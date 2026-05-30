from fastapi import APIRouter
from app.api.v1.endpoints import telemetry, alerts, analysis

api_router = APIRouter()

# Include sub-routers under clean REST paths
api_router.include_router(telemetry.router, prefix="/sensors", tags=["telemetry"])
api_router.include_router(alerts.router, prefix="/sensors", tags=["alerts"])
api_router.include_router(analysis.router, prefix="/sensors", tags=["analysis"])

# Telemetry early warning checkpoint 39
