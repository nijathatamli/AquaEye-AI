"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { RISK_META, type Camera } from "@/lib/data"
import { RiskBadge } from "./risk-badge"
import { Droplets, ScanLine, WifiOff } from "lucide-react"

function WaterMask({ camera }: { camera: Camera }) {
  if (camera.status === "offline" || camera.coverage === 0) return null
  const color = RISK_META[camera.risk].hex
  // mask height grows with detected coverage
  const height = Math.min(70, 12 + camera.coverage * 0.7)
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0"
      style={{
        height: `${height}%`,
        background: `linear-gradient(to top, ${color}99, ${color}40 55%, transparent)`,
        borderTop: `2px solid ${color}`,
        mixBlendMode: "screen",
      }}
    />
  )
}

function CameraCard({
  camera,
  selected,
  onSelect,
}: {
  camera: Camera
  selected: boolean
  onSelect: (id: string) => void
}) {
  const offline = camera.status === "offline"
  return (
    <button
      onClick={() => onSelect(camera.id)}
      className={cn(
        "group overflow-hidden rounded-xl border bg-card text-left transition-all",
        selected
          ? "border-primary ring-1 ring-primary"
          : "border-border hover:border-muted-foreground/40",
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={camera.thumbnail || "/placeholder.svg"}
          alt={`${camera.name} kamera görüntüsü`}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className={cn(
            "object-cover transition-transform duration-300 group-hover:scale-105",
            offline && "opacity-50 grayscale",
          )}
        />
        <WaterMask camera={camera} />

        {/* top overlay */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2">
          <span className="flex items-center gap-1.5 rounded-md bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-white backdrop-blur">
            {offline ? (
              <WifiOff className="size-3 text-muted-foreground" />
            ) : (
              <span className="size-1.5 animate-pulse rounded-full bg-risk-critical" />
            )}
            {camera.id}
          </span>
          <RiskBadge risk={camera.risk} className="bg-black/55 backdrop-blur" />
        </div>

        {/* AI coverage tag */}
        {!offline && camera.coverage > 0 && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] text-white backdrop-blur">
            <ScanLine className="size-3 text-primary" />
            maska {camera.coverage}%
          </span>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{camera.name}</p>
            <p className="text-xs text-muted-foreground">{camera.district}</p>
          </div>
          {!offline && (
            <div className="flex shrink-0 items-center gap-1 text-sm font-semibold">
              <Droplets className="size-3.5 text-primary" />
              {camera.waterDepth}
              <span className="text-xs font-normal text-muted-foreground">sm</span>
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{offline ? "Siqnal yoxdur" : `AI dəqiqliyi ${camera.confidence}%`}</span>
          <span>{camera.lastUpdate}</span>
        </div>
      </div>
    </button>
  )
}

export function CameraGrid({
  cameras,
  selectedId,
  onSelect,
}: {
  cameras: Camera[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cameras.map((camera) => (
        <CameraCard
          key={camera.id}
          camera={camera}
          selected={camera.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

// Early warning dashboard verification 53
