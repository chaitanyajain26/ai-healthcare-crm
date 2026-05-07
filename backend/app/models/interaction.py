from datetime import datetime
from pydantic import BaseModel, Field


class InteractionDocument(BaseModel):
    hcp_name: str
    interaction_type: str
    notes: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
