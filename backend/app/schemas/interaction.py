from datetime import date as Date
from datetime import datetime as DateTime
from typing import Annotated, Any

from pydantic import BaseModel, ConfigDict, Field


class EntityExtraction(BaseModel):
    doctors: list[str] = Field(default_factory=list)
    products: list[str] = Field(default_factory=list)
    diseases: list[str] = Field(default_factory=list)


class InteractionBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    hcp_name: str = Field(..., alias="hcpName", examples=["Dr. Aisha Menon"])
    specialty: str | None = None
    interaction_type: str = Field(..., alias="interactionType")
    date: Date
    time: str
    attendees: str | None = None
    topics_discussed: Annotated[str | None, Field(alias="topicsDiscussed")] = None
    notes: str | None = None
    materials_shared: Annotated[str | None, Field(alias="materialsShared")] = None
    follow_up_actions: Annotated[list[str] | str | None, Field(alias="followUpActions")] = None
    topics: list[str] = Field(default_factory=list)
    ai_summary: Annotated[str | None, Field(alias="aiSummary")] = None
    sentiment: str | None = None
    extracted_entities: Annotated[EntityExtraction | dict[str, Any] | None, Field(alias="extractedEntities")] = None
    action_items: list[str] = Field(default_factory=list, alias="actionItems")
    created_by: str = Field(default="demo-field-rep", alias="createdBy")
    status: str = "Submitted"


class InteractionCreate(InteractionBase):
    pass


class InteractionUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    hcp_name: Annotated[str | None, Field(alias="hcpName")] = None
    specialty: str | None = None
    interaction_type: Annotated[str | None, Field(alias="interactionType")] = None
    date: Date | None = None
    time: str | None = None
    attendees: str | None = None
    topics_discussed: Annotated[str | None, Field(alias="topicsDiscussed")] = None
    notes: str | None = None
    materials_shared: Annotated[str | None, Field(alias="materialsShared")] = None
    follow_up_actions: Annotated[list[str] | str | None, Field(alias="followUpActions")] = None
    topics: list[str] | None = None
    ai_summary: Annotated[str | None, Field(alias="aiSummary")] = None
    sentiment: str | None = None
    extracted_entities: Annotated[EntityExtraction | dict[str, Any] | None, Field(alias="extractedEntities")] = None
    action_items: list[str] | None = Field(default=None, alias="actionItems")
    status: str | None = None


class InteractionOut(InteractionBase):
    id: str
    created_at: DateTime = Field(alias="createdAt")
    updated_at: DateTime = Field(alias="updatedAt")
    updated_fields: list[str] = Field(default_factory=list, alias="updatedFields")


class HcpHistoryResponse(BaseModel):
    hcp_name: str = Field(alias="hcpName")
    total_interactions: int = Field(alias="totalInteractions")
    insights: list[str]
    interactions: list[InteractionOut]
