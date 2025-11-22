
from datetime import datetime, timezone
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from . import models
from src.auth.models import TokenData
from src.entities.trade import Trade, TradeStatus, TradeSide
from src.entities.user import UserRole
from ..exceptions import EntityNotFoundException, BusinessLogicException

def validate_trade_timeline(entry_date: datetime, exit_date: datetime):
    """
    Ensures strict chronological order. 
    Handles Naive vs Aware datetime comparison issues.
    """
    if not entry_date or not exit_date:
        return

    if entry_date.tzinfo is None:
        entry_date = entry_date.replace(tzinfo=timezone.utc)
    
    if exit_date.tzinfo is None:
        exit_date = exit_date.replace(tzinfo=timezone.utc)

    if exit_date < entry_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Time Paradox: Exit date ({exit_date}) cannot be before Entry date ({entry_date})"
        )

def create_trade(current_user: TokenData, db: Session, trade: models.TradeCreate) -> Trade:
    if current_user.role == UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admins cannot create trades")
    
    new_trade = Trade(**trade.model_dump())
    new_trade.user_id = UUID(current_user.user_id)
    
    if not new_trade.entry_date:
        new_trade.entry_date = datetime.now(timezone.utc)
        
    db.add(new_trade)
    db.commit()
    db.refresh(new_trade)
    return new_trade

def get_trades(current_user: TokenData, db: Session, skip: int = 0, limit: int = 20, status: TradeStatus = None):
    query = db.query(Trade).options(joinedload(Trade.owner))
    if current_user.role != UserRole.ADMIN:
        query = query.filter(Trade.user_id == UUID(current_user.user_id))
    if status:
        query = query.filter(Trade.status == status)
    
    total_count = query.count()
    trades = query.order_by(Trade.entry_date.desc()).offset(skip).limit(limit).all()
    
    return {
        "total": total_count,
        "page": (skip // limit) + 1,
        "limit": limit,
        "data": trades
    }

def get_trade_by_id(current_user: TokenData, db: Session, trade_id: UUID) -> Trade:
    query = db.query(Trade).options(joinedload(Trade.owner)).filter(Trade.id == trade_id)
    if current_user.role != UserRole.ADMIN:
        query = query.filter(Trade.user_id == UUID(current_user.user_id))
    trade = query.first()
    if not trade:
        raise EntityNotFoundException(entity_name="Trade", entity_id=str(trade_id))
    return trade

def verify_ownership(current_user: TokenData, trade: Trade):
    if trade.user_id != UUID(current_user.user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only modify your own trades")

def update_trade(current_user: TokenData, db: Session, trade_id: UUID, update_data: models.TradeUpdate) -> Trade:
    trade = get_trade_by_id(current_user, db, trade_id)
    verify_ownership(current_user, trade)
    
    for key, value in update_data.model_dump(exclude_unset=True).items():
        setattr(trade, key, value)

    if trade.exit_date:
        validate_trade_timeline(trade.entry_date, trade.exit_date)

    if trade.status == TradeStatus.CLOSED:
        if not trade.exit_price:
             pass 
        elif trade.side == TradeSide.LONG:
            trade.pnl = (trade.exit_price - trade.entry_price) * trade.quantity
        else:
            trade.pnl = (trade.entry_price - trade.exit_price) * trade.quantity

    db.commit()
    db.refresh(trade)
    return trade

def close_trade(current_user: TokenData, db: Session, trade_id: UUID, close_data: models.TradeClose) -> Trade:
    trade = get_trade_by_id(current_user, db, trade_id)
    verify_ownership(current_user, trade)
    
    if trade.status == TradeStatus.CLOSED:
        raise BusinessLogicException(detail="Trade is already closed")

    final_exit_date = close_data.exit_date or datetime.now(timezone.utc)

    validate_trade_timeline(trade.entry_date, final_exit_date)

    if trade.side == TradeSide.LONG:
        pnl = (close_data.exit_price - trade.entry_price) * trade.quantity
    else:
        pnl = (trade.entry_price - close_data.exit_price) * trade.quantity
    
    trade.exit_price = close_data.exit_price
    trade.pnl = pnl
    trade.status = TradeStatus.CLOSED
    trade.exit_date = final_exit_date

    db.commit()
    db.refresh(trade)
    return trade

def delete_trade(current_user: TokenData, db: Session, trade_id: UUID):
    trade = get_trade_by_id(current_user, db, trade_id)
    verify_ownership(current_user, trade)
    db.delete(trade)
    db.commit()