"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getVendor, type ApiVendor } from "@/lib/api"
import { VendorDetails } from "@/components/vendor/vendor-details"
import { mapApiVendorToView } from "@/lib/vendors"

export default function VendorPage() {
  const routeParams = useParams<{ id: string }>()
  const vendorId = routeParams?.id
  const [vendor, setVendor] = useState<ApiVendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!vendorId) {
      setLoading(false)
      setError("Vendor id not found in route")
      return
    }

    async function loadVendor() {
      try {
        setLoading(true)
        setError("")
        const data = await getVendor(vendorId)
        setVendor(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load vendor")
      } finally {
        setLoading(false)
      }
    }

    loadVendor()
  }, [vendorId])

  if (loading) {
    return <section className="py-12 text-center text-muted-foreground">Loading vendor details...</section>
  }

  if (error || !vendor) {
    return <section className="py-12 text-center text-red-600">{error || "Vendor not found"}</section>
  }

  return <VendorDetails vendor={mapApiVendorToView(vendor)} vendorApi={vendor} />
}
