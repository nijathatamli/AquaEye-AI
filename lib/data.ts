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
    id: "ALR-8985",
    cameraId: "NRM-118",
    cameraName: "Nərimanov prospekti — alt keçid",
    zone: "Nərimanov pr.",
    risk: "critical",
    waterDepth: 58,
    message: "Su sürətlə yüksəlir. Piyada keçidi tam bağlandı, yönləndirmə aktiv.",
    time: "13:55",
    dispatched: "Polis DYP",
  },
  {
    id: "ALR-8974",
    cameraId: "NRM-204",
    cameraName: "Gənclik metro qarşısı",
    zone: "Gənclik",
    risk: "critical",
    waterDepth: 51,
    message: "Kritik həddə çatdı. Metro girişinə su sızması qeydə alındı.",
    time: "13:41",
    dispatched: "FHN",
  },
  {
    id: "ALR-8962",
    cameraId: "NRM-118",
    cameraName: "Nərimanov prospekti — alt keçid",
    zone: "Nərimanov pr.",
    risk: "medium",
    waterDepth: 34,
    message: "Orta səviyyəli su yığımı aşkarlandı. Sürücülər xəbərdar edilir.",
    time: "13:12",
    dispatched: undefined,
  },
  {
    id: "ALR-8951",
    cameraId: "NRM-204",
    cameraName: "Gənclik metro qarşısı",
    zone: "Gənclik",
    risk: "low",
    waterDepth: 14,
    message: "İlkin su yığımı müşahidə edildi. Vəziyyət izlənilir.",
    time: "12:48",
    dispatched: undefined,
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
