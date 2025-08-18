"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, MapPin, Globe, FileText, Hash } from "lucide-react"
import RegistrationLayout from "@/components/registration/registration-layout"
import { useRegistration } from "@/hooks/use-registration"
import { ErrorDisplay, FieldError } from "@/components/ui/error-display"

// Mock data - replace with API calls
const industryCategories = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Retail",
  "Education",
  "Real Estate",
  "Professional Services"
]

const countries = [
  "Australia",
  "United States",
  "United Kingdom",
  "Canada",
  "Singapore",
  "New Zealand"
]

export default function CompanyStage2() {
  const router = useRouter()
  const { submitStage, isLoading, error, clearError } = useRegistration()
  const [registrationData, setRegistrationData] = useState<any>(null)
  const [formData, setFormData] = useState({
    companyName: "",
    abnBusinessRegistrationNumber: "",
    registeredBusinessName: "",
    industryCategory: "",
    countryOfRegistration: "",
    registeredAddress: ""
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Get registration data from localStorage
    const stored = localStorage.getItem("registrationData")
    if (stored) {
      const data = JSON.parse(stored)
      setRegistrationData(data)
      
      // Verify we're on the correct stage
      if (data.currentStage !== 2) {
        router.push(`/register/${data.userType}/stage${data.currentStage}`)
        return
      }
    } else {
      // No registration data, redirect to start
      router.push("/register")
      return
    }
  }, [router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName) {
      newErrors.companyName = "Company name is required"
    }

    if (!formData.abnBusinessRegistrationNumber) {
      newErrors.abnBusinessRegistrationNumber = "ABN/Business Registration Number is required"
    }

    if (!formData.industryCategory) {
      newErrors.industryCategory = "Please select an industry category"
    }

    if (!formData.countryOfRegistration) {
      newErrors.countryOfRegistration = "Please select country of registration"
    }

    if (!formData.registeredAddress) {
      newErrors.registeredAddress = "Registered address is required"
    }

    setFieldErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !registrationData) return

    clearError()
    
    const result = await submitStage(
      2, 
      formData, 
      registrationData.userId, 
      registrationData.userType
    )
    
    if (result?.success) {
      // Update registration data
      const updatedData = {
        ...registrationData,
        currentStage: result.currentStage
      }
      localStorage.setItem("registrationData", JSON.stringify(updatedData))
      
      // Navigate to next stage
      router.push("/register/company/stage3")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const retrySubmission = async () => {
    if (validateForm() && registrationData) {
      const result = await submitStage(
        2, 
        formData, 
        registrationData.userId, 
        registrationData.userType
      )
      if (result?.success) {
        const updatedData = {
          ...registrationData,
          currentStage: result.currentStage
        }
        localStorage.setItem("registrationData", JSON.stringify(updatedData))
        router.push("/register/company/stage3")
      }
    }
  }

  if (!registrationData) {
    return <div>Loading...</div>
  }

  return (
    <RegistrationLayout
      title="Company Details"
      description="Tell us about your company and business registration"
      currentStage={2}
      totalStages={4}
      userType="company"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <ErrorDisplay 
          error={error} 
          onRetry={retrySubmission}
          onDismiss={clearError}
          className="mb-6"
        />

        <div className="grid gap-6">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Company Name *
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              placeholder="Your Company Pty Ltd"
              className={fieldErrors.companyName ? "border-red-500" : ""}
            />
            <FieldError error={fieldErrors.companyName} />
            <p className="text-sm text-gray-500">The trading name of your business</p>
          </div>

          {/* ABN/Business Registration Number */}
          <div className="space-y-2">
            <Label htmlFor="abnBusinessRegistrationNumber" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              ABN / Business Registration Number *
            </Label>
            <Input
              id="abnBusinessRegistrationNumber"
              value={formData.abnBusinessRegistrationNumber}
              onChange={(e) => handleInputChange("abnBusinessRegistrationNumber", e.target.value)}
              placeholder="12 345 678 901"
              className={fieldErrors.abnBusinessRegistrationNumber ? "border-red-500" : ""}
            />
            <FieldError error={fieldErrors.abnBusinessRegistrationNumber} />
    
    // Auto-populate registered business name when ABN is entered
    if (field === "abnBusinessRegistrationNumber" && value) {
      // TODO: API call to fetch registered business name from ABN
      setFormData(prev => ({ ...prev, registeredBusinessName: `${formData.companyName} Pty Ltd` }))
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <RegistrationLayout
      title="Company Details"
      description="Tell us about your company and business registration"
      currentStage={2}
      totalStages={4}
      userType="company"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <Alert variant="destructive">
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Company Name
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              placeholder="Enter your company name"
              className={errors.companyName ? "border-red-500" : ""}
            />
            {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
          </div>

          {/* ABN/Business Registration Number */}
          <div className="space-y-2">
            <Label htmlFor="abnBusinessRegistrationNumber" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              ABN / Business Registration Number
            </Label>
            <Input
              id="abnBusinessRegistrationNumber"
              value={formData.abnBusinessRegistrationNumber}
              onChange={(e) => handleInputChange("abnBusinessRegistrationNumber", e.target.value)}
              placeholder="Enter your ABN or business registration number"
              className={errors.abnBusinessRegistrationNumber ? "border-red-500" : ""}
            />
            {errors.abnBusinessRegistrationNumber && <p className="text-sm text-red-500">{errors.abnBusinessRegistrationNumber}</p>}
          </div>

          {/* Registered Business Name (Auto-populated) */}
          <div className="space-y-2">
            <Label htmlFor="registeredBusinessName" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Registered Business Name
            </Label>
            <Input
              id="registeredBusinessName"
              value={formData.registeredBusinessName}
              readOnly
              placeholder="Will be auto-populated based on ABN"
              className="bg-gray-50"
            />
            <p className="text-sm text-gray-500">This field will be automatically populated when you enter your ABN</p>
          </div>

          {/* Industry Category */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Industry Category
            </Label>
            <Select onValueChange={(value) => handleInputChange("industryCategory", value)}>
              <SelectTrigger className={errors.industryCategory ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your industry category" />
              </SelectTrigger>
              <SelectContent>
                {industryCategories.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.industryCategory && <p className="text-sm text-red-500">{errors.industryCategory}</p>}
          </div>

          {/* Country of Registration */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Country of Registration
            </Label>
            <Select onValueChange={(value) => handleInputChange("countryOfRegistration", value)}>
              <SelectTrigger className={errors.countryOfRegistration ? "border-red-500" : ""}>
                <SelectValue placeholder="Select country of registration" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.countryOfRegistration && <p className="text-sm text-red-500">{errors.countryOfRegistration}</p>}
          </div>

          {/* Registered Address */}
          <div className="space-y-2">
            <Label htmlFor="registeredAddress" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Registered Address
            </Label>
            <Input
              id="registeredAddress"
              value={formData.registeredAddress}
              onChange={(e) => handleInputChange("registeredAddress", e.target.value)}
              placeholder="Enter your registered business address"
              className={errors.registeredAddress ? "border-red-500" : ""}
            />
            {errors.registeredAddress && <p className="text-sm text-red-500">{errors.registeredAddress}</p>}
          </div>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Why We Need This Information</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your business registration details help us verify your company and ensure compliance. 
                  This information is kept secure and only used for verification purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            size="lg" 
            disabled={isLoading}
            className="min-w-32"
          >
            {isLoading ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </form>
    </RegistrationLayout>
  )
}
