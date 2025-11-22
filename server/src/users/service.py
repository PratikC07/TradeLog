from uuid import UUID
from sqlalchemy.orm import Session
from src.entities.user import User
from ..exceptions import EntityNotFoundException
import logging

def get_user_by_id(db: Session, user_id: UUID) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        logging.warning(f"User not found: {user_id}")
        raise EntityNotFoundException(entity_name="User", entity_id=str(user_id))
    
    return user