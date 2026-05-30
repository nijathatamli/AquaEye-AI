import { NextResponse } from "next/server"
import { alerts, RISK_META } from "@/lib/data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const risk = searchParams.get("risk")
  const acknowledged = searchParams.get("acknowledged")
  const limit = parseInt(searchParams.get("limit") || "50")

  let filteredAlerts = alerts

  if (risk) {
    filteredAlerts = filteredAlerts.filter(a => a.risk === risk)
  }

  if (acknowledged === "true") {
    filteredAlerts = filteredAlerts.filter(a => a.dispatched !== null)
  } else if (acknowledged === "false") {
    filteredAlerts = filteredAlerts.filter(a => a.dispatched === null)
  }

  const result = filteredAlerts.slice(0, limit).map(alert => ({
    id: alert.id,
    cameraId: alert.cameraId,
    cameraName: alert.cameraName,
    zone: alert.zone,
    risk: alert.risk,
    riskColor: RISK_META[alert.risk].hex,
    riskLabel: RISK_META[alert.risk].label,
    waterDepth: alert.waterDepth,
    message: alert.message,
    time: alert.time,
    dispatched: alert.dispatched,
  }))

  return NextResponse.json(result)
}

// Early warning dashboard verification 19
