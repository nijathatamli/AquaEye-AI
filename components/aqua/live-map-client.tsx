import { DISTRICT } from "@/lib/data"
import { Layers, Radio } from "lucide-react"
import { DashboardLayout } from "./dashboard-layout"

export default function LiveMapClient() {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-card">
          <div className="flex items-center gap-2">
            <Radio className="size-4 text-primary" />
            <div>
              <h3 className="text-sm font-semibold leading-none">Canlı Risk Xəritəsi 3D</h3>
              <p className="mt-1 text-[11px] text-muted-foreground">{DISTRICT} · F4Map 3D</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground">
              <Layers className="size-3.5" />
              Qatlar
            </button>
            <button className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground">
              <span className="size-2 animate-pulse rounded-full bg-green-500" />
              Live
            </button>
          </div>
        </div>
        <div className="relative flex-1">
          <iframe
            src="https://demo.f4map.com/#lat=40.40926&lon=49.86709&zoom=15"
            className="h-full w-full border-none"
            title="Baku 3D Live Flood Map"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

// Early warning dashboard verification 56
