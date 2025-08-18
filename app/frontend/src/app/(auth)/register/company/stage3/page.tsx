"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Phone, Briefcase, Linkedin } from "lucide-react"
import RegistrationLayout from "@/components/registration/registration-layout"

export default function CompanyStage3() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    jobTitle: "",
    emailAddress: "",
    phoneNumber: "",
    linkedInProfile: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.jobTitle) {
      newErrors.jobTitle = "Job title is required"
    }

    if (!formData.emailAddress) {
      newErrors.emailAddress = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address"
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required"
    }

    if (formData.linkedInProfile && !formData.linkedInProfile.includes("linkedin.com")) {
      newErrors.linkedInProfile = "Please enter a valid LinkedIn URL"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      // TODO: API call to save contact details
      console.log("Saving contact details:", formData)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate to next stage
      router.push("/register/company/stage4")
    } catch (error) {
      console.error("Save error:", error)
      setErrors({ submit: "Failed to save contact details. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <RegistrationLayout
      title="Primary Contact Information"
      description="Provide details for the main contact person for your company"
      currentStage={3}
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
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="Enter your full name"
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
            <p className="text-sm text-gray-500">This person will be the primary contact for your company</p>
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Job Title / Designation
            </Label>
            <Input
              id="jobTitle"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange("jobTitle", e.target.value)}
              placeholder="e.g., CEO, Business Development Manager, Sales Director"
              className={errors.jobTitle ? "border-red-500" : ""}
            />
            {errors.jobTitle && <p className="text-sm text-red-500">{errors.jobTitle}</p>}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="emailAddress" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              id="emailAddress"
              type="email"
              value={formData.emailAddress}
              onChange={(e) => handleInputChange("emailAddress", e.target.value)}
              placeholder="contact@yourcompany.com"
              className={errors.emailAddress ? "border-red-500" : ""}
            />
            {errors.emailAddress && <p className="text-sm text-red-500">{errors.emailAddress}</p>}
            <p className="text-sm text-gray-500">This should be the same as your login email</p>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              placeholder="+61 4XX XXX XXX"
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
            <p className="text-sm text-gray-500">Include country code for international numbers</p>
          </div>

          {/* LinkedIn Profile (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="linkedInProfile" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn Profile (Optional)
            </Label>
            <Input
              id="linkedInProfile"
              value={formData.linkedInProfile}
              onChange={(e) => handleInputChange("linkedInProfile", e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className={errors.linkedInProfile ? "border-red-500" : ""}
            />
            {errors.linkedInProfile && <p className="text-sm text-red-500">{errors.linkedInProfile}</p>}
            <p className="text-sm text-gray-500">Your professional LinkedIn profile (optional but recommended)</p>
          </div>
        </div>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Almost Done!</h4>
                <p className="text-sm text-green-700 mt-1">
                  You're one step away from completing your basic registration. After this, you'll be able to 
                  access your dashboard and complete additional profile details at your own pace.
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
