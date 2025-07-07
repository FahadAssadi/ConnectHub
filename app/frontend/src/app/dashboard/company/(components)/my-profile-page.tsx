"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Building, User, Save, Edit, X } from "lucide-react"

export function MyProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "Acme Corp.",
    registeredBusinessName: "Acme Corporation Pty Ltd",
    websiteUrl: "https://acmecorp.com",
    industry: "Software",
    businessType: "SME",
    country: "Australia",
    headOfficeLocation: "Sydney, NSW",
    yearOfIncorporation: "2018",
    fullName: "John Smith",
    jobTitle: "CEO & Founder",
    email: "john.smith@acmecorp.com",
    phoneNumber: "+61 2 8123 4567",
    linkedinProfile: "https://linkedin.com/in/johnsmith",
    companyDescription:
      "Acme Corp is a leading provider of cloud-based analytics solutions for enterprise clients. We specialize in helping businesses transform their data into actionable insights through our innovative platform that combines machine learning, real-time processing, and intuitive visualization tools.",
    businessRegistrationNumber: "12 345 678 901",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log("Saving profile:", formData)
    setIsEditing(false)
    // Here you would typically make an API call to save the data
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data to original values if needed
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your company information and contact details</p>
        </div>
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

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              {isEditing ? (
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                />
              ) : (
                <p className="text-gray-900 font-medium">{formData.companyName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="registeredBusinessName">Registered Business Name</Label>
              {isEditing ? (
                <Input
                  id="registeredBusinessName"
                  value={formData.registeredBusinessName}
                  onChange={(e) => handleInputChange("registeredBusinessName", e.target.value)}
                />
              ) : (
                <p className="text-gray-900">{formData.registeredBusinessName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              {isEditing ? (
                <Input
                  id="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                />
              ) : (
                <a
                  href={formData.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {formData.websiteUrl}
                </a>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              {isEditing ? (
                <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="FMCG">FMCG</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Professional Services">Professional Services</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="secondary">{formData.industry}</Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type *</Label>
              {isEditing ? (
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => handleInputChange("businessType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Startup">Startup</SelectItem>
                    <SelectItem value="SME">SME</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                    <SelectItem value="Distributor">Distributor</SelectItem>
                    <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="Service Provider">Service Provider</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="outline">{formData.businessType}</Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country of Registration *</Label>
              {isEditing ? (
                <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
                    <SelectItem value="United States">🇺🇸 United States</SelectItem>
                    <SelectItem value="United Kingdom">🇬🇧 United Kingdom</SelectItem>
                    <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                    <SelectItem value="New Zealand">🇳🇿 New Zealand</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-gray-900">{formData.country}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="headOfficeLocation">Head Office Location</Label>
              {isEditing ? (
                <Input
                  id="headOfficeLocation"
                  value={formData.headOfficeLocation}
                  onChange={(e) => handleInputChange("headOfficeLocation", e.target.value)}
                />
              ) : (
                <p className="text-gray-900">{formData.headOfficeLocation}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearOfIncorporation">Year of Incorporation</Label>
              {isEditing ? (
                <Select
                  value={formData.yearOfIncorporation}
                  onValueChange={(value) => handleInputChange("yearOfIncorporation", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
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
              ) : (
                <p className="text-gray-900">{formData.yearOfIncorporation}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyDescription">Company Description</Label>
            {isEditing ? (
              <Textarea
                id="companyDescription"
                value={formData.companyDescription}
                onChange={(e) => handleInputChange("companyDescription", e.target.value)}
                rows={4}
              />
            ) : (
              <p className="text-gray-900">{formData.companyDescription}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessRegistrationNumber">ABN/Business Registration Number</Label>
            {isEditing ? (
              <Input
                id="businessRegistrationNumber"
                value={formData.businessRegistrationNumber}
                onChange={(e) => handleInputChange("businessRegistrationNumber", e.target.value)}
              />
            ) : (
              <p className="text-gray-900">{formData.businessRegistrationNumber}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Primary Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Primary Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              {isEditing ? (
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                />
              ) : (
                <p className="text-gray-900 font-medium">{formData.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title/Designation *</Label>
              {isEditing ? (
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                />
              ) : (
                <p className="text-gray-900">{formData.jobTitle}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              ) : (
                <p className="text-gray-900">{formData.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              {isEditing ? (
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                />
              ) : (
                <p className="text-gray-900">{formData.phoneNumber}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
              {isEditing ? (
                <Input
                  id="linkedinProfile"
                  value={formData.linkedinProfile}
                  onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
                />
              ) : (
                <a
                  href={formData.linkedinProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {formData.linkedinProfile}
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <p className="font-medium text-green-900">Account Verified</p>
              <p className="text-sm text-green-700">Your company profile has been approved and is active</p>
            </div>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
