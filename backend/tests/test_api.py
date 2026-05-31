from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"
    assert "api_documentation" in response.json()

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_telemetry_unauthorized():
    # Test uploading telemetry without the required DİN secure key header
    payload = {
        "node_id": "cctv_nrm_118",
        "status": "CRITICAL",
        "telemetry": {
            "water_depth_cm": 62.0,
            "flow_velocity_ms": 1.45,
            "flow_direction_degree": 195,
            "confidence_score": 0.96
        }
    }
    headers = {"X-AquaEye-API-Key": "invalid_key_token"}
    response = client.post("/api/v1/sensors/telemetry", json=payload, headers=headers)
    assert response.status_code == 403  # Should fail with Forbidden

def test_telemetry_authorized():
    # Test uploading telemetry with the correct DİN secure key header
    payload = {
        "node_id": "cctv_nrm_118",
        "status": "CRITICAL",
        "telemetry": {
            "water_depth_cm": 62.0,
            "flow_velocity_ms": 1.45,
            "flow_direction_degree": 195,
            "confidence_score": 0.96
        }
    }
    headers = {settings.API_KEY_NAME: settings.API_KEY}
    response = client.post("/api/v1/sensors/telemetry", json=payload, headers=headers)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_get_alert_triggers():
    # Fetch active alerts
    response = client.get("/api/v1/sensors/alert-trigger?threshold_cm=10.0")
    assert response.status_code == 200
    data = response.json()
    assert "active_alerts_count" in data
    assert "alerts" in data
    assert len(data["alerts"]) > 0
    # Verify alert recommendations
    first_alert = data["alerts"][0]
    assert "node_id" in first_alert
    assert "recommended_action" in first_alert

# Telemetry early warning checkpoint 50
