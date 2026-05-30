import google.generativeai as genai
from PIL import Image
import os

# 1. Configure Gemini API Key
api_key = os.getenv("GEMINI_API_KEY", "SİZİN_GEMINI_API_KEY")
genai.configure(api_key=api_key)
if api_key == "SİZİN_GEMINI_API_KEY":
    print("[WARN] Gemini API key is using the placeholder. Set GEMINI_API_KEY env variable to run live calls.")

# 2. Dynamically search for a camera frame to analyze (prevents FileNotFoundError)
sample_paths = [
    'street_flood_camera_frame.jpg',
    '../public/flooded-city-street-cars-cctv.png',
    'public/flooded-city-street-cars-cctv.png',
    '../assets/screenshots/dashboard.png',
    'assets/screenshots/dashboard.png',
    '../../assets/screenshots/dashboard.png'
]

img = None
for path in sample_paths:
    if os.path.exists(path):
        img = Image.open(path)
        print(f"[INFO] Successfully loaded camera frame: {path}")
        break

if img is None:
    # Build a simulated 640x480 gray street frame if no assets are found
    print("[WARN] No camera frame image found. Generating a simulated gray-scale street canvas for demonstration.")
    img = Image.new('RGB', (640, 480), color=(80, 80, 90))

# 3. Select the multimodal flash model
model = genai.GenerativeModel('gemini-1.5-flash')

# 4. Multi-modal vision prompt
prompt = """
You are an expert Urban Flood Monitoring AI. Analyze this street security camera image and calculate the flood status.

Your tasks:
1. Detect if there is water accumulation (flooding) on the road or sidewalk.
2. Look for reference objects (cars, car wheels, curbs, humans, traffic signs) to estimate the water depth.
3. Use the following logic for estimation:
   - Water touches the bottom of the car tire / curb level: ~10-15 cm (LOW RISK)
   - Water reaches half of the car tire / covers the curb completely: ~25-35 cm (MEDIUM RISK)
   - Water covers the car wheels completely / reaches car doors: ~50+ cm (CRITICAL RISK)

Output the analysis STRICTLY in the following JSON format, with no extra text or explanations:

{
  "flood_detected": true or false,
  "estimated_water_level_cm": integer,
  "risk_level": "LOW" or "MEDIUM" or "CRITICAL" or "NONE",
  "reference_object_detected": "string (e.g., car tire, curb, none)",
  "confidence_score": float (between 0.0 and 1.0),
  "recommended_action": "string"
}
"""

print("[AI] Analyzing camera frame and evaluating risk scale ...")

try:
    if api_key != "SİZİN_GEMINI_API_KEY":
        response = model.generate_content([prompt, img])
        print("\n--- AI Analysis Output (JSON) ---")
        print(response.text)
    else:
        # High fidelity mock telemetry matching Baku flood dataset for demo
        import json
        mock_output = {
            "flood_detected": True,
            "estimated_water_level_cm": 62,
            "risk_level": "CRITICAL",
            "reference_object_detected": "car wheels and sidewalk curb",
            "confidence_score": 0.96,
            "recommended_action": "Water covers wheels completely. Dispatch FHN road blocks and close Nərimanov Tunnel!"
        }
        print("\n--- Simulated AI Analysis Output (JSON) ---")
        print(json.dumps(mock_output, indent=2))
except Exception as e:
    print(f"[ERROR] API failed: {e}. Ensure library google-generativeai is installed.")

# Telemetry early warning checkpoint 48
