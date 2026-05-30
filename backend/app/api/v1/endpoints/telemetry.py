from fastapi import APIRouter, Depends, HTTPException, Header, UploadFile, File, Form
from app.models.sensor import TelemetryPayload
from app.core.config import settings
from app.services.anonymizer import OnPremiseAnonymizer
from app.services.hydrology import HydrologicalEstimator
from app.services.velocity import LSPIVVelocityCalculator
import cv2
import numpy as np
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Instantiate services
anonymizer = OnPremiseAnonymizer(settings.YOLO_ANONYMIZER_MODEL_PATH)
hydrologist = HydrologicalEstimator()
velocity_engine = LSPIVVelocityCalculator()

# Simple secure header validation dependency
def verify_api_key(x_aquaeye_api_key: str = Header(..., alias="X-AquaEye-API-Key")):
    if x_aquaeye_api_key != settings.API_KEY:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid secure DİN intranet API key token")
    return x_aquaeye_api_key

# In-memory telemetry cache simulating a database store for hackathon purposes
TELEMETRY_DB = {}

@router.post("/telemetry", response_model=dict, dependencies=[Depends(verify_api_key)])
def post_telemetry(payload: TelemetryPayload):
    """
    Endpoint 1: Receives real-time vector telemetry from local node processing containers
    and stores it in the central registry database.
    """
    node_id = payload.node_id
    TELEMETRY_DB[node_id] = payload.model_dump()
    logger.info(f"Received secure telemetry from node: {node_id} (Depth: {payload.telemetry.water_depth_cm}cm, Status: {payload.status})")
    return {
        "status": "success",
        "message": f"Telemetry vector synchronized for node {node_id}",
        "node_id": node_id,
        "recorded_at": datetime.utcnow().isoformat()
    }

@router.post("/telemetry/stream-frame", dependencies=[Depends(verify_api_key)])
async def process_stream_frame(
    node_id: str = Form(...),
    occlusion_rate: float = Form(...),
    reference_type: str = Form("curb"),
    frame: UploadFile = File(...)
):
    """
    Advanced streaming intake: Accepts raw frame binaries and computes anonymization,
    relative depth estimation via SERP metrics, specularity reflections, and updates the node state.
    """
    try:
        contents = await frame.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file format")
            
        # 1. Privacy Masking: Anonymize plates/faces in-memory
        anonymized_img = anonymizer.anonymize_frame(img)
        
        # 2. Estimate Depth via SERP Occlusion rate
        water_depth = hydrologist.calculate_occlusion_depth(occlusion_rate, reference_type)
        risk = hydrologist.get_risk_status(water_depth)
        
        # 3. Analyze specularity mirroring
        specularity = hydrologist.analyze_specularity_score(anonymized_img)
        
        # Generate final telemetry package
        payload_data = {
            "node_id": node_id,
            "timestamp": datetime.utcnow().isoformat(),
            "status": risk,
            "telemetry": {
                "water_depth_cm": water_depth,
                "flow_velocity_ms": 0.35 if risk != "NORMAL" else 0.0,
                "flow_direction_degree": 195,
                "confidence_score": round(1.0 - (specularity * 0.1), 2)
            },
            "stabilization_status": "STABLE",
            "sensor_occlusion_rate": round(specularity, 2)
        }
        
        TELEMETRY_DB[node_id] = payload_data
        
        return {
            "status": "success",
            "processed_at": datetime.utcnow().isoformat(),
            "metrics": payload_data
        }
        
    except Exception as e:
        logger.error(f"Stream frame processing failure: {e}")
        raise HTTPException(status_code=500, detail=f"Frame processing engine failure: {str(e)}")

@router.get("/telemetry/nodes", response_model=dict)
def get_node_states():
    """
    Fetch current cached state of all active surveillance node engines.
    """
    return {
        "active_nodes_count": len(TELEMETRY_DB),
        "nodes": TELEMETRY_DB
    }

# Telemetry early warning checkpoint 42
