from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str
    SESSION_SECRET: str
    DB_ECHO: bool = False
    CORS_ORIGINS: str = "http://localhost:5173"
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20

    model_config = {"env_file": ".env"}

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

settings = Settings()
