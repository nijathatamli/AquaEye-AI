"use client"

import { useState } from "react"
import { MessageSquare, HelpCircle, FileText, Send, Search, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/aqua/dashboard-layout"

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<"tickets" | "faq">("tickets")
  const [newTicket, setNewTicket] = useState({ subject: "", message: "" })
  const [searchQuery, setSearchQuery] = useState("")

  const tickets = [
    {
      id: "TKT-001",
      subject: "Kamera NRM-118 offline",
      status: "open",
      priority: "high",
      createdAt: "31 May 2026",
      lastUpdate: "31 May 2026"
    },
    {
      id: "TKT-002",
      subject: "Bildirişlər gəlmir",
      status: "in-progress",
      priority: "medium",
      createdAt: "30 May 2026",
      lastUpdate: "31 May 2026"
    },
    {
      id: "TKT-003",
      subject: "Xəritə yenilənmir",
      status: "closed",
      priority: "low",
      createdAt: "28 May 2026",
      lastUpdate: "30 May 2026"
    },
  ]

  const faqs = [
    {
      id: 1,
      question: "Kamera necə əlavə edilir?",
      answer: "Kamera əlavə etmək üçün Tənzimləmələr > Kameralar bölməsinə daxil olun və 'Yeni Kamera' düyməsini sıxın."
    },
    {
      id: 2,
      question: "Bildirişləri necə aktivləşdirə bilərəm?",
      answer: "Tənzimləmələr > Bildirişlər bölməsindən email, push və ya SMS bildirişlərini aktivləşdirə bilərsiniz."
    },
    {
      id: 3,
      question: "Risk səviyyələri necə müəyyən edilir?",
      answer: "Risk səviyyələri AI modeli tərəfindən su dərinliyi, əhatə dairəsi və etibarlılıq əsasən hesablanır."
    },
    {
      id: 4,
      question: "Hesabatları necə export edə bilərəm?",
      answer: "Hesabatlar səhifəsindən PDF və ya Excel formatında export edə bilərsiniz."
    },
  ]

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmitTicket = () => {
    console.log("Submitting ticket:", newTicket)
    setNewTicket({ subject: "", message: "" })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-card">
        <div>
          <h1 className="text-xl font-semibold">Dəstək</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Yardım və texniki dəstək
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r border-border bg-card p-4">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("tickets")}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                activeTab === "tickets"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <MessageSquare className="size-4" />
              Dəstək Tiketləri
            </button>
            <button
              onClick={() => setActiveTab("faq")}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                activeTab === "faq"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <HelpCircle className="size-4" />
              FAQ
            </button>
          </nav>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "tickets" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Dəstək Tiketləri</h2>
                <button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90">
                  <Plus className="size-4" />
                  Yeni Tiket
                </button>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="font-semibold mb-4">Yeni Tiket Yarat</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Mövzu</label>
                    <input
                      type="text"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      placeholder="Problem haqqında qısa məlumat..."
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Mesaj</label>
                    <textarea
                      value={newTicket.message}
                      onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                      placeholder="Problem haqqında ətraflı məlumat..."
                      rows={4}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSubmitTicket}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                  >
                    <Send className="size-4" />
                    Göndər
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-xl border border-border bg-card p-4 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-lg flex items-center justify-center bg-primary/10">
                          <MessageSquare className="size-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{ticket.subject}</h3>
                          <p className="text-sm text-muted-foreground">{ticket.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-[10px] font-medium",
                            ticket.status === "open" && "bg-green-500/15 text-green-500",
                            ticket.status === "in-progress" && "bg-yellow-500/15 text-yellow-500",
                            ticket.status === "closed" && "bg-muted text-muted-foreground",
                          )}
                        >
                          {ticket.status === "open" ? "Açıq" : ticket.status === "in-progress" ? "İşlənir" : "Bağlı"}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-[10px] font-medium",
                            ticket.priority === "high" && "bg-red-500/15 text-red-500",
                            ticket.priority === "medium" && "bg-yellow-500/15 text-yellow-500",
                            ticket.priority === "low" && "bg-muted text-muted-foreground",
                          )}
                        >
                          {ticket.priority === "high" ? "Yüksək" : ticket.priority === "medium" ? "Orta" : "Aşağı"}
                        </span>
                        <p className="text-[11px] text-muted-foreground">{ticket.lastUpdate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Tez-tez verilən suallar</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="FAQ axtar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="rounded-xl border border-border bg-card p-4 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="size-8 rounded-lg flex items-center justify-center bg-primary/10 mt-0.5">
                        <HelpCircle className="size-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{faq.question}</h3>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredFAQs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <HelpCircle className="size-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Nəticə tapılmadı</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </DashboardLayout>
  )
}

// Early warning dashboard verification 29
