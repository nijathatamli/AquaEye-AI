import { NextResponse } from "next/server"
import { cameras, alerts } from "@/lib/data"

export async function GET() {
  const stats = {
    totalCameras: cameras.length,
    onlineCameras: cameras.filter(c => c.status === "online").length,
    offlineCameras: cameras.filter(c => c.status === "offline").length,
    criticalZones: cameras.filter(c => c.risk === "critical").length,
    mediumRisk: cameras.filter(c => c.risk === "medium").length,
    lowRisk: cameras.filter(c => c.risk === "low").length,
    normalRisk: cameras.filter(c => c.risk === "normal").length,
    totalAlerts: alerts.length,
    criticalAlerts: alerts.filter(a => a.risk === "critical").length,
    avgWaterDepth: Math.round(cameras.reduce((sum, c) => sum + c.waterDepth, 0) / cameras.length),
    avgConfidence: Math.round(cameras.reduce((sum, c) => sum + c.confidence, 0) / cameras.length),
  }

  return NextResponse.json(stats)
}

// Early warning dashboard verification 22
