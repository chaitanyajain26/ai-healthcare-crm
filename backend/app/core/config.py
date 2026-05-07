from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    mongo_uri: str = "mongodb://mongo:27017"
    mongo_db: str = "helixcrm"
    groq_api_key: str = ""
    primary_model: str = "gemma2-9b-it"
    secondary_model: str = "llama-3.3-70b-versatile"
    cors_origins: str = "http://localhost:5173,http://localhost:3000,http://localhost:8080"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
