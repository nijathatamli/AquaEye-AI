export type RiskLevel = "low" | "medium" | "critical" | "normal"

export type CameraStatus = "online" | "offline"

export interface Camera {
  id: string
  name: string
  /** Sub-zone within Nərimanov rayonu */
  zone: string
  lat: number
  lng: number
  /** Overlay position on the F4Map frame, in percent (0-100) */
  mapX: number
  mapY: number
  status: CameraStatus
  risk: RiskLevel
  /** Detected water depth in centimeters */
  waterDepth: number
  /** AI segmentation confidence 0-100 */
  confidence: number
  /** Percentage of frame covered by water mask */
  coverage: number
  lastUpdate: string
  thumbnail: string
}

export interface AlertEvent {
  id: string
  cameraId: string
  cameraName: string
  zone: string
  risk: Exclude<RiskLevel, "normal">
  waterDepth: number
  message: string
  time: string
  dispatched: ("FHN" | "DYP" | "Bələdiyyə nasos") | null
}

/** District this whole deployment covers */
export const DISTRICT = "Nərimanov rayonu"

/** Map center — Nərimanov rayonu, Bakı */
export const MAP_CENTER = { lat: 40.4072, lng: 49.8588, zoom: 14 }

/** Dark tile layer for the Leaflet map (CartoDB dark matter — no API key needed) */
export const MAP_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
export const MAP_TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'

/** External map link for the maximize button */
export const EXTERNAL_MAP_URL =
  `https://www.openstreetmap.org/#map=${MAP_CENTER.zoom}/${MAP_CENTER.lat}/${MAP_CENTER.lng}`

export const RISK_META: Record<
  RiskLevel,
  { label: string; range: string; token: string; hex: string }
> = {
  normal: { label: "Normal", range: "Su yoxdur", token: "text-muted-foreground", hex: "#7c8794" },
  low: { label: "Aşağı risk", range: "10–15 sm", token: "text-risk-low", hex: "#2bb673" },
  medium: { label: "Orta risk", range: "25–35 sm", token: "text-risk-medium", hex: "#e0a82e" },
  critical: { label: "Kritik risk", range: "50+ sm", token: "text-risk-critical", hex: "#e0452e" },
}

// All cameras are located inside Nərimanov rayonu, Bakı
export const cameras: Camera[] = [
  {
    id: "NRM-118",
    name: "Nərimanov prospekti — alt keçid",
    zone: "Nərimanov pr.",
    lat: 40.4093,
    lng: 49.8731,
    mapX: 63,
    mapY: 38,
    status: "online",
    risk: "critical",
    waterDepth: 62,
    confidence: 96,
    coverage: 74,
    lastUpdate: "indicə",
    thumbnail: "/flooded-road-tunnel-cctv-night.png",
  },
  {
    id: "NRM-204",
    name: "Gənclik metro qarşısı",
    zone: "Gənclik",
    lat: 40.4007,
    lng: 49.8516,
    mapX: 34,
    mapY: 62,
    status: "online",
    risk: "medium",
    waterDepth: 31,
    confidence: 91,
    coverage: 45,
    lastUpdate: "indicə",
    thumbnail: "/flooded-city-street-cars-cctv.png",
  },
  {
    id: "NRM-077",
    name: "Gənclik Mall alt keçidi",
    zone: "Gənclik",
    lat: 40.4019,
    lng: 49.853,
    mapX: 39,
    mapY: 56,
    status: "online",
    risk: "critical",
    waterDepth: 58,
    confidence: 94,
    coverage: 70,
    lastUpdate: "1 dəq əvvəl",
    thumbnail: "/deeply-flooded-road-cars-cctv.png",
  },
  {
    id: "NRM-312",
    name: "Heydər Əliyev Sarayı qarşısı",
    zone: "Atatürk pr.",
    lat: 40.3956,
    lng: 49.8516,
    mapX: 30,
    mapY: 74,
    status: "online",
    risk: "low",
    waterDepth: 12,
    confidence: 84,
    coverage: 18,
    lastUpdate: "indicə",
    thumbnail: "/light-rain-puddle-street-cctv.png",
  },
  {
    id: "NRM-095",
    name: "Atatürk prospekti — Təbriz küç.",
    zone: "Atatürk pr.",
    lat: 40.4042,
    lng: 49.8462,
    mapX: 22,
    mapY: 48,
    status: "online",
    risk: "medium",
    waterDepth: 27,
    confidence: 86,
    coverage: 38,
    lastUpdate: "indicə",
    thumbnail: "/rainy-square-street-cctv.png",
  },
  {
    id: "NRM-150",
    name: "Təbriz küçəsi — yaşayış zonası",
    zone: "Təbriz küç.",
    lat: 40.4118,
    lng: 49.8623,
    mapX: 49,
    mapY: 30,
    status: "online",
    risk: "low",
    waterDepth: 11,
    confidence: 88,
    coverage: 16,
    lastUpdate: "indicə",
    thumbnail: "/old-city-gate-wet-cctv.png",
  },
  {
    id: "NRM-261",
    name: "8-ci kilometr dairəsi",
    zone: "8-ci km",
    lat: 40.4081,
    lng: 49.9001,
    mapX: 82,
    mapY: 44,
    status: "online",
    risk: "critical",
    waterDepth: 55,
    confidence: 93,
    coverage: 68,
    lastUpdate: "indicə",
    thumbnail: "/flooded-city-street-cars-cctv.png",
  },
  {
    id: "NRM-188",
    name: "Koroğlu prospekti",
    zone: "Koroğlu",
    lat: 40.4153,
    lng: 49.8842,
    mapX: 72,
    mapY: 24,
    status: "online",
    risk: "normal",
    waterDepth: 2,
    confidence: 98,
    coverage: 3,
    lastUpdate: "indicə",
    thumbnail: "/slightly-wet-avenue-cctv.png",
  },
  {
    id: "NRM-340",
    name: "Fətəli Xan Xoyski pr.",
    zone: "Xoyski pr.",
    lat: 40.413,
    lng: 49.8519,
    mapX: 41,
    mapY: 20,
    status: "online",
    risk: "normal",
    waterDepth: 3,
    confidence: 97,
    coverage: 4,
    lastUpdate: "indicə",
    thumbnail: "/dry-boulevard-promenade-cctv.png",
  },
  {
    id: "NRM-401",
    name: "Nizami parkı yaxınlığı",
    zone: "Gənclik",
    lat: 40.3982,
    lng: 49.857,
    mapX: 45,
    mapY: 70,
    status: "offline",
    risk: "normal",
    waterDepth: 0,
    confidence: 0,
    coverage: 0,
    lastUpdate: "12 dəq əvvəl",
    thumbnail: "/offline-camera-no-signal.png",
  },
]

