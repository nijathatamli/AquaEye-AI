# 🔒 Security Policy — AquaEye AI

Since AquaEye AI operates on live, public security surveillance footage (Safe City Baku networks), security is our highest engineering priority. This document outlines the protocols, networks, and vulnerability guidelines required for our system deployments.

---

## 1. Intranet & Air-Gapped Containment
All core YOLO-seg inference models, frame processors, and local Uvicorn API endpoints must run within an **air-gapped intranet zone** owned by the Ministry of Internal Affairs (DİN).
*   **Zero Internet Leakage**: No RTSP stream packets or frames may leave the local DİN datacenter.
*   **Internal Routing**: API integrations (e.g. Next.js dashboard requests) communicate using local DNS endpoints (`*.secure.intranet.gov.az`).
*   **Gemini Fallback**: In production deployments, standard Gemini visual requests are replaced by locally hosted LLaVA or custom Vision-Language Models (VLMs) running on local GPU servers to prevent external API calls.

---

## 2. API Authentication & Token Rotation
All telemetry pipelines require the header token:
```http
X-AquaEye-API-Key: <Secure_Intranet_Token>
```
*   **Rotation**: Tokens must be rotated every 30 days via automated DİN internal vault configurations.
*   **Hashing**: All stored node credentials are encrypted in-transit using TLS 1.3 and at-rest using AES-256-GCM.

---

## 3. Anonymization Audit
All incoming video footage must immediately pass through the [OnPremiseAnonymizer](file:///C:/Users/user/Desktop/AquaEye-AI/backend/app/services/anonymizer.py) module. 
*   **Volatile Buffer**: Frame pixels representing human faces or license plates are blurred directly in the frame-buffer queues. No raw, unmasked frame is allowed to hit persistent SSD storage.
*   **Audit Logging**: The system conducts automated integrity audits to verify that the face/plate blur kernel size is set to a minimum of $51 \times 51$ pixels with $\sigma \ge 15$.

---

## 4. Reporting Vulnerabilities
If you identify a security vulnerability, **do NOT create a public issue**. Instead, report it directly through secure internal government communication channels:
*   **Contact Security**: `security-alert@din.gov.az`
*   **PGP Public Key**: Available in our internal security directory for encrypted vulnerability briefings.
*   We aim to address all verified security exposures within 24 hours of notice.
