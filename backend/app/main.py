import warnings

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic.warnings import UnsupportedFieldAttributeWarning

warnings.filterwarnings("ignore", category=UnsupportedFieldAttributeWarning)
from app.api.v1.router import api_router
from app.api.v1.routes import agent, interactions
from app.core.config import settings
from app.core.logging import configure_logging
from app.db.mongodb import close_mongo_connection, connect_to_mongo

configure_logging()

app = FastAPI(
    title="HelixCRM AI API",
    version="1.0.0",
    description="AI-first Healthcare CRM APIs for HCP interaction logging and intelligence.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup() -> None:
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown() -> None:
    await close_mongo_connection()


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "helixcrm-ai"}


app.include_router(api_router, prefix="/api/v1")
app.include_router(interactions.router, prefix="/interactions", tags=["interactions-root"])
app.include_router(agent.router, prefix="/agent", tags=["agent-root"])
