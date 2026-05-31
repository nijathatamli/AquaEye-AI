"use client"

import { useState } from "react"
import { FileText, Download, Calendar, TrendingUp, AlertTriangle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/aqua/dashboard-layout"

export default function ReportsPage() {

  const reports = [
    {
      id: 1,
      title: "Günlük Sel Risk Hesabatı",
      period: "31 May 2026",
      type: "daily",
      criticalAlerts: 3,
      totalAlerts: 12,
      avgWaterLevel: 28,
      status: "completed"
    },
    {
      id: 2,
      title: "Həftəlik Risk Analizi",
      period: "May 24-30, 2026",
      type: "weekly",
      criticalAlerts: 15,
      totalAlerts: 48,
      avgWaterLevel: 32,
      status: "completed"
    },
    {
      id: 3,
      title: "Aylıq Su Səviyyəsi Hesabatı",
      period: "May 2026",
      type: "monthly",
      criticalAlerts: 67,
      totalAlerts: 234,
      avgWaterLevel: 35,
      status: "completed"
    },
  ]

  const exportReport = (format: "pdf" | "excel") => {
    console.log(`Exporting report as ${format}`)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-card">
        <div>
          <h1 className="text-xl font-semibold">Hesabatlar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Risk analizi və statistika hesabatları
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent">
            <Calendar className="size-4" />
            Tarix Seç
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ümumi Hesabat</span>
              <FileText className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-semibold">156</p>
            <p className="text-[11px] text-muted-foreground">Bu ay</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Kritik Hadisə</span>
              <AlertTriangle className="size-4 text-red-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-red-500">23</p>
            <p className="text-[11px] text-muted-foreground">Bu ay</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Orta Su Səviyyəsi</span>
              <TrendingUp className="size-4 text-blue-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold">32 sm</p>
            <p className="text-[11px] text-muted-foreground">Bu ay</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Export Edildi</span>
              <Download className="size-4 text-green-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold">89</p>
            <p className="text-[11px] text-muted-foreground">Bu ay</p>
          </div>
        </div>


        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-xl border border-border bg-card p-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="size-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  >
                    <FileText className="size-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">{report.period}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-[11px] text-muted-foreground">Kritik</p>
                    <p className="font-semibold text-red-500">{report.criticalAlerts}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-muted-foreground">Ümumi</p>
                    <p className="font-semibold">{report.totalAlerts}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-muted-foreground">Orta Su</p>
                    <p className="font-semibold">{report.avgWaterLevel} sm</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportReport("pdf")}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-accent"
                    >
                      <Download className="size-3" />
                      PDF
                    </button>
                    <button
                      onClick={() => exportReport("excel")}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-accent"
                    >
                      <Download className="size-3" />
                      Excel
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90">
                      Bax
                      <ChevronRight className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </DashboardLayout>
  )
}

// Early warning dashboard verification 27
