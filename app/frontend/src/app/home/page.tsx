import { HeroSection } from "@/app/home/(components)/hero-section"
import { SocialProofSection } from "@/app/home/(components)/social-proof-section"
import { ValuePropositionsSection } from "@/app/home/(components)/value-propositions-section"
import { IndustryShowcaseSection } from "@/app/home/(components)/industry-showcase-section"
import { TestimonialsSection } from "@/app/home/(components)/testimonials-section"
import { SecurityTrustSection } from "@/app/home/(components)/security-trust-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      
      <main>
        <HeroSection />
        <SocialProofSection />
        <ValuePropositionsSection />
        <IndustryShowcaseSection />
        <TestimonialsSection />
        <SecurityTrustSection />
      </main>
      
    </div>
  )
}
