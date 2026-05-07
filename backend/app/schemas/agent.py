from typing import Annotated, Any, Literal

from pydantic import BaseModel, Field

from app.schemas.interaction import EntityExtraction, InteractionCreate, InteractionOut, InteractionUpdate

Sentiment = Literal["Positive", "Neutral", "Negative"]


class AgentMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class AgentRequest(BaseModel):
    message: str = Field(..., min_length=1)
    hcp_name: Annotated[str | None, Field(alias="hcpName")] = None
    interaction_id: Annotated[str | None, Field(alias="interactionId")] = None
    draft_interaction: Annotated[InteractionCreate | dict[str, Any] | None, Field(alias="draftInteraction")] = None
    messages: list[AgentMessage] = Field(default_factory=list)


class SummaryRequest(BaseModel):
    notes: str = Field(..., min_length=1)
    hcp_name: Annotated[str | None, Field(alias="hcpName")] = None
    topics_discussed: Annotated[str | None, Field(alias="topicsDiscussed")] = None


class SentimentRequest(BaseModel):
    text: str = Field(..., min_length=1)


class SentimentResponse(BaseModel):
    sentiment: Sentiment
    confidence: float
    rationale: str


class AgentAnalysis(BaseModel):
    summary: str
    sentiment: Sentiment
    confidence: float
    extracted_entities: EntityExtraction = Field(alias="extractedEntities")
    suggested_actions: list[str] = Field(alias="suggestedActions")


class AgentResponse(BaseModel):
    intent: str
    tool: str
    response: str
    analysis: AgentAnalysis | None = None
    interaction: InteractionOut | None = None
    updated_fields: list[str] = Field(default_factory=list, alias="updatedFields")
    metadata: dict[str, Any] = Field(default_factory=dict)


class ToolExecutionPayload(BaseModel):
    intent: str
    tool: str
    draft: dict[str, Any] = Field(default_factory=dict)
    interaction_id: str | None = None
    message: str = ""
    hcp_name: str | None = None
    update: InteractionUpdate | dict[str, Any] | None = None
