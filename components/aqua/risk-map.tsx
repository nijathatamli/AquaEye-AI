import { DISTRICT } from "@/lib/data"
import { Maximize2, Radio } from "lucide-react"

export function RiskMap({
  cameras,
  selectedId,
  onSelect,
}: {
  cameras?: any
  selectedId?: any
  onSelect?: any
} = {}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Radio className="size-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold leading-none">Canli risk xeritesi 3D</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">{DISTRICT} · F4Map 3D</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <a
            href="https://demo.f4map.com/#lat=40.40926&lon=49.86709&zoom=15"
            target="_blank"
            rel="noreferrer"
            className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <Maximize2 className="size-3.5" />
          </a>
        </div>
      </div>
      <div className="relative min-h-[380px] flex-1">
        <iframe
          src="https://demo.f4map.com/#lat=40.40926&lon=49.86709&zoom=15"
          className="h-full w-full border-none"
          title="Baku 3D Flood Risk Map"
        />
      </div>
    </div>
  )
}
// Early warning dashboard verification 58
