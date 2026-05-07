from fastapi import APIRouter, Query

from app.agents.tools.interaction_tools import log_interaction
from app.schemas.interaction import HcpHistoryResponse, InteractionCreate, InteractionOut, InteractionUpdate
from app.services.interaction_service import InteractionService

router = APIRouter()


@router.get("", response_model=list[InteractionOut])
async def list_interactions(
    hcp_name: str | None = Query(default=None, alias="hcpName"),
    sentiment: str | None = None,
) -> list[InteractionOut]:
    return await InteractionService().list_interactions(hcp_name=hcp_name, sentiment=sentiment)


@router.get("/hcp/history", response_model=HcpHistoryResponse)
async def hcp_history(hcp_name: str = Query(..., alias="hcpName")) -> HcpHistoryResponse:
    return await InteractionService().fetch_hcp_history(hcp_name)


@router.get("/{interaction_id}", response_model=InteractionOut)
async def get_interaction(interaction_id: str) -> InteractionOut:
    return await InteractionService().get_interaction(interaction_id)


@router.post("", response_model=InteractionOut, status_code=201)
async def create_interaction(payload: InteractionCreate) -> InteractionOut:
    result = await log_interaction(payload.model_dump(mode="json", by_alias=False))
    return result["interaction"]


@router.put("/{interaction_id}", response_model=InteractionOut)
async def update_interaction(interaction_id: str, payload: InteractionUpdate) -> InteractionOut:
    return await InteractionService().update_interaction(interaction_id, payload)
