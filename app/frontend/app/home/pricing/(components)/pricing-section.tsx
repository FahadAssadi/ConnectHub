import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"

export function PricingSection() {
  const businessFeatures = [
    "Product listing and management",
    "BD partner matching algorithm",
    "Real-time deal tracking",
    "Commission management system",
    "Marketing material distribution",
    "24/7 customer support",
    "Analytics and reporting",
    "Secure payment processing",
  ]

  const partnerFeatures = [
    "Access to product marketplace",
    "Professional CRM tools",
    "Lead management system",
    "Commission tracking",
    "Marketing materials access",
    "Training and certification",
    "Mobile app access",
    "Dedicated support",
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Choose the plan that works for your business model</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* For Businesses */}
          <Card className="relative hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-8">
              <Badge className="w-fit mx-auto mb-4 bg-blue-100 text-blue-800">For Businesses</Badge>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Scale Your Business</CardTitle>
              <p className="text-gray-600">Expand globally without hiring overhead</p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-600 ml-2">AUD registration</span>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-gray-900">$49</span>
                  <span className="text-gray-600 ml-2">AUD/month platform fee</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">5-8%</span>
                  <span className="text-gray-600 ml-2">success fee per deal</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {businessFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mb-4">
                Start Free Trial
              </Button>

              <p className="text-center text-sm text-gray-500">30-day money-back guarantee</p>
            </CardContent>
          </Card>

          {/* For BD Partners */}
          <Card className="relative hover:shadow-xl transition-shadow border-2 border-purple-200">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-purple-600 text-white flex items-center gap-1">
                <Star className="h-3 w-3" />
                Most Popular
              </Badge>
            </div>

            <CardHeader className="text-center pb-8">
              <Badge className="w-fit mx-auto mb-4 bg-purple-100 text-purple-800">For BD Partners</Badge>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Turn Network Into Income</CardTitle>
              <p className="text-gray-600">Flexible earning with high commissions</p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-green-600">Free</span>
                  <span className="text-gray-600 ml-2">Year 1</span>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600 ml-2">AUD/month Year 2+</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">100%</span>
                  <span className="text-gray-600 ml-2">of agreed commissions</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {partnerFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 mb-4">
                Apply Now
              </Button>

              <p className="text-center text-sm text-gray-500">Background check required</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Questions about pricing? We're here to help.</p>
          <Button variant="outline">Contact Sales Team</Button>
        </div>
      </div>
    </section>
  )
}