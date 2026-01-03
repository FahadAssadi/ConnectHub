"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, MessageSquare, CreditCard, Smartphone, Shield } from "lucide-react"

export function PlatformFeaturesSection() {
  const [activeFeature, setActiveFeature] = useState("dashboard")

  const features = [
    {
      id: "dashboard",
      name: "CRM Dashboard",
      icon: BarChart3,
      description: "Comprehensive deal tracking and performance analytics",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "analytics",
      name: "Real-time Analytics",
      icon: BarChart3,
      description: "Live charts showing deal progression and revenue forecasts",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "communication",
      name: "Communication Hub",
      icon: MessageSquare,
      description: "Integrated messaging and document sharing platform",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "payments",
      name: "Commission Management",
      icon: CreditCard,
      description: "Automated payment processing and earnings tracking",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "mobile",
      name: "Mobile Experience",
      icon: Smartphone,
      description: "Full-featured mobile app for on-the-go management",
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  const activeFeatureData = features.find((f) => f.id === activeFeature) || features[0]
  const ActiveIcon = activeFeatureData.icon

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Platform Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional tools designed for successful business development
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature) => {
              const IconComponent = feature.icon
              return (
                <Button
                  key={feature.id}
                  variant={activeFeature === feature.id ? "default" : "outline"}
                  onClick={() => setActiveFeature(feature.id)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  {feature.name}
                </Button>
              )
            })}
          </div>

          {/* Feature Display */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Feature Info */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
                      <ActiveIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{activeFeatureData.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        Featured
                      </Badge>
                    </div>
                  </div>

                  <p className="text-lg text-gray-600 mb-8">{activeFeatureData.description}</p>

                  {/* Feature Benefits */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-600">Real-time data synchronization across all devices</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-600">Advanced filtering and search capabilities</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-600">Customizable dashboards and reporting</p>
                    </div>
                  </div>

                  <Button className="w-fit">Explore Feature</Button>
                </div>

                {/* Feature Screenshot */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 lg:p-12 flex items-center justify-center">
                  <div className="relative">
                    <img
                      src={activeFeatureData.image || "/placeholder.svg"}
                      alt={activeFeatureData.name}
                      className="rounded-lg shadow-2xl max-w-full h-auto"
                    />
                    {/* Overlay indicators */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Shield className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Preview */}
          {activeFeature === "mobile" && (
            <div className="mt-12 text-center">
              <h4 className="text-xl font-semibold text-gray-900 mb-8">Available on all platforms</h4>
              <div className="flex justify-center items-center space-x-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                    <Smartphone className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-600">iOS App</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                    <Smartphone className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-600">Android App</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                    <BarChart3 className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-600">Web Platform</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}