"use client"

import { RISK_META, MAP_TILE_URL, MAP_TILE_ATTR, MAP_CENTER, DISTRICT, cameras } from "@/lib/data"
import { Layers, Radio } from "lucide-react"
import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet"
import L from "leaflet"
import { DashboardLayout } from "./dashboard-layout"

const LEGEND: { risk: keyof typeof RISK_META }[] = [
  { risk: "critical" },
  { risk: "medium" },
  { risk: "low" },
  { risk: "normal" },
]

export default function LiveMapClient() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      console.log("Refreshing map data...")
    }, 10000)
    return () => clearInterval(interval)
  }, [])

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
    <DashboardLayout>
      <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-card">
        <div className="flex items-center gap-2">
          <Radio className="size-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold leading-none">Canlı Risk Xəritəsi</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">{DISTRICT} · Real-time</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground">
            <Layers className="size-3.5" />
            Qatlar
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground">
            <span className="size-2 animate-pulse rounded-full bg-green-500" />
            Live
          </button>
        </div>
      </div>
      <div className="relative flex-1">
        <MapContainer
          center={[MAP_CENTER.lat, MAP_CENTER.lng]}
          zoom={MAP_CENTER.zoom}
          className="h-full w-full"
          zoomControl={true}
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
                eventHandlers={{ click: () => setSelectedId(cam.id) }}
              >
                <Tooltip permanent={isActive} direction="top" offset={[0, -12]}>
                  <div className="text-[11px] font-semibold">{cam.name}</div>
                  <div className="text-[10px] opacity-70">
                    {cam.id} · {cam.waterDepth} sm · {meta.label}
                  </div>
                </Tooltip>
              </Marker>
            )
          })}
        </MapContainer>
        <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-xl border border-border bg-background/85 p-3 backdrop-blur">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Risk Səviyyəsi
          </p>
          <div className="flex flex-col gap-1.5">
            {LEGEND.map(({ risk }) => (
              <div key={risk} className="flex items-center gap-2 text-xs">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: RISK_META[risk].hex }}
                />
                <span className="text-foreground">{RISK_META[risk].label}</span>
                <span className="text-muted-foreground"> · {RISK_META[risk].range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  )
}

// Early warning dashboard verification 56
