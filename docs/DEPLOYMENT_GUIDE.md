# 🚀 On-Premise Air-Gapped Deployment Guide

This document outlines the procedures, hardware configurations, and failover topologies required to deploy **AquaEye AI** within the secure, air-gapped intranet networks of the Ministry of Internal Affairs (DİN).

---

## 1. Hardware Requirements

To process 500 active RTSP surveillance streams at 15 FPS concurrently:

| Component | Minimum Specification | Recommended Specification |
| :--- | :--- | :--- |
| **GPU Node** | 2x NVIDIA RTX 4090 (24GB VRAM) | 4x NVIDIA A100 (80GB VRAM) |
| **CPU Core** | AMD EPYC 32-Core | AMD EPYC 64-Core |
| **Memory** | 128GB DDR5 ECC | 256GB DDR5 ECC |
| **Storage** | 1TB NVMe Gen4 SSD | 2TB NVMe Enterprise SSD |
| **Network** | 10 Gbps LAN interface | 2x 10 Gbps SFP+ Fiber lines |

---

## 2. Model Preparation & CUDA Setup

Before launching the container stack, compile the YOLO instance segmentation models for TensorRT acceleration:

```bash
# Export standard PyTorch weights to NVIDIA TensorRT engine
yolo export model=yolov8n-seg.pt format=engine device=0
yolo export model=yolov8n-anonymizer.pt format=engine device=0
```

Deploy weights into the local host directory: `/opt/models/` for persistent Kubernetes/Docker mounts.

---

## 3. Deployment Steps (Docker Compose)

On the local processing server:

```bash
# 1. Clone repository in the secure node env
git clone https://github.com/aquaeye/aquaeye-core.git
cd aquaeye-core/infrastructure

# 2. Configure environment credentials
cat <<EOF > .env
ENVIRONMENT=production
AQUAEYE_API_KEY=din_secure_intranet_access_token_2026
YOLO_SEG_MODEL_PATH=/opt/models/yolov8n-seg.engine
YOLO_ANONYMIZER_MODEL_PATH=/opt/models/yolov8n-anonymizer.engine
EOF

# 3. Pull images and launch services
docker-compose up -d --build
```

Verify GPU allocation using:
```bash
docker exec -it aquaeye-backend nvidia-smi
```

---

## 4. Kubernetes Cluster Orchestration

Apply configurations using `kubectl`:

```bash
# Create target namespace
kubectl create namespace aquaeye

# Set secrets and variables
kubectl apply -f kubernetes/secret.yaml
kubectl apply -f kubernetes/configmap.yaml

# Provision storage volumes
kubectl apply -f kubernetes/pv-volume.yaml
kubectl apply -f kubernetes/pvc-claim.yaml

# Deploy app services & ingress
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/ingress.yaml
kubectl apply -f kubernetes/hpa.yaml
```

---

## 5. Offline VLM Integrations (LLaVA-1.5)

To execute visual depth estimations without external Gemini API keys:
1.  Launch a local `vllm` OpenAI-compatible server hosting **LLaVA-1.5-7B**:
    ```bash
    python -m vllm.entrypoints.openai.api_server \
      --model llava-hf/llava-1.5-7b-hf \
      --port 8001 \
      --host 0.0.0.0
    ```
2.  Route Gemini fallback configurations in `backend/app/core/config.py` to point to `http://localhost:8001/v1/chat/completions`.
