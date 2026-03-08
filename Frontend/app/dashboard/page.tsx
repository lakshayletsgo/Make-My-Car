import {
  Users,
  Store,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  MapPin,
  Star,
  BarChart3,
  Activity,
  Calendar,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Dashboard — Make My Car",
  description: "Admin dashboard for managing vendors, analytics, and platform performance.",
}

const statsCards = [
  {
    title: "Total Users",
    value: "10,482",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "vs last month",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Active Vendors",
    value: "524",
    change: "+8.2%",
    trend: "up",
    icon: Store,
    description: "vs last month",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Verified Listings",
    value: "1,847",
    change: "+23.1%",
    trend: "up",
    icon: ShieldCheck,
    description: "vs last month",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    title: "Recommendations",
    value: "42,690",
    change: "+15.8%",
    trend: "up",
    icon: TrendingUp,
    description: "total served",
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
]

const recentVendors = [
  { name: "ProMech Auto Care", category: "Service", location: "Mumbai", status: "Verified", rating: 4.7 },
  { name: "AutoStyle Hub", category: "Accessories", location: "Mumbai", status: "Verified", rating: 4.6 },
  { name: "SafeDrive Store", category: "Safety", location: "Mumbai", status: "Pending", rating: 4.8 },
  { name: "DriveGuard Policies", category: "Insurance", location: "Delhi", status: "Verified", rating: 4.5 },
  { name: "Elite Car Spa", category: "Service", location: "Mumbai", status: "Verified", rating: 4.9 },
  { name: "QuickFit Accessories", category: "Accessories", location: "Pune", status: "Pending", rating: 4.4 },
]

const topCities = [
  { city: "Mumbai", vendors: 156, users: 3240, percentage: 100 },
  { city: "Delhi", vendors: 124, users: 2810, percentage: 84 },
  { city: "Bangalore", vendors: 98, users: 1920, percentage: 63 },
  { city: "Hyderabad", vendors: 72, users: 1340, percentage: 46 },
  { city: "Chennai", vendors: 54, users: 890, percentage: 35 },
]

const recentActivity = [
  { action: "New vendor registered", detail: "SpeedFix Garage — Malad, Mumbai", time: "2 min ago", color: "bg-blue-500" },
  { action: "Review submitted", detail: "4.5 stars for ProMech Auto Care", time: "15 min ago", color: "bg-amber-500" },
  { action: "Car profile created", detail: "Hyundai Creta, Petrol — Delhi", time: "32 min ago", color: "bg-emerald-500" },
  { action: "Vendor verified", detail: "SafeDrive Store approved", time: "1 hour ago", color: "bg-indigo-500" },
  { action: "New user signup", detail: "user@example.com from Bangalore", time: "2 hours ago", color: "bg-blue-500" },
]

export default function DashboardPage() {
  return (
    <section className="bg-gradient-to-b from-muted/50 via-background to-background py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Dashboard</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Platform overview and management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1">
              <Activity className="mr-1.5 h-3.5 w-3.5" />
              Live
            </Badge>
            <Button variant="outline" size="sm" className="border-border hover:bg-muted">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 days
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25">
              <BarChart3 className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-10">
          {statsCards.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-lg transition-all hover:shadow-xl hover:border-primary/20"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {stat.change}
                </div>
              </div>
              <p className="mt-5 text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.title}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Vendors Table */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="font-serif text-xl font-semibold text-foreground">Recent Vendors</h2>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vendor</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVendors.map((vendor) => (
                    <tr key={vendor.name} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-foreground">{vendor.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-muted-foreground">{vendor.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {vendor.location}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`text-xs font-medium ${
                            vendor.status === "Verified"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {vendor.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {vendor.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Top Cities */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-5">Top Cities</h3>
              <div className="flex flex-col gap-4">
                {topCities.map((city) => (
                  <div key={city.city}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{city.city}</span>
                      <span className="text-sm text-muted-foreground">{city.vendors} vendors</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-2.5 rounded-full bg-primary transition-all"
                        style={{ width: `${city.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-5">Recent Activity</h3>
              <div className="flex flex-col gap-4">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.color}`} />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.action}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.detail}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
