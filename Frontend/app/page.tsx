import { CTASection } from "@/components/home/cta-section"
import { FeaturesSection } from "@/components/home/features-section"
import { HeroSection } from "@/components/home/hero-section"
import { SearchSection } from "@/components/home/search-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
