# API Documentation

FastAPI exposes interactive OpenAPI documentation at:

- Local: `http://localhost:8000/docs`
- Health: `GET /health`

## Interactions

`GET /api/v1/interactions` or `GET /interactions`

Returns the latest HCP interaction records.

`GET /api/v1/interactions/{id}` or `GET /interactions/{id}`

Returns one interaction.

`GET /api/v1/interactions/hcp/history?hcpName=Dr.%20Aisha%20Menon`

Returns HCP history and context-aware insights.

`POST /api/v1/interactions` or `POST /interactions`

Creates an interaction.

```json
{
  "hcpName": "Dr. Aisha Menon",
  "interactionType": "In-person visit",
  "date": "2026-05-07",
  "time": "10:30",
  "attendees": "MSL, account manager",
  "topicsDiscussed": "Adherence, onboarding",
  "notes": "HCP requested dosing material and follow-up support.",
  "materialsShared": "Dosing guide",
  "followUpActions": ["Send dosing guide"]
}
```

`PUT /api/v1/interactions/{id}` or `PUT /interactions/{id}`

Updates an interaction and records updated fields.

## AI Agent

`POST /api/v1/agent/chat` or `POST /agent/chat`

Runs the LangGraph intent-detection and tool-execution flow.

`POST /api/v1/agent/summarize` or `POST /agent/summarize`

Returns a concise interaction summary.

`POST /api/v1/agent/sentiment` or `POST /agent/sentiment`

Returns Positive, Neutral, or Negative sentiment with confidence.
