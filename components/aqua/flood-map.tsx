"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { MAP_CENTER, MAP_TILE_URL, MAP_TILE_ATTR } from "@/lib/data"

interface FloodMarker {
  id: string
  lat: number
  lng: number
  label: string
  sublabel: string
  color: "red" | "yellow" | "green"
}

const COLOR_HEX = {
  red:    "#e0452e",
  yellow: "#e0a82e",
  green:  "#2bb673",
}

/** All static flood-risk zone markers shared across both map views */
export const FLOOD_MARKERS: FloodMarker[] = [
  {
    id: "nrm-118",
    lat: 40.4093,
    lng: 49.8731,
    label: "Nərimanov pr. — alt keçid",
    sublabel: "Kritik · 62 sm",
    color: "red",
  },
  {
    id: "nrm-077",
    lat: 40.4019,
    lng: 49.853,
    label: "Gənclik Mall alt keçidi",
    sublabel: "Kritik · 58 sm",
    color: "red",
  },
  {
    id: "nrm-261",
    lat: 40.4081,
    lng: 49.9001,
    label: "8-ci kilometr dairəsi",
    sublabel: "Kritik · 55 sm",
    color: "red",
  },
  {
    id: "nrm-204",
    lat: 40.4007,
    lng: 49.8516,
    label: "Gənclik metro qarşısı",
    sublabel: "Orta · 31 sm",
    color: "yellow",
  },
  {
    id: "nrm-095",
    lat: 40.4042,
    lng: 49.8462,
    label: "Atatürk pr. — Təbriz küç.",
    sublabel: "Orta · 27 sm",
    color: "yellow",
  },
  {
    id: "nrm-312",
    lat: 40.3956,
    lng: 49.8516,
    label: "Heydər Əliyev Sarayı qarşısı",
    sublabel: "Aşağı · 12 sm",
    color: "green",
  },
  {
    id: "nrm-150",
    lat: 40.4118,
    lng: 49.8623,
    label: "Təbriz küçəsi — yaşayış zonası",
    sublabel: "Aşağı · 11 sm",
    color: "green",
  },
]

/** Fixes the tile layer attribution control position */
function AttributionFix() {
  const map = useMap()
  useEffect(() => {
    map.attributionControl.setPosition("bottomright")
  }, [map])
  return null
}

interface FloodMapProps {
  zoom?: number
  className?: string
}

export function FloodMap({ zoom = 14, className = "h-full w-full" }: FloodMapProps) {
  return (
    <MapContainer
      center={[MAP_CENTER.lat, MAP_CENTER.lng]}
      zoom={zoom}
      className={className}
      zoomControl={true}
      scrollWheelZoom={true}
      style={{ background: "#0f1117" }}
    >
      {/* Dark CartoDB tile layer */}
      <TileLayer url={MAP_TILE_URL} attribution={MAP_TILE_ATTR} />
      <AttributionFix />

      {FLOOD_MARKERS.map((m) => {
        const hex = COLOR_HEX[m.color]
        return (
          <CircleMarker
            key={m.id}
            center={[m.lat, m.lng]}
            radius={9}
            pathOptions={{
              color: hex,
              fillColor: hex,
              fillOpacity: 0.85,
              weight: 2,
              opacity: 1,
            }}
          >
            <Tooltip
              permanent={false}
              direction="top"
              offset={[0, -12]}
              opacity={1}
              className="flood-tooltip"
            >
              <div className="text-[11px] font-semibold leading-tight">{m.label}</div>
              <div className="text-[10px] mt-0.5" style={{ color: hex }}>{m.sublabel}</div>
            </Tooltip>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
