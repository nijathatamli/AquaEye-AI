"""
╔══════════════════════════════════════════════════════════════════════╗
║   AquaEye AI — Flood Water Segmentation Visualizer                 ║
║   YOLOv8/YOLOv11 Instance Segmentation + OpenCV Overlay            ║
╚══════════════════════════════════════════════════════════════════════╝

SETUP:
    pip install ultralytics opencv-python numpy

RUN:
    python aquaeye_segmentation.py
"""

import cv2
import numpy as np
import os

# ═══════════════════════════════════════════════════════════════════════
#  CONFIGURATION & DYNAMIC RESOLVING
# ═══════════════════════════════════════════════════════════════════════

# Dynamically locate the hackathon flash flood footage MP4 in the workspace
possible_video_paths = [
    "assets/video/CCTV FLASH FLOOD FOOTAGE TIMELAPSE JAPAN 2020.mp4",
    "../assets/video/CCTV FLASH FLOOD FOOTAGE TIMELAPSE JAPAN 2020.mp4",
    "../../assets/video/CCTV FLASH FLOOD FOOTAGE TIMELAPSE JAPAN 2020.mp4",
    "CCTV FLASH FLOOD FOOTAGE TIMELAPSE JAPAN 2020.mp4"
]

VIDEO_PATH = "YOUR_VIDEO_PATH.mp4"
for path in possible_video_paths:
    if os.path.exists(path):
        VIDEO_PATH = path
        break

MODEL_PATH      = "yolov8n-seg.pt"       # or custom water segmentation weights
WATER_CLASS_IDS = [0]                     # Set class ID of target labels

# Visual settings
MASK_COLOR      = (0, 255, 0)             # Bright green (B, G, R)
MASK_ALPHA      = 0.45                    # Transparency of the flood overlay
CONFIDENCE_THR  = 0.35                    # Minimum confidence to draw a mask

# Telemetry banner
BANNER_TEXT     = "CAM 07 | SABUNCHU TUNNEL | LIVE FLOOD MONITORING"
BANNER_HEIGHT   = 48
BANNER_ALPHA    = 0.65

# Display
WINDOW_NAME     = "AquaEye AI — Flood Segmentation"
RESIZE_WIDTH    = 1280                    # 0 = keep original size


# ═══════════════════════════════════════════════════════════════════════
#  UTILITY FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def draw_telemetry_banner(frame: np.ndarray) -> np.ndarray:
    h, w = frame.shape[:2]
    banner_h = min(BANNER_HEIGHT, h // 8)

    # Create semi-transparent overlay
    overlay = frame.copy()
    cv2.rectangle(overlay, (0, 0), (w, banner_h), (0, 0, 0), -1)
    frame = cv2.addWeighted(overlay, BANNER_ALPHA, frame, 1 - BANNER_ALPHA, 0)

    # White text centered in the banner
    font      = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = banner_h / 38.0
    thickness  = max(1, int(banner_h / 24))
    text_size  = cv2.getTextSize(BANNER_TEXT, font, font_scale, thickness)[0]
    text_x     = (w - text_size[0]) // 2
    text_y     = (banner_h + text_size[1]) // 2

    cv2.putText(frame, BANNER_TEXT, (text_x, text_y),
                font, font_scale, (255, 255, 255), thickness, cv2.LINE_AA)
    return frame


def apply_water_mask(frame: np.ndarray, masks, class_ids, confidences) -> np.ndarray:
    if masks is None:
        return frame

    h, w = frame.shape[:2]
    combined_mask = np.zeros((h, w), dtype=np.uint8)

    for mask_tensor, cls_id, conf in zip(masks.data, class_ids, confidences):
        if int(cls_id) not in WATER_CLASS_IDS:
            continue
        if conf < CONFIDENCE_THR:
            continue

        # Convert YOLO mask tensor to binary numpy mask at frame resolution
        mask_np = mask_tensor.cpu().numpy().astype(np.uint8)
        mask_np = cv2.resize(mask_np, (w, h), interpolation=cv2.INTER_NEAREST)
        mask_np = (mask_np > 0.5).astype(np.uint8)
        combined_mask = cv2.bitwise_or(combined_mask, mask_np)

    if not np.any(combined_mask):
        return frame

    # Build a colored overlay from the binary mask
    colored = np.zeros_like(frame)
    colored[combined_mask == 1] = MASK_COLOR

    # Alpha blend: overlay = frame * (1-α) + colored * α
    blended = frame.copy()
    blended[combined_mask == 1] = cv2.addWeighted(
        frame[combined_mask == 1], 1 - MASK_ALPHA,
        colored[combined_mask == 1], MASK_ALPHA, 0
    )
    return blended


def resize_frame(frame: np.ndarray, target_width: int) -> np.ndarray:
    if target_width <= 0:
        return frame
    h, w = frame.shape[:2]
    if w <= target_width:
        return frame
    ratio = target_width / w
    new_h = int(h * ratio)
    return cv2.resize(frame, (target_width, new_h), interpolation=cv2.INTER_AREA)


# ═══════════════════════════════════════════════════════════════════════
#  MAIN PROCESSING LOOP
# ═══════════════════════════════════════════════════════════════════════

def main():
    # ── Load model ──────────────────────────────────────────────────
    print(f"[MODEL]  Loading YOLO Model weights from: {MODEL_PATH} …")
    try:
        from ultralytics import YOLO
        model = YOLO(MODEL_PATH)
        if hasattr(model, "names"):
            print(f"[MODEL]  Classes: {model.names}")
    except Exception as e:
        print(f"[ERROR] Could not load ultralytics YOLO engine: {e}")
        print("Please install requirements: pip install ultralytics opencv-python")
        return

    print(f"[CONFIG] Water class IDs: {WATER_CLASS_IDS}")
    print(f"[CONFIG] Confidence threshold: {CONFIDENCE_THR}\n")

    # ── Open video ──────────────────────────────────────────────────
    if VIDEO_PATH == "YOUR_VIDEO_PATH.mp4" or not os.path.exists(VIDEO_PATH):
        print(f"[WARN]   VIDEO_PATH '{VIDEO_PATH}' not resolved. Falling back to default camera (Webcam 0).")
        cap = cv2.VideoCapture(0)
    else:
        print(f"[VIDEO]  Opening video stream: {VIDEO_PATH}")
        cap = cv2.VideoCapture(VIDEO_PATH)

    if not cap.isOpened():
        print("[ERROR]  Cannot open video source.")
        return

    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    print(f"[VIDEO]  FPS: {fps:.1f}  |  Total Frames: {total_frames}\n")
    print("[INFO]   Press 'q' in the window to exit the CV visualizer.\n")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("[DONE]   End of video stream reached.")
            break

        display = resize_frame(frame, RESIZE_WIDTH)

        # ── YOLO inference ──────────────────────────────────────────
        results = model(display, verbose=False)

        for r in results:
            if r.masks is None:
                continue
            display = apply_water_mask(
                display,
                r.masks,
                r.boxes.cls if r.boxes is not None else [],
                r.boxes.conf if r.boxes is not None else [],
            )

        # ── Telemetry banner ────────────────────────────────────────
        display = draw_telemetry_banner(display)

        # ── Show frame in OpenCV window ──────────────────────────────
        cv2.imshow(WINDOW_NAME, display)

        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            print("[INFO]   Exit requested by user.")
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()

# Telemetry early warning checkpoint 49
