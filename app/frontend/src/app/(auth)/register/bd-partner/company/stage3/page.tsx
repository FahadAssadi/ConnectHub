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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Users, Clock, Target, Globe, Award } from "lucide-react"
import RegistrationLayout from "@/components/registration/registration-layout"

// Mock data
const industriesList = [
  "Technology", "Healthcare", "Finance", "Manufacturing", "Retail", "Education", "Real Estate", "Consulting"
]

const domainExpertiseList = [
  "Sales", "Marketing", "Business Development", "Strategic Partnerships", "Channel Development", "Market Research"
]

const specializationList = [
  "B2B Sales", "Enterprise Solutions", "SaaS", "E-commerce", "Consulting", "Market Expansion", "Digital Transformation"
]

const toolsPlatformsList = [
  "Salesforce", "HubSpot", "LinkedIn Sales Navigator", "Zoom", "Microsoft Teams", "Slack", "Pipedrive"
]

const certificationsList = [
  "Certified Sales Professional", "Google Analytics", "AWS Certified", "Project Management Professional", "HubSpot Certified"
]

const employeeRanges = [
  "1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "500+ employees"
]

const experienceYears = [
  "0-2 years", "3-5 years", "6-10 years", "11-15 years", "15+ years"
]

const engagementTypes = [
  "Project-based consulting", "Ongoing partnership", "Commission-based sales", "Retainer agreement", "Revenue sharing", "Equity partnership"
]

const regions = [
  "Australia", "New Zealand", "United States", "United Kingdom", "Canada", "Singapore", "India", "Japan"
]

export default function CompanyBDStage3() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    // Company Profile
    industriesExperienced: [] as string[],
    domainExpertise: [] as string[],
    specialization: [] as string[],
    toolsPlatformsUsed: [] as string[],
    certifications: [] as string[],
    numberOfEmployees: "",
    yearsOfExperience: "",
    existingClientBase: "",
    targetRegions: [] as string[],
    
    // Engagement Preferences
    engagementTypeInterestedIn: [] as string[],
    capacityCommitment: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Company Profile validation
    if (formData.industriesExperienced.length === 0) {
      newErrors.industriesExperienced = "Please select at least one industry"
    }
    if (formData.domainExpertise.length === 0) {
      newErrors.domainExpertise = "Please select at least one domain expertise"
    }
    if (!formData.numberOfEmployees) {
      newErrors.numberOfEmployees = "Please select number of employees"
    }
    if (!formData.yearsOfExperience) {
      newErrors.yearsOfExperience = "Please select years of experience"
    }
    if (formData.targetRegions.length === 0) {
      newErrors.targetRegions = "Please select at least one target region"
    }

    // Engagement Preferences validation
    if (formData.engagementTypeInterestedIn.length === 0) {
      newErrors.engagementTypeInterestedIn = "Please select at least one engagement type"
    }
    if (!formData.capacityCommitment) {
      newErrors.capacityCommitment = "Please specify capacity commitment"
    } else if (isNaN(Number(formData.capacityCommitment)) || Number(formData.capacityCommitment) <= 0) {
      newErrors.capacityCommitment = "Please enter a valid number of hours"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      console.log("Saving company BD profile:", formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push("/register/bd-partner/company/stage4")
    } catch (error) {
      console.error("Save error:", error)
      setErrors({ submit: "Failed to save profile. Please try again." })
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
      title="Company Profile & Engagement"
      description="Showcase your expertise and set your engagement preferences"
      currentStage={3}
      totalStages={4}
      userType="company_bd"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.submit && (
          <Alert variant="destructive">
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        {/* Company Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company Profile
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
                  placeholder="Select industries..."
                  className={errors.industriesExperienced ? "border-red-500" : ""}
                />
                {errors.industriesExperienced && (
                  <p className="text-sm text-red-500">{errors.industriesExperienced}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Domain Expertise</Label>
                <MultiSelectTags
                  value={formData.domainExpertise}
                  onChange={(value) => handleInputChange("domainExpertise", value)}
                  suggestions={domainExpertiseList}
                  placeholder="Select expertise areas..."
                  className={errors.domainExpertise ? "border-red-500" : ""}
                />
                {errors.domainExpertise && (
                  <p className="text-sm text-red-500">{errors.domainExpertise}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Specialization</Label>
              <MultiSelectTags
                value={formData.specialization}
                onChange={(value) => handleInputChange("specialization", value)}
                suggestions={specializationList}
                placeholder="Add your specializations..."
              />
            </div>

            <div className="space-y-2">
              <Label>Tools & Platforms Used</Label>
              <MultiSelectTags
                value={formData.toolsPlatformsUsed}
                onChange={(value) => handleInputChange("toolsPlatformsUsed", value)}
                suggestions={toolsPlatformsList}
                placeholder="Add tools and platforms..."
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Certifications
              </Label>
              <MultiSelectTags
                value={formData.certifications}
                onChange={(value) => handleInputChange("certifications", value)}
                suggestions={certificationsList}
                placeholder="Add company certifications..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Number of Employees
                </Label>
                <Select onValueChange={(value) => handleInputChange("numberOfEmployees", value)}>
                  <SelectTrigger className={errors.numberOfEmployees ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.numberOfEmployees && (
                  <p className="text-sm text-red-500">{errors.numberOfEmployees}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Select onValueChange={(value) => handleInputChange("yearsOfExperience", value)}>
                  <SelectTrigger className={errors.yearsOfExperience ? "border-red-500" : ""}>
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
                {errors.yearsOfExperience && (
                  <p className="text-sm text-red-500">{errors.yearsOfExperience}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="existingClientBase">Existing Client Base (Optional)</Label>
              <Textarea
                id="existingClientBase"
                value={formData.existingClientBase}
                onChange={(e) => handleInputChange("existingClientBase", e.target.value)}
                placeholder="Provide a high-level overview of your current client portfolio..."
                rows={3}
              />
              <p className="text-sm text-gray-500">Brief description of your existing clients and market presence</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Target Regions
              </Label>
              <MultiSelectTags
                value={formData.targetRegions}
                onChange={(value) => handleInputChange("targetRegions", value)}
                suggestions={regions}
                placeholder="Select target regions..."
                className={errors.targetRegions ? "border-red-500" : ""}
              />
              {errors.targetRegions && (
                <p className="text-sm text-red-500">{errors.targetRegions}</p>
              )}
              <p className="text-sm text-gray-500">Countries and regions where you operate or want to expand</p>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Engagement Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Engagement Type Interested In</Label>
              <MultiSelectTags
                value={formData.engagementTypeInterestedIn}
                onChange={(value) => handleInputChange("engagementTypeInterestedIn", value)}
                suggestions={engagementTypes}
                placeholder="Select engagement types..."
                className={errors.engagementTypeInterestedIn ? "border-red-500" : ""}
              />
              {errors.engagementTypeInterestedIn && (
                <p className="text-sm text-red-500">{errors.engagementTypeInterestedIn}</p>
              )}
              <p className="text-sm text-gray-500">Types of partnerships and arrangements you're open to</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacityCommitment" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Capacity & Commitment (Hours/Week)
              </Label>
              <Input
                id="capacityCommitment"
                type="number"
                min="1"
                value={formData.capacityCommitment}
                onChange={(e) => handleInputChange("capacityCommitment", e.target.value)}
                placeholder="e.g., 40"
                className={errors.capacityCommitment ? "border-red-500" : ""}
              />
              {errors.capacityCommitment && (
                <p className="text-sm text-red-500">{errors.capacityCommitment}</p>
              )}
              <p className="text-sm text-gray-500">Total hours your team can commit per week to BD activities</p>
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
