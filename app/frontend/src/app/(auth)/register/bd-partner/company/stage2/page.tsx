"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Calendar, Hash, Globe, User, Mail, Phone, Briefcase, Linkedin } from "lucide-react"
import RegistrationLayout from "@/components/registration/registration-layout"

// Mock data
const companyTypes = [
  "Private Limited Company",
  "Public Limited Company", 
  "Partnership",
  "Sole Proprietorship",
  "Limited Liability Partnership",
  "Corporation"
]

const countries = [
  "Australia", "United States", "United Kingdom", "Canada", "Singapore", "New Zealand"
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

export default function CompanyBDStage2() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    // Company Details
    companyName: "",
    yearEstablished: "",
    companyType: "",
    registrationNumber: "",
    registeredCompanyName: "",
    countryOfRegistration: "",
    website: "",
    linkedInSocialLinks: "",
    
    // Contact Person
    contactPersonName: "",
    designation: "",
    emailAddress: "",
    phoneNumber: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Company Details validation
    if (!formData.companyName) newErrors.companyName = "Company name is required"
    if (!formData.yearEstablished) newErrors.yearEstablished = "Year established is required"
    if (!formData.companyType) newErrors.companyType = "Company type is required"
    if (!formData.registrationNumber) newErrors.registrationNumber = "Registration number is required"
    if (!formData.countryOfRegistration) newErrors.countryOfRegistration = "Country of registration is required"

    // Contact Person validation
    if (!formData.contactPersonName) newErrors.contactPersonName = "Contact person name is required"
    if (!formData.designation) newErrors.designation = "Designation is required"
    if (!formData.emailAddress) {
      newErrors.emailAddress = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address"
    }
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required"

    // Optional field validation
    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = "Please enter a valid website URL (starting with http:// or https://)"
    }
    if (formData.linkedInSocialLinks && !formData.linkedInSocialLinks.includes('linkedin.com')) {
      newErrors.linkedInSocialLinks = "Please enter a valid LinkedIn URL"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      console.log("Saving company BD details:", formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push("/register/bd-partner/company/stage3")
    } catch (error) {
      console.error("Save error:", error)
      setErrors({ submit: "Failed to save details. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-populate registered company name
    if (field === "registrationNumber" && value) {
      setFormData(prev => ({ ...prev, registeredCompanyName: `${formData.companyName} Pty Ltd` }))
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <RegistrationLayout
      title="Company Details & Contact"
      description="Provide your company information and primary contact details"
      currentStage={2}
      totalStages={4}
      userType="company_bd"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.submit && (
          <Alert variant="destructive">
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        {/* Company Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="Enter your company name"
                  className={errors.companyName ? "border-red-500" : ""}
                />
                {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Year Established
                </Label>
                <Select onValueChange={(value) => handleInputChange("yearEstablished", value)}>
                  <SelectTrigger className={errors.yearEstablished ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.yearEstablished && <p className="text-sm text-red-500">{errors.yearEstablished}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Type</Label>
                <Select onValueChange={(value) => handleInputChange("companyType", value)}>
                  <SelectTrigger className={errors.companyType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select company type" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.companyType && <p className="text-sm text-red-500">{errors.companyType}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber" className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Registration Number
                </Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                  placeholder="Company registration number"
                  className={errors.registrationNumber ? "border-red-500" : ""}
                />
                {errors.registrationNumber && <p className="text-sm text-red-500">{errors.registrationNumber}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registeredCompanyName">Registered Company Name</Label>
              <Input
                id="registeredCompanyName"
                value={formData.registeredCompanyName}
                readOnly
                placeholder="Will be auto-populated"
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-500">Auto-populated based on registration details</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Country of Registration
              </Label>
              <Select onValueChange={(value) => handleInputChange("countryOfRegistration", value)}>
                <SelectTrigger className={errors.countryOfRegistration ? "border-red-500" : ""}>
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
              {errors.countryOfRegistration && <p className="text-sm text-red-500">{errors.countryOfRegistration}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://www.yourcompany.com"
                  className={errors.website ? "border-red-500" : ""}
                />
                {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedInSocialLinks" className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn / Social Links (Optional)
                </Label>
                <Input
                  id="linkedInSocialLinks"
                  value={formData.linkedInSocialLinks}
                  onChange={(e) => handleInputChange("linkedInSocialLinks", e.target.value)}
                  placeholder="https://linkedin.com/company/yourcompany"
                  className={errors.linkedInSocialLinks ? "border-red-500" : ""}
                />
                {errors.linkedInSocialLinks && <p className="text-sm text-red-500">{errors.linkedInSocialLinks}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Person Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Contact Person
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPersonName">Full Name</Label>
                <Input
                  id="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
                  placeholder="Primary contact person"
                  className={errors.contactPersonName ? "border-red-500" : ""}
                />
                {errors.contactPersonName && <p className="text-sm text-red-500">{errors.contactPersonName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Designation
                </Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => handleInputChange("designation", e.target.value)}
                  placeholder="e.g., BD Manager, CEO, Sales Director"
                  className={errors.designation ? "border-red-500" : ""}
                />
                {errors.designation && <p className="text-sm text-red-500">{errors.designation}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
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
                  placeholder="contact@company.com"
                  className={errors.emailAddress ? "border-red-500" : ""}
                />
                {errors.emailAddress && <p className="text-sm text-red-500">{errors.emailAddress}</p>}
                <p className="text-sm text-gray-500">Should match your login email</p>
              </div>

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
                  placeholder="+61 X XXXX XXXX"
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
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
