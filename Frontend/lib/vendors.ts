import type { ApiVendor } from "@/lib/api"

export type VendorView = {
  id: string
  name: string
  category: "insurance" | "accessories" | "safety" | "service"
  description: string
  priceRange: string
  distance: string
  rating: number
  reviewCount: number
  location: string
  verified: boolean
  products: string[]
  image: string
  slug: string
  latitude: number | null
  longitude: number | null
}

function normalizeCoordinate(value: number, min: number, max: number): number | null {
  if (!Number.isFinite(value)) return null
  if (value < min || value > max) return null
  return value
}

function normalizeCategory(category: string): VendorView["category"] {
  const normalized = category.toLowerCase()
  if (normalized.includes("insurance")) return "insurance"
  if (normalized.includes("accessor")) return "accessories"
  if (normalized.includes("safety")) return "safety"
  return "service"
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|webm|m4v|avi|mkv)(\?.*)?$/i.test(url)
}

export function mapApiVendorToView(vendor: ApiVendor): VendorView {
  const latitude = normalizeCoordinate(vendor.latitude, -90, 90)
  const longitude = normalizeCoordinate(vendor.longitude, -180, 180)
  const mediaCandidates = [vendor.image, ...(vendor.gallery || [])].filter(Boolean) as string[]
  const displayImage = mediaCandidates.find((url) => !isVideoUrl(url)) || "/images/hero-car.jpg"

  return {
    id: vendor.id,
    name: vendor.name,
    category: normalizeCategory(vendor.category),
    description: vendor.description,
    priceRange: vendor.price_range,
    distance: "Nearby",
    rating: vendor.rating,
    reviewCount: vendor.review_count,
    location: vendor.address,
    verified: vendor.is_verified,
    products: (vendor.products || []).map((product) => product.name),
    image: displayImage,
    slug: vendor.slug,
    latitude,
    longitude,
  }
}
