import re
from typing import Any

from app.agents.tools.compliance_tools import sanitize_interaction_notes
from app.schemas.agent import SentimentResponse
from app.schemas.interaction import InteractionCreate, InteractionUpdate
from app.services.interaction_service import InteractionService
from app.services.llm_service import LLMService

NEXT_BEST_ACTIONS = [
    "send brochure",
    "schedule follow-up",
    "share clinical trial",
    "product sample follow-up",
]


def _notes_blob(payload: dict[str, Any]) -> str:
    return " ".join(str(payload.get(key, "")) for key in ["hcp_name", "hcpName", "topics_discussed", "topicsDiscussed", "notes", "materials_shared", "materialsShared"])


def _fallback_entities(payload: dict[str, Any]) -> dict[str, list[str]]:
    text = _notes_blob(payload)
    doctors = sorted(set(re.findall(r"Dr\.?\s+[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?", text)))
    if payload.get("hcp_name") or payload.get("hcpName"):
        doctors.append(payload.get("hcp_name") or payload.get("hcpName"))
    product_terms = ["GLP-1", "Insulin", "CardioMax", "OncoRelief", "Respira"]
    disease_terms = ["diabetes", "hypertension", "asthma", "oncology", "cardiology", "obesity"]
    products = [term for term in product_terms if term.lower() in text.lower()]
    diseases = [term.title() for term in disease_terms if term in text.lower()]
    return {"doctors": sorted(set(doctors)), "products": products, "diseases": diseases}


async def summarize_interaction(payload: dict[str, Any]) -> str:
    sanitized = sanitize_interaction_notes(payload)
    fallback = "HCP discussion captured key clinical interests, requested materials, and follow-up commitments."
    return await LLMService().text_completion(
        "You summarize HCP/pharma field interactions in one concise, compliant CRM-ready sentence.",
        f"Summarize this interaction:\n{sanitized}",
        fallback,
    )


async def analyze_sentiment(text: str) -> SentimentResponse:
    lowered = text.lower()
    fallback_sentiment = "Neutral"
    if any(word in lowered for word in ["interested", "positive", "requested", "agreed", "strong"]):
        fallback_sentiment = "Positive"
    if any(word in lowered for word in ["concern", "negative", "declined", "skeptical", "objection"]):
        fallback_sentiment = "Negative"

    fallback = {
        "sentiment": fallback_sentiment,
        "confidence": 0.76,
        "rationale": "Rule-based fallback used because no Groq key was configured or the provider was unavailable.",
    }
    result = await LLMService().json_completion(
        "Return strict JSON with sentiment as Positive, Neutral, or Negative, confidence as number, and rationale as string.",
        f"Analyze HCP sentiment from this interaction text:\n{text}",
        fallback,
    )
    return SentimentResponse(**result)


async def extract_entities(payload: dict[str, Any]) -> dict[str, list[str]]:
    fallback = _fallback_entities(payload)
    return await LLMService().json_completion(
        "Extract healthcare CRM entities. Return strict JSON: doctors array, products array, diseases array.",
        f"Extract doctors, products, and diseases from this interaction:\n{payload}",
        fallback,
    )


async def suggest_followup(payload: dict[str, Any], sentiment: str = "Neutral") -> list[str]:
    text = _notes_blob(payload).lower()
    suggestions = ["schedule follow-up"]
    if "brochure" in text or "material" in text or "guide" in text:
        suggestions.insert(0, "send brochure")
    if "trial" in text or "evidence" in text or "study" in text:
        suggestions.append("share clinical trial")
    if "sample" in text:
        suggestions.append("product sample follow-up")
    if sentiment == "Negative":
        suggestions.append("schedule follow-up with medical science liaison")
    ordered = suggestions + [item for item in NEXT_BEST_ACTIONS if item not in suggestions]
    return list(dict.fromkeys(ordered))[:4]


async def log_interaction(payload: dict[str, Any]) -> dict[str, Any]:
    summary = await summarize_interaction(payload)
    sentiment_result = await analyze_sentiment(_notes_blob(payload))
    entities = await extract_entities(payload)
    actions = await suggest_followup(payload, sentiment_result.sentiment)
    enriched = {
        **payload,
        "ai_summary": summary,
        "sentiment": sentiment_result.sentiment,
        "extracted_entities": entities,
        "action_items": actions,
    }
    interaction = await InteractionService().create_interaction(InteractionCreate(**enriched))
    return {
        "interaction": interaction,
        "analysis": {
            "summary": summary,
            "sentiment": sentiment_result.sentiment,
            "confidence": sentiment_result.confidence,
            "extractedEntities": entities,
            "suggestedActions": actions,
        },
    }


async def edit_interaction(interaction_id: str, update: dict[str, Any]) -> dict[str, Any]:
    updated = await InteractionService().update_interaction(interaction_id, InteractionUpdate(**update))
    return {"interaction": updated, "updated_fields": updated.updated_fields}


async def fetch_hcp_history(hcp_name: str) -> dict[str, Any]:
    history = await InteractionService().fetch_hcp_history(hcp_name)
    return history.model_dump(by_alias=True)
