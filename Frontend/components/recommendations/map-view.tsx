"use client"

import { useMemo, useState } from "react"
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from "@react-google-maps/api"
import { MapPin, Locate } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { VendorView } from "@/lib/vendors"

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 }
const mapContainerStyle = { width: "100%", height: "100%" }

export function MapView({ vendors }: { vendors: VendorView[] }) {
  const [locationMessage, setLocationMessage] = useState("")
  const [isLocating, setIsLocating] = useState(false)
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  const { isLoaded, loadError } = useJsApiLoader({
    id: "vendor-map-script",
    googleMapsApiKey,
  })

  const vendorsWithCoords = useMemo(
    () => vendors.filter((vendor) => vendor.latitude !== null && vendor.longitude !== null),
    [vendors],
  )

  const selectedVendor = useMemo(
    () => vendorsWithCoords.find((vendor) => vendor.id === selectedVendorId) || null,
    [selectedVendorId, vendorsWithCoords],
  )

  const mapCenter = useMemo(() => {
    if (userLocation) return userLocation
    const firstVendor = vendorsWithCoords[0]
    if (
      firstVendor &&
      typeof firstVendor.latitude === "number" &&
      typeof firstVendor.longitude === "number"
    ) {
      return { lat: firstVendor.latitude, lng: firstVendor.longitude }
    }
    return DEFAULT_CENTER
  }, [userLocation, vendorsWithCoords])

  const handleLocateMe = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationMessage("Location services are not available in this browser.")
      return
    }

    setIsLocating(true)
    setLocationMessage("")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6))
        const lng = Number(position.coords.longitude.toFixed(6))
        setUserLocation({ lat, lng })
        setLocationMessage(`Location access granted: ${lat}, ${lng}`)
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
      <div className="relative h-75 lg:h-100 bg-muted/50">
        {!googleMapsApiKey ? (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted-foreground">
            Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in Frontend/.env to enable map view.
          </div>
        ) : loadError ? (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-red-600">
            Failed to load Google Maps. Check API key and billing settings.
          </div>
        ) : !isLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted-foreground">
            Loading map...
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={userLocation ? 13 : 11}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {vendorsWithCoords.map((vendor) => (
              <MarkerF
                key={vendor.id}
                position={{ lat: vendor.latitude as number, lng: vendor.longitude as number }}
                title={vendor.name}
                onClick={() => setSelectedVendorId(vendor.id)}
              />
            ))}

            {userLocation ? <MarkerF position={userLocation} title="You are here" /> : null}

            {selectedVendor && selectedVendor.latitude !== null && selectedVendor.longitude !== null ? (
              <InfoWindowF
                position={{ lat: selectedVendor.latitude, lng: selectedVendor.longitude }}
                onCloseClick={() => setSelectedVendorId(null)}
              >
                <div className="max-w-52">
                  <p className="font-semibold text-foreground">{selectedVendor.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedVendor.distance} away</p>
                </div>
              </InfoWindowF>
            ) : null}
          </GoogleMap>
        )}

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
            Showing <span className="font-semibold text-foreground">{vendorsWithCoords.length}</span> mapped vendors nearby
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary shadow-sm" />
              <span className="text-sm text-muted-foreground">Your location</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Vendors</span>
            </div>
          </div>
        </div>
        {locationMessage ? <p className="mt-2 text-sm text-muted-foreground">{locationMessage}</p> : null}
      </div>
    </div>
  )
}
