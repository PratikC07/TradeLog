from datetime import timedelta, datetime, timezone
from typing import Annotated
from uuid import uuid4
from fastapi import Depends
from passlib.context import CryptContext
import jwt
from jwt import PyJWTError
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer

from src.config import settings
from src.entities.user import User, UserRole
from . import models
from ..exceptions import AuthenticationError

oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/login')
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def get_password_hash(password: str) -> str:
    return bcrypt_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt_context.verify(plain_password, hashed_password)

def authenticate_user(email: str, password: str, db: Session) -> User | bool:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(user: User, expires_delta: timedelta) -> str:
    encode = {
        'sub': user.email,
        'id': str(user.id),
        'role': user.role.value,
        'exp': datetime.now(timezone.utc) + expires_delta
    }
    return jwt.encode(encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_token(token: str) -> models.TokenData:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get('id')
        role: str = payload.get('role')
        
        if user_id is None:
            raise AuthenticationError()
            
        return models.TokenData(user_id=user_id, role=role)
    except PyJWTError:
        raise AuthenticationError()

def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]) -> models.TokenData:
    return verify_token(token)

CurrentUser = Annotated[models.TokenData, Depends(get_current_user)]

def login_for_access_token(form_data: OAuth2PasswordRequestForm, db: Session) -> models.Token:
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise AuthenticationError("Incorrect email or password")
    
    token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(user, token_expires)
    
    return models.Token(access_token=token, token_type='bearer')

def register_user(db: Session, req: models.RegisterUserRequest) -> models.Token:
    
    if db.query(User).filter((User.email == req.email) | (User.username == req.username)).first():
        raise AuthenticationError("Email or Username already taken")

    
    new_user = User(
        id=uuid4(),
        email=req.email,
        username=req.username,
        hashed_password=get_password_hash(req.password),
        role=UserRole.TRADER
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(new_user, token_expires)

    return models.Token(access_token=access_token, token_type='bearer')