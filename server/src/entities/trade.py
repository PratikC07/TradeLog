
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum
from ..database.core import Base 

class TradeSide(str, enum.Enum):
    LONG = "LONG"
    SHORT = "SHORT"

class TradeStatus(str, enum.Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"

class Trade(Base):
    __tablename__ = 'trades'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    
    symbol = Column(String, nullable=False, index=True) 
    side = Column(Enum(TradeSide), nullable=False)
    quantity = Column(Float, nullable=False)
    
    entry_price = Column(Float, nullable=False)
    entry_date = Column(DateTime(timezone=True), server_default=func.now())
    
    exit_price = Column(Float, nullable=True)
    exit_date = Column(DateTime(timezone=True), nullable=True)
    
    status = Column(Enum(TradeStatus), default=TradeStatus.OPEN, index=True)
    pnl = Column(Float, nullable=True) 

    owner = relationship("src.entities.user.User", back_populates="trades")

    def __repr__(self):
        return f"<Trade(symbol='{self.symbol}', side='{self.side}', status='{self.status}')>"