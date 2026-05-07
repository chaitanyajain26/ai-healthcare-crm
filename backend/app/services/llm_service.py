import json
from typing import Any

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq

from app.core.config import settings


class LLMService:
    def __init__(self) -> None:
        self.primary_model = settings.primary_model
        self.fallback_model = settings.secondary_model

    async def json_completion(self, system_prompt: str, user_prompt: str, fallback: dict[str, Any]) -> dict[str, Any]:
        if not settings.groq_api_key:
            return fallback

        for model_name in [self.primary_model, self.fallback_model]:
            try:
                model = ChatGroq(api_key=settings.groq_api_key, model=model_name, temperature=0.2)
                response = await model.ainvoke([SystemMessage(content=system_prompt), HumanMessage(content=user_prompt)])
                content = response.content.strip().removeprefix("```json").removesuffix("```").strip()
                return json.loads(content)
            except Exception:
                continue
        return fallback

    async def text_completion(self, system_prompt: str, user_prompt: str, fallback: str) -> str:
        if not settings.groq_api_key:
            return fallback

        for model_name in [self.primary_model, self.fallback_model]:
            try:
                model = ChatGroq(api_key=settings.groq_api_key, model=model_name, temperature=0.2)
                response = await model.ainvoke([SystemMessage(content=system_prompt), HumanMessage(content=user_prompt)])
                return response.content.strip()
            except Exception:
                continue
        return fallback
