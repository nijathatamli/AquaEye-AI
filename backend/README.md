# 🐍 AquaEye AI — Backend Core & Computer Vision Pipeline

This directory houses the local processing core of **AquaEye AI**, developed to run on-premise on secure servers for Azerbaijani municipal and security authorities (such as the Ministry of Internal Affairs - DİN, Emergency Situations - FHN, and AYNA/BNA).

The backend extracts hydrological data directly from live RTSP city camera streams with zero hardware footprint, anonymizes public footage in real time to comply with regulations, and exposes a high-throughput, secure REST API to feed the central Next.js command dashboard.

---

## 🏗️ Backend Directory Structure

```filepath
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── alerts.py         # Alert rules, rate-of-increase & FHN dispatch routing
│   │       │   ├── analysis.py       # Multimodal visual analysis (Gemini-1.5-Flash integration)
│   │       │   └── telemetry.py      # Telemetry vector ingestion & frame processing routes
│   │       └── router.py             # Main routing entry
│   ├── core/
│   │   ├── config.py                 # System configurations, environment vars & API keys
│   │   └── security.py               # Cryptographic tokens & intranet validation
│   ├── models/
│   │   └── sensor.py                 # Pydantic data schemas representing nodes & alerts
│   ├── services/
│   │   ├── anonymizer.py             # YOLOv8 face & plate blurring service
│   │   ├── hydrology.py              # Relative occlusion (SERP) & specularity calculations
│   │   └── velocity.py               # LSPIV dense optical flow velocity engine
│   └── main.py                       # FastAPI application setup & logging
├── tests/
│   └── test_api.py                   # Automated endpoint validation tests (pytest)
├── Dockerfile                        # Multi-stage production-ready CUDA GPU image
└── requirements.txt                  # Python dependencies
```

---

## 🧠 Scientific & CV Methodologies

### 1. In-Memory Privacy Anonymization
To meet public safety data privacy standards, the intake pipeline strips face profiles and vehicle license plates **in-memory** before passing frames to depth models.
*   **Method**: YOLOv8-Nano Anonymizer detects plate (class 1) and face (class 0) rectangles.
*   **Fallback**: If running without GPUs, uses a local OpenCV Haar Cascade frontal face classifier + color threshold clustering to blur license plate structures.

### 2. Relative Occlusion Water Level Engine (SERP)
Since standard cameras provide 2D perspectives, the depth is calculated by analyzing **Static Environmental Reference Points (SERPs)**.
*   **Curb Calibration**: If a curb (standard 15 cm height in Baku) is detected as obscured, water level is calculated proportionally:
    $$\text{Water Level} = \text{Occlusion Rate} \times 15\text{ cm}$$
*   **Tire Occlusion**: Standard car wheels (diameter ~65 cm) are monitored. Submersion rate translates directly to the low ($10\text{ cm}$), medium ($30\text{ cm}$), and critical ($50+\text{ cm}$) alert levels.

### 3. Specularity Reflection Filter
To avoid false positives from wet, reflective asphalt, we use **Reflection Attention analysis**:
*   Wet asphalt diffuses light widely due to micro-roughness.
*   Standing water behaves as a specular mirror. The engine checks for vertical symmetry projections (like car headlight reflections reflecting downward). If symmetry is matched, the water mask confidence is raised.

### 4. Large-Scale Particle Image Velocimetry (LSPIV)
Flow velocity is measured without floating physical meters by tracing surface ripples, rain vectors, and floating debris.
*   **Core Algorithm**: Gunnar Farneback dense optical flow checks pixel displacement vectors $(\Delta x, \Delta y)$ between frames.
*   **Velocity Output**: Calibrated via camera elevation matrix values, converting pixel-delta per frame into physical meters per second ($m/s$).

---

## 🚀 Installation & Local Execution

### 1. Local Python Setup
Ensure you have Python 3.10+ installed.

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
pip install -r requirements.txt

# Run Uvicorn dev server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
*   The interactive Swagger API documentation will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
*   The Redoc interface is located at [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### 2. Run Automated Pytest Suite
To verify endpoints and telemetry validation logic:
```bash
pytest -v
```

### 3. Running with Docker
To build and run the CUDA-optimized production image:
```bash
# Build the Docker image
docker build -t aquaeye-backend:latest .

# Run the container mapping port 8000
docker run -d -p 8000:8000 --name aquaeye-core aquaeye-backend:latest
```

<!-- Telemetry audit verified node 36 -->
