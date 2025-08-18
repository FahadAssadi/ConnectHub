"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelectTags } from "@/components/ui/multi-select-tags"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, MapPin, Linkedin, Briefcase, Award, Globe } from "lucide-react"
import RegistrationLayout from "@/components/registration/registration-layout"
import { useRegistration } from "@/hooks/use-registration"
import { ErrorDisplay } from "@/components/ui/error-display"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock data - replace with API calls
const countries = [
  "Australia", "United States", "United Kingdom", "Canada", "Singapore", "New Zealand"
]

const industriesList = [
  "Technology", "Healthcare", "Finance", "Manufacturing", "Retail", "Education", "Real Estate"
]

const domainExpertiseList = [
  "Sales", "Marketing", "Business Development", "Strategic Partnerships", "Channel Development"
]

const specializationList = [
  "B2B Sales", "Enterprise Solutions", "SaaS", "Consulting", "Market Expansion"
]

const toolsPlatformsList = [
  "Salesforce", "HubSpot", "LinkedIn Sales Navigator", "Zoom", "Microsoft Teams", "Slack"
]

const certificationsList = [
  "Certified Sales Professional", "Google Analytics", "AWS Certified", "Project Management Professional"
]

const experienceYears = [
  "0-1 years", "2-3 years", "4-5 years", "6-10 years", "10+ years"
]

export default function IndividualBDStage2() {
  const router = useRouter()
  const { submitStage, isLoading: registrationLoading, error, clearError } = useRegistration()
  
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    emailAddress: "",
    mobileNumber: "",
    country: "",
    stateProvince: "",
    city: "",
    linkedInProfile: "",
    
    // Professional Background
    industriesExperienced: [] as string[],
    domainExpertise: [] as string[],
    specialization: [] as string[],
    toolsPlatformsUsed: [] as string[],
    certifications: [] as string[],
    yearsOfBDExperience: "",
    fluencyInEnglish: "",
    referralLeadNetworkBase: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Personal Details validation
    if (!formData.fullName) newErrors.fullName = "Full name is required"
    if (!formData.emailAddress) {
      newErrors.emailAddress = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address"
    }
    if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile number is required"
    if (!formData.country) newErrors.country = "Country is required"
    if (!formData.stateProvince) newErrors.stateProvince = "State/Province is required"
    if (!formData.city) newErrors.city = "City is required"

    // Professional Background validation
    if (formData.industriesExperienced.length === 0) {
      newErrors.industriesExperienced = "Please select at least one industry"
    }
    if (formData.domainExpertise.length === 0) {
      newErrors.domainExpertise = "Please select at least one domain expertise"
    }
    if (!formData.yearsOfBDExperience) {
      newErrors.yearsOfBDExperience = "Please select years of experience"
    }
    if (!formData.fluencyInEnglish) {
      newErrors.fluencyInEnglish = "Please select your English fluency level"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      console.log("Saving personal and professional details:", formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push("/register/bd-partner/individual/stage3")
    } catch (error) {
      console.error("Save error:", error)
      setErrors({ submit: "Failed to save details. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <RegistrationLayout
      title="Personal & Professional Details"
      description="Tell us about yourself and your professional background"
      currentStage={2}
      totalStages={3}
      userType="individual_bd"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.submit && (
          <Alert variant="destructive">
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        {/* Personal Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full legal name"
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                  placeholder="your.email@example.com"
                  className={errors.emailAddress ? "border-red-500" : ""}
                />
                {errors.emailAddress && <p className="text-sm text-red-500">{errors.emailAddress}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                  placeholder="+61 4XX XXX XXX"
                  className={errors.mobileNumber ? "border-red-500" : ""}
                />
                {errors.mobileNumber && <p className="text-sm text-red-500">{errors.mobileNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label>Country</Label>
                <Select onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stateProvince">State/Province</Label>
                <Input
                  id="stateProvince"
                  value={formData.stateProvince}
                  onChange={(e) => handleInputChange("stateProvince", e.target.value)}
                  placeholder="Enter state or province"
                  className={errors.stateProvince ? "border-red-500" : ""}
                />
                {errors.stateProvince && <p className="text-sm text-red-500">{errors.stateProvince}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter your city"
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedInProfile">LinkedIn Profile (Optional)</Label>
              <Input
                id="linkedInProfile"
                value={formData.linkedInProfile}
                onChange={(e) => handleInputChange("linkedInProfile", e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Background Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Professional Background
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Industries Experienced In</Label>
                <MultiSelectTags
                  value={formData.industriesExperienced}
                  onChange={(value) => handleInputChange("industriesExperienced", value)}
                  suggestions={industriesList}
                  placeholder="Select or type industries..."
                  className={errors.industriesExperienced ? "border-red-500" : ""}
                />
                {errors.industriesExperienced && <p className="text-sm text-red-500">{errors.industriesExperienced}</p>}
              </div>

              <div className="space-y-2">
                <Label>Domain Expertise</Label>
                <MultiSelectTags
                  value={formData.domainExpertise}
                  onChange={(value) => handleInputChange("domainExpertise", value)}
                  suggestions={domainExpertiseList}
                  placeholder="Select or type expertise areas..."
                  className={errors.domainExpertise ? "border-red-500" : ""}
                />
                {errors.domainExpertise && <p className="text-sm text-red-500">{errors.domainExpertise}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Specialization</Label>
              <MultiSelectTags
                value={formData.specialization}
                onChange={(value) => handleInputChange("specialization", value)}
                suggestions={specializationList}
                placeholder="Select or type your specializations..."
              />
            </div>

            <div className="space-y-2">
              <Label>Tools & Platforms Used</Label>
              <MultiSelectTags
                value={formData.toolsPlatformsUsed}
                onChange={(value) => handleInputChange("toolsPlatformsUsed", value)}
                suggestions={toolsPlatformsList}
                placeholder="Select or type tools and platforms..."
              />
            </div>

            <div className="space-y-2">
              <Label>Certifications</Label>
              <MultiSelectTags
                value={formData.certifications}
                onChange={(value) => handleInputChange("certifications", value)}
                suggestions={certificationsList}
                placeholder="Add your certifications..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Years of BD Experience</Label>
                <Select onValueChange={(value) => handleInputChange("yearsOfBDExperience", value)}>
                  <SelectTrigger className={errors.yearsOfBDExperience ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceYears.map((years) => (
                      <SelectItem key={years} value={years}>
                        {years}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.yearsOfBDExperience && <p className="text-sm text-red-500">{errors.yearsOfBDExperience}</p>}
              </div>

              <div className="space-y-2">
                <Label>Fluency in English</Label>
                <Select onValueChange={(value) => handleInputChange("fluencyInEnglish", value)}>
                  <SelectTrigger className={errors.fluencyInEnglish ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select fluency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="fluent">Fluent</SelectItem>
                  </SelectContent>
                </Select>
                {errors.fluencyInEnglish && <p className="text-sm text-red-500">{errors.fluencyInEnglish}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralLeadNetworkBase">Referral or Lead Network Base</Label>
              <Textarea
                id="referralLeadNetworkBase"
                value={formData.referralLeadNetworkBase}
                onChange={(e) => handleInputChange("referralLeadNetworkBase", e.target.value)}
                placeholder="Describe your network, regions you cover, or types of leads you can provide..."
                rows={3}
              />
              <p className="text-sm text-gray-500">Describe your network reach and the types of business opportunities you can facilitate</p>
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
