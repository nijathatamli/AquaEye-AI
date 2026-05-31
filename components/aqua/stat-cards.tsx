import { Camera, Droplets, ShieldAlert, Activity, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Camera as CameraType } from "@/lib/data"

export function StatCards({ cameras }: { cameras: CameraType[] }) {
  const online = cameras.filter((c) => c.status === "online").length
  const critical = cameras.filter((c) => c.risk === "critical").length
  const elevated = cameras.filter((c) => c.risk === "medium" || c.risk === "critical").length
  const maxDepth = Math.max(...cameras.map((c) => c.waterDepth))

  const stats = [
    {
      label: "Aktiv kameralar",
      value: `${online}/${cameras.length}`,
      delta: "100% əhatə",
      trend: "up" as const,
      icon: Camera,
      filled: true,
    },
    {
      label: "Kritik nöqtələr",
      value: String(critical),
      delta: "+2 son saatda",
      trend: "up" as const,
      icon: ShieldAlert,
      accent: "text-risk-critical",
      ring: "bg-risk-critical/12",
    },
    {
      label: "Yüksələn risk",
      value: String(elevated),
      delta: "orta + kritik",
      trend: "up" as const,
      icon: Activity,
      accent: "text-risk-medium",
      ring: "bg-risk-medium/12",
    },
    {
      label: "Maks. su dərinliyi",
      value: `${maxDepth} sm`,
      delta: "Nərimanov pr.",
      trend: "down" as const,
      icon: Droplets,
      accent: "text-primary",
      ring: "bg-primary/12",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon
        const Trend = s.trend === "up" ? TrendingUp : TrendingDown
        if (s.filled) {
          return (
            <div key={s.label} className="rounded-2xl bg-stat p-4 text-stat-foreground">
              <div className="flex items-start justify-between">
                <p className="text-xs font-medium opacity-80">{s.label}</p>
                <Icon className="size-4 opacity-70" />
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight">{s.value}</p>
              <div className="mt-1 flex items-center gap-1 text-xs font-medium opacity-80">
                <Trend className="size-3.5" />
                {s.delta}
              </div>
            </div>
          )
        }
        return (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <span className={cn("flex size-8 items-center justify-center rounded-lg", s.ring)}>
                <Icon className={cn("size-4", s.accent)} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{s.value}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Trend className={cn("size-3.5", s.accent)} />
              {s.delta}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Early warning dashboard verification 61
