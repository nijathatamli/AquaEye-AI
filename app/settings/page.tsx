"use client"

import { useState, useEffect } from "react"
import { User, Bell, Shield, Palette, Globe, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/aqua/dashboard-layout"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security" | "appearance">("profile")
  const [settings, setSettings] = useState({
    // Profile
    name: "Admin User",
    email: "admin@aquaeye.ai",
    role: "Super Admin",
    
    // Notifications
    emailAlerts: true,
    pushNotifications: true,
    smsAlerts: false,
    criticalOnly: true,
    
    // Security
    twoFactor: false,
    sessionTimeout: 30,
    
    // Appearance
    theme: "light",
    language: "az",
  })

  useEffect(() => {
    if (theme) {
      setSettings((prev) => ({ ...prev, theme }))
    }
  }, [theme])


  const handleSave = () => {
    console.log("Saving settings:", settings)
  }

  const tabs = [
    { id: "profile" as const, label: "Profil", icon: User },
    { id: "notifications" as const, label: "Bildirişlər", icon: Bell },
    { id: "security" as const, label: "Təhlükəsizlik", icon: Shield },
    { id: "appearance" as const, label: "Görünüş", icon: Palette },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-card">
        <div>
          <h1 className="text-xl font-semibold">Tənzimləmələr</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sistem konfiqurasiyası və istifadəçi üstünlükləri
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          <Save className="size-4" />
          Yadda Saxla
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r border-border bg-card p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "profile" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Profil Məlumatları</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Ad</label>
                    <input
                      type="text"
                      value={settings.name}
                      onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Rol</label>
                    <input
                      type="text"
                      value={settings.role}
                      disabled
                      className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Bildiriş Tənzimləmələri</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">Email Bildirişləri</p>
                      <p className="text-sm text-muted-foreground">Xəbərdarlıqları email ilə al</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, emailAlerts: !settings.emailAlerts })}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                        settings.emailAlerts ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block size-4 rounded-full bg-white transition-transform",
                          settings.emailAlerts ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">Push Bildirişləri</p>
                      <p className="text-sm text-muted-foreground">Brauzer bildirişləri aktiv</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, pushNotifications: !settings.pushNotifications })}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                        settings.pushNotifications ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block size-4 rounded-full bg-white transition-transform",
                          settings.pushNotifications ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">SMS Bildirişləri</p>
                      <p className="text-sm text-muted-foreground">Kritik hadisələr üçün SMS</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, smsAlerts: !settings.smsAlerts })}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                        settings.smsAlerts ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block size-4 rounded-full bg-white transition-transform",
                          settings.smsAlerts ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">Yalnız Kritik</p>
                      <p className="text-sm text-muted-foreground">Sadəcə kritik xəbərdarlıqlar</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, criticalOnly: !settings.criticalOnly })}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                        settings.criticalOnly ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block size-4 rounded-full bg-white transition-transform",
                          settings.criticalOnly ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Təhlükəsizlik</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">İki Faktorlu Təsdiqləmə</p>
                      <p className="text-sm text-muted-foreground">2FA aktivləşdir</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, twoFactor: !settings.twoFactor })}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                        settings.twoFactor ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block size-4 rounded-full bg-white transition-transform",
                          settings.twoFactor ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Sessiya Timeout (dəqiqə)</label>
                    <input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Görünüş</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Tema</label>
                    <select
                      value={settings.theme}
                      onChange={(e) => {
                        const val = e.target.value
                        setSettings({ ...settings, theme: val })
                        setTheme(val)
                      }}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="light">İşıqlı (Light)</option>
                      <option value="dark">Qaranlıq (Dark)</option>
                      <option value="system">Sistem (System)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Dil</label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="az">Azərbaycan</option>
                      <option value="en">English</option>
                      <option value="ru">Русский</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </DashboardLayout>
  )
}

// Early warning dashboard verification 28
