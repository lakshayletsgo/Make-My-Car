import { CarSetupForm } from "@/components/setup/car-setup-form"

export const metadata = {
  title: "Add Your Car — Make My Car",
  description: "Set up your car profile to get personalized recommendations for insurance, accessories, and services.",
}

export default function SetupPage() {
  return (
    <section className="bg-linear-to-b from-muted/50 via-background to-background py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Car Profile
          </p>
          <h1 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Add Your Car
          </h1>
          <p className="mt-5 text-pretty text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Tell us about your car to receive personalized recommendations for insurance, accessories,
            safety gear, and nearby service centers.
          </p>
        </div>

        <CarSetupForm />
      </div>
    </section>
  )
}
