"use client"

import { useEffect, useState } from "react"
import {
  getVendorSummary,
  listVendorBookings,
  updateVendorBookingStatus,
  type Booking,
  type VendorDashboardSummary,
} from "@/lib/api"

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]

export default function VendorDashboardPage() {
  const [summary, setSummary] = useState<VendorDashboardSummary | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null)

  async function loadData() {
    try {
      setLoading(true)
      setError("")
      const [summaryData, bookingData] = await Promise.all([getVendorSummary(), listVendorBookings()])
      setSummary(summaryData)
      setBookings(bookingData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load vendor dashboard")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function onStatusChange(bookingId: string, nextStatus: string) {
    try {
      setUpdatingBookingId(bookingId)
      await updateVendorBookingStatus(bookingId, nextStatus)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update booking")
    } finally {
      setUpdatingBookingId(null)
    }
  }

  return (
    <section className="bg-linear-to-b from-muted/50 via-background to-background py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Vendor Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Manage customer bookings and update slot statuses.</p>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          <StatCard title="Total" value={summary?.total_bookings ?? 0} />
          <StatCard title="Pending" value={summary?.pending_bookings ?? 0} />
          <StatCard title="Confirmed" value={summary?.confirmed_bookings ?? 0} />
          <StatCard title="Completed" value={summary?.completed_bookings ?? 0} />
          <StatCard title="Cancelled" value={summary?.cancelled_bookings ?? 0} />
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-foreground">Booked Slots</h2>
          {loading ? <p className="mt-4 text-sm text-muted-foreground">Loading bookings...</p> : null}

          {!loading && bookings.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No bookings yet.</p>
          ) : null}

          {!loading && bookings.length > 0 ? (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-215 text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Slot</th>
                    <th className="pb-3">Notes</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-border/60">
                      <td className="py-3 font-medium text-foreground">{booking.user_name || booking.user_id}</td>
                      <td className="py-3 text-muted-foreground">{booking.user_email || "-"}</td>
                      <td className="py-3 text-muted-foreground">{new Date(booking.slot_at).toLocaleString()}</td>
                      <td className="py-3 text-muted-foreground">{booking.notes || "-"}</td>
                      <td className="py-3">
                        <select
                          className="rounded-lg border border-border bg-background px-2 py-1"
                          disabled={updatingBookingId === booking.id}
                          value={booking.status}
                          onChange={(event) => onStatusChange(booking.id, event.target.value)}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
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

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}
