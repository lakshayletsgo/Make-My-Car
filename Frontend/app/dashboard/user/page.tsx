"use client"

import { useEffect, useState } from "react"
import { listMyBookings, type Booking } from "@/lib/api"
import { getStoredSession } from "@/lib/auth"

export default function UserDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError("")
        const data = await listMyBookings()
        setBookings(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bookings")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const session = typeof window !== "undefined" ? getStoredSession() : null

  return (
    <section className="bg-linear-to-b from-muted/50 via-background to-background py-10 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">User Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome {session?.name || "User"}. Manage your bookings and track slot status.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-foreground">My Bookings</h2>
          {loading ? <p className="mt-4 text-sm text-muted-foreground">Loading bookings...</p> : null}
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

          {!loading && !error && bookings.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No bookings yet. Visit recommendations and book a slot.</p>
          ) : null}

          {!loading && !error && bookings.length > 0 ? (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-160 text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3">Vendor</th>
                    <th className="pb-3">Slot</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-border/60">
                      <td className="py-3 font-medium text-foreground">{booking.vendor_name || booking.vendor_id}</td>
                      <td className="py-3 text-muted-foreground">{new Date(booking.slot_at).toLocaleString()}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground">{booking.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