export const alerts: AlertEvent[] = [
  {
    id: "ALR-9001",
    cameraId: "NRM-118",
    cameraName: "Nərimanov prospekti — alt keçid",
    zone: "Nərimanov pr.",
    risk: "critical",
    waterDepth: 62,
    message: "Su təkərləri keçdi. Alt keçidin təcili bağlanması tövsiyə olunur.",
    time: "14:32",
    dispatched: "FHN",
  },
  {
    id: "ALR-9000",
    cameraId: "NRM-077",
    cameraName: "Gənclik Mall alt keçidi",
    zone: "Gənclik",
    risk: "critical",
    waterDepth: 58,
    message: "Kritik su səviyyəsi aşkarlandı. Hərəkət təhlükəlidir.",
    time: "14:29",
    dispatched: "DYP",
  },
  {
    id: "ALR-8998",
    cameraId: "NRM-261",
    cameraName: "8-ci kilometr dairəsi",
    zone: "8-ci km",
    risk: "critical",
    waterDepth: 55,
    message: "Dairədə su yığılır. Nasos briqadası yönləndirildi.",
    time: "14:26",
    dispatched: "Bələdiyyə nasos",
  },
  {
    id: "ALR-8997",
    cameraId: "NRM-204",
    cameraName: "Gənclik metro qarşısı",
    zone: "Gənclik",
    risk: "medium",
    waterDepth: 31,
    message: "Su təkərlərin yarısına çatdı. Müşahidə gücləndirildi.",
    time: "14:21",
    dispatched: "Bələdiyyə nasos",
  },
  {
    id: "ALR-8994",
    cameraId: "NRM-095",
    cameraName: "Atatürk prospekti — Təbriz küç.",
    zone: "Atatürk pr.",
    risk: "medium",
    waterDepth: 27,
    message: "Su səviyyəsi yüksəlir. Müşahidə davam edir.",
    time: "14:10",
    dispatched: null,
  },
  {
    id: "ALR-8990",
    cameraId: "NRM-312",
    cameraName: "Heydər Əliyev Sarayı qarşısı",
    zone: "Atatürk pr.",
    risk: "low",
    waterDepth: 12,
    message: "Yerdə su yığılmağa başladı.",
    time: "13:58",
    dispatched: null,
  },
]

// 24h water-depth trend (max depth across Nərimanov network, cm)
export const trendData = [
  { time: "00:00", depth: 2, alerts: 0 },
  { time: "02:00", depth: 4, alerts: 0 },
  { time: "04:00", depth: 6, alerts: 0 },
  { time: "06:00", depth: 9, alerts: 1 },
  { time: "08:00", depth: 18, alerts: 2 },
  { time: "10:00", depth: 27, alerts: 3 },
  { time: "12:00", depth: 41, alerts: 5 },
  { time: "14:00", depth: 62, alerts: 8 },
  { time: "16:00", depth: 48, alerts: 6 },
  { time: "18:00", depth: 33, alerts: 4 },
  { time: "20:00", depth: 21, alerts: 2 },
  { time: "22:00", depth: 12, alerts: 1 },
]

// Early warning dashboard verification 95
