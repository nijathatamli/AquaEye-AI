import { NextResponse } from "next/server"
import { cameras, RISK_META } from "@/lib/data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const risk = searchParams.get("risk")
  const zone = searchParams.get("zone")

  let filteredCameras = cameras

  if (status) {
    filteredCameras = filteredCameras.filter(c => c.status === status)
  }

  if (risk) {
    filteredCameras = filteredCameras.filter(c => c.risk === risk)
  }

  if (zone) {
    filteredCameras = filteredCameras.filter(c => c.zone.toLowerCase().includes(zone.toLowerCase()))
  }

  const result = filteredCameras.map(cam => ({
    id: cam.id,
    name: cam.name,
    zone: cam.zone,
    lat: cam.lat,
    lng: cam.lng,
    status: cam.status,
    risk: cam.risk,
    riskColor: RISK_META[cam.risk].hex,
    riskLabel: RISK_META[cam.risk].label,
    waterDepth: cam.waterDepth,
    confidence: cam.confidence,
    coverage: cam.coverage,
    lastUpdate: cam.lastUpdate,
    thumbnail: cam.thumbnail,
  }))

  return NextResponse.json(result)
}

// Early warning dashboard verification 20
