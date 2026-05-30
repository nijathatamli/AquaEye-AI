"use client"

import { RISK_META, MAP_TILE_URL, MAP_TILE_ATTR, EXTERNAL_MAP_URL, MAP_CENTER, DISTRICT, type Camera } from "@/lib/data"
import { Maximize2, Radio, Layers } from "lucide-react"
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet"
import L from "leaflet"

const LEGEND: { risk: keyof typeof RISK_META }[] = [
  { risk: "critical" },
  { risk: "medium" },
  { risk: "low" },
  { risk: "normal" },
]

export function RiskMap({
  cameras,
  selectedId,
  onSelect,
}: {
  cameras: Camera[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  function createMarkerIcon(hex: string, isActive: boolean, isOffline: boolean) {
    const size = isActive ? 20 : 14
    const opacity = isOffline ? 0.5 : 1
    return L.divIcon({
      className: "",
      iconSize: [size + 8, size + 8],
      iconAnchor: [(size + 8) / 2, (size + 8) / 2],
      html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:50%;background:${hex};border:2px solid #1a1a2e;box-shadow:0 0 8px ${hex}66;opacity:${opacity};margin:4px;"></span>`,
    })
  }

  function FitBoundsOnMount() {
    const map = useMap()
    const bounds = L.latLngBounds([40.393, 49.842], [40.418, 49.905])
    map.fitBounds(bounds, { padding: [20, 20], animate: false })
    return null
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Radio className="size-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold leading-none">Canli risk xeritesi 3D</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">{DISTRICT} OpenStreetMap</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground">
            <Layers className="size-3.5" />
            Qatlar
          </button>
          <a
            href={EXTERNAL_MAP_URL}
            target="_blank"
            rel="noreferrer"
            className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <Maximize2 className="size-3.5" />
          </a>
        </div>
      </div>
      <div className="relative min-h-[380px] flex-1">
        <MapContainer
          center={[MAP_CENTER.lat, MAP_CENTER.lng]}
          zoom={MAP_CENTER.zoom}
          className="h-full w-full"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url={MAP_TILE_URL} attribution={MAP_TILE_ATTR} />
          <FitBoundsOnMount />
          {cameras.map((cam) => {
            const meta = RISK_META[cam.risk]
            const isActive = selectedId === cam.id
            const isOffline = cam.status === "offline"
            return (
              <Marker
                key={cam.id}
                position={[cam.lat, cam.lng]}
                icon={createMarkerIcon(meta.hex, isActive, isOffline)}
                eventHandlers={{ click: () => onSelect(cam.id) }}
              >
                <Tooltip permanent={isActive} direction="top" offset={[0, -12]}>
                  <div className="text-[11px] font-semibold">{cam.name}</div>
                  <div className="text-[10px] opacity-70">
                    {cam.id} {cam.waterDepth} sm {meta.label}
                  </div>
                </Tooltip>
              </Marker>
            )
          })}
        </MapContainer>
        <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-xl border border-border bg-background/85 p-3 backdrop-blur">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Risk seviyesi
          </p>
          <div className="flex flex-col gap-1.5">
            {LEGEND.map(({ risk }) => (
              <div key={risk} className="flex items-center gap-2 text-xs">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: RISK_META[risk].hex }}
                />
                <span className="text-foreground">{RISK_META[risk].label}</span>
                <span className="text-muted-foreground"> {RISK_META[risk].range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
// Early warning dashboard verification 58
