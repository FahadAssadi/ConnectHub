"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Users, BarChart3 } from "lucide-react"

export function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<"businesses" | "partners">("businesses")

  const businessSteps = [
    {
      icon: CheckCircle,
      title: "List & Define",
      description: "Register your business and products with commission structure",
      details:
        "Set up your profile, upload product information, and define commission rates that work for your business model.",
    },
    {
      icon: Users,
      title: "Connect & Enable",
      description: "Get matched with qualified BD partners in your target markets",
      details:
        "Our algorithm matches you with pre-vetted partners who have the right expertise and network for your products.",
    },
    {
      icon: BarChart3,
      title: "Sell & Scale",
      description: "BD partners sell your products while you track performance and pay commissions",
      details:
        "Monitor real-time progress, manage relationships, and pay commissions only when deals close successfully.",
    },
  ]

  const partnerSteps = [
    {
      icon: CheckCircle,
      title: "Apply & Verify",
      description: "Register with your expertise and background check",
      details:
        "Complete our verification process including background checks, reference validation, and expertise assessment.",
    },
    {
      icon: Users,
      title: "Browse & Select",
      description: "Choose products/services that match your network and expertise",
      details:
        "Access our marketplace of opportunities and select products that align with your industry knowledge and contacts.",
    },
    {
      icon: BarChart3,
      title: "Sell & Earn",
      description: "Leverage our CRM tools to close deals and earn commissions",
      details:
        "Use professional sales tools, marketing materials, and support to close deals and earn competitive commissions.",
    },
  ]

  const currentSteps = activeTab === "businesses" ? businessSteps : partnerSteps

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Simple, transparent process designed for success</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <Button
              variant={activeTab === "businesses" ? "default" : "ghost"}
              onClick={() => setActiveTab("businesses")}
              className="px-6"
            >
              For Businesses
            </Button>
            <Button
              variant={activeTab === "partners" ? "default" : "ghost"}
              onClick={() => setActiveTab("partners")}
              className="px-6"
            >
              For BD Partners
            </Button>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {currentSteps.map((step, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-6">
                  <step.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <p className="text-sm text-gray-500">{step.details}</p>

                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {activeTab === "businesses" ? "List Your Business" : "Become a Partner"}
          </Button>
        </div>
      </div>
    </section>
  )
}
