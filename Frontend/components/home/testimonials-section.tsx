import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Honda City Owner",
    location: "Mumbai",
    rating: 5,
    text: "Found the best insurance deal through Make My Car. Saved over 8,000 rupees compared to what I was paying before. The whole process took just 10 minutes.",
    initials: "RK",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "Priya Sharma",
    role: "Hyundai Creta Owner",
    location: "Delhi",
    rating: 5,
    text: "I was looking for genuine accessories for my Creta. This platform connected me with a verified vendor just 2 km away. Amazing experience!",
    initials: "PS",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "Anil Mehta",
    role: "Maruti Swift Owner",
    location: "Bangalore",
    rating: 5,
    text: "The service center recommendations are spot on. Got my car serviced at a rated workshop for a great price. Highly recommend this platform.",
    initials: "AM",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  {
    name: "Sneha Patel",
    role: "Tata Nexon Owner",
    location: "Hyderabad",
    rating: 5,
    text: "Safety gear shopping was never this easy. Got a dashcam and fire extinguisher from a nearby store recommended by Make My Car. Great quality!",
    initials: "SP",
    bgColor: "bg-indigo-500/10",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Testimonials
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Trusted by Car Owners
          </h2>
          <p className="mt-5 text-pretty text-lg text-muted-foreground leading-relaxed">
            Hear from real car owners who found the best deals and services through our platform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="group relative rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-muted/30" />
              
              {/* Stars */}
              <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-base leading-relaxed text-muted-foreground">
                {`"${testimonial.text}"`}
              </p>
              
              {/* Author */}
              <div className="mt-6 flex items-center gap-4 pt-6 border-t border-border">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold ${testimonial.bgColor} ${testimonial.textColor}`}>
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} &bull; {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
