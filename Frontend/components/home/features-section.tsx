import { Shield, Wrench, ShieldCheck, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Shield,
    title: "Best Insurance Deals",
    description:
      "Compare policies from top providers and find coverage that fits your budget and needs.",
    stat: "Save up to 30%",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    borderColor: "group-hover:border-blue-500/30",
  },
  {
    icon: Wrench,
    title: "Trusted Nearby Accessories",
    description:
      "Genuine parts, premium upgrades, and custom accessories from verified local vendors.",
    stat: "200+ Products",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    borderColor: "group-hover:border-emerald-500/30",
  },
  {
    icon: ShieldCheck,
    title: "Safety Gear & Services",
    description:
      "Dashcams, fire extinguishers, first-aid kits, and safety inspections from rated providers.",
    stat: "Top Rated",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    borderColor: "group-hover:border-amber-500/30",
  },
  {
    icon: MapPin,
    title: "Service Centers Near You",
    description:
      "Regular maintenance, repairs, and detailing from trusted workshops in your area.",
    stat: "Within 5 km",
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    borderColor: "group-hover:border-indigo-500/30",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            What We Offer
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Everything in One Place
          </h2>
          <p className="mt-5 text-pretty text-lg text-muted-foreground leading-relaxed">
            From insurance to accessories, we bring the best car services near you with transparent
            pricing and real ratings.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Link
              href="/recommendations"
              key={feature.title}
              className={`group relative rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 ${feature.borderColor}`}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${feature.color}`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-serif text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${feature.color}`}>
                  {feature.stat}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
