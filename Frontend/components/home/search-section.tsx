"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MapPin, Search, Sparkles } from "lucide-react"

const popularCities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune"]

export function SearchSection() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [serviceType, setServiceType] = useState("")

  const handleSearch = () => {
    router.push(`/recommendations${serviceType ? `?tab=${serviceType}` : ""}`)
  }

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Section Header */}
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-5">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
              Find Services Near You
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground leading-relaxed">
              Enter your city or area to discover the best car services nearby.
            </p>
          </div>

          {/* Search Form */}
          <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-xl shadow-primary/5 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter your city or area..."
                  className="h-14 border-border bg-background pl-12 text-base placeholder:text-muted-foreground focus-visible:ring-primary"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger className="h-14 w-full border-border bg-background text-base md:w-[200px]">
                  <SelectValue placeholder="Service type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="safety">Safety Gear</SelectItem>
                  <SelectItem value="service">Service Centers</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleSearch}
                className="h-14 bg-primary px-8 text-base font-medium text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>

            {/* Popular Locations */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Popular cities:</span>
              {popularCities.map((city) => (
                <button
                  key={city}
                  onClick={() => setLocation(city)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                    location === city
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
