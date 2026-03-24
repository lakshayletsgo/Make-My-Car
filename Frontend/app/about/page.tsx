import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Target, Eye, Heart, MapPin, ShieldCheck, Zap, Sparkles } from "lucide-react"

export const metadata = {
  title: "About — Make My Car",
  description: "Learn about Make My Car's mission to help car owners save time and money by recommending the best services near them.",
}

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description: "Every vendor is verified and every review is authentic. We show real prices with no hidden charges.",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    icon: MapPin,
    title: "Hyper-Local Focus",
    description: "Recommendations are tailored to your exact location, showing only the most relevant nearby options.",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Zap,
    title: "Speed & Simplicity",
    description: "Get personalized recommendations in under 2 minutes. No complex sign-ups or lengthy processes.",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: Heart,
    title: "Car Owner First",
    description: "Every feature is built with the car owner in mind. We optimize for your time, budget, and satisfaction.",
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
]

const stats = [
  { value: "10,000+", label: "Car Owners Served" },
  { value: "500+", label: "Verified Vendors" },
  { value: "50+", label: "Cities Covered" },
  { value: "4.8", label: "Average Rating" },
]

const teamMembers = [
  { name: "Arjun Patel", role: "Founder & CEO", initials: "AP", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { name: "Kavya Sharma", role: "Head of Product", initials: "KS", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { name: "Rohan Desai", role: "CTO", initials: "RD", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { name: "Nisha Gupta", role: "Head of Partnerships", initials: "NG", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 via-background to-background py-20 lg:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                About Us
              </p>
              <h1 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                Helping Car Owners Make Smarter Choices
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Make My Car was born from a simple frustration: finding reliable, affordable car
                services shouldn&apos;t be so hard. We built a platform that connects car owners with
                the best vendors near them — transparently, quickly, and at the best prices.
              </p>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Whether you&apos;re looking for insurance, accessories, safety gear, or a trusted
                service center, we&apos;ve got you covered. Our mission is to save every car owner
                time and money, one recommendation at a time.
              </p>
              <Button asChild className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base shadow-lg shadow-primary/25">
                <Link href="/add-car">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative h-80 lg:h-[480px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/about-team.jpg"
                alt="Professional automotive service center"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-border" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-card py-16 lg:py-20 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-primary md:text-5xl">{stat.value}</p>
                <p className="mt-2 text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-8 lg:p-10 shadow-lg hover:shadow-xl transition-shadow hover:border-primary/20">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground">Our Mission</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                To empower every car owner with instant access to the best, most affordable, and
                most trusted car services in their locality. We eliminate the guesswork and help
                you make informed decisions — saving you time, money, and hassle.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-8 lg:p-10 shadow-lg hover:shadow-xl transition-shadow hover:border-primary/20">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                <Eye className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground">Our Vision</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                To become India&apos;s most trusted platform for car-related services, where every
                car owner finds exactly what they need within minutes. We envision a future where
                quality car care is accessible, transparent, and just a few taps away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              What Drives Us
            </p>
            <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Our Core Values
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-border bg-card p-7 shadow-lg transition-all hover:shadow-xl hover:border-primary/20"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${value.color}`}>
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-serif text-lg font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              The People Behind
            </p>
            <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Our Team
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              A passionate team of automotive enthusiasts and tech builders on a mission to make car
              ownership simpler.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-lg transition-all hover:shadow-xl hover:border-primary/20"
              >
                <div className={`flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold ${member.color}`}>
                  {member.initials}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="mt-1 text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-10 md:p-16 lg:p-20">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            
            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-8">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-balance font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                Ready to Find the Best for Your Car?
              </h2>
              <p className="mt-5 max-w-xl text-lg text-white/80 leading-relaxed">
                Join thousands of car owners who trust Make My Car for their insurance, accessories,
                and service needs.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="h-14 bg-white px-10 text-primary hover:bg-white/90 text-base font-semibold shadow-xl">
                  <Link href="/add-car">
                    Add Your Car
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-10 border-white/30 bg-white/10 text-white hover:bg-white/20 text-base font-semibold backdrop-blur-sm">
                  <Link href="/recommendations">
                    Browse Recommendations
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
