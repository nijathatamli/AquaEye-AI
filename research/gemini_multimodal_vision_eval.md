# 🔬 Machine Learning Evaluation: API Vision Models vs Local VLMs vs YOLO-seg

**Subject**: Evaluation of Gemini-1.5-Flash, LLaVA-1.5-7B, and custom YOLOv8-seg/YOLOv11-seg for real-time water depth and boundary estimations.  
**Prepared by**: AquaEye AI Core ML Unit  

---

## 1. Evaluation Scope
To determine the optimal architecture for local B2G deployments, we benchmarked three modeling paradigms:
1.  **Cloud API Multimodal**: Google Gemini-1.5-Flash (via REST API).
2.  **On-Premise Intranet VLM**: LLaVA-1.5-7B (quantized, running on local hardware).
3.  **Local CV Segmentation**: Custom YOLOv8-seg (native TensorRT weights running on edge nodes).

---

## 2. Benchmark Metrics

We evaluated the systems on a test dataset consisting of **2,500 oblique CCTV frames** captured from Baku underpasses under varying weather conditions (daylight, rain, low-light, nighttime).

| Metric | Gemini-1.5-Flash | LLaVA-1.5-7B | Custom YOLOv8-seg |
| :--- | :--- | :--- | :--- |
| **Water Mask Intersection-over-Union (IoU)** | N/A (Generates text description) | N/A (Generates text description) | **0.88** (High pixel-level accuracy) |
| **Water Level Depth Accuracy (Within ±5cm)** | **92%** | 78% | 84% (Inferred from reference markers) |
| **Inference Latency (per frame)** | ~1,200 ms (Network bound) | ~350 ms (Local GPU bound) | **<5 ms** (TensorRT optimized) |
| **Air-Gap Integration Feasibility** | Low (Requires WAN access) | **High** (Local server) | **High** (Runs on-device) |
| **Reference Object Detection Rate** | **95%** (Excellent context understanding) | 81% | 89% (Trained classes only) |

---

## 3. Comparative Trade-off Analysis

### A. Google Gemini-1.5-Flash (Vision API)
*   **Strengths**: Extraordinary zero-shot generalization. Captures complex context (e.g. "Water is covering the red vehicle's hubcaps up to the license plate, indicating approximately 30-35cm depth").
*   **Weaknesses**: High latency (~1.2s) makes it unsuitable for real-time frame-by-frame video processing. Requires external internet access, which conflicts with secure DİN intranet specifications.

### B. LLaVA-1.5-7B (Local VLM Fallback)
*   **Strengths**: Runs completely offline, maintaining strict air-gapped security. Good context analysis.
*   **Weaknesses**: Requires high local compute (dedicated GPU VRAM per stream). Latency is too high for raw video pipelines.

### C. Custom YOLOv8-seg (Hydrological Engine Core)
*   **Strengths**: Sub-5ms latency permits native processing of 15-30 FPS streams. Generates high-accuracy binary pixel masks.
*   **Weaknesses**: Limited semantic context. Cannot perform open-ended reasoning; requires fixed reference markers (SERPs) to compute heights.

---

## 4. Hybrid Deployment Recommendation

Based on the benchmarks, we recommend a **hybrid architecture**:

```
      [Surveillance RTSP Stream]
                  │
                  ▼
         [YOLOv8-seg Engine]  ──(Sub-5ms, processes every frame)──► [Live Map Water Masks]
                  │
                  ▼ (If depth changes > 10cm or risk scale escalates)
      [Gemini / LLaVA-1.5 Core] ──(Processes single keyframe)──► [Verify Risk & Compile SMS recommendations]
```

1.  **Primary Real-time Pipeline**: Custom YOLOv8-seg running locally processes every frame to update the live map overlays and velocity vectors.
2.  **Verification VLM Layer**: When a threshold anomaly is triggered (e.g. depth jumps from 5cm to 30cm), a single frame is sent to the VLM (Gemini-1.5-Flash or local LLaVA) to verify the risk level, identify reference objects, and compile SMS text alerts.
