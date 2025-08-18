"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
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
    
    // Auto-populate registered business name when company name is entered
    if (field === "companyName" && value) {
      setFormData(prev => ({ ...prev, registeredBusinessName: `${value} Pty Ltd` }))
    }
    
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
            <p className="text-sm text-gray-500">Your Australian Business Number or equivalent</p>
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
              onChange={(e) => handleInputChange("registeredBusinessName", e.target.value)}
              placeholder="Auto-populated based on company name"
              className="bg-gray-50"
            />
            <p className="text-sm text-gray-500">Legal name as registered with authorities</p>
          </div>

          {/* Industry Category */}
          <div className="space-y-2">
            <Label htmlFor="industryCategory" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Industry Category *
            </Label>
            <Select 
              value={formData.industryCategory} 
              onValueChange={(value) => handleInputChange("industryCategory", value)}
            >
              <SelectTrigger className={fieldErrors.industryCategory ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {industryCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError error={fieldErrors.industryCategory} />
            <p className="text-sm text-gray-500">Primary industry your company operates in</p>
          </div>

          {/* Country of Registration */}
          <div className="space-y-2">
            <Label htmlFor="countryOfRegistration" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Country of Registration *
            </Label>
            <Select 
              value={formData.countryOfRegistration} 
              onValueChange={(value) => handleInputChange("countryOfRegistration", value)}
            >
              <SelectTrigger className={fieldErrors.countryOfRegistration ? "border-red-500" : ""}>
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
            <FieldError error={fieldErrors.countryOfRegistration} />
            <p className="text-sm text-gray-500">Where your company is legally registered</p>
          </div>

          {/* Registered Address */}
          <div className="space-y-2">
            <Label htmlFor="registeredAddress" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Registered Address *
            </Label>
            <Input
              id="registeredAddress"
              value={formData.registeredAddress}
              onChange={(e) => handleInputChange("registeredAddress", e.target.value)}
              placeholder="123 Business Street, City, State, Postcode"
              className={fieldErrors.registeredAddress ? "border-red-500" : ""}
            />
            <FieldError error={fieldErrors.registeredAddress} />
            <p className="text-sm text-gray-500">Legal registered address of your company</p>
          </div>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Next Steps</h4>
                <p className="text-sm text-blue-700 mt-1">
                  After completing your company details, you'll add your primary contact information and 
                  complete your company profile to help BD partners understand your business better.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </form>
    </RegistrationLayout>
  )
}
