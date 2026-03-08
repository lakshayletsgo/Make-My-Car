import { RecommendationsView } from "@/components/recommendations/recommendations-view"

export const metadata = {
  title: "Recommendations — Make My Car",
  description: "Browse recommended insurance, accessories, safety gear, and service centers near you.",
}

export default function RecommendationsPage() {
  return (
    <section className="bg-gradient-to-b from-muted/50 via-background to-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Personalized For You
          </p>
          <h1 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Your Recommendations
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
            Showing the best vendors and services based on your car profile and location.
            Filter by category, price, distance, or rating.
          </p>
        </div>

        <RecommendationsView />
      </div>
    </section>
  )
}
