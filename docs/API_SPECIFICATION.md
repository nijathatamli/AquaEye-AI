# 🔌 API Specification: AquaEye AI Local Processing Core

This document outlines the API specifications, payloads, headers, and endpoints exposed by the secure **AquaEye AI** FastAPI core intranet application.

---

## 1. Global Specifications

*   **API Base URL**: `https://api.aquaeye.secure.intranet.gov.az/api/v1`
*   **Response Format**: `application/json`
*   **Security Header**: `X-AquaEye-API-Key` (AES-256 rotated credentials)
*   **Performance Tracking**: Each response includes `X-Process-Time-Ms` in headers.

---

## 2. Telemetry Ingestion API

### `POST /sensors/telemetry`
Receives live telemetry vectors from edge camera containers.

#### Request Headers
```http
X-AquaEye-API-Key: din_secure_intranet_access_token_2026
Content-Type: application/json
```

#### Request Payload
```json
{
  "node_id": "cctv_nrm_118",
  "status": "CRITICAL",
  "telemetry": {
    "water_depth_cm": 62.0,
    "flow_velocity_ms": 1.45,
    "flow_direction_degree": 195,
    "confidence_score": 0.96
  },
  "stabilization_status": "STABLE",
  "sensor_occlusion_rate": 0.05
}
```

#### Response (200 OK)
```json
{
  "status": "success",
  "message": "Telemetry vector synchronized for node cctv_nrm_118",
  "node_id": "cctv_nrm_118",
  "recorded_at": "2026-05-31T08:34:04Z"
}
```

---

## 3. Visual Analytics API

### `POST /sensors/analysis/vision-estimate`
Processes a raw static CCTV screen capture through the multimodal AI vision model (Gemini-1.5-Flash or local VLM) to extract zero-hardware flood metrics.

#### Request Headers
```http
X-AquaEye-API-Key: din_secure_intranet_access_token_2026
Content-Type: multipart/form-data
```

#### Request Body (Multipart)
*   `frame`: File binary (JPEG/PNG)

#### Response (200 OK)
```json
{
  "flood_detected": true,
  "estimated_water_level_cm": 62,
  "risk_level": "CRITICAL",
  "reference_object_detected": "wheel hub and curb",
  "confidence_score": 0.96,
  "recommended_action": "Water covers wheel hubs completely. Urgent: Dispatch FHN road blockers and close tunnel NRM-118!"
}
```

---

## 4. Alert Dispatch API

### `GET /sensors/alert-trigger`
Scans telemetry registries for active anomalies exceeding safety limits and compiles alerts for dashboard displays and emergency sirens.

#### Query Parameters
| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `threshold_cm` | float | No | `10.0` | Inundation height threshold to filter critical alerts. |

#### Response (200 OK)
```json
{
  "active_alerts_count": 3,
  "alerts": [
    {
      "node_id": "cctv_nrm_118",
      "location": "Nərimanov prospekti — alt keçid",
      "severity": "CRITICAL",
      "reading": "62 cm",
      "rate_of_increase_cm_min": 4.1,
      "estimated_submersion_eta_minutes": 6.2,
      "recommended_action": "DISPATCH_ROAD_SERVICES_AND_REROUTE_TRAFFIC"
    },
    {
      "node_id": "cctv_nrm_077",
      "location": "Gənclik Mall alt keçidi",
      "severity": "CRITICAL",
      "reading": "58 cm",
      "rate_of_increase_cm_min": 3.8,
      "estimated_submersion_eta_minutes": 8.0,
      "recommended_action": "CLOSE_TUNNEL_TO_TRAFFIC_AND_ALERT_FHN"
    }
  ]
}
```

<!-- Telemetry audit verified node 87 -->
