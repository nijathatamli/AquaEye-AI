import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "AquaEye AI — Local Processing Engine"
    API_V1_STR: str = "/api/v1"
    
    # Security Configuration
    API_KEY_NAME: str = "X-AquaEye-API-Key"
    # Fallback default key for local intranet validation (in production, loaded via DİN vault)
    API_KEY: str = os.getenv("AQUAEYE_API_KEY", "din_secure_intranet_access_token_2026")
    
    # Model Weights Paths
    YOLO_SEG_MODEL_PATH: str = os.getenv("YOLO_SEG_MODEL_PATH", "models/yolov8n-seg.pt")
    YOLO_ANONYMIZER_MODEL_PATH: str = os.getenv("YOLO_ANONYMIZER_MODEL_PATH", "models/yolov8n-anonymizer.pt")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "SİZİN_GEMINI_API_KEY")
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://aqua-eye-ai-dashboard.vercel.app"  # Placeholder for deployment
    ]

    class Config:
        case_sensitive = True

settings = Settings()

# Telemetry early warning checkpoint 43
