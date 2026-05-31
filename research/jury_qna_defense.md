# Jury Q&A Defense Registry: AquaEye AI

This document consolidates all possible questions that a technical, commercial, or administrative jury panel can ask during the pitch talks for **AquaEye AI** in Azerbaijan. The answers are structured using psychological inoculation—acknowledging the operational realities first, then neutralizing the objection with concrete technical or business proof.

---

## Category 1: Technical & AI Accuracy (Texniki və İntellektual Sistem)

### Q1.1: "How does the system handle rain glare, headlights at night, and dirt/mud on the camera lenses?"
*   **Target Jury Member**: Technical / AI Expert.
*   **Strategic Angle**: Acknowledge that visual noise is inevitable. Pivot to the **Relative Occlusion** mechanism rather than absolute pixel classification.
*   **Response**:
    > *"We expect camera feeds to be noisy during heavy downpours. That is why AquaEye AI does not use simple color/intensity tracking or raw pixel matching. Instead, the model runs **static environmental anchor detection** (such as concrete barrier outlines or sidewalk curb heights). We measure a relative occlusion ratio—how much of the known static object is missing. Additionally, we run a **specular Specularity Analysis** to identify high-contrast light reflections characteristic of standing water mirror effects, distinguishing wet asphalt from deep puddles. If a lens is completely obscured by mud or water droplets, the system automatically flags a 'Sensor Occluded' state, preventing false positives."*

### Q1.2: "CCTV cameras in Baku vary in resolution (many are 720p or low-bitrate). How do you get accurate level readings from low-quality streams?"
*   **Target Jury Member**: Hardware / Infrastructure Expert.
*   **Strategic Angle**: Show that resolution scales logarithmically for relative spatial analysis. Focus on the auto-scaling capability.
*   **Response**:
    > *"Our system does not need 4K resolution. The Computer Vision model calculates the depth ratio dynamically by using **on-screen vehicles as real-time scale references**. Standard public buses and transport vehicles in Baku have standardized tire and height profiles. When a vehicle passes through a low-resolution camera’s field of view, the system automatically runs edge detection on the tire line relative to the submerged sidewalk. This auto-scales the pixel-to-centimeter calibration ratio dynamically, making it compatible with legacy 720p streams."*

### Q1.3: "Baku is famous for strong winds (Xəzri). Camera shake will throw off your static reference coordinates. How do you fix this?"
*   **Target Jury Member**: Technical / Systems Expert.
*   **Strategic Angle**: Explain visual stabilization and relative coordinates.
*   **Response**:
    > *"Baku's wind is a known variable. If a camera pole vibrates, absolute pixel coordinates shift. To counter this, AquaEye AI uses **visual landmark alignment** (homography matrix alignment) in real-time. The software locks onto high-contrast static landmarks (like buildings or traffic signs) to stabilize the frame coordinates digitally before running the hydrology analysis. The AI measures the gap between the stabilized sidewalk curb and the water line, neutralizing physical camera shake."*

---

## Category 2: Legal, Security & Data Privacy (Hüquqi, Təhlükəsizlik və Gizlilik)

### Q2.1: "Public surveillance cameras (Safe City / BNA) are restricted national security assets. DİN will never allow a startup to access these feeds. How will you scale?"
*   **Target Jury Member**: Government / Administrative Liaison.
*   **Strategic Angle**: Frame the deployment as a secure, local, edge-isolated sandbox rather than an external cloud database.
*   **Response**:
    > *"This is the most critical operational gateway. We do not ask to stream public security feeds to our external cloud. AquaEye AI is built to deploy as an **on-premise secure container** inside DİN’s existing government data centers. The video analysis is processed in-memory locally. The only data exported outside their firewall is a lightweight vector string—simply the coordinate and numerical level (e.g., 'Kamera #04: 18 sm'). The video feeds remain 100% secure and untouched."*

### Q2.2: "How do you comply with citizen privacy laws? You are analyzing video feeds of public streets containing faces and license plates."
*   **Target Jury Member**: Legal / Compliance Expert.
*   **Strategic Angle**: State clearly that the technology tracks geography, not humans, and runs immediate local obfuscation.
*   **Response**:
    > *"AquaEye AI is strictly a **geographical telemetry tool, not a surveillance tool**. In our local container processing loop, the very first step is passing the frame through a fast, lightweight Gaussian blur filter that blocks out all human faces and license plates. Only the road surface, curbs, and vehicle tires are analyzed. The system does not store or process personal identifier data, ensuring complete compliance with the Law on Personal Data of the Republic of Azerbaijan."*

