from typing import Any

REDACTED_TERMS = ["patient name", "phone number", "email address"]


def sanitize_interaction_notes(draft: dict[str, Any]) -> dict[str, Any]:
    """Lightweight guardrail that keeps obvious patient identifiers out of the AI prompt."""
    sanitized = dict(draft)
    notes = str(sanitized.get("notes", ""))
    for term in REDACTED_TERMS:
        notes = notes.replace(term, "[redacted]")
    sanitized["notes"] = notes
    return sanitized
