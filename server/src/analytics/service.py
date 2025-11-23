from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, case, desc, asc  
from uuid import UUID
from src.entities.trade import Trade, TradeStatus
from src.entities.user import User, UserRole
from src.auth.models import TokenData
from src.trades.models import PaginatedTradeResponse
from . import models

def get_user_analytics(current_user: TokenData, db: Session) -> models.UserAnalyticsSummary:
    user_uuid = UUID(current_user.user_id)
    
    # 1. Aggregate Math for User Analytics
    # We use conditional sums (case) to calculate all metrics in a single DB query for performance
    query = db.query(
        func.count(Trade.id).label('total_trades'),
        func.sum(Trade.pnl).label('total_pnl'),
        # Sum only positive PnL for Gross Profit
        func.sum(case((Trade.pnl > 0, Trade.pnl), else_=0)).label('gross_profit'),
        # Sum only negative PnL for Gross Loss (result will be negative, e.g., -500)
        func.sum(case((Trade.pnl < 0, Trade.pnl), else_=0)).label('gross_loss'),
        # Count number of winning trades
        func.sum(case((Trade.pnl > 0, 1), else_=0)).label('win_count'),
        # Count number of losing trades
        func.sum(case((Trade.pnl < 0, 1), else_=0)).label('loss_count')
    ).filter(Trade.user_id == user_uuid, Trade.status == TradeStatus.CLOSED)
    
    result = query.first()
    
    # 2. Count Active Positions (Open Trades) separately
    active_count = db.query(func.count(Trade.id)).filter(
        Trade.user_id == user_uuid, 
        Trade.status == TradeStatus.OPEN
    ).scalar() or 0

    # 3. Extract & Sanitize (Handle None if user has 0 trades)
    total_trades = result.total_trades or 0
    total_pnl = result.total_pnl or 0.0
    gross_profit = result.gross_profit or 0.0
    # Use abs() to get the magnitude of loss (e.g., convert -500 to 500) for correct division
    gross_loss = abs(result.gross_loss or 0.0)
    wins = result.win_count or 0
    losses = result.loss_count or 0

    # 4. Derived Math Calculations
    
    # Profit Factor: Ratio of money won to money lost
    if gross_loss > 0:
        profit_factor = round(gross_profit / gross_loss, 2)
    else:
        # If no losses, profit factor is infinite. We use 99.99 as a cap if there is profit, else 0.
        profit_factor = 99.99 if gross_profit > 0 else 0.0

    # Win Rate: Percentage of trades that were profitable
    win_rate = round((wins / total_trades * 100), 1) if total_trades > 0 else 0.0
    
    # Avg Win: Average profit per winning trade
    avg_win = round(gross_profit / wins, 2) if wins > 0 else 0.0
    
    # Avg Loss: Average loss per losing trade
    avg_loss = round(gross_loss / losses, 2) if losses > 0 else 0.0

    # 5. Best Asset Logic
    # Groups trades by symbol and sums PnL.
    best_asset_query = db.query(
        Trade.symbol, 
        func.sum(Trade.pnl).label('total')
    ).filter(
        Trade.user_id == user_uuid, 
        Trade.status == TradeStatus.CLOSED
    ).group_by(Trade.symbol)
    
    # CRITICAL FIX: Ensure we only return a "Best Asset" if the total PnL is POSITIVE (> 0).
    # This prevents showing a losing asset as your "best" just because it lost the least.
    best_asset_row = best_asset_query.having(func.sum(Trade.pnl) > 0)\
        .order_by(desc('total')).first()
        
    best_asset = None
    if best_asset_row:
        best_asset = models.BestAsset(
            symbol=best_asset_row.symbol, 
            total_pnl=round(best_asset_row.total, 2)
        )

    return models.UserAnalyticsSummary(
        net_realized_pnl=round(total_pnl, 2),
        profit_factor=profit_factor,
        win_rate=win_rate,
        total_closed_trades=total_trades,
        active_positions=active_count,
        avg_win=avg_win,
        avg_loss=avg_loss,
        best_asset=best_asset
    )

def get_admin_analytics(db: Session) -> models.AdminAnalyticsSummary:
    # Count users (excluding admins)
    total_users = db.query(User).filter(User.role != UserRole.ADMIN).count()
    # Count all trades (open + closed)
    total_trades = db.query(Trade).count()
    # Count currently open positions
    active_positions = db.query(Trade).filter(Trade.status == TradeStatus.OPEN).count()
    # Sum PnL of ALL closed trades on the platform
    total_pnl = db.query(func.sum(Trade.pnl)).filter(Trade.status == TradeStatus.CLOSED).scalar() or 0.0

    # Helper function to find Top Gainer / Top Loser
    def get_outlier(order_func, require_positive=False):
        query = db.query(
            Trade.user_id, 
            func.sum(Trade.pnl).label('total')
        ).filter(Trade.status == TradeStatus.CLOSED).group_by(Trade.user_id)
        
        # CRITICAL FIX: For Top Gainer, require sum(pnl) > 0
        if require_positive:
            query = query.having(func.sum(Trade.pnl) > 0)

        row = query.order_by(order_func('total')).first()
        
        if row:
            user = db.query(User).filter(User.id == row.user_id).first()
            if user: 
                return models.UserPerformance(
                    username=user.username, 
                    email=user.email, 
                    total_pnl=round(row.total, 2)
                )
        return None

    top_gainer = get_outlier(desc, require_positive=True)
    top_loser = get_outlier(asc, require_positive=False)

    # CORRECTION: Logic to prevent the same user from appearing as both Gainer and Loser.
    # If the Top Gainer and Top Loser are the same person (e.g., only 1 user has PnL),
    # we hide the 'Loser' card to avoid confusion.
    if top_gainer and top_loser and top_gainer.email == top_loser.email:
        top_loser = None

    return models.AdminAnalyticsSummary(
        total_users=total_users,
        total_trades=total_trades,
        active_positions=active_positions,
        total_platform_pnl=round(total_pnl, 2),
        top_gainer=top_gainer,
        top_loser=top_loser
    )


def get_pnl_chart(current_user: TokenData, db: Session) -> models.ChartResponse:
    query = db.query(Trade.exit_date, Trade.pnl).filter(
        Trade.status == TradeStatus.CLOSED,
        Trade.exit_date.isnot(None)
    )
    if current_user.role != UserRole.ADMIN:
        query = query.filter(Trade.user_id == UUID(current_user.user_id))
        
    trades = query.order_by(Trade.exit_date.asc()).all()
    
    chart_data = []
    running_balance = 0.0
    for t in trades:
        pnl = t.pnl or 0.0
        running_balance += pnl
        chart_data.append(models.PnLPoint(date=t.exit_date, pnl=pnl, cumulative_pnl=round(running_balance, 2)))

    return models.ChartResponse(data=chart_data)

def get_top_profitable_trades(db: Session) -> PaginatedTradeResponse:
    trades = db.query(Trade).options(joinedload(Trade.owner))\
        .filter(Trade.status == TradeStatus.CLOSED, Trade.pnl > 0)\
        .order_by(desc(Trade.pnl)).limit(5).all()
        
    return {
        "data": trades, 
        "total": len(trades), 
        "page": 1, 
        "limit": 5
    }