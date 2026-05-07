from typing import Any, Literal, TypedDict

from langgraph.graph import END, StateGraph

from app.agents.tools.interaction_tools import (
    analyze_sentiment,
    edit_interaction,
    fetch_hcp_history,
    log_interaction,
    suggest_followup,
    summarize_interaction,
)

Intent = Literal["log_interaction", "edit_interaction", "summarize_interaction", "analyze_sentiment", "suggest_followup", "fetch_hcp_history"]


class InteractionAgentState(TypedDict, total=False):
    message: str
    messages: list[dict[str, str]]
    draft: dict[str, Any]
    interaction_id: str | None
    hcp_name: str | None
    intent: str
    tool: str
    tool_result: dict[str, Any]
    response: str
    error: str


def _detect_intent(message: str, draft: dict[str, Any], interaction_id: str | None, hcp_name: str | None) -> Intent:
    text = message.lower()
    tokens = set(text.replace("-", " ").split())
    if interaction_id and tokens.intersection({"edit", "update", "change", "modify"}):
        return "edit_interaction"
    if tokens.intersection({"history", "previous", "past"}) or "last visit" in text or hcp_name:
        return "fetch_hcp_history"
    if tokens.intersection({"sentiment", "tone", "positive", "negative"}):
        return "analyze_sentiment"
    if tokens.intersection({"follow", "followup", "actions", "recommend"}) or "next best" in text or "follow-up" in text:
        return "suggest_followup"
    if tokens.intersection({"summarize", "summary", "recap"}):
        return "summarize_interaction"
    if draft or tokens.intersection({"log", "save", "record", "interaction"}):
        return "log_interaction"
    return "summarize_interaction"


async def intent_detection_node(state: InteractionAgentState) -> InteractionAgentState:
    intent = _detect_intent(
        state.get("message", ""),
        state.get("draft", {}),
        state.get("interaction_id"),
        state.get("hcp_name"),
    )
    return {**state, "intent": intent}


async def tool_selection_node(state: InteractionAgentState) -> InteractionAgentState:
    return {**state, "tool": state["intent"]}


async def tool_execution_node(state: InteractionAgentState) -> InteractionAgentState:
    tool = state["tool"]
    draft = state.get("draft", {})
    message = state.get("message", "")
    result: dict[str, Any]

    try:
        if tool == "log_interaction":
            result = await log_interaction(draft)
        elif tool == "edit_interaction":
            result = await edit_interaction(state.get("interaction_id") or "", draft)
        elif tool == "fetch_hcp_history":
            result = await fetch_hcp_history(state.get("hcp_name") or draft.get("hcp_name") or draft.get("hcpName") or message)
        elif tool == "analyze_sentiment":
            sentiment = await analyze_sentiment(message or draft.get("notes", ""))
            result = {"sentiment": sentiment.model_dump()}
        elif tool == "suggest_followup":
            actions = await suggest_followup(draft or {"notes": message})
            result = {"suggested_actions": actions}
        else:
            summary = await summarize_interaction(draft or {"notes": message})
            result = {"summary": summary}
        return {**state, "tool_result": result}
    except Exception as exc:
        return {**state, "error": str(exc), "tool_result": {}}


async def response_node(state: InteractionAgentState) -> InteractionAgentState:
    if state.get("error"):
        return {
            **state,
            "response": "I could not complete that CRM action. Please check the request payload and backend logs.",
        }

    tool = state["tool"]
    result = state.get("tool_result", {})
    if tool == "log_interaction":
        response = "Interaction logged with AI summary, entity extraction, sentiment, and next best actions."
    elif tool == "edit_interaction":
        response = f"Interaction updated. Fields changed: {', '.join(result.get('updated_fields', [])) or 'none'}."
    elif tool == "fetch_hcp_history":
        response = "Fetched HCP history and generated contextual insights."
    elif tool == "analyze_sentiment":
        response = f"Detected sentiment: {result.get('sentiment', {}).get('sentiment', 'Neutral')}."
    elif tool == "suggest_followup":
        response = "Recommended next best actions for this HCP interaction."
    else:
        response = result.get("summary", "Generated a concise interaction summary.")
    return {**state, "response": response}


workflow = StateGraph(InteractionAgentState)
workflow.add_node("intent_detection", intent_detection_node)
workflow.add_node("tool_selection", tool_selection_node)
workflow.add_node("tool_execution", tool_execution_node)
workflow.add_node("ai_response", response_node)
workflow.set_entry_point("intent_detection")
workflow.add_edge("intent_detection", "tool_selection")
workflow.add_edge("tool_selection", "tool_execution")
workflow.add_edge("tool_execution", "ai_response")
workflow.add_edge("ai_response", END)

interaction_agent = workflow.compile()
