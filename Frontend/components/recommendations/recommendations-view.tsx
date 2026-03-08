"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { VendorCard } from "@/components/recommendations/vendor-card"
import { MapView } from "@/components/recommendations/map-view"
import { Shield, Wrench, ShieldCheck, Settings, SlidersHorizontal, Map, LayoutGrid, X, Search } from "lucide-react"
import { vendors } from "@/lib/vendor-data"

const categories = [
  { value: "all", label: "All Services", icon: LayoutGrid },
  { value: "insurance", label: "Insurance", icon: Shield },
  { value: "accessories", label: "Accessories", icon: Wrench },
  { value: "safety", label: "Safety Gear", icon: ShieldCheck },
  { value: "service", label: "Service Centers", icon: Settings },
]

export function RecommendationsView() {
  const [activeTab, setActiveTab] = useState("all")
  const [showMap, setShowMap] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [maxDistance, setMaxDistance] = useState([10])
  const [minRating, setMinRating] = useState([0])

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      if (activeTab !== "all" && v.category !== activeTab) return false
      const dist = parseFloat(v.distance)
      if (dist > maxDistance[0]) return false
      if (v.rating < minRating[0]) return false
      return true
    })
  }, [activeTab, maxDistance, minRating])

  const resetFilters = () => {
    setActiveTab("all")
    setMaxDistance([10])
    setMinRating([0])
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
          <TabsList className="h-auto flex-wrap bg-muted/50 p-1.5 rounded-xl">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
              >
                <cat.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* View & Filter Toggles */}
        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-primary text-primary-foreground shadow-md" : "border-border hover:bg-muted"}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button
            variant={showMap ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMap(!showMap)}
            className={showMap ? "bg-primary text-primary-foreground shadow-md" : "border-border hover:bg-muted"}
          >
            <Map className="mr-2 h-4 w-4" />
            Map View
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              Filter Results
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <label className="mb-4 flex items-center justify-between text-sm font-medium text-muted-foreground">
                Maximum Distance
                <span className="text-foreground font-semibold">{maxDistance[0]} km</span>
              </label>
              <Slider
                value={maxDistance}
                onValueChange={setMaxDistance}
                max={20}
                min={1}
                step={0.5}
                className="py-2"
              />
            </div>
            <div>
              <label className="mb-4 flex items-center justify-between text-sm font-medium text-muted-foreground">
                Minimum Rating
                <span className="text-foreground font-semibold">{minRating[0]} stars</span>
              </label>
              <Slider
                value={minRating}
                onValueChange={setMinRating}
                max={5}
                min={0}
                step={0.5}
                className="py-2"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="outline" size="sm" onClick={resetFilters} className="border-border hover:bg-muted">
              Reset All
            </Button>
          </div>
        </div>
      )}

      {/* Map View */}
      {showMap && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <MapView vendors={filteredVendors} />
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredVendors.length}</span> results
          {activeTab !== "all" && (
            <span> in <span className="text-primary font-medium">{categories.find(c => c.value === activeTab)?.label}</span></span>
          )}
        </p>
        {(activeTab !== "all" || maxDistance[0] !== 10 || minRating[0] !== 0) && (
          <Badge 
            variant="outline" 
            className="border-primary/30 text-primary cursor-pointer hover:bg-primary/10" 
            onClick={resetFilters}
          >
            Clear all filters
            <X className="ml-1.5 h-3 w-3" />
          </Badge>
        )}
      </div>

      {/* Vendor Grid */}
      {filteredVendors.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-card py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="font-serif text-xl font-semibold text-foreground">No Results Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or category.</p>
          </div>
          <Button
            variant="outline"
            onClick={resetFilters}
            className="border-border hover:bg-muted"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  )
}
