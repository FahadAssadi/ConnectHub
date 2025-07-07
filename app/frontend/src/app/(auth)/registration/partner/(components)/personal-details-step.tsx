"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Check, X } from "lucide-react"

interface PersonalDetailsStepProps {
  onNext: (data: any) => void
  onPrevious: () => void
  formData: any
  isFirstStep: boolean
  isLastStep: boolean
}

export function PersonalDetailsStep({ onNext, formData }: PersonalDetailsStepProps) {
  const [data, setData] = useState({
    fullName: formData.fullName || "",
    email: formData.email || "",
    phoneNumber: formData.phoneNumber || "",
    linkedinProfile: formData.linkedinProfile || "",
    country: formData.country || "",
    city: formData.city || "",
  })

  const [validation, setValidation] = useState<Record<string, boolean>>({})

  const countries = ["Australia", "United States", "United Kingdom", "Canada", "New Zealand", "Singapore"]

  const validateField = (field: string, value: string) => {
    let isValid = false
    switch (field) {
      case "fullName":
        isValid = value.length >= 2
        break
      case "email":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        break
      case "phoneNumber":
        isValid = /^\+?[\d\s-()]{8,15}$/.test(value)
        break
      case "linkedinProfile":
        isValid = !value || /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/.test(value)
        break
      case "country":
        isValid = value !== ""
        break
      case "city":
        isValid = value.length >= 2
        break
      default:
        isValid = true
    }

    setValidation((prev) => ({ ...prev, [field]: isValid }))
    return isValid
  }

  const handleInputChange = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const isFormValid = () => {
    const requiredFields = ["fullName", "email", "phoneNumber", "country", "city"]
    return requiredFields.every((field) => data[field as keyof typeof data] && validation[field] !== false)
  }

  const handleSubmit = () => {
    if (isFormValid()) {
      onNext(data)
    }
  }

  const getFieldIcon = (field: string) => {
    if (validation[field] === true) return <Check className="h-4 w-4 text-green-600" />
    if (validation[field] === false) return <X className="h-4 w-4 text-red-600" />
    return null
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Let's get to know you</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={data.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={`pr-10 transition-colors ${
                  validation.fullName === false
                    ? "border-red-500"
                    : validation.fullName === true
                      ? "border-green-500"
                      : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">{getFieldIcon("fullName")}</div>
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={data.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`pr-10 transition-colors ${
                  validation.email === false ? "border-red-500" : validation.email === true ? "border-green-500" : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">{getFieldIcon("email")}</div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="phoneNumber"
                placeholder="+61 123 456 789"
                value={data.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                className={`pr-10 transition-colors ${
                  validation.phoneNumber === false
                    ? "border-red-500"
                    : validation.phoneNumber === true
                      ? "border-green-500"
                      : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">{getFieldIcon("phoneNumber")}</div>
            </div>
          </div>

          {/* LinkedIn Profile */}
          <div className="space-y-2">
            <Label htmlFor="linkedinProfile" className="text-sm font-medium">
              LinkedIn Profile/Website <span className="text-gray-500">(Optional)</span>
            </Label>
            <div className="relative">
              <Input
                id="linkedinProfile"
                placeholder="https://linkedin.com/in/yourprofile"
                value={data.linkedinProfile}
                onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
                className={`pr-10 transition-colors ${
                  validation.linkedinProfile === false
                    ? "border-red-500"
                    : validation.linkedinProfile === true
                      ? "border-green-500"
                      : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">{getFieldIcon("linkedinProfile")}</div>
            </div>
          </div>

          {/* Country and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Country of Operation <span className="text-red-500">*</span>
              </Label>
              <Select value={data.country} onValueChange={(value) => handleInputChange("country", value)}>
                <SelectTrigger
                  className={`transition-colors ${
                    validation.country === false
                      ? "border-red-500"
                      : validation.country === true
                        ? "border-green-500"
                        : ""
                  }`}
                >
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                City <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="city"
                  placeholder="Enter your city"
                  value={data.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={`pr-10 transition-colors ${
                    validation.city === false ? "border-red-500" : validation.city === true ? "border-green-500" : ""
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">{getFieldIcon("city")}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button variant="ghost" className="text-blue-600">
              Save & Continue Later
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid()} className="bg-blue-600 hover:bg-blue-700">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
