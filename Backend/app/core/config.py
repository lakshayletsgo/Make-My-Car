try:
    # pydantic v2+: BaseSettings was moved to pydantic-settings
    from pydantic_settings import BaseSettings
except Exception:
    # fallback for older pydantic versions
    from pydantic import BaseSettings

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    API_VERSION: str = "v1"
    APP_BASE_URL: str = "http://localhost:3000"
    CORS_ORIGINS: str = "http://localhost:3000"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    # JWT settings
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    EMAIL_VERIFY_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
