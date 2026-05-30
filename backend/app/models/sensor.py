from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

# Telemetry details
class TelemetryData(BaseModel):
    water_depth_cm: float = Field(..., description="Estimated water depth in centimeters")
    flow_velocity_ms: float = Field(..., description="Flow velocity in meters per second")
    flow_direction_degree: int = Field(..., description="Flow direction degree (0-360)")
    confidence_score: float = Field(..., description="Model segmentation confidence score (0.0 to 1.0)")

# Main telemetry incoming payload (Endpoint 1)
class TelemetryPayload(BaseModel):
    node_id: str = Field(..., example="cctv_nrm_118")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(..., description="Alert status level (NORMAL, LOW, MEDIUM, CRITICAL)")
    telemetry: TelemetryData
    stabilization_status: str = Field(default="STABLE")
    sensor_occlusion_rate: float = Field(default=0.0)

# Alert detail schema
class AlertDetail(BaseModel):
    node_id: str
    location: str
    severity: str
    reading: str
    rate_of_increase_cm_min: float
    estimated_submersion_eta_minutes: float
    recommended_action: str

# Alert triggers query output (Endpoint 2)
class AlertTriggerResponse(BaseModel):
    active_alerts_count: int
    alerts: List[AlertDetail]

# Gemini Visual Analytics payload schema (Endpoint 3)
class CameraFrameAnalysisResponse(BaseModel):
    flood_detected: bool
    estimated_water_level_cm: int
    risk_level: str
    reference_object_detected: str
    confidence_score: float
    recommended_action: str

# Telemetry early warning checkpoint 44
