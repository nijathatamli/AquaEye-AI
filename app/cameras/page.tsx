"use client"

import { useState, useRef, useEffect } from "react"
import { cameras, RISK_META, type Camera, type RiskLevel } from "@/lib/data"
import { Search, Filter, Video, Signal, X, Settings, Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/aqua/dashboard-layout"

const FILTERS: { id: RiskLevel | "all"; label: string }[] = [
  { id: "all", label: "Hamısı" },
  { id: "critical", label: "Kritik" },
  { id: "medium", label: "Orta" },
  { id: "low", label: "Aşağı" },
  { id: "normal", label: "Normal" },
]

interface ActiveVideo {
  src: string
  startTime: number
  endTime: number
  title: string
  label: "Əvvəl" | "Sonra"
}

const CAMERA_VIDEOS: Record<string, { src: string; duration: number; beforeSplit: number; afterEnd: number; afterThumbnail: string }> = {
  "NRM-118": {
    src: "/video1.mp4",
    duration: 32.08,
    beforeSplit: 16.0,
    afterEnd: 32.08,
    afterThumbnail: "/thumb-after-nrm118.jpg",
  },
  "NRM-204": {
    src: "/video2.mp4",
    duration: 14.6,
    beforeSplit: 4.0,
    afterEnd: 10.0,
    afterThumbnail: "/thumb-after-nrm204.jpg",
  },
}

export default function CamerasPage() {
  const [filter, setFilter] = useState<RiskLevel | "all">("all")
  const [search, setSearch] = useState("")
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null)
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null)

  const filteredCameras = cameras.filter((cam) => {
    const matchesFilter = filter === "all" || cam.risk === filter
    const matchesSearch = cam.name.toLowerCase().includes(search.toLowerCase()) || 
                         cam.id.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-card">
        <div>
          <h1 className="text-xl font-semibold">Kameralar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {cameras.length} kamera · {cameras.filter(c => c.status === "online").length} online
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Kamera axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent">
            <Filter className="size-4" />
            Filtrlər
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const isActive = filter === f.id
              const color = f.id !== "all" ? RISK_META[f.id as RiskLevel].hex : undefined
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {color && (
                    <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
                  )}
                  {f.label}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCameras.map((cam) => {
              const meta = RISK_META[cam.risk]
              const isOnline = cam.status === "online"
              const videoInfo = CAMERA_VIDEOS[cam.id]
              return (
                <div
                  key={cam.id}
                  onClick={() => {
                    if (videoInfo) {
                      setActiveVideo({
                        src: videoInfo.src,
                        startTime: videoInfo.beforeSplit,
                        endTime: videoInfo.afterEnd,
                        title: cam.name,
                        label: "Sonra",
                      })
                    }
                  }}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg cursor-pointer",
                    selectedCamera?.id === cam.id && "ring-2 ring-primary"
                  )}
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {videoInfo ? (
                      <>
                        <img
                          src={videoInfo.afterThumbnail}
                          alt={`${cam.name} after`}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Play icon overlay on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30">
                          <div className="rounded-full bg-white/20 backdrop-blur p-3 border border-white/30">
                            <Play className="size-6 fill-white text-white" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Video className="size-12 text-muted-foreground/50" />
                      </div>
                    )}

                    {/* Online badge */}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-full bg-background/80 px-2 py-1 text-[10px] font-medium backdrop-blur">
                      {isOnline ? (
                        <>
                          <Signal className="size-3 text-green-500" />
                          Online
                        </>
                      ) : (
                        <>
                          <X className="size-3 text-red-500" />
                          Offline
                        </>
                      )}
                    </div>

                    {/* Risk badge */}
                    <div className="absolute bottom-2 left-2 rounded-full bg-background/80 px-2 py-1 text-[10px] font-medium backdrop-blur" style={{ backgroundColor: `${meta.hex}20` }}>
                      <span className="size-2 inline-block rounded-full mr-1" style={{ backgroundColor: meta.hex }} />
                      {meta.label}
                    </div>

                    {/* Details button — opens sidebar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedCamera(cam)
                      }}
                      className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/70 backdrop-blur px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-white/20 transition-colors shadow-lg opacity-0 group-hover:opacity-100 duration-200"
                    >
                      <Settings className="size-3" />
                      Details
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold">{cam.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{cam.id}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">{cam.zone}</span>
                      <span className="font-medium">{cam.waterDepth} sm</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {selectedCamera && (() => {
          const sidebarVideo = CAMERA_VIDEOS[selectedCamera.id]
          return (
            <div className="w-80 border-l border-border bg-card p-4 overflow-y-auto">
              <div className="mb-4">
                <button
                  onClick={() => setSelectedCamera(null)}
                  className="text-sm text-muted-foreground hover:text-foreground mb-2"
                >
                  ← Geri
                </button>
                <h2 className="text-lg font-semibold">{selectedCamera.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedCamera.id}</p>
              </div>

              <div className="space-y-3">
                {/* Thumbnail */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  {sidebarVideo ? (
                    <>
                      <img
                        src={sidebarVideo.afterThumbnail}
                        alt={`${selectedCamera.name} after`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider">
                        Sonra
                      </span>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Video className="size-12 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                {/* Watch buttons — directly below thumbnail */}
                {sidebarVideo && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setActiveVideo({
                          src: sidebarVideo.src,
                          startTime: 0,
                          endTime: sidebarVideo.beforeSplit,
                          title: selectedCamera.name,
                          label: "Əvvəl",
                        })
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-accent transition-colors"
                    >
                      <Play className="size-3 text-blue-400 fill-blue-400/30" />
                      Watch Before
                    </button>
                    <button
                      onClick={() => {
                        setActiveVideo({
                          src: sidebarVideo.src,
                          startTime: sidebarVideo.beforeSplit,
                          endTime: sidebarVideo.afterEnd,
                          title: selectedCamera.name,
                          label: "Sonra",
                        })
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/5 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Play className="size-3 fill-red-400/50" />
                      Watch After
                    </button>
                  </div>
                )}

                {/* Stats */}
                <div className="space-y-2 pt-1 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className={cn("font-medium", selectedCamera.status === "online" ? "text-green-500" : "text-red-500")}>
                      {selectedCamera.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Risk Level</span>
                    <span className="font-medium" style={{ color: RISK_META[selectedCamera.risk].hex }}>
                      {RISK_META[selectedCamera.risk].label}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Water Depth</span>
                    <span className="font-medium">{selectedCamera.waterDepth} sm</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-medium">{selectedCamera.confidence}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Coverage</span>
                    <span className="font-medium">{selectedCamera.coverage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Zone</span>
                    <span className="font-medium">{selectedCamera.zone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium text-xs">
                      {selectedCamera.lat.toFixed(4)}, {selectedCamera.lng.toFixed(4)}
                    </span>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent">
                  <Settings className="size-4" />
                  Tənzimləmələr
                </button>
              </div>
            </div>
          )
        })()}
      </div>
      </div>
      {activeVideo && (
        <VideoPlayerModal
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </DashboardLayout>
  )
}

function VideoPlayerModal({
  video,
  onClose,
}: {
  video: ActiveVideo
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(video.startTime)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)

  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    videoEl.currentTime = video.startTime
    videoEl.volume = volume
    videoEl.muted = isMuted
    videoEl.playbackRate = playbackRate

    const playPromise = videoEl.play()
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Auto-play prevented", error)
        setIsPlaying(false)
      })
    }
  }, [video])

  const handlePlayPause = () => {
    const videoEl = videoRef.current
    if (!videoEl) return

    if (isPlaying) {
      videoEl.pause()
      setIsPlaying(false)
    } else {
      videoEl.play()
      setIsPlaying(true)
    }
  }

  const handleTimeUpdate = () => {
    const videoEl = videoRef.current
    if (!videoEl) return

    let current = videoEl.currentTime

    if (current >= video.endTime) {
      videoEl.currentTime = video.startTime
      current = video.startTime
    } else if (current < video.startTime) {
      videoEl.currentTime = video.startTime
      current = video.startTime
    }

    setCurrentTime(current)
  }

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videoEl = videoRef.current
    if (!videoEl) return

    const percentage = parseFloat(e.target.value)
    const newTime = video.startTime + (percentage / 100) * (video.endTime - video.startTime)
    videoEl.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videoEl = videoRef.current
    if (!videoEl) return

    const newVolume = parseFloat(e.target.value)
    videoEl.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const videoEl = videoRef.current
    if (!videoEl) return

    const nextMuted = !isMuted
    videoEl.muted = nextMuted
    setIsMuted(nextMuted)
  }

  const handleSpeedChange = (rate: number) => {
    const videoEl = videoRef.current
    if (!videoEl) return

    videoEl.playbackRate = rate
    setPlaybackRate(rate)
  }

  const formatTime = (time: number) => {
    const relativeTime = Math.max(0, time - video.startTime)
    const mins = Math.floor(relativeTime / 60)
    const secs = Math.floor(relativeTime % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const segmentProgress = ((currentTime - video.startTime) / (video.endTime - video.startTime)) * 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <span className={cn(
              "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider",
              video.label === "Əvvəl" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
            )}>
              {video.label} (Video)
            </span>
            <h3 className="text-base font-semibold text-foreground truncate max-w-md">
              {video.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Video Screen */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={video.src}
            onTimeUpdate={handleTimeUpdate}
            onClick={handlePlayPause}
            className="w-full h-full object-contain cursor-pointer"
            loop={false}
            playsInline
          />
        </div>

        {/* Controls */}
        <div className="p-4 bg-card flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground w-10">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={segmentProgress || 0}
              onChange={handleTimelineChange}
              className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
            <span className="text-xs font-mono text-muted-foreground w-10 text-right">
              {formatTime(video.endTime)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayPause}
                className="flex items-center justify-center p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
              </button>
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = video.startTime;
                    setCurrentTime(video.startTime);
                  }
                }}
                className="flex items-center justify-center p-2 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                title="Restart"
              >
                <RotateCcw className="size-4" />
              </button>

              <div className="flex items-center gap-1.5 ml-2 group/volume">
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary transition-opacity"
                />
              </div>
            </div>

            <div className="flex items-center gap-1">
              {[0.5, 1, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleSpeedChange(rate)}
                  className={cn(
                    "px-2 py-1 rounded text-[10px] font-medium border border-transparent transition-colors",
                    playbackRate === rate
                      ? "bg-accent text-foreground font-semibold border-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                  )}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Early warning dashboard verification 24
