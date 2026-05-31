# 📝 Scientific Whitepaper: Zero-Hardware CCTV Hydrological Inference

**Project AquaEye AI**  
*Baku Urban Flood & Inundation Early Warning Network Engine*  
*Prepared for the Openwave Hackathon*

---

## 1. Abstract
Traditional urban inundation monitoring systems rely heavily on expensive physical sensors (ultrasonic, radar, or hydrostatic pressure gauges) installed at fixed locations. These systems require substantial B2G hardware budgets, high maintenance, and are highly vulnerable to vandalism. 

**AquaEye AI** introduces a hardware-free alternative by transforming Baku's existing CCTV security and traffic camera network into a unified "virtual sensor network". By utilizing deep-learning instance segmentation (YOLOv8-seg/YOLOv11-seg), homography stabilization, relative occlusion delta tracking, and dense optical flow (LSPIV), the system extracts high-fidelity water depths and flow velocities directly from obliques. This paper details the mathematical formulations and computer vision pipelines driving the local inference engines.

---

## 2. In-Memory Privacy Anonymization
To ensure strict compliance with public data protection regulations in Azerbaijan, all incoming camera streams (RTSP) undergo automated anonymization in volatile memory before feature extraction.

Let $F \in \mathbb{R}^{H \times W \times 3}$ be the raw camera frame. The face and license plate detector model outputs a set of bounding boxes $B = \{b_1, b_2, \dots, b_n\}$, where each box $b_i = (x_1, y_1, x_2, y_2)$. The anonymized frame $\tilde{F}$ is computed by applying an intensive Gaussian kernel $G_{\sigma}$ to each bounding box region:

$$\tilde{F}_{x,y} = \begin{cases} 
(F * G_{\sigma})_{x,y} & \text{if } (x,y) \in b_i \\
F_{x,y} & \text{otherwise}
\end{cases}$$

Where the standard deviation $\sigma = 15$ and kernel dimensions are fixed at $51 \times 51$ pixels to guarantee complete irreversibility.

---

## 3. Relative Occlusion Water Level Engine
Depth estimation from standard 2D monocular CCTV feeds is achieved by measuring the occlusion rate of **Static Environmental Reference Points (SERPs)**.

```
                  [Monocular CCTV Feed]
                           │
      ┌────────────────────┴────────────────────┐
      ▼                                         ▼
[SERP: Curb Height (H_ref)]           [SERP: Wheel Hub (D_ref)]
      │                                         │
      ├────────────────────┼────────────────────┤
      ▼                                         ▼
Vertical Submersion Ratio (ω)         Vertical Submersion Ratio (ω)
      │                                         │
      └────────────────────┬────────────────────┘
                           ▼
                 Estimated Water Depth (d)
```

### A. Curb Occlusion Formulation
Let $H_{ref}$ be the known physical height of a standard sidewalk curb in Baku (nominally $H_{ref} = 15.0\text{ cm}$). Let the vertical pixel span of the curb in the camera projection plane be $P_{curb} = y_{bottom} - y_{top}$. 

When water accumulates, the lower boundary of the visible curb shifts to $y_{water}$. The vertical occlusion ratio $\omega_{curb} \in [0, 1]$ is defined as:

$$\omega_{curb} = \frac{y_{bottom} - y_{water}}{y_{bottom} - y_{top}}$$

The physical water depth $d_{curb}$ is then calculated as:

$$d_{curb} = \omega_{curb} \cdot H_{ref}$$

### B. Wheel Hub Occlusion Formulation
For cameras capturing active traffic lanes, the system detects car wheels as reference points. Let $D_{wheel}$ be the standard tire diameter (classified dynamically by vehicle category, e.g., $D_{wheel} = 65.0\text{ cm}$). 

Let the vertical pixel span of the wheel projection be $P_{wheel}$. If water rises to obscure the bottom segment of the tire up to pixel $y_{water}$, the occlusion ratio is:

$$\omega_{wheel} = \frac{y_{bottom} - y_{water}}{P_{wheel}}$$

The estimated water level $d_{wheel}$ is:

$$d_{wheel} = \omega_{wheel} \cdot D_{wheel}$$

---

## 4. Specularity Reflection Filter
To prevent false water detections on wet asphalt (which reflects streetlights similar to standing water), the engine runs a **Specular Mirror Index (SMI)** test. 

Standing water behaves as a specular mirror (reflecting clear vertical inversions), while wet asphalt exhibits diffuse scattering. Let $I(x,y)$ be the grayscale intensity. The specularity index $S$ is computed as the normalized correlation of vertical pixel symmetry around a reflection boundary $y_{sym}$:

$$S = \frac{\sum_{x} \sum_{y} \left( I(x, y_{sym} - y) \cdot I(x, y_{sym} + y) \right)}{\sqrt{\sum_{x} \sum_{y} I(x, y_{sym} - y)^2} \sqrt{\sum_{x} \sum_{y} I(x, y_{sym} + y)^2}}$$

If $S > 0.85$, the segment is confirmed as standing water. If $S \le 0.85$, it is filtered as wet asphalt, suppressing false telemetry alerts.

---

## 5. Large-Scale Particle Image Velocimetry (LSPIV)
Flow velocity is computed using **Farneback Dense Optical Flow** mapped to real-world coordinates via a homography matrix $H_m \in \mathbb{R}^{3 \times 3}$.

Let $\mathbf{x}_i = (x_i, y_i, 1)^T$ be a pixel in frame $t$, and let the dense flow field output vector displacement be $\mathbf{u} = (\Delta x, \Delta y)^T$. The real-world physical coordinate $\mathbf{X}_i = (X_i, Y_i, 1)^T$ is mapped via homography projection:

$$\mathbf{X}_i = H_m \mathbf{x}_i$$

The physical velocity vector $\mathbf{V} = (V_X, V_Y)^T$ in meters per second ($m/s$) is derived by dividing the orthorectified displacement by the frame delta $\Delta t$:

$$\mathbf{V} = \frac{H_m (\mathbf{x}_i + \mathbf{u}) - H_m \mathbf{x}_i}{\Delta t}$$

The average flow velocity $v_{avg}$ and direction angle $\theta$ are:

$$v_{avg} = \frac{1}{N} \sum_{i=1}^N \|\mathbf{V}_i\|_2$$

$$\theta = \tan^{-1} \left( \frac{\sum V_Y}{\sum V_X} \right) \times \frac{180}{\pi}$$

---

## 6. Conclusion
By linking relative occlusion geometry with specularity filtering and optical velocity, AquaEye AI achieves high-precision hydrological readings using standard CCTV oblique feeds. This allows public safety authorities to monitor city-wide risks in real-time, completely hardware-free.
