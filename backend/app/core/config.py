from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:root@localhost:5432/todolist"
    SESSION_SECRET: str = "super-secret-key-change-in-production"
    DB_ECHO: bool = False
    CORS_ORIGINS: str = "http://localhost:5173"

    model_config = {"env_file": ".env"}

settings = Settings()