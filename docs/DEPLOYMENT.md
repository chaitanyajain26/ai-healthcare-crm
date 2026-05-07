# Deployment Instructions

## Local Docker

1. Start Docker Desktop.
2. Optionally copy `.env.example` to `.env` and add `GROQ_API_KEY`.
3. Run `docker compose up --build`.
4. Open `http://localhost:8080`.
5. API docs are available at `http://localhost:8000/docs`.

## Production Notes

- Deploy the frontend to Vercel from `frontend/`.
- Deploy the backend to Render or Railway using `backend/Dockerfile` or `render.yaml`.
- Use MongoDB Atlas with a production connection string.
- Store `GROQ_API_KEY` in a secret manager, not in source control.
- Add organization-specific compliance logging, consent capture, and audit retention before regulated rollout.
- Restrict CORS to approved frontend origins.