### Q2.3: "Who is liable if your AI fails to detect a flood or gives a false routing direction that leads to vehicle damage?"
*   **Target Jury Member**: Risk / Legal Consultant.
*   **Strategic Angle**: Frame the AI as a decision support tool (triage helper) rather than an autonomous authority.
*   **Response**:
    > *"AquaEye AI serves as a **Tactical Triage Support System** for human dispatchers; it does not directly close roads autonomously. The final operational authority to dispatch resources or officially close a road remains with the FHN or BNA operators. The AI acts as a digital twin that flags anomalies and calculates risks, similar to a weather forecasting tool, protecting the software provider from direct operational liability."*

---

## Category 3: Business Model, Cost & ROI (Biznes Modeli, Xərclər və ROI)

### Q3.1: "How do you make money? What is the business model?"
*   **Target Jury Member**: Venture Capitalist / Commercial Expert.
*   **Strategic Angle**: B2G (Business-to-Government) SaaS / Annual licensing with tiered agency access.
*   **Response**:
    > *"We operate on a **B2G Software-as-a-Service (SaaS) annual licensing model** paid by municipal and emergency management agencies (such as Baku City Executive Power and FHN). The license is tiered based on the number of virtual telemetry nodes activated. Because we require zero physical hardware installation, our customer acquisition costs are low, and the government can justify the subscription fee immediately through massive infrastructure savings."*

### Q3.2: "If physical IoT sensors become cheaper and easier to install, why would the government keep paying for your software?"
*   **Target Jury Member**: Investor / Technology Strategist.
*   **Strategic Angle**: Focus on maintenance scaling friction, visual city clutter, and physical durability limits.
*   **Response**:
    > *"Even if physical sensors cost 5 AZN each, the true cost is the **operational maintenance (OpEx)**. Floodwaters carry sludge, trash, and heavy physical debris that clog and break physical sensors, requiring physical teams to go out and clean or replace them. AquaEye AI is software-defined. It cannot be clogged by mud, stolen, or damaged by physical impact. Furthermore, a physical sensor only monitors one spot; a single camera can monitor a wide intersection containing multiple lanes, providing spatial depth analysis that a physical single-point sensor never can."*

### Q3.3: "What is the return on investment (ROI) for the Baku municipality?"
*   **Target Jury Member**: Financial Auditor / Executive.
*   **Strategic Angle**: Contrast CapEx savings with reduced emergency response times and disaster damage costs.
*   **Response**:
    > *"The ROI is driven by two main vectors: **CapEx avoidance** and **response optimization**. Installing 1,000 physical sensors in Baku costs roughly 300,000 AZN in hardware and street-cutting labor, plus 50,000 AZN annually in maintenance. AquaEye AI leverages the pre-existing 10,000+ CCTV camera network, saving 100% of that CapEx. Furthermore, by reducing FHN emergency dispatch times by just 15 minutes, we avoid gridlock traffic hours that cost Baku's economy millions of AZN in lost productivity during autumn storm seasons."*

---

## Category 4: Product Integration & Usability (Məhsulun İnteqrasiyası və İstifadəçi Təcrübəsi)

### Q4.1: "How will the emergency dispatchers use this? They already have too many screens and systems."
*   **Target Jury Member**: Operations / Product Manager.
*   **Strategic Angle**: Highlight that AquaEye AI acts as an **attention filter**, not another video wall. Focus on the mygov dashboard design.
*   **Response**:
    > *"We designed the user interface specifically to avoid cognitive overload. Operators do not watch video streams. They view a **color-coded digital twin heatmap** (inspired by the clean visual layout of `mygov.az`). The system is silent until a threshold is crossed (e.g., water depth exceeds 10 sm). When that happens, the system highlights only that specific node, shows the telemetry metric, and provides a direct, one-click option to alert road maintenance or contact FHN (112), reducing manual monitoring time to zero."*

### Q4.2: "How does AquaEye AI integrate with consumer navigation apps like Waze or Google Maps so drivers actually avoid the floods?"
*   **Target Jury Member**: Product Partner / City Integration Specialist.
*   **Strategic Angle**: Explain the API integration layer.
*   **Response**:
    > *"AquaEye AI operates an open API channel. When the system detects a critical flood (Red Level / 15 sm+) on a main artery, it immediately publishes the coordinates to our integration layer. This feed is structured to sync directly with BNA's traffic command center database and can be pushed to Waze's municipal partner program (Waze for Cities), automatically rerouting drivers away from the flood zone in real-time."*
