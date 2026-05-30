import { cn } from "@/lib/utils"
import { RISK_META, type RiskLevel } from "@/lib/data"

const STYLES: Record<RiskLevel, string> = {
  normal: "bg-muted text-muted-foreground border-border",
  low: "bg-risk-low/15 text-risk-low border-risk-low/30",
  medium: "bg-risk-medium/15 text-risk-medium border-risk-medium/30",
  critical: "bg-risk-critical/15 text-risk-critical border-risk-critical/40",
}

export function RiskBadge({
  risk,
  className,
  showRange = false,
}: {
  risk: RiskLevel
  className?: string
  showRange?: boolean
}) {
  const meta = RISK_META[risk]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STYLES[risk],
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          risk === "normal" && "bg-muted-foreground",
          risk === "low" && "bg-risk-low",
          risk === "medium" && "bg-risk-medium",
          risk === "critical" && "bg-risk-critical animate-pulse",
        )}
      />
      {meta.label}
      {showRange && <span className="opacity-70">· {meta.range}</span>}
    </span>
  )
}

// Early warning dashboard verification 57
