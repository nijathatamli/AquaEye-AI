"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { useSidebar } from "./sidebar-context"
import {
  LayoutDashboard,
  Camera,
  Bell,
  Map,
  FileBarChart,
  Settings,
  Waves,
  LifeBuoy,
} from "lucide-react"

const NAV = [
  { id: "overview", label: "İcmal", icon: LayoutDashboard, href: "/dashboard" },
  { id: "map", label: "Canlı xəritə", icon: Map, href: "/live-map" },
  { id: "cameras", label: "Kameralar", icon: Camera, href: "/cameras" },
  { id: "alerts", label: "Xəbərdarlıqlar", icon: Bell, badge: 6, href: "/alerts" },
  { id: "reports", label: "Hesabatlar", icon: FileBarChart, href: "/reports" },
]

const SYSTEM_NAV = [
  { id: "settings", label: "Tənzimləmələr", icon: Settings, href: "/settings" },
  { id: "support", label: "Dəstək", icon: LifeBuoy, href: "/support" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, setIsOpen } = useSidebar()

  // Close sidebar on path change (mobile)
  useEffect(() => {
    setIsOpen(false)
  }, [pathname, setIsOpen])

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/" || pathname === "/dashboard"
    return pathname === href
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:flex",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <Link href="/dashboard" className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5 hover:bg-sidebar-accent/50 transition-colors">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Waves className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-sidebar-foreground">AquaEye AI</p>
            <p className="text-[11px] text-muted-foreground">Monitorinq Mərkəzi</p>
          </div>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Naviqasiya
          </p>
          {NAV.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-primary/15 font-medium text-sidebar-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <Icon className="size-4.5 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-risk-critical text-[10px] font-semibold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}

          <p className="px-3 pb-1 pt-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Sistem
          </p>
          {SYSTEM_NAV.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-primary/15 font-medium text-sidebar-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <Icon className="size-4.5 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="rounded-lg bg-sidebar-accent p-3">
            <div className="flex items-center gap-2">
              <span className="size-2 animate-pulse rounded-full bg-risk-low" />
              <p className="text-xs font-medium text-sidebar-foreground">AI modulu aktiv</p>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              YOLOv8-seg · real vaxt analizi işləyir
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}


// Early warning dashboard verification 60
