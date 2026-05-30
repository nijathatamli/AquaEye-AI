"use client"

import { useState } from "react"
import { cameras, RISK_META, type Camera, type RiskLevel } from "@/lib/data"
import { Search, Filter, Video, Signal, X, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/aqua/dashboard-layout"

const FILTERS: { id: RiskLevel | "all"; label: string }[] = [
  { id: "all", label: "Hamısı" },
  { id: "critical", label: "Kritik" },
  { id: "medium", label: "Orta" },
  { id: "low", label: "Aşağı" },
  { id: "normal", label: "Normal" },
]

export default function CamerasPage() {
  const [filter, setFilter] = useState<RiskLevel | "all">("all")
  const [search, setSearch] = useState("")
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null)

  const filteredCameras = cameras.filter((cam) => {
    const matchesFilter = filter === "all" || cam.risk === filter
    const matchesSearch = cam.name.toLowerCase().includes(search.toLowerCase()) || 
                         cam.id.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-card">
        <div>
          <h1 className="text-xl font-semibold">Kameralar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {cameras.length} kamera · {cameras.filter(c => c.status === "online").length} online
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Kamera axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent">
            <Filter className="size-4" />
            Filtrlər
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCameras.map((cam) => {
              const meta = RISK_META[cam.risk]
              const isOnline = cam.status === "online"
              return (
                <div
                  key={cam.id}
                  onClick={() => setSelectedCamera(cam)}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg cursor-pointer",
                    selectedCamera?.id === cam.id && "ring-2 ring-primary"
                  )}
                >
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="size-12 text-muted-foreground/50" />
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-full bg-background/80 px-2 py-1 text-[10px] font-medium backdrop-blur">
                      {isOnline ? (
                        <>
                          <Signal className="size-3 text-green-500" />
                          Online
                        </>
                      ) : (
                        <>
                          <X className="size-3 text-red-500" />
                          Offline
                        </>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2 rounded-full bg-background/80 px-2 py-1 text-[10px] font-medium backdrop-blur" style={{ backgroundColor: `${meta.hex}20` }}>
                      <span className="size-2 inline-block rounded-full mr-1" style={{ backgroundColor: meta.hex }} />
                      {meta.label}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold">{cam.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{cam.id}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">{cam.zone}</span>
                      <span className="font-medium">{cam.waterDepth} sm</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {selectedCamera && (
          <div className="w-80 border-l border-border bg-card p-4 overflow-y-auto">
            <div className="mb-4">
              <button
                onClick={() => setSelectedCamera(null)}
                className="text-sm text-muted-foreground hover:text-foreground mb-2"
              >
                ← Geri
              </button>
              <h2 className="text-lg font-semibold">{selectedCamera.name}</h2>
              <p className="text-sm text-muted-foreground">{selectedCamera.id}</p>
            </div>

            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Video className="size-12 text-muted-foreground/50" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className={cn("font-medium", selectedCamera.status === "online" ? "text-green-500" : "text-red-500")}>
                    {selectedCamera.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Risk Level</span>
                  <span className="font-medium" style={{ color: RISK_META[selectedCamera.risk].hex }}>
                    {RISK_META[selectedCamera.risk].label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Water Depth</span>
                  <span className="font-medium">{selectedCamera.waterDepth} sm</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-medium">{selectedCamera.confidence}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Coverage</span>
                  <span className="font-medium">{selectedCamera.coverage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Zone</span>
                  <span className="font-medium">{selectedCamera.zone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium text-xs">
                    {selectedCamera.lat.toFixed(4)}, {selectedCamera.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent">
                <Settings className="size-4" />
                Tənzimləmələr
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </DashboardLayout>
  )
}

// Early warning dashboard verification 24
