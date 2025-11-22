
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class BestAsset(BaseModel):
    symbol: str
    total_pnl: float

class PnLPoint(BaseModel):
    date: datetime
    pnl: float
    cumulative_pnl: float

class UserPerformance(BaseModel):
    username: str
    email: str
    total_pnl: float

class UserAnalyticsSummary(BaseModel):
    net_realized_pnl: float
    profit_factor: float
    win_rate: float
    total_closed_trades: int
    active_positions: int
    avg_win: float
    avg_loss: float
    best_asset: Optional[BestAsset] = None

class AdminAnalyticsSummary(BaseModel):
    total_users: int
    total_trades: int
    active_positions: int
    total_platform_pnl: float
    top_gainer: Optional[UserPerformance] = None
    top_loser: Optional[UserPerformance] = None

class ChartResponse(BaseModel):
    data: List[PnLPoint]