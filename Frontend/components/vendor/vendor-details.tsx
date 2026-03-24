"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Star,
  MapPin,
  Phone,
  Navigation,
  ShieldCheck,
  ArrowLeft,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import { createBooking, type ApiVendor } from "@/lib/api"
import { getStoredRole } from "@/lib/auth"
import type { VendorView } from "@/lib/vendors"

function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|webm|m4v|avi|mkv)(\?.*)?$/i.test(url)
}

export function VendorDetails({ vendor, vendorApi }: { vendor: VendorView; vendorApi: ApiVendor }) {
  const router = useRouter()
  const categoryLabel = vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)
  const [slotAt, setSlotAt] = useState("")
  const [notes, setNotes] = useState("")
  const [message, setMessage] = useState("")
  const [isBooking, setIsBooking] = useState(false)
  const isAuthenticated = typeof window !== "undefined" ? Boolean(localStorage.getItem("access_token") || localStorage.getItem("token")) : false
  const role = typeof window !== "undefined" ? getStoredRole() : null
  const canBook = role === "USER"
  const bannerMediaUrl = vendorApi.gallery?.[0] || vendor.image
  const bannerIsVideo = isVideoUrl(bannerMediaUrl)
  const directionsUrl = useMemo(() => {
    const locationLink = (vendorApi.location || "").trim()
    if (locationLink.startsWith("http://") || locationLink.startsWith("https://")) {
      return locationLink
    }

    if (Number.isFinite(vendorApi.latitude) && Number.isFinite(vendorApi.longitude)) {
      return `https://www.google.com/maps/search/?api=1&query=${vendorApi.latitude},${vendorApi.longitude}`
    }

    const encodedAddress = encodeURIComponent(vendorApi.address || vendor.location)
    return encodedAddress ? `https://www.google.com/maps/search/?api=1&query=${encodedAddress}` : ""
  }, [vendorApi.address, vendorApi.latitude, vendorApi.location, vendorApi.longitude, vendor.location])

  const categoryColors: Record<string, string> = {
    insurance: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    accessories: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    safety: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    service: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  }

  const apiReviews = useMemo(() => {
    return (vendorApi.reviews || []).map((review) => {
      const initials = (review.user_name || "User")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")

      return {
        name: review.user_name || "Verified User",
        rating: review.rating,
        date: "recent",
        text: review.comment,
        initials: initials || "U",
      }
    })
  }, [vendorApi.reviews])

  async function handleBookSlot() {
    if (!slotAt) {
      setMessage("Please select a date and time for your booking slot.")
      return
    }

    try {
      setIsBooking(true)
      setMessage("")
      await createBooking({
        vendor_id: vendorApi.id,
        slot_at: new Date(slotAt).toISOString(),
        notes: notes || undefined,
      })
      setMessage("Booking created successfully. You can track it in your user dashboard.")
      setNotes("")
      setSlotAt("")
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to create booking")
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <section className="bg-linear-to-b from-muted/50 via-background to-background py-8 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <Link
          href="/recommendations"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Recommendations
        </Link>

        <div className="relative h-64 md:h-80 lg:h-96 rounded-3xl overflow-hidden mb-10 shadow-xl bg-muted">
          {bannerIsVideo ? (
            <video
              src={bannerMediaUrl}
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              controls
            />
          ) : (
            <Image
              src={bannerMediaUrl}
              alt={vendor.name}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />
          <div className="absolute bottom-6 left-6 flex items-center gap-3">
            <Badge className={`border ${categoryColors[vendor.category]} text-sm px-4 py-1.5 font-medium`}>
              {categoryLabel}
            </Badge>
            {vendor.verified ? (
              <Badge className="border border-primary/20 bg-primary text-primary-foreground text-sm px-4 py-1.5 font-medium">
                <ShieldCheck className="mr-1.5 h-4 w-4" />
                Verified Partner
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                {vendor.name}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-1.5">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="text-lg font-semibold text-foreground">{vendor.rating}</span>
                  <span className="text-muted-foreground">({vendor.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>{vendor.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Navigation className="h-5 w-5" />
                  <span>{vendor.distance} away</span>
                </div>
              </div>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                {vendor.description}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-7 shadow-lg">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-5">
                Products & Services
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {vendor.products.map((product) => (
                  <div
                    key={product}
                    className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 transition-all hover:border-primary/30 hover:bg-muted/50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <ChevronRight className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{product}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-7 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  User Reviews
                </h2>
                <span className="text-sm text-muted-foreground">
                  {vendor.reviewCount} total reviews
                </span>
              </div>
              <div className="flex flex-col gap-5">
                {apiReviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No approved reviews yet.</p>
                ) : null}
                {apiReviews.map((review) => (
                  <div
                    key={`${review.name}-${review.text}`}
                    className="rounded-xl border border-border bg-muted/20 p-5 transition-all hover:border-primary/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                          {review.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{review.name}</p>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sticky top-24">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-5">Quick Info</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 rounded-xl bg-muted/30 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Price Range</p>
                    <p className="font-semibold text-foreground">{vendor.priceRange}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl bg-muted/30 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="font-semibold text-foreground">{vendor.distance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl bg-muted/30 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Working Hours</p>
                    <p className="font-semibold text-foreground">9:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {canBook ? (
                  <>
                    <label className="text-sm font-medium text-foreground">Book a Slot</label>
                    <input
                      type="datetime-local"
                      value={slotAt}
                      onChange={(event) => setSlotAt(event.target.value)}
                      className="h-11 rounded-lg border border-border bg-background px-3"
                    />
                    <textarea
                      placeholder="Notes (optional)"
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      className="h-24 rounded-lg border border-border bg-background px-3 py-2"
                    />
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium shadow-lg shadow-primary/25"
                      onClick={handleBookSlot}
                      disabled={isBooking}
                    >
                      {isBooking ? "Booking..." : "Book Slot"}
                    </Button>
                    {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
                  </>
                ) : !isAuthenticated ? (
                  <>
                    <p className="text-sm text-muted-foreground">Sign in is required to book an appointment.</p>
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium shadow-lg shadow-primary/25"
                      onClick={() => router.push("/auth")}
                    >
                      Sign In to Book Appointment
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Only user accounts can book appointments.</p>
                )}

                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium shadow-lg shadow-primary/25">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Vendor
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-border hover:bg-muted h-12 text-base font-medium"
                  disabled={!directionsUrl}
                >
                  <a href={directionsUrl || "#"} target="_blank" rel="noopener noreferrer">
                    <Navigation className="mr-2 h-5 w-5" />
                    Get Directions
                  </a>
                </Button>
                <Button variant="ghost" className="w-full h-12 text-base font-medium text-muted-foreground hover:text-foreground">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Visit Website
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
