"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, Check, X } from "lucide-react"

interface CompanyDetailsStepProps {
  onNext: (data: any) => void
  onPrevious: () => void
  formData: any
  isFirstStep: boolean
  isLastStep: boolean
}

export function CompanyDetailsStep({ onNext, formData }: CompanyDetailsStepProps) {
  const [data, setData] = useState({
    companyName: formData.companyName || "",
    registeredBusinessName: formData.registeredBusinessName || "",
    websiteUrl: formData.websiteUrl || "",
    industry: formData.industry || "",
    businessType: formData.businessType || "",
    country: formData.country || "",
    headOfficeLocation: formData.headOfficeLocation || "",
    yearOfIncorporation: formData.yearOfIncorporation || "",
  })

  const [validation, setValidation] = useState<Record<string, boolean>>({})

  const industries = [
    "Software",
    "Real Estate",
    "FMCG",
    "Healthcare",
    "Manufacturing",
    "Professional Services",
    "Education",
    "Finance",
    "Retail",
    "Other",
  ]

  const businessTypes = ["Startup", "SME", "Enterprise", "Distributor", "Manufacturer", "Service Provider"]

  const countries = ["Australia", "United States", "United Kingdom", "Canada", "New Zealand", "Singapore"]

  const validateField = (field: string, value: string) => {
    let isValid = false
    switch (field) {
      case "companyName":
        isValid = value.length >= 2
        break
      case "websiteUrl":
        isValid = !value || /^https?:\/\/.+\..+/.test(value)
        break
      case "industry":
      case "businessType":
      case "country":
        isValid = value !== ""
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
    const requiredFields = ["companyName", "industry", "businessType", "country"]
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
              <Building className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Tell us about your company</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-sm font-medium">
              Company Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="companyName"
                placeholder="Enter your company name"
                value={data.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                className={`pr-10 transition-colors ${
                  validation.companyName === false
                    ? "border-red-500"
                    : validation.companyName === true
                      ? "border-green-500"
                      : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">{getFieldIcon("companyName")}</div>
            </div>
          </div>

          {/* Registered Business Name */}
          <div className="space-y-2">
            <Label htmlFor="registeredBusinessName" className="text-sm font-medium">
              Registered Business Name <span className="text-gray-500">(Optional)</span>
            </Label>
            <Input
              id="registeredBusinessName"
              placeholder="If different from company name"
              value={data.registeredBusinessName}
              onChange={(e) => handleInputChange("registeredBusinessName", e.target.value)}
            />
          </div>

          {/* Website URL */}
          <div className="space-y-2">
            <Label htmlFor="websiteUrl" className="text-sm font-medium">
              Website URL
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">https://</div>
              <Input
                id="websiteUrl"
                placeholder="yourcompany.com"
                value={data.websiteUrl}
                onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                className={`pl-20 pr-10 transition-colors ${
                  validation.websiteUrl === false
                    ? "border-red-500"
                    : validation.websiteUrl === true
                      ? "border-green-500"
                      : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">{getFieldIcon("websiteUrl")}</div>
            </div>
          </div>

          {/* Industry/Sector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Industry/Sector <span className="text-red-500">*</span>
            </Label>
            <Select value={data.industry} onValueChange={(value) => handleInputChange("industry", value)}>
              <SelectTrigger
                className={`transition-colors ${
                  validation.industry === false
                    ? "border-red-500"
                    : validation.industry === true
                      ? "border-green-500"
                      : ""
                }`}
              >
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Business Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Business Type <span className="text-red-500">*</span>
            </Label>
            <Select value={data.businessType} onValueChange={(value) => handleInputChange("businessType", value)}>
              <SelectTrigger
                className={`transition-colors ${
                  validation.businessType === false
                    ? "border-red-500"
                    : validation.businessType === true
                      ? "border-green-500"
                      : ""
                }`}
              >
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Country and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Country of Registration <span className="text-red-500">*</span>
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
                      🏳️ {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="headOfficeLocation" className="text-sm font-medium">
                Head Office Location
              </Label>
              <Input
                id="headOfficeLocation"
                placeholder="City, State/Province"
                value={data.headOfficeLocation}
                onChange={(e) => handleInputChange("headOfficeLocation", e.target.value)}
              />
            </div>
          </div>

          {/* Year of Incorporation */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Year of Incorporation</Label>
            <Select
              value={data.yearOfIncorporation}
              onValueChange={(value) => handleInputChange("yearOfIncorporation", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => {
                  const year = new Date().getFullYear() - i
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
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
