
from fastapi import APIRouter, status
from typing import Optional
from uuid import UUID
from ..database.core import DbSession
from . import models, service
from ..auth.service import CurrentUser
from src.entities.trade import TradeStatus

router = APIRouter(prefix="/trades", tags=["Trades"])

@router.post("/", response_model=models.TradeResponse, status_code=status.HTTP_201_CREATED)
def create_trade(db: DbSession, trade: models.TradeCreate, current_user: CurrentUser):
    return service.create_trade(current_user, db, trade)

@router.get("/", response_model=models.PaginatedTradeResponse)
def get_trades(
    db: DbSession, 
    current_user: CurrentUser, 
    skip: int = 0, 
    limit: int = 20,
    status: Optional[TradeStatus] = None
):
    return service.get_trades(current_user, db, skip, limit, status)

@router.get("/{trade_id}", response_model=models.TradeResponse)
def get_trade(db: DbSession, trade_id: UUID, current_user: CurrentUser):
    return service.get_trade_by_id(current_user, db, trade_id)

@router.put("/{trade_id}", response_model=models.TradeResponse)
def update_trade(db: DbSession, trade_id: UUID, update_data: models.TradeUpdate, current_user: CurrentUser):
    return service.update_trade(current_user, db, trade_id, update_data)

@router.patch("/{trade_id}/close", response_model=models.TradeResponse)
def close_trade(db: DbSession, trade_id: UUID, close_data: models.TradeClose, current_user: CurrentUser):
    return service.close_trade(current_user, db, trade_id, close_data)

@router.delete("/{trade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trade(db: DbSession, trade_id: UUID, current_user: CurrentUser):
    service.delete_trade(current_user, db, trade_id)