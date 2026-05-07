from fastapi import APIRouter
from app.api.v1.routes import agent, interactions

api_router = APIRouter()
api_router.include_router(interactions.router, prefix="/interactions", tags=["interactions"])
api_router.include_router(agent.router, prefix="/agent", tags=["agent"])
