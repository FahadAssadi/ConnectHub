"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Check, X, Linkedin } from "lucide-react"

interface PrimaryContactStepProps {
  onNext: (data: any) => void
  onPrevious: () => void
  formData: any
  isFirstStep: boolean
  isLastStep: boolean
}

export function PrimaryContactStep({ onNext, onPrevious, formData }: PrimaryContactStepProps) {
  const [data, setData] = useState({
    fullName: formData.fullName || "",
    jobTitle: formData.jobTitle || "",
    email: formData.email || "",
    phoneNumber: formData.phoneNumber || "",
    countryCode: formData.countryCode || "+61",
    linkedinProfile: formData.linkedinProfile || "",
  })

  const [validation, setValidation] = useState<Record<string, boolean>>({})

  const countryCodes = [
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+1", country: "United States", flag: "🇺🇸" },
    { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
    { code: "+1", country: "Canada", flag: "🇨🇦" },
    { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  ]

  const validateField = (field: string, value: string) => {
    let isValid = false
    switch (field) {
      case "fullName":
        isValid = value.length >= 2
        break
      case "jobTitle":
        isValid = value.length >= 2
        break
      case "email":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        break
      case "phoneNumber":
        isValid = /^\d{8,15}$/.test(value.replace(/\s/g, ""))
        break
      case "linkedinProfile":
        isValid = !value || /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/.test(value)
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
    const requiredFields = ["fullName", "jobTitle", "email", "phoneNumber"]
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
          <CardTitle className="text-2xl">Primary contact information</CardTitle>
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

          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-sm font-medium">
              Job Title/Designation <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="jobTitle"
                placeholder="e.g., CEO, Sales Director, Business Development Manager"
                value={data.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                className={`pr-10 transition-colors ${
                  validation.jobTitle === false
                    ? "border-red-500"
                    : validation.jobTitle === true
                      ? "border-green-500"
                      : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">{getFieldIcon("jobTitle")}</div>
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
                placeholder="your.email@company.com"
                value={data.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`pr-10 transition-colors ${
                  validation.email === false ? "border-red-500" : validation.email === true ? "border-green-500" : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">{getFieldIcon("email")}</div>
            </div>
            {validation.email === false && <p className="text-sm text-red-600">Please enter a valid email address</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <div className="flex space-x-2">
              <Select value={data.countryCode} onValueChange={(value) => handleInputChange("countryCode", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((item) => (
                    <SelectItem key={`${item.code}-${item.country}`} value={item.code}>
                      {item.flag} {item.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Input
                  placeholder="123 456 789"
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
            {validation.phoneNumber === false && (
              <p className="text-sm text-red-600">Please enter a valid phone number</p>
            )}
          </div>

          {/* LinkedIn Profile */}
          <div className="space-y-2">
            <Label htmlFor="linkedinProfile" className="text-sm font-medium">
              LinkedIn Profile <span className="text-gray-500">(Optional)</span>
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Linkedin className="h-4 w-4 text-blue-600" />
              </div>
              <Input
                id="linkedinProfile"
                placeholder="https://linkedin.com/in/yourprofile"
                value={data.linkedinProfile}
                onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
                className={`pl-10 pr-10 transition-colors ${
                  validation.linkedinProfile === false
                    ? "border-red-500"
                    : validation.linkedinProfile === true
                      ? "border-green-500"
                      : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">{getFieldIcon("linkedinProfile")}</div>
            </div>
            {validation.linkedinProfile === false && (
              <p className="text-sm text-red-600">Please enter a valid LinkedIn URL</p>
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
