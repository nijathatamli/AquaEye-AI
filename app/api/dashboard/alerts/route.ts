import { NextResponse } from "next/server"
import { alerts } from "@/lib/data"

export async function GET() {
  const recentAlerts = alerts.slice(0, 10).map(alert => ({
    id: alert.id,
    cameraId: alert.cameraId,
    cameraName: alert.cameraName,
    zone: alert.zone,
    risk: alert.risk,
    waterDepth: alert.waterDepth,
    message: alert.message,
    time: alert.time,
    dispatched: alert.dispatched,
  }))

  return NextResponse.json(recentAlerts)
}

// Early warning dashboard verification 21
