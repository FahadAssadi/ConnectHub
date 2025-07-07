"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Settings, CheckCircle, Pause, Clock, Calendar, Puzzle, Target } from "lucide-react"

interface EngagementPreferencesStepProps {
  onNext: (data: any) => void
  onPrevious: () => void
  formData: any
  isFirstStep: boolean
  isLastStep: boolean
}

export function EngagementPreferencesStep({ onNext, onPrevious, formData }: EngagementPreferencesStepProps) {
  const [data, setData] = useState({
    openToRepresenting: formData.openToRepresenting || "",
    availability: formData.availability || "",
    preferredCategories: formData.preferredCategories || [],
  })

  const availabilityOptions = [
    {
      id: "parttime",
      label: "Part-time",
      icon: Clock,
      description: "10-20 hours per week",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      id: "fulltime",
      label: "Full-time",
      icon: Calendar,
      description: "40+ hours per week",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      id: "flexible",
      label: "Flexible",
      icon: Puzzle,
      description: "Variable hours as needed",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    {
      id: "projectbased",
      label: "Project-based",
      icon: Target,
      description: "Specific projects/campaigns",
      color: "bg-orange-100 text-orange-700 border-orange-200",
    },
  ]

  const productCategories = [
    "SaaS & Software",
    "FMCG & Consumer Goods",
    "Healthcare & MedTech",
    "Real Estate & PropTech",
    "Manufacturing & Industrial",
    "Financial Services",
    "Education & Training",
    "Professional Services",
    "Retail & E-commerce",
    "Energy & Sustainability",
  ]

  const handleCategoryToggle = (category: string) => {
    setData((prev) => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(category)
        ? prev.preferredCategories.filter((cat: string) => cat !== category)
        : [...prev.preferredCategories, category],
    }))
  }

  const isFormValid = () => {
    return data.openToRepresenting && data.availability
  }

  const handleSubmit = () => {
    if (isFormValid()) {
      onNext(data)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Your preferences</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Open to Representing */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">
              Open to representing products/services <span className="text-red-500">*</span>
            </Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setData((prev) => ({ ...prev, openToRepresenting: "yes" }))}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  data.openToRepresenting === "yes"
                    ? "border-green-500 bg-green-50 shadow-sm"
                    : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                }`}
              >
                <div className="text-center">
                  <CheckCircle
                    className={`h-12 w-12 mx-auto mb-3 ${
                      data.openToRepresenting === "yes" ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Yes, I'm interested</h3>
                  <p className="text-sm text-gray-600">Ready to start representing products and earning commissions</p>
                </div>
              </div>

              <div
                onClick={() => setData((prev) => ({ ...prev, openToRepresenting: "not_now" }))}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  data.openToRepresenting === "not_now"
                    ? "border-gray-500 bg-gray-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="text-center">
                  <Pause
                    className={`h-12 w-12 mx-auto mb-3 ${
                      data.openToRepresenting === "not_now" ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Not at this time</h3>
                  <p className="text-sm text-gray-600">Complete profile setup but remain inactive for now</p>
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">
              Your Availability <span className="text-red-500">*</span>
            </Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availabilityOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <div
                    key={option.id}
                    onClick={() => setData((prev) => ({ ...prev, availability: option.id }))}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      data.availability === option.id
                        ? `${option.color} border-current shadow-sm`
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent
                        className={`h-8 w-8 ${data.availability === option.id ? "text-current" : "text-gray-400"}`}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{option.label}</h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Preferred Product Categories */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">
              Preferred Product Categories <span className="text-gray-500">(Optional - Select up to 5)</span>
            </Label>
            <p className="text-sm text-gray-600">Choose categories you're most interested in representing</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {productCategories.map((category) => (
                <div
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all text-sm ${
                    data.preferredCategories.includes(category)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  } ${
                    data.preferredCategories.length >= 5 && !data.preferredCategories.includes(category)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  style={{
                    pointerEvents:
                      data.preferredCategories.length >= 5 && !data.preferredCategories.includes(category)
                        ? "none"
                        : "auto",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category}</span>
                    {data.preferredCategories.includes(category) && (
                      <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {data.preferredCategories.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  ✓ Selected {data.preferredCategories.length} categor
                  {data.preferredCategories.length > 1 ? "ies" : "y"}
                  {data.preferredCategories.length >= 5 && " (Maximum reached)"}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button variant="ghost" onClick={onPrevious}>
              Previous
            </Button>
            <div className="flex space-x-3">
              <Button variant="ghost" className="text-blue-600">
                Save & Continue Later
              </Button>
              <Button onClick={handleSubmit} disabled={!isFormValid()} className="bg-blue-600 hover:bg-blue-700">
                Continue
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
