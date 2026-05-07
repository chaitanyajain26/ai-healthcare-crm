# Folder Structure

```text
ai-healthcare-crm/
  frontend/
    src/
      app/                    # Redux store and React Router setup
      components/
        ai/                   # AI Assistant panel
        common/               # Reusable cards, badges, fields, loading states
        interactions/         # Interaction form and table
        layout/               # Sidebar, topbar, app shell
      features/
        aiAssistant/          # AI assistant Redux slice
        auth/                 # Auth Redux slice
        interactions/         # Interaction Redux slice
      pages/                  # Login, Dashboard, Log Interaction, History
      services/               # Axios API clients
  backend/
    app/
      agents/                 # LangGraph orchestration and tools
      api/v1/routes/          # FastAPI route modules
      core/                   # Settings and logging
      db/                     # MongoDB lifecycle
      models/                 # Database document models
      schemas/                # Pydantic request/response schemas
      services/               # Business logic layer
      utils/                  # Shared exceptions and utilities
  docs/                       # API, deployment, and architecture notes
  docker-compose.yml
  .env.example
```
