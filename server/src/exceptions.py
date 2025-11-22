from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse

class TradeLogException(HTTPException):
    """Base Exception for our app"""
    pass

class EntityNotFoundException(TradeLogException):
    def __init__(self, entity_name: str, entity_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"{entity_name} with ID {entity_id} not found"
        )

class BusinessLogicException(TradeLogException):
    """For invalid logic (e.g. closing an already closed trade)"""
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=detail
        )

class AuthenticationError(TradeLogException):
    def __init__(self, detail: str = "Could not validate credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )

async def global_exception_handler(request: Request, exc: Exception):
    """Catches any unhandled server errors"""
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)}
    )