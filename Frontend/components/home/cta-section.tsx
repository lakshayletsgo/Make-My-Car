import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Car, CheckCircle2 } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-10 md:p-16 lg:p-20">
          {/* Background decorations */}
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-8">
              <Car className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-balance font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Ready to Get Started?
            </h2>
            
            <p className="mt-5 max-w-xl text-pretty text-lg text-white/80 leading-relaxed">
              Add your car profile in under 2 minutes and unlock personalized recommendations for
              insurance, accessories, and more.
            </p>

            {/* Benefits */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Free to use</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">No signup required</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Instant recommendations</span>
              </div>
            </div>
            
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-14 bg-white px-10 text-primary hover:bg-white/90 text-base font-semibold shadow-xl">
                <Link href="/add-car">
                  Add Your Car Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-10 border-white/30 bg-white/10 text-white hover:bg-white/20 text-base font-semibold backdrop-blur-sm">
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
