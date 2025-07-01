"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Code, Home, Package, Heart } from "lucide-react"

export function IndustryShowcaseSection() {
  const [activeIndustry, setActiveIndustry] = useState(0)

  const industries = [
    {
      name: "Software",
      icon: Code,
      commissionRange: "15-25%",
      opportunities: 45,
      description: "SaaS platforms, development tools, and enterprise software solutions",
      successStory: "TechFlow increased revenue by 300% in 8 months through our BD partner network",
    },
    {
      name: "Real Estate",
      icon: Home,
      commissionRange: "3-8%",
      opportunities: 23,
      description: "Property management, real estate tech, and investment platforms",
      successStory: "PropTech Solutions expanded to 5 new markets with zero hiring costs",
    },
    {
      name: "FMCG",
      icon: Package,
      commissionRange: "5-12%",
      opportunities: 34,
      description: "Consumer goods, food & beverage, and retail products",
      successStory: "HealthySnacks reached 50,000 new customers through partner channels",
    },
    {
      name: "Healthcare",
      icon: Heart,
      commissionRange: "10-20%",
      opportunities: 18,
      description: "Medical devices, health tech, and pharmaceutical products",
      successStory: "MedTech Innovations achieved $2M in sales through specialized partners",
    },
  ]

  const recentOpportunities = [
    { title: "Cloud Analytics Platform", industry: "Software", commission: "20%", location: "Global" },
    { title: "Smart Home Security", industry: "Technology", commission: "15%", location: "AU/US" },
    { title: "Organic Food Products", industry: "FMCG", commission: "8%", location: "APAC" },
    { title: "Telehealth Platform", industry: "Healthcare", commission: "18%", location: "Global" },
    { title: "Property Management SaaS", industry: "Real Estate", commission: "12%", location: "AU/NZ" },
    { title: "Manufacturing Equipment", industry: "Industrial", commission: "10%", location: "Global" },
  ]

  const nextIndustry = () => {
    setActiveIndustry((prev) => (prev + 1) % industries.length)
  }

  const prevIndustry = () => {
    setActiveIndustry((prev) => (prev - 1 + industries.length) % industries.length)
  }

  const currentIndustry = industries[activeIndustry]
  const IconComponent = currentIndustry.icon

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Industries We Serve</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Specialized opportunities across diverse sectors</p>
        </div>

        {/* Industry Carousel */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="relative overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevIndustry}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mr-4">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{currentIndustry.name}</h3>
                      <p className="text-gray-600">{currentIndustry.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{currentIndustry.commissionRange}</div>
                      <p className="text-sm text-gray-600">Commission Range</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{currentIndustry.opportunities}</div>
                      <p className="text-sm text-gray-600">Active Opportunities</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">95%</div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-medium">Success Story</p>
                    <p className="text-blue-700">{currentIndustry.successStory}</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextIndustry}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Industry Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {industries.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndustry(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndustry ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Recent Opportunities Preview */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Recent Opportunities</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Software
              </Button>
              <Button variant="outline" size="sm">
                Consumer Goods
              </Button>
              <Button variant="outline" size="sm">
                B2B Services
              </Button>
              <Button variant="outline" size="sm">
                All Industries
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recentOpportunities.map((opportunity, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{opportunity.title}</h4>
                    <Badge variant="secondary">{opportunity.commission}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{opportunity.industry}</p>
                  <p className="text-xs text-gray-500">{opportunity.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg">
              View All Opportunities
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
