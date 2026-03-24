"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Star, Users, CheckCircle2 } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 via-background to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col">
            {/* Badge */}
            <Badge variant="outline" className="w-fit mb-6 border-primary/30 bg-primary/5 text-primary px-4 py-1.5">
              <Star className="mr-1.5 h-3.5 w-3.5 fill-primary" />
              Trusted by 10,000+ Car Owners
            </Badge>

            {/* Headline */}
            <h1 className="text-balance font-serif text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Everything Your Car Needs — 
              <span className="text-primary"> Near You</span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
              Discover the best insurance deals, trusted accessories, safety gear, and service centers
              — all personalized to your car and location.
            </p>

            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Verified Vendors</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Best Prices</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Real Reviews</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base font-medium shadow-lg shadow-primary/25">
                <Link href="/recommendations">
                  Get Recommendations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-medium border-border hover:bg-muted">
                <Link href="/add-car">
                  Add Your Car
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">10K+</p>
                  <p className="text-xs text-muted-foreground">Happy Users</p>
                </div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">500+</p>
                  <p className="text-xs text-muted-foreground">Verified Vendors</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-primary/10">
              <Image
                src="/images/hero-car.jpg"
                alt="Premium car services"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 rounded-2xl border border-border bg-card p-4 shadow-xl md:p-5">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 ring-2 ring-card flex items-center justify-center text-xs font-semibold text-primary">A</div>
                  <div className="h-8 w-8 rounded-full bg-emerald-500/20 ring-2 ring-card flex items-center justify-center text-xs font-semibold text-emerald-600">R</div>
                  <div className="h-8 w-8 rounded-full bg-amber-500/20 ring-2 ring-card flex items-center justify-center text-xs font-semibold text-amber-600">P</div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Trusted Community</p>
                  <p className="text-xs text-muted-foreground">Join 10K+ car owners</p>
                </div>
              </div>
            </div>

            {/* Rating Card */}
            <div className="absolute -top-4 -right-4 rounded-2xl border border-border bg-card p-4 shadow-xl md:right-8 md:top-8">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">4.9</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Based on 2,500+ reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
