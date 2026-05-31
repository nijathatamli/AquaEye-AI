# 🖥️ Operator Dashboard User Guide

Welcome to the **AquaEye AI** Command Portal User Guide. This guide describes the visual modules, Leaflet map interactive layers, and automated alerts dispatch rules of the Next.js web application.

---

## 1. Left Sidebar Navigation

*   📊 **Dashboard (Panel)**: Access real-time city summaries, stat cards, alert tables, and precipitation trend charts.
*   🗺️ **Canlı Xəritə (Live Map)**: Full-screen interactive Leaflet mapping showing all active surveillance nodes.
*   📷 **Kameralar (Cameras)**: Active YOLO-seg output grid. Displays colorized water masks.
*   📈 **Hesabatlar (Reports)**: PDF generation of flood statistics and damage assessments.
*   ⚙️ **Sazlamalar (Settings)**: Threshold configurations, camera IP registrations, and API keys.

---

## 2. Interactive Baku Map Controls

The Leaflet map shows camera positions across **Nərimanov rayonu, Baku**:
*   **Node Colors**: Nodes flash green, yellow, or red corresponding to Low, Medium, or Critical risk.
*   **Tooltips**: Hovering over a node displays the camera name, ID, estimated water level (cm), and status.
*   **Selection**: Clicking a node selects it across all other UI components, updating the central camera feed card.

---

## 3. Water-Level Stat Cards

The top dashboard displays critical summary blocks:
*   **Kritik Keçidlər (Critical Tunnels)**: Total tunnels showing water depths exceeding $50\text{ cm}$.
*   **Aktiv Sorğular (Active Drains)**: Active municipal pump dispatches.
*   **Ümumi Kameralar (Total Streams)**: Count of active connected RTSP lines.
*   **Şəbəkə Statusu (Network Uptime)**: Percentage of active, non-offline surveillance nodes.

---

## 4. Triggering Manual Dispatch Override

Operators can manually dispatch pump trucks or close tunnels if visual confirmation overrides automated AI estimation:
1.  Navigate to the **Alerts Feed** sidebar block.
2.  Click **Dispatch** beside an alert row.
3.  Select the dispatch target:
    *   **FHN (Ministry of Emergency Situations)**: Sends urgent roadblock sirens.
    *   **DYP (Traffic Police)**: Initiates detour lanes.
    *   **Bələdiyyə nasos (Municipal Pumps)**: Deploys drainage trucks.
