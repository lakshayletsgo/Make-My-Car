"use client"

import { useState } from "react"
import { MapPin, Navigation, Locate } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { VendorView } from "@/lib/vendors"

export function MapView({ vendors }: { vendors: VendorView[] }) {
  const [locationMessage, setLocationMessage] = useState("")
  const [isLocating, setIsLocating] = useState(false)

  const handleLocateMe = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationMessage("Location services are not available in this browser.")
      return
    }

    setIsLocating(true)
    setLocationMessage("")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4)
        const lon = position.coords.longitude.toFixed(4)
        setLocationMessage(`Location access granted: ${lat}, ${lon}`)
        setIsLocating(false)
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationMessage("Location permission was denied. Please enable it in your browser settings.")
        } else {
          setLocationMessage("Unable to access your location right now.")
        }
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  return (
    <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
      {/* Map placeholder */}
      <div className="relative h-75 lg:h-100 bg-linear-to-br from-muted via-muted/50 to-muted">
        {/* Grid lines for visual effect */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            opacity: 0.1
          }} />
        </div>

        {/* Decorative circles */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full border border-primary/20 animate-pulse" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full border border-primary/10" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full border border-primary/5" />

        {/* Center marker */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-primary p-3 shadow-xl shadow-primary/30 ring-4 ring-primary/20">
              <Navigation className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="mt-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
              You are here
            </div>
          </div>
        </div>

        {/* Vendor markers */}
        {vendors.slice(0, 6).map((vendor, i) => {
          const positions = [
            { left: "22%", top: "28%" },
            { left: "72%", top: "22%" },
            { left: "32%", top: "68%" },
            { left: "78%", top: "62%" },
            { left: "12%", top: "48%" },
            { left: "62%", top: "42%" },
          ]
          const pos = positions[i]
          return (
            <div
              key={vendor.id}
              className="absolute flex flex-col items-center cursor-pointer group z-5"
              style={{ left: pos.left, top: pos.top }}
            >
              <div className="rounded-full bg-card border-2 border-primary p-2 shadow-lg transition-all duration-300 group-hover:scale-125 group-hover:shadow-xl group-hover:shadow-primary/20">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-2 hidden group-hover:block rounded-xl bg-card border border-border px-3 py-2 shadow-xl z-20 animate-in fade-in zoom-in-95 duration-200">
                <p className="text-sm font-semibold text-foreground whitespace-nowrap">{vendor.name}</p>
                <p className="text-xs text-muted-foreground">{vendor.distance} away</p>
              </div>
            </div>
          )
        })}

        {/* Locate button */}
        <Button
          size="sm"
          variant="outline"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm border-border shadow-lg hover:bg-card"
        >
          <Locate className="mr-2 h-4 w-4" />
          {isLocating ? "Locating..." : "Locate Me"}
        </Button>
      </div>

      {/* Map legend */}
      <div className="border-t border-border bg-muted/30 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{vendors.length}</span> vendors nearby
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary shadow-sm" />
              <span className="text-sm text-muted-foreground">Your location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full border-2 border-primary bg-card" />
              <span className="text-sm text-muted-foreground">Vendors</span>
            </div>
          </div>
        </div>
        {locationMessage ? <p className="mt-2 text-sm text-muted-foreground">{locationMessage}</p> : null}
      </div>
    </div>
  )
}
