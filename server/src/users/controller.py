from fastapi import APIRouter
from ..database.core import DbSession
from . import models, service
from ..auth.service import CurrentUser
from uuid import UUID

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me", response_model=models.UserResponse)
def get_current_user_profile(current_user: CurrentUser, db: DbSession):
    """
    Fetches the current logged-in user's profile.
    The 'current_user' dependency validates the JWT token before this runs.
    """
    return service.get_user_by_id(db, UUID(current_user.user_id))