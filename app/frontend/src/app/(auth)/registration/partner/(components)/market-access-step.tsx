"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Network } from "lucide-react"

interface MarketAccessStepProps {
  onNext: (data: any) => void
  onPrevious: () => void
  formData: any
  isFirstStep: boolean
  isLastStep: boolean
}

export function MarketAccessStep({ onNext, onPrevious, formData }: MarketAccessStepProps) {
  const [data, setData] = useState({
    customerTypes: formData.customerTypes || [],
    regions: formData.regions || "",
  })

  const customerTypeOptions = [
    { id: "smes", label: "SMEs", icon: "🏢", description: "Small & Medium Enterprises" },
    { id: "enterprises", label: "Enterprises", icon: "🏛️", description: "Large Corporations" },
    { id: "government", label: "Government", icon: "🏛️", description: "Public Sector" },
    { id: "retailers", label: "Retailers", icon: "🛍️", description: "Retail Businesses" },
    { id: "distributors", label: "Distributors", icon: "📦", description: "Distribution Partners" },
    { id: "endconsumers", label: "End Consumers", icon: "👥", description: "Individual Customers" },
  ]

  const handleCustomerTypeToggle = (customerId: string) => {
    setData((prev) => ({
      ...prev,
      customerTypes: prev.customerTypes.includes(customerId)
        ? prev.customerTypes.filter((id: string) => id !== customerId)
        : [...prev.customerTypes, customerId],
    }))
  }

  const isFormValid = () => {
    return data.customerTypes.length > 0 && data.regions.length >= 10
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
              <Network className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Your market reach</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Types of Customers */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">
              Types of Customers You Engage With <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-600">Select all customer types you have experience working with</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customerTypeOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleCustomerTypeToggle(option.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    data.customerTypes.includes(option.id)
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{option.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{option.label}</h3>
                        <Checkbox
                          checked={data.customerTypes.includes(option.id)}
                          onChange={() => handleCustomerTypeToggle(option.id)}
                          className="pointer-events-none"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {data.customerTypes.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  ✓ Selected {data.customerTypes.length} customer type{data.customerTypes.length > 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>

          {/* Regions Coverage */}
          <div className="space-y-2">
            <Label htmlFor="regions" className="text-sm font-medium">
              Regions You Can Cover/Influence <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="regions"
              placeholder="e.g., Southeast Asia, NSW, Middle East, or specific cities/countries. Be specific about your geographic reach and any particular markets where you have strong connections."
              value={data.regions}
              onChange={(e) => setData((prev) => ({ ...prev, regions: e.target.value }))}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Describe your geographic reach and market influence</span>
              <span className={data.regions.length >= 10 ? "text-green-600" : "text-gray-500"}>
                {data.regions.length}/500 characters
              </span>
            </div>

            {data.regions.length >= 10 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">✓ Geographic coverage information provided</p>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Tips for better matching:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be specific about regions where you have established networks</li>
              <li>• Mention any industry clusters or business hubs you're connected to</li>
              <li>• Include both geographic and sector-specific reach (e.g., "Tech startups in Sydney")</li>
            </ul>
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
