"use client"

import { useState } from "react"
import { alerts, RISK_META, type AlertEvent, type RiskLevel } from "@/lib/data"
import { Search, Filter, AlertTriangle, Check, Clock, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/aqua/dashboard-layout"

const FILTERS: { id: RiskLevel | "all"; label: string }[] = [
  { id: "all", label: "Hamısı" },
  { id: "critical", label: "Kritik" },
  { id: "medium", label: "Orta" },
  { id: "low", label: "Aşağı" },
]

export default function AlertsPage() {
  const [filter, setFilter] = useState<RiskLevel | "all">("all")
  const [search, setSearch] = useState("")
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set())

  const filteredAlerts = alerts.filter((alert) => {
    const matchesFilter = filter === "all" || alert.risk === filter
    const matchesSearch = alert.message.toLowerCase().includes(search.toLowerCase()) ||
                         alert.cameraId.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleAcknowledge = (id: string) => {
    setAcknowledged(new Set([...acknowledged, id]))
  }

  const handleAcknowledgeAll = () => {
    setAcknowledged(new Set(filteredAlerts.map(a => a.id)))
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-card">
        <div>
          <h1 className="text-xl font-semibold">Xəbərdarlıqlar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {alerts.length} ümumi · {alerts.filter(a => a.risk === "critical").length} kritik
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Xəbərdarlıq axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent">
            <Filter className="size-4" />
            Filtrlər
          </button>
          <button
            onClick={handleAcknowledgeAll}
            className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            <Check className="size-4" />
            Hamısını Təsdiqlə
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const isActive = filter === f.id
            const color = f.id !== "all" ? RISK_META[f.id as RiskLevel].hex : undefined
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {color && (
                  <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
                )}
                {f.label}
              </button>
            )
          })}
        </div>

        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const meta = RISK_META[alert.risk]
            const isAcknowledged = acknowledged.has(alert.id)
            return (
              <div
                key={alert.id}
                className={cn(
                  "rounded-xl border border-border bg-card p-4 transition-all",
                  isAcknowledged && "opacity-50"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-1 size-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${meta.hex}20` }}
                    >
                      <AlertTriangle className="size-5" style={{ color: meta.hex }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{alert.cameraId}</h3>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                          style={{ backgroundColor: `${meta.hex}20`, color: meta.hex }}
                        >
                          {meta.label}
                        </span>
                        {isAcknowledged && (
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Check className="size-3" />
                            Təsdiqlənib
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
                      <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {alert.time}
                        </span>
                        <span>Su səviyyəsi: {alert.waterDepth} sm</span>
                      </div>
                    </div>
                  </div>
                  {!isAcknowledged && (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-accent"
                    >
                      <Check className="size-3" />
                      Təsdiqlə
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <X className="size-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Xəbərdarlıq tapılmadı</p>
          </div>
        )}
      </div>
      </div>
    </DashboardLayout>
  )
}

// Early warning dashboard verification 18
