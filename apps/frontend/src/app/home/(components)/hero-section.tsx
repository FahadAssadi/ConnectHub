import { Button } from "@/components/ui/button"
import { Play, TrendingUp, Globe, DollarSign } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Headlines */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Expand Your Business{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Globally</span>{" "}
            Without the Overhead
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            Connect with trusted business development partners who sell your products on performance-based commissions.
            No upfront costs, no hiring hassles.
          </p>

          {/* Value Proposition Trio */}
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Performance-Based Growth</h3>
              <p className="mt-2 text-sm text-gray-600">Pay only for results</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Global Reach</h3>
              <p className="mt-2 text-sm text-gray-600">Access partners worldwide</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Zero Hiring Costs</h3>
              <p className="mt-2 text-sm text-gray-600">No recruitment or employment expenses</p>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
            >
              List Your Business
            </Button>
            <Button size="lg" variant="outline" className="px-8 bg-transparent">
              Become a BD Partner
            </Button>
          </div>

          {/* Secondary CTA */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild variant="ghost" className="flex items-center gap-2">
              <a href="/home/onboarding">
              <Play className="h-4 w-4" />
              Learn How It Works
              </a>
            </Button>
          </div>

          {/* Trust Indicator */}
          <p className="mt-8 text-sm text-gray-500">Trusted by 500+ businesses across 25 countries</p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-400 to-purple-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
    </section>
  )
}
