"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Car, IndianRupee, Loader2, Phone, PlusCircle, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  createMarketplaceListing,
  listMarketplaceListings,
  listMyMarketplaceListings,
  type MarketplaceListing,
} from "@/lib/api"
import { getStoredSession } from "@/lib/auth"

const defaultForm = {
  title: "",
  brand: "",
  model: "",
  variant: "",
  year: String(new Date().getFullYear()),
  fuel_type: "Petrol",
  city: "",
  km_driven: "",
  price: "",
  description: "",
  contact_phone: "",
  image_url: "",
}

export function MarketplaceView() {
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [myListings, setMyListings] = useState<MarketplaceListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [search, setSearch] = useState("")
  const [cityFilter, setCityFilter] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const [formData, setFormData] = useState(defaultForm)

  const session = typeof window !== "undefined" ? getStoredSession() : null
  const canPublish = session?.role === "USER" || session?.role === "ADMIN"

  const marketplaceStats = useMemo(() => {
    const totalValue = listings.reduce((acc, item) => acc + Number(item.price || 0), 0)
    return {
      count: listings.length,
      averagePrice: listings.length > 0 ? Math.round(totalValue / listings.length) : 0,
    }
  }, [listings])

  async function loadListings() {
    try {
      setIsLoading(true)
      setError("")
      const data = await listMarketplaceListings({
        search: search || undefined,
        city: cityFilter || undefined,
        min_price: minPrice ? Number(minPrice) : undefined,
        max_price: maxPrice ? Number(maxPrice) : undefined,
        limit: 80,
      })
      setListings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load marketplace listings")
    } finally {
      setIsLoading(false)
    }
  }

  async function loadMyListings() {
    if (!canPublish) {
      setMyListings([])
      return
    }

    try {
      const rows = await listMyMarketplaceListings()
      setMyListings(rows)
    } catch {
      setMyListings([])
    }
  }

  useEffect(() => {
    loadListings()
    loadMyListings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handlePublish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canPublish) {
      setError("Please login as a user account to publish listings")
      return
    }

    try {
      setIsPublishing(true)
      setError("")
      setSuccess("")
      await createMarketplaceListing({
        title: formData.title,
        brand: formData.brand,
        model: formData.model,
        variant: formData.variant,
        year: Number(formData.year),
        fuel_type: formData.fuel_type,
        city: formData.city,
        km_driven: Number(formData.km_driven),
        price: Number(formData.price),
        description: formData.description,
        contact_phone: formData.contact_phone,
        image_url: formData.image_url || undefined,
      })

      setSuccess("Your car listing is now live in marketplace")
      setFormData(defaultForm)
      await Promise.all([loadListings(), loadMyListings()])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish listing")
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-background py-12 lg:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,hsl(var(--primary)/0.16),transparent_32%),radial-gradient(circle_at_95%_0%,hsl(var(--primary)/0.12),transparent_35%)]" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-8 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-xl backdrop-blur md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Make My Car Marketplace</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">Buy or Sell Cars with Verified Community Users</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Publish your car listing in minutes and connect directly with interested buyers. Looking to purchase? Browse fresh listings and contact sellers instantly.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Live Listings</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{marketplaceStats.count}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Avg Price</p>
              <p className="mt-1 flex items-center text-2xl font-bold text-foreground">
                <IndianRupee className="mr-1 h-5 w-5 text-primary" />
                {marketplaceStats.averagePrice.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-lg">
              <h2 className="text-xl font-semibold text-foreground">Find Cars to Buy</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search model, brand"
                  className="md:col-span-2"
                />
                <Input
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  placeholder="City"
                />
                <Button onClick={loadListings} className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <Input
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min Price"
                  type="number"
                />
                <Input
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max Price"
                  type="number"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground">
                <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                <p className="mt-3">Loading marketplace listings...</p>
              </div>
            ) : null}

            {!isLoading && listings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
                <Car className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-muted-foreground">No listings found for the selected filters.</p>
              </div>
            ) : null}

            {!isLoading && listings.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {listings.map((listing) => (
                  <article key={listing.id} className="group rounded-3xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl">
                    <div className="aspect-16/10 overflow-hidden rounded-2xl bg-muted">
                      {listing.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={listing.image_url} alt={listing.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">No image available</div>
                      )}
                    </div>

                    <div className="mt-4 space-y-2">
                      <h3 className="line-clamp-1 text-lg font-semibold text-foreground">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {listing.brand} {listing.model} {listing.variant} • {listing.year}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {listing.fuel_type} • {listing.km_driven.toLocaleString("en-IN")} km • {listing.city}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="flex items-center text-xl font-bold text-foreground">
                        <IndianRupee className="h-5 w-5 text-primary" />
                        {Number(listing.price).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(listing.created_at).toLocaleDateString()}</p>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{listing.description}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        <User className="mr-1 h-3 w-3" />
                        {listing.seller_name || "Seller"}
                      </span>
                      <a href={`tel:${listing.contact_phone}`} className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-foreground transition hover:bg-muted">
                        <Phone className="mr-1 h-3 w-3" />
                        {listing.contact_phone}
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-lg">
              <h2 className="flex items-center text-xl font-semibold text-foreground">
                <PlusCircle className="mr-2 h-5 w-5 text-primary" />
                Sell Your Car
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">Create your listing and buyers can contact you directly.</p>

              {!session ? (
                <div className="mt-4 rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  Sign in to publish a listing.
                  <div className="mt-3">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/auth">Go to Login</Link>
                    </Button>
                  </div>
                </div>
              ) : null}

              {session && !canPublish ? (
                <div className="mt-4 rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  Your role cannot publish listings. Please use a user account.
                </div>
              ) : null}

              {canPublish ? (
                <form onSubmit={handlePublish} className="mt-4 space-y-3">
                  <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Listing title" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input required value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} placeholder="Brand" />
                    <Input required value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} placeholder="Model" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input required value={formData.variant} onChange={(e) => setFormData({ ...formData, variant: e.target.value })} placeholder="Variant" />
                    <Input required value={formData.fuel_type} onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })} placeholder="Fuel Type" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input required value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} placeholder="Year" type="number" />
                    <Input required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="City" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input required value={formData.km_driven} onChange={(e) => setFormData({ ...formData, km_driven: e.target.value })} placeholder="KM Driven" type="number" />
                    <Input required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Price" type="number" />
                  </div>
                  <Input required value={formData.contact_phone} onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })} placeholder="Contact Phone" />
                  <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="Image URL (optional)" />
                  <Textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Describe your car condition, service history, owners, insurance details"
                  />

                  {error ? <p className="text-sm text-red-600">{error}</p> : null}
                  {success ? <p className="text-sm text-green-600">{success}</p> : null}

                  <Button type="submit" disabled={isPublishing} className="w-full">
                    {isPublishing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...
                      </>
                    ) : (
                      "Publish Listing"
                    )}
                  </Button>
                </form>
              ) : null}
            </div>

            {canPublish ? (
              <div className="rounded-3xl border border-border bg-card p-5 shadow-lg">
                <h3 className="text-lg font-semibold text-foreground">My Listings</h3>
                {myListings.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">You have not published any listing yet.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {myListings.slice(0, 5).map((item) => (
                      <div key={item.id} className="rounded-xl border border-border bg-background p-3">
                        <p className="text-sm font-semibold text-foreground line-clamp-1">{item.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.city} • {item.status} • INR {Number(item.price).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
