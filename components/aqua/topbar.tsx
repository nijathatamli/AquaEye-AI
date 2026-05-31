"use client"

import { Bell, Search, Waves, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSidebar } from "./sidebar-context"

export function Topbar() {
  const { toggle } = useSidebar()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <button
          onClick={toggle}
          className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground mr-1"
          aria-label="Menyu"
        >
          <Menu className="size-4.5" />
        </button>
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Waves className="size-4" />
        </div>
        <span className="text-sm font-semibold">AquaEye AI</span>
      </div>


      <div className="relative ml-auto hidden w-full max-w-sm md:block lg:ml-0">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Kamera, rayon və ya hadisə axtar..."
          className="h-9 border-border bg-card pl-9 text-sm"
        />
      </div>

      <div className="flex items-center gap-2 md:ml-auto lg:ml-0">
        <span className="hidden items-center gap-1.5 rounded-full border border-risk-low/30 bg-risk-low/10 px-3 py-1 text-xs font-medium text-risk-low sm:flex">
          <span className="size-1.5 animate-pulse rounded-full bg-risk-low" />
          Canlı
        </span>

        <button className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground">
          <Bell className="size-4.5" />
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-risk-critical text-[9px] font-semibold text-white">
            6
          </span>
        </button>

        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card py-1 pl-1 pr-3">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/20 text-xs font-semibold text-primary">
            FH
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-medium">FHN Operatoru</p>
            <p className="text-[10px] text-muted-foreground">Bakı Şəhər İH</p>
          </div>
        </div>
      </div>
    </header>
  )
}

// Early warning dashboard verification 62
