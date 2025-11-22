
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field, field_validator
from src.entities.trade import TradeSide, TradeStatus

class TradeBase(BaseModel):
    symbol: str
    side: TradeSide
    quantity: float = Field(..., gt=0, description="Must be positive")
    entry_price: float = Field(..., gt=0)
    entry_date: Optional[datetime] = None

    @field_validator('symbol')
    def uppercase_symbol(cls, v):
        return v.strip().upper()

class TradeCreate(TradeBase):
    pass

class TradeUpdate(BaseModel):
    """
    Allows updating ANY field (Entry or Exit) to fix mistakes.
    """
    symbol: Optional[str] = None
    side: Optional[TradeSide] = None
    quantity: Optional[float] = None
    entry_price: Optional[float] = None
    entry_date: Optional[datetime] = None
    
    exit_price: Optional[float] = None
    exit_date: Optional[datetime] = None

    @field_validator('symbol')
    def uppercase_symbol(cls, v):
        if v: return v.strip().upper()
        return v

class TradeClose(BaseModel):
    """
    Close a position. 
    exit_date is optional; if omitted, defaults to NOW.
    """
    exit_price: float = Field(..., gt=0)
    exit_date: Optional[datetime] = None

class TradeOwner(BaseModel):
    username: str
    email: str
    model_config = ConfigDict(from_attributes=True)

class TradeResponse(TradeBase):
    id: UUID
    user_id: UUID
    status: TradeStatus
    exit_price: Optional[float] = None
    exit_date: Optional[datetime] = None
    pnl: Optional[float] = None
    owner: Optional[TradeOwner] = None 
    
    model_config = ConfigDict(from_attributes=True)

class PaginatedTradeResponse(BaseModel):
    total: int
    page: int
    limit: int
    data: List[TradeResponse]