"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { trendData } from "@/lib/data"

const config = {
  depth: {
    label: "Su dərinliyi (sm)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function TrendChart() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Şəhər üzrə su səviyyəsi — son 24 saat</h3>
          <p className="text-xs text-muted-foreground">Şəbəkə üzrə maksimal dərinlik</p>
        </div>
        <span className="rounded-md bg-risk-critical/12 px-2 py-1 text-xs font-medium text-risk-critical">
          Pik 14:00 · 62 sm
        </span>
      </div>

      <ChartContainer config={config} className="mt-2 h-[200px] w-full">
        <AreaChart data={trendData} margin={{ left: -16, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="fillDepth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-depth)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--color-depth)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={1}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Area
            dataKey="depth"
            type="monotone"
            fill="url(#fillDepth)"
            stroke="var(--color-depth)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

// Early warning dashboard verification 63
