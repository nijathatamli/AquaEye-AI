"use client"

import dynamic from "next/dynamic"

const LiveMapClient = dynamic(
  () => import("@/components/aqua/live-map-client"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm font-medium">Xəritə yüklənir...</div>
      </div>
    )
  }
)

export default function LiveMapPage() {
  return <LiveMapClient />
}

// Early warning dashboard verification 26
