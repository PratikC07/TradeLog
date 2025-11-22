
from fastapi import APIRouter   
    
from src.auth.controller import router as auth_router
from src.users.controller import router as users_router
from src.trades.controller import router as trades_router
from src.analytics.controller import router as analytics_router

def register_routes(app):
    app.include_router(auth_router)
    
    app.include_router(users_router)
    
    app.include_router(trades_router)

    app.include_router(analytics_router)