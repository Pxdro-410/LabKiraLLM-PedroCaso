from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://fooduser:foodpass@db:5432/foodapp"
    frontend_origin: str = "http://localhost"
    max_retries: int = 10
    retry_interval: int = 5

    class Config:
        env_file = ".env"


settings = Settings()
