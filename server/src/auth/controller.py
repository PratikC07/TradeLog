from typing import Annotated
from fastapi import APIRouter, Depends, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from ..database.core import DbSession
from ..rate_limiter import limiter
from . import models, service

router = APIRouter(
    prefix='/auth',
    tags=['Auth']
)

# 1. Changed from "/" to "/register"
@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=models.Token)
@limiter.limit("5/minute")
async def register_user(request: Request, db: DbSession, req: models.RegisterUserRequest):
    return service.register_user(db, req)

# 2. Changed from "/token" to "/login"
@router.post("/login", response_model=models.Token)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: DbSession):
    return service.login_for_access_token(form_data, db)