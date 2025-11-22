
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from src.config import settings
from src.logging import configure_logging
from src.api import register_routes
from src.rate_limiter import limiter
from src.database.core import Base, engine

configure_logging()

app = FastAPI(
    title="TradeLog API",
    description="Backend for the TradeLog Internship Assignment",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = ["http://localhost:3000", "http://localhost:5173"] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


register_routes(app)



@app.get("/health")
def health_check():
    return {"status": "healthy", "app": "TradeLog"}