from typing import Any

from app.agents.interaction_agent import interaction_agent
from app.agents.tools.interaction_tools import analyze_sentiment, summarize_interaction
from app.schemas.agent import AgentRequest, AgentResponse, SentimentRequest, SentimentResponse, SummaryRequest


class AgentService:
    async def chat(self, payload: AgentRequest) -> AgentResponse:
        draft = payload.draft_interaction.model_dump(by_alias=False) if hasattr(payload.draft_interaction, "model_dump") else payload.draft_interaction or {}
        result = await interaction_agent.ainvoke(
            {
                "message": payload.message,
                "messages": [message.model_dump() for message in payload.messages],
                "draft": draft,
                "interaction_id": payload.interaction_id,
                "hcp_name": payload.hcp_name,
            }
        )
        tool_result: dict[str, Any] = result.get("tool_result", {})
        interaction = tool_result.get("interaction")
        analysis = tool_result.get("analysis")

        if result.get("tool") == "analyze_sentiment":
            sentiment = tool_result.get("sentiment", {})
            analysis = {
                "summary": sentiment.get("rationale", "Sentiment analysis completed."),
                "sentiment": sentiment.get("sentiment", "Neutral"),
                "confidence": sentiment.get("confidence", 0.75),
                "extractedEntities": {"doctors": [], "products": [], "diseases": []},
                "suggestedActions": [],
            }

        if result.get("tool") == "suggest_followup":
            analysis = {
                "summary": "Next best actions generated for the interaction.",
                "sentiment": "Neutral",
                "confidence": 0.75,
                "extractedEntities": {"doctors": [], "products": [], "diseases": []},
                "suggestedActions": tool_result.get("suggested_actions", []),
            }

        if result.get("tool") == "summarize_interaction":
            analysis = {
                "summary": tool_result.get("summary", result.get("response", "")),
                "sentiment": "Neutral",
                "confidence": 0.75,
                "extractedEntities": {"doctors": [], "products": [], "diseases": []},
                "suggestedActions": [],
            }

        return AgentResponse(
            intent=result.get("intent", "unknown"),
            tool=result.get("tool", "unknown"),
            response=result.get("response", ""),
            analysis=analysis,
            interaction=interaction,
            updatedFields=tool_result.get("updated_fields", []),
            metadata={"rawToolResultKeys": list(tool_result.keys())},
        )

    async def summarize(self, payload: SummaryRequest) -> dict[str, str]:
        summary = await summarize_interaction(payload.model_dump(by_alias=False))
        return {"summary": summary}

    async def sentiment(self, payload: SentimentRequest) -> SentimentResponse:
        return await analyze_sentiment(payload.text)
