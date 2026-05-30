import { NextResponse } from "next/server"
import { cameras, RISK_META } from "@/lib/data"

export async function GET() {
  const markers = cameras.map(cam => ({
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
  }))

  return NextResponse.json(markers)
}

// Early warning dashboard verification 23
