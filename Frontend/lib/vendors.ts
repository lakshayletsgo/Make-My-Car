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
}

function normalizeCategory(category: string): VendorView["category"] {
  const normalized = category.toLowerCase()
  if (normalized.includes("insurance")) return "insurance"
  if (normalized.includes("accessor")) return "accessories"
  if (normalized.includes("safety")) return "safety"
  return "service"
}

export function mapApiVendorToView(vendor: ApiVendor): VendorView {
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
    image: vendor.image || "/images/hero-car.jpg",
    slug: vendor.slug,
  }
}
