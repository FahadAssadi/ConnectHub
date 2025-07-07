"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Award,
  Target,
  DollarSign,
  Calendar,
  Edit,
  Save,
  X,
} from "lucide-react"

type PartnerProfileFormData = {
  // Personal Details
  firstName: string
  lastName: string
  email: string
  phone: string
  linkedinProfile: string

  // Professional Background
  currentJobTitle: string
  currentCompany: string
  yearsOfExperience: string
  professionalSummary: string

  // Industry & Domain Expertise
  primaryIndustries: string[]
  secondaryIndustries: string[]
  productCategories: string[]
  technicalExpertise: string[]

  // Market Access & Influence
  primaryRegions: string[]
  secondaryRegions: string[]
  customerTypes: string[]
  keyRelationships: string

  // Engagement Preferences
  preferredCommissionStructure: string[]
  minimumCommissionRate: string
  preferredDealSize: string
  salesCyclePreference: string
  supportRequirements: string[]

  // Optional Showcase
  keyAchievements: string[]
  certifications: string[]
  languages: string[]

  // Availability
  availabilityStatus: string
  hoursPerWeek: string
  startDate: string
}

export function PartnerProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<PartnerProfileFormData>({
    // Personal Details
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@email.com",
    phone: "+61 412 345 678",
    linkedinProfile: "https://linkedin.com/in/janedoe",

    // Professional Background
    currentJobTitle: "Senior Business Development Manager",
    currentCompany: "TechSales Solutions",
    yearsOfExperience: "8",
    professionalSummary:
      "Experienced business development professional with 8+ years in SaaS and technology sales. Proven track record of $2M+ annual sales with expertise in enterprise analytics, security systems, and data solutions. Strong relationships with CTOs and decision-makers across Australia and APAC region.",

    // Industry & Domain Expertise
    primaryIndustries: ["Software & Technology", "Security Technology", "Data Analytics"],
    secondaryIndustries: ["Healthcare Technology", "Manufacturing"],
    productCategories: ["SaaS Solutions", "Analytics Platforms", "Security Systems", "Enterprise Software"],
    technicalExpertise: ["Cloud Computing", "Data Analytics", "Cybersecurity", "API Integration"],

    // Market Access & Influence
    primaryRegions: ["Australia", "New Zealand"],
    secondaryRegions: ["Singapore", "Hong Kong"],
    customerTypes: ["Enterprises", "SMEs", "Government"],
    keyRelationships:
      "Strong relationships with CTOs, IT Directors, and procurement teams at 50+ organizations including major banks, healthcare providers, and manufacturing companies.",

    // Engagement Preferences
    preferredCommissionStructure: ["Recurring Commission", "Upfront + Recurring"],
    minimumCommissionRate: "15",
    preferredDealSize: "$10,000 - $100,000",
    salesCyclePreference: "3-12 months",
    supportRequirements: ["Technical Sales Support", "Marketing Materials", "Training"],

    // Optional Showcase
    keyAchievements: [
      "Achieved 150% of sales target for 3 consecutive years",
      "Successfully launched 5 new products in Australian market",
      "Built partner network generating $2M+ annual revenue",
    ],
    certifications: ["Salesforce Certified", "AWS Cloud Practitioner", "Cybersecurity Fundamentals"],
    languages: ["English (Native)", "Mandarin (Conversational)"],

    // Availability
    availabilityStatus: "Available for new partnerships",
    hoursPerWeek: "20-30",
    startDate: "Immediate",
  })

  const handleInputChange = <K extends keyof PartnerProfileFormData>(field: K, value: PartnerProfileFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleArrayChange = <K extends keyof PartnerProfileFormData>(
    field: K,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter((item) => item !== value),
    }))
  }

  const handleSave = () => {
    console.log("Saving profile data:", formData)
    setIsEditing(false)
    // Here you would typically send the data to your backend
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data to original values if needed
  }

  const profileCompleteness = 85 // Calculate based on filled fields

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your professional information and partnership preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Completeness */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Profile Completeness</h3>
              <p className="text-sm text-gray-600">Complete your profile to get better matches</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{profileCompleteness}%</div>
              <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${profileCompleteness}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="h-10 w-10 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {formData.firstName} {formData.lastName}
              </h3>
              <p className="text-gray-600 mb-2">{formData.currentJobTitle}</p>
              <p className="text-sm text-gray-500 mb-4">{formData.currentCompany}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {formData.email}
                </div>
                <div className="flex items-center justify-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {formData.phone}
                </div>
                <div className="flex items-center justify-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {formData.primaryRegions.join(", ")}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{formData.yearsOfExperience} years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Availability</span>
                  <span className="font-medium">{formData.hoursPerWeek} hrs/week</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Min Commission</span>
                  <span className="font-medium">{formData.minimumCommissionRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedinProfile}
                  onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Background */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Professional Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobTitle">Current Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.currentJobTitle}
                    onChange={(e) => handleInputChange("currentJobTitle", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Current Company</Label>
                  <Input
                    id="company"
                    value={formData.currentCompany}
                    onChange={(e) => handleInputChange("currentCompany", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Select
                  value={formData.yearsOfExperience}
                  onValueChange={(value) => handleInputChange("yearsOfExperience", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-8">5-8 years</SelectItem>
                    <SelectItem value="8">8+ years</SelectItem>
                    <SelectItem value="10">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={formData.professionalSummary}
                  onChange={(e) => handleInputChange("professionalSummary", e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Industry & Domain Expertise */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Industry & Domain Expertise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Primary Industries</Label>
                <p className="text-sm text-gray-600 mb-3">Industries where you have the most experience</p>
                <div className="flex flex-wrap gap-2">
                  {formData.primaryIndustries.map((industry, index) => (
                    <Badge key={index} variant="default">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Product Categories</Label>
                <p className="text-sm text-gray-600 mb-3">Types of products you specialize in</p>
                <div className="flex flex-wrap gap-2">
                  {formData.productCategories.map((category, index) => (
                    <Badge key={index} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Technical Expertise</Label>
                <p className="text-sm text-gray-600 mb-3">Technical areas you understand well</p>
                <div className="flex flex-wrap gap-2">
                  {formData.technicalExpertise.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Access & Influence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Market Access & Influence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Primary Regions</Label>
                <p className="text-sm text-gray-600 mb-3">Regions where you have strong market presence</p>
                <div className="flex flex-wrap gap-2">
                  {formData.primaryRegions.map((region, index) => (
                    <Badge key={index} variant="default">
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Target Customer Types</Label>
                <p className="text-sm text-gray-600 mb-3">Types of customers you typically engage with</p>
                <div className="flex flex-wrap gap-2">
                  {formData.customerTypes.map((type, index) => (
                    <Badge key={index} variant="outline">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="relationships">Key Relationships & Network</Label>
                <Textarea
                  id="relationships"
                  value={formData.keyRelationships}
                  onChange={(e) => handleInputChange("keyRelationships", e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Engagement Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Engagement Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minCommission">Minimum Commission Rate (%)</Label>
                  <Input
                    id="minCommission"
                    type="number"
                    value={formData.minimumCommissionRate}
                    onChange={(e) => handleInputChange("minimumCommissionRate", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="dealSize">Preferred Deal Size</Label>
                  <Select
                    value={formData.preferredDealSize}
                    onValueChange={(value) => handleInputChange("preferredDealSize", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$1,000 - $10,000">$1,000 - $10,000</SelectItem>
                      <SelectItem value="$10,000 - $100,000">$10,000 - $100,000</SelectItem>
                      <SelectItem value="$100,000 - $500,000">$100,000 - $500,000</SelectItem>
                      <SelectItem value="$500,000+">$500,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Preferred Commission Structure</Label>
                <p className="text-sm text-gray-600 mb-3">Types of commission structures you prefer</p>
                <div className="flex flex-wrap gap-2">
                  {formData.preferredCommissionStructure.map((structure, index) => (
                    <Badge key={index} variant="default">
                      {structure}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Support Requirements</Label>
                <p className="text-sm text-gray-600 mb-3">Types of support you need from companies</p>
                <div className="flex flex-wrap gap-2">
                  {formData.supportRequirements.map((requirement, index) => (
                    <Badge key={index} variant="outline">
                      {requirement}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optional Showcase */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Professional Showcase
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Key Achievements</Label>
                <div className="space-y-2 mt-2">
                  {formData.keyAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-start text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2"></div>
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Certifications</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Languages</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.languages.map((language, index) => (
                    <Badge key={index} variant="outline">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Current Status</Label>
                <Select
                  value={formData.availabilityStatus}
                  onValueChange={(value) => handleInputChange("availabilityStatus", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available for new partnerships">Available for new partnerships</SelectItem>
                    <SelectItem value="Selectively available">Selectively available</SelectItem>
                    <SelectItem value="Not currently available">Not currently available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hours">Hours per Week</Label>
                  <Select
                    value={formData.hoursPerWeek}
                    onValueChange={(value) => handleInputChange("hoursPerWeek", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5-10">5-10 hours</SelectItem>
                      <SelectItem value="10-20">10-20 hours</SelectItem>
                      <SelectItem value="20-30">20-30 hours</SelectItem>
                      <SelectItem value="30+">30+ hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Available Start Date</Label>
                  <Select
                    value={formData.startDate}
                    onValueChange={(value) => handleInputChange("startDate", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Immediate">Immediate</SelectItem>
                      <SelectItem value="Within 2 weeks">Within 2 weeks</SelectItem>
                      <SelectItem value="Within 1 month">Within 1 month</SelectItem>
                      <SelectItem value="Within 3 months">Within 3 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
