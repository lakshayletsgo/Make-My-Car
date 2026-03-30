"use client"

import { useEffect, useState } from "react"
import { createVendorByAdmin, getAdminOverview, listCities, resolveGoogleMapsLinkByAdmin, uploadVendorBannersByAdmin, type AdminAnalyticsOverview, type City } from "@/lib/api"
import { extractLatLngFromGoogleMapsLink, normalizeGoogleMapsInput } from "@/lib/map-helpers"

const categories = ["INSURANCE", "ACCESSORIES", "SAFETY", "SERVICE"]
const fallbackCities: City[] = [
  { id: "delhi", name: "Delhi", state: "Delhi" },
  { id: "gurugram", name: "Gurugram", state: "Haryana" },
]

type VendorForm = {
  name: string
  email: string
  phone: string
  password: string
  slug: string
  description: string
  category: string
  price_range: string
  address: string
  gmaps_link: string
  city_id: string
  website: string
}

const initialForm: VendorForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  slug: "",
  description: "",
  category: "SERVICE",
  price_range: "",
  address: "",
  gmaps_link: "",
  city_id: "",
  website: "",
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|webm|m4v|avi|mkv)(\?.*)?$/i.test(url)
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminAnalyticsOverview | null>(null)
  const [cities, setCities] = useState<City[]>([])
  const [form, setForm] = useState<VendorForm>(initialForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [bannerFiles, setBannerFiles] = useState<File[]>([])
  const availableCities = cities.length > 0 ? cities : fallbackCities

  async function loadData() {
    try {
      setLoading(true)
      setError("")
      const [overviewData, cityData] = await Promise.all([getAdminOverview(), listCities()])
      setOverview(overviewData)
      setCities(cityData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin dashboard")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    try {
      setSubmitting(true)
      setMessage("")
      setError("")

      const normalizedDescription = form.description.trim()
      if (normalizedDescription.length < 10) {
        throw new Error("Description must be at least 10 characters.")
      }

      const normalizedMapsLink = normalizeGoogleMapsInput(form.gmaps_link)
      if (!normalizedMapsLink) {
        throw new Error("Please provide a valid Google Maps location link.")
      }

      let coordinates = extractLatLngFromGoogleMapsLink(normalizedMapsLink)
      if (!coordinates) {
        const resolved = await resolveGoogleMapsLinkByAdmin(normalizedMapsLink)
        coordinates = { latitude: resolved.latitude, longitude: resolved.longitude }
      }

      let bannerUrls: string[] = []
      if (bannerFiles.length > 0) {
        const uploadResult = await uploadVendorBannersByAdmin(bannerFiles)
        bannerUrls = uploadResult.urls || []
      }

      const primaryImage = bannerUrls.find((url) => !isVideoUrl(url)) || bannerUrls[0]

      const response = await createVendorByAdmin({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password || undefined,
        slug: form.slug,
        description: normalizedDescription,
        category: form.category,
        price_range: form.price_range,
        address: form.address,
        location: normalizedMapsLink,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        city_id: form.city_id,
        website: form.website || undefined,
        image: primaryImage || undefined,
        gallery: bannerUrls,
      })

      setMessage(
        `Vendor created. Vendor ID: ${response.vendor_id}. Temporary password: ${response.temporary_password || "custom password"}`
      )
      setForm(initialForm)
      setBannerFiles([])
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create vendor")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-linear-to-b from-muted/50 via-background to-background py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Create vendor accounts and monitor platform analytics.</p>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}

        <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-7">
          <StatCard title="Users" value={overview?.total_users ?? 0} loading={loading} />
          <StatCard title="Vendors" value={overview?.total_vendors ?? 0} loading={loading} />
          <StatCard title="Active Vendors" value={overview?.active_vendors ?? 0} loading={loading} />
          <StatCard title="Verified Vendors" value={overview?.verified_vendors ?? 0} loading={loading} />
          <StatCard title="Bookings" value={overview?.total_bookings ?? 0} loading={loading} />
          <StatCard title="Completed" value={overview?.completed_bookings ?? 0} loading={loading} />
          <StatCard title="Cancelled" value={overview?.cancelled_bookings ?? 0} loading={loading} />
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-foreground">Add Vendor</h2>
          <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <InputField label="Vendor Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
            <InputField label="Vendor Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} required />
            <InputField label="Phone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
            <InputField label="Temporary Password (optional)" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} />
            <InputField label="Slug" value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} required />
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Category</label>
              <select
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <InputField label="Price Range" value={form.price_range} onChange={(value) => setForm({ ...form, price_range: value })} required />
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">City</label>
              <select
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                required
                value={form.city_id}
                onChange={(event) => setForm({ ...form, city_id: event.target.value })}
              >
                <option value="">Select City</option>
                {availableCities.map((city) => (
                  <option key={city.id} value={city.id}>{city.name}, {city.state}</option>
                ))}
              </select>
            </div>
            <InputField label="Address" className="md:col-span-2" value={form.address} onChange={(value) => setForm({ ...form, address: value })} required />
            <InputField
              label="Google Maps Link"
              className="md:col-span-2"
              value={form.gmaps_link}
              onChange={(value) => setForm({ ...form, gmaps_link: value })}
              required
            />
            <InputField label="Website" value={form.website} onChange={(value) => setForm({ ...form, website: value })} />
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Banner Media (Images/Videos)</label>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(event) => setBannerFiles(Array.from(event.target.files || []))}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Files are uploaded to Supabase bucket "Banners" and shown on vendor banner.
              </p>
              {bannerFiles.length > 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">Selected: {bannerFiles.map((file) => file.name).join(", ")}</p>
              ) : null}
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Description</label>
              <textarea
                className="h-28 w-full rounded-lg border border-border bg-background px-3 py-2"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                required
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {submitting ? "Creating Vendor..." : "Create Vendor Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

function StatCard({ title, value, loading }: { title: string; value: number; loading: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{loading ? "..." : value}</p>
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
  required,
  type = "text",
  className = "",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  type?: string
  className?: string
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-foreground">{label}</label>
      <input
        className="w-full rounded-lg border border-border bg-background px-3 py-2"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        required={required}
      />
    </div>
  )
}
