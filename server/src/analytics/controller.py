
from typing import Union
from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from ..database.core import DbSession
from ..auth.service import CurrentUser
from src.entities.user import UserRole
from src.trades.models import PaginatedTradeResponse
from . import models, service

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary", response_model=Union[models.AdminAnalyticsSummary, models.UserAnalyticsSummary])
def get_dashboard_summary(current_user: CurrentUser, db: DbSession):
    if current_user.role == UserRole.ADMIN.value:
        return service.get_admin_analytics(db)
    return service.get_user_analytics(current_user, db)

@router.get("/chart", response_model=models.ChartResponse)
def get_pnl_chart(current_user: CurrentUser, db: DbSession):
    return service.get_pnl_chart(current_user, db)

@router.get("/admin/top-trades", response_model=PaginatedTradeResponse)
def get_admin_top_trades(current_user: CurrentUser, db: DbSession):
    if current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    return service.get_top_profitable_trades(db)