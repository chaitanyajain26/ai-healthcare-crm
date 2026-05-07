from fastapi import APIRouter

from app.schemas.agent import AgentRequest, AgentResponse, SentimentRequest, SentimentResponse, SummaryRequest
from app.services.agent_service import AgentService

router = APIRouter()


@router.post("/chat", response_model=AgentResponse)
async def chat(payload: AgentRequest) -> AgentResponse:
    return await AgentService().chat(payload)


@router.post("/summarize")
async def summarize(payload: SummaryRequest) -> dict[str, str]:
    return await AgentService().summarize(payload)


@router.post("/sentiment", response_model=SentimentResponse)
async def sentiment(payload: SentimentRequest) -> SentimentResponse:
    return await AgentService().sentiment(payload)
