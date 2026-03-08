"use client"

import Image from "next/image"
import Link from "next/link"
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
import type { Vendor } from "@/lib/vendor-data"

const reviews = [
  {
    name: "Amit Singh",
    rating: 5,
    date: "2 weeks ago",
    text: "Excellent service! The team was professional, pricing was transparent, and the work was done on time. Highly recommended.",
    initials: "AS",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "Meera Joshi",
    rating: 4,
    date: "1 month ago",
    text: "Good experience overall. The quality was great, but had to wait a bit longer than expected. Would still visit again.",
    initials: "MJ",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "Vikram Rao",
    rating: 5,
    date: "1 month ago",
    text: "Best in the area! Fair prices and the staff really knows their stuff. Got exactly what I needed for my car.",
    initials: "VR",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  {
    name: "Sunita Pillai",
    rating: 4,
    date: "2 months ago",
    text: "Professional and courteous service. The shop is clean and well-organized. Pricing could be slightly more competitive.",
    initials: "SP",
    bgColor: "bg-indigo-500/10",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
]

export function VendorDetails({ vendor }: { vendor: Vendor }) {
  const categoryLabel = vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)

  const categoryColors: Record<string, string> = {
    insurance: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    accessories: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    safety: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    service: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  }

  return (
    <section className="bg-gradient-to-b from-muted/50 via-background to-background py-8 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {/* Back button */}
        <Link
          href="/recommendations"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Recommendations
        </Link>

        {/* Hero Image */}
        <div className="relative h-64 md:h-80 lg:h-96 rounded-3xl overflow-hidden mb-10 shadow-xl">
          <Image
            src={vendor.image}
            alt={vendor.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute bottom-6 left-6 flex items-center gap-3">
            <Badge className={`border ${categoryColors[vendor.category]} text-sm px-4 py-1.5 font-medium`}>
              {categoryLabel}
            </Badge>
            {vendor.verified && (
              <Badge className="border border-primary/20 bg-primary text-primary-foreground text-sm px-4 py-1.5 font-medium">
                <ShieldCheck className="mr-1.5 h-4 w-4" />
                Verified Partner
              </Badge>
            )}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Vendor Header */}
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

            {/* Products & Services */}
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

            {/* Reviews */}
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
                {reviews.map((review) => (
                  <div
                    key={review.name}
                    className="rounded-xl border border-border bg-muted/20 p-5 transition-all hover:border-primary/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold ${review.bgColor} ${review.textColor}`}>
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

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Pricing Card */}
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

              {/* CTAs */}
              <div className="mt-6 flex flex-col gap-3">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium shadow-lg shadow-primary/25">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Vendor
                </Button>
                <Button variant="outline" className="w-full border-border hover:bg-muted h-12 text-base font-medium">
                  <Navigation className="mr-2 h-5 w-5" />
                  Get Directions
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
