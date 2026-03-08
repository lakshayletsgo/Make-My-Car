import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, ShieldCheck, ArrowRight } from "lucide-react"
import type { Vendor } from "@/lib/vendor-data"

export function VendorCard({ vendor }: { vendor: Vendor }) {
  const categoryColors: Record<string, string> = {
    insurance: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    accessories: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    safety: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    service: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  }

  return (
    <div className="group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-muted">
        <Image
          src={vendor.image}
          alt={vendor.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
          <Badge className={`border ${categoryColors[vendor.category]} text-xs font-medium`}>
            {vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)}
          </Badge>
          {vendor.verified && (
            <Badge className="border border-primary/20 bg-primary/10 text-primary text-xs font-medium">
              <ShieldCheck className="mr-1 h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {vendor.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {vendor.description}
        </p>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-foreground">{vendor.rating}</span>
            <span className="text-xs text-muted-foreground">({vendor.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{vendor.distance}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="mt-5 flex items-center justify-between pt-5 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Price Range</p>
            <p className="text-sm font-semibold text-foreground">{vendor.priceRange}</p>
          </div>
          <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20">
            <Link href={`/vendor/${vendor.id}`}>
              View Details
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
