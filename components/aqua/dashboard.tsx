"use client"

import { useState, useMemo } from "react"
import { StatCards } from "./stat-cards"
import dynamic from "next/dynamic"

const RiskMap = dynamic(
  () => import("./risk-map").then((mod) => mod.RiskMap),
  { ssr: false }
)
import { AlertsFeed } from "./alerts-feed"
import { TrendChart } from "./trend-chart"
import { CameraGrid } from "./camera-grid"
import { cameras, alerts, RISK_META, type RiskLevel } from "@/lib/data"
import { cn } from "@/lib/utils"

const FILTERS: { id: RiskLevel | "all"; label: string }[] = [
  { id: "all", label: "Hamısı" },
  { id: "critical", label: "Kritik" },
  { id: "medium", label: "Orta" },
  { id: "low", label: "Aşağı" },
  { id: "normal", label: "Normal" },
]

export function Dashboard() {
  const [selectedId, setSelectedId] = useState<string | null>("CAM-118")
  const [filter, setFilter] = useState<RiskLevel | "all">("all")

  const filteredCameras = useMemo(
    () => (filter === "all" ? cameras : cameras.filter((c) => c.risk === filter)),
    [filter],
  )

  return (
    <div className="p-4 md:p-6">
      {/* Page heading */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            Sel və subasma monitorinqi
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bakı şəhəri · {cameras.length} kamera ağıllı sel sensoruna çevrilib
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-risk-low" />
          Son sinxronizasiya: indicə
        </div>
      </div>

      <StatCards cameras={cameras} />

      {/* Map + alerts */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RiskMap
            cameras={cameras}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        <div className="min-h-[420px] xl:col-span-1">
          <AlertsFeed alerts={alerts} onSelectCamera={setSelectedId} />
        </div>
      </div>

      {/* Trend */}
      <div className="mt-4">
        <TrendChart />
      </div>

      {/* Camera feeds */}
      <div className="mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Kamera görüntüləri</h2>
            <p className="text-xs text-muted-foreground">
              AI su maskası real vaxt rejimində tətbiq olunur
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((f) => {
              const isActive = filter === f.id
              const color =
                f.id !== "all" ? RISK_META[f.id as RiskLevel].hex : undefined
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    isActive
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {color && (
                    <span
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  )}
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>

        <CameraGrid
          cameras={filteredCameras}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    </div>
  )
}

// Early warning dashboard verification 55
