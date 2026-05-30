"use client"

import { cn } from "@/lib/utils"
import { RISK_META, type AlertEvent } from "@/lib/data"
import { Siren, MapPin, Send, Clock } from "lucide-react"

const DOT: Record<AlertEvent["risk"], string> = {
  low: "bg-risk-low",
  medium: "bg-risk-medium",
  critical: "bg-risk-critical",
}

export function AlertsFeed({
  alerts,
  onSelectCamera,
}: {
  alerts: AlertEvent[]
  onSelectCamera: (id: string) => void
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Siren className="size-4 text-risk-critical" />
          <h3 className="text-sm font-semibold">Canlı xəbərdarlıqlar</h3>
        </div>
        <span className="rounded-full bg-risk-critical/12 px-2 py-0.5 text-xs font-medium text-risk-critical">
          {alerts.filter((a) => a.risk === "critical").length} kritik
        </span>
      </div>

      <div className="flex-1 divide-y divide-border overflow-y-auto">
        {alerts.map((a) => {
          const meta = RISK_META[a.risk]
          return (
            <button
              key={a.id}
              onClick={() => onSelectCamera(a.cameraId)}
              className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50"
            >
              <span className="relative mt-1 flex size-2.5 shrink-0">
                {a.risk === "critical" && (
                  <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-60", DOT[a.risk])} />
                )}
                <span className={cn("relative inline-flex size-2.5 rounded-full", DOT[a.risk])} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{a.cameraName}</p>
                  <span className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="size-3" />
                    {a.time}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{a.message}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                    style={{ backgroundColor: `${meta.hex}22`, color: meta.hex }}
                  >
                    {meta.label} · {a.waterDepth} sm
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="size-3" />
                    {a.district}
                  </span>
                  {a.dispatched && (
                    <span className="flex items-center gap-1 rounded-md bg-primary/12 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                      <Send className="size-3" />
                      {a.dispatched}
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Early warning dashboard verification 52
