
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
    query = db.query(
        func.count(Trade.id).label('total_trades'),
        func.sum(Trade.pnl).label('total_pnl'),
        func.sum(case((Trade.pnl > 0, Trade.pnl), else_=0)).label('gross_profit'),
        func.sum(case((Trade.pnl < 0, Trade.pnl), else_=0)).label('gross_loss'),
        func.sum(case((Trade.pnl > 0, 1), else_=0)).label('win_count'),
        func.sum(case((Trade.pnl < 0, 1), else_=0)).label('loss_count')
    ).filter(Trade.user_id == user_uuid, Trade.status == TradeStatus.CLOSED)
    
    result = query.first()
    
    active_count = db.query(func.count(Trade.id)).filter(
        Trade.user_id == user_uuid, 
        Trade.status == TradeStatus.OPEN
    ).scalar() or 0

    # Extract
    total_trades = result.total_trades or 0
    total_pnl = result.total_pnl or 0.0
    gross_profit = result.gross_profit or 0.0
    gross_loss = abs(result.gross_loss or 0.0)
    wins = result.win_count or 0
    losses = result.loss_count or 0

    # Derived Math
    profit_factor = round(gross_profit / gross_loss, 2) if gross_loss > 0 else (99.99 if gross_profit > 0 else 0.0)
    win_rate = round((wins / total_trades * 100), 1) if total_trades > 0 else 0.0
    avg_win = round(gross_profit / wins, 2) if wins > 0 else 0.0
    avg_loss = round(gross_loss / losses, 2) if losses > 0 else 0.0

    # Best Asset
    best_asset_row = db.query(Trade.symbol, func.sum(Trade.pnl).label('total'))\
        .filter(Trade.user_id == user_uuid, Trade.status == TradeStatus.CLOSED)\
        .group_by(Trade.symbol).order_by(desc('total')).first()
        
    best_asset = models.BestAsset(symbol=best_asset_row.symbol, total_pnl=round(best_asset_row.total, 2)) if best_asset_row else None

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
    total_users = db.query(User).filter(User.role != UserRole.ADMIN).count()
    total_trades = db.query(Trade).count()
    active_positions = db.query(Trade).filter(Trade.status == TradeStatus.OPEN).count()
    total_pnl = db.query(func.sum(Trade.pnl)).filter(Trade.status == TradeStatus.CLOSED).scalar() or 0.0

    # Helper to find Outliers
    def get_outlier(order_func, require_negative=False):
        query = db.query(
            Trade.user_id, 
            func.sum(Trade.pnl).label('total')
        ).filter(Trade.status == TradeStatus.CLOSED).group_by(Trade.user_id)
        
        
        if require_negative:
            query = query.having(func.sum(Trade.pnl) < 0)

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

    return models.AdminAnalyticsSummary(
        total_users=total_users,
        total_trades=total_trades,
        active_positions=active_positions,
        total_platform_pnl=round(total_pnl, 2),
        # Top Gainer: Just highest number
        top_gainer=get_outlier(desc, require_negative=False),
        # Top Loser: Lowest number BUT must be negative
        top_loser=get_outlier(asc, require_negative=True) 
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