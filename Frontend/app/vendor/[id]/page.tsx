import { vendors } from "@/lib/vendor-data"
import { VendorDetails } from "@/components/vendor/vendor-details"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return vendors.map((vendor) => ({ id: vendor.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const vendor = vendors.find((v) => v.id === id)
  if (!vendor) return { title: "Vendor Not Found" }
  return {
    title: `${vendor.name} — Make My Car`,
    description: vendor.description,
  }
}

export default async function VendorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const vendor = vendors.find((v) => v.id === id)

  if (!vendor) {
    notFound()
  }

  return <VendorDetails vendor={vendor} />
}
