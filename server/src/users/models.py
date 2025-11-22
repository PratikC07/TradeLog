from pydantic import BaseModel, EmailStr
from uuid import UUID
from src.entities.user import UserRole

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    username: str
    role: UserRole

    class Config:
        from_attributes = True