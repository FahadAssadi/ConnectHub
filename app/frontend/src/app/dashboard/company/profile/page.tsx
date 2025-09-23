"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle, Clock, Plus, X, Edit, Save, Camera } from "lucide-react"

// Mock company data
const mockCompanyData = {
  basicInfo: {
    companyName: "TechCorp Solutions",
    abn: "12 345 678 901",
    registrationNumber: "ACN 123 456 789",
    industryCategory: "technology",
    industrySubCategory: "software",
    industrySpecialization: "enterprise-solutions",
    yearEstablished: "2018",
    companyType: "private",
    registeredAddress: "Level 15, 123 Collins Street, Melbourne VIC 3000",
    headOfficeAddress: "Level 15, 123 Collins Street, Melbourne VIC 3000",
  },
  contactInfo: {
    primaryEmail: "contact@techcorp.com",
    primaryPhone: "+61 3 9123 4567",
    website: "https://techcorp.com",
    linkedinUrl: "https://linkedin.com/company/techcorp",
    contacts: [
      {
        id: 1,
        name: "John Smith",
        title: "CEO",
        email: "john@techcorp.com",
        phone: "+61 3 9123 4568",
        isPrimary: true,
      },
      {
        id: 2,
        name: "Sarah Johnson",
        title: "Head of Partnerships",
        email: "sarah@techcorp.com",
        phone: "+61 3 9123 4569",
        isPrimary: false,
      },
    ],
  },
  branding: {
    companyDescription: `TechCorp Solutions is a leading provider of enterprise software solutions, specializing in cloud-based analytics platforms and AI-powered business intelligence tools. Founded in 2018, we have grown to serve over 500 enterprise clients across Australia and the Asia-Pacific region.

Our mission is to empower businesses with data-driven insights that drive growth and operational efficiency. We combine cutting-edge technology with deep industry expertise to deliver solutions that transform how organizations operate and compete in the digital economy.`,
    logoUrl: "/company-logo.png",
    profileDeckUrl: "/company-profile-deck.pdf",
  },
  verification: {
    overallStatus: "verified",
    completionPercentage: 85,
    documents: [
      { type: "business_registration", status: "verified", uploadedDate: "2024-01-10" },
      { type: "tax_registration", status: "verified", uploadedDate: "2024-01-10" },
      { type: "insurance_certificate", status: "pending", uploadedDate: "2024-01-15" },
      { type: "financial_statements", status: "missing", uploadedDate: null },
      { type: "compliance_certificates", status: "verified", uploadedDate: "2024-01-12" },
    ],
  },
}

const industryCategories = {
  technology: {
    label: "Technology",
    subCategories: {
      software: {
        label: "Software",
        specializations: ["enterprise-solutions", "mobile-apps", "web-development", "saas-platforms"],
      },
      hardware: {
        label: "Hardware",
        specializations: ["networking", "servers", "iot-devices", "consumer-electronics"],
      },
      consulting: {
        label: "IT Consulting",
        specializations: ["digital-transformation", "cybersecurity", "cloud-migration", "data-analytics"],
      },
    },
  },
  finance: {
    label: "Finance",
    subCategories: {
      banking: {
        label: "Banking",
        specializations: ["retail-banking", "commercial-banking", "investment-banking", "digital-banking"],
      },
      insurance: {
        label: "Insurance",
        specializations: ["life-insurance", "property-insurance", "health-insurance", "commercial-insurance"],
      },
      fintech: {
        label: "FinTech",
        specializations: ["payments", "lending", "wealth-management", "cryptocurrency"],
      },
    },
  },
  healthcare: {
    label: "Healthcare",
    subCategories: {
      medical: {
        label: "Medical Services",
        specializations: ["primary-care", "specialist-care", "emergency-services", "mental-health"],
      },
      pharma: {
        label: "Pharmaceuticals",
        specializations: ["drug-development", "manufacturing", "distribution", "research"],
      },
      medtech: {
        label: "Medical Technology",
        specializations: ["medical-devices", "diagnostics", "telemedicine", "health-software"],
      },
    },
  },
}

const documentTypes = [
  { type: "business_registration", label: "Business Registration Certificate", required: true },
  { type: "tax_registration", label: "Tax Registration (ABN/GST)", required: true },
  { type: "insurance_certificate", label: "Professional Indemnity Insurance", required: true },
  { type: "financial_statements", label: "Financial Statements (Last 2 Years)", required: false },
  { type: "compliance_certificates", label: "Industry Compliance Certificates", required: false },
]

export default function ProfileManagement() {
  const [companyData, setCompanyData] = useState(mockCompanyData)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  const handleInputChange = (section: string, field: string, value: any) => {
    setCompanyData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleContactChange = (contactId: number, field: string, value: any) => {
    setCompanyData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        contacts: prev.contactInfo.contacts.map((contact) =>
          contact.id === contactId ? { ...contact, [field]: value } : contact,
        ),
      },
    }))
  }

  const addContact = () => {
    const newContact = {
      id: Date.now(),
      name: "",
      title: "",
      email: "",
      phone: "",
      isPrimary: false,
    }
    setCompanyData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        contacts: [...prev.contactInfo.contacts, newContact],
      },
    }))
  }

  const removeContact = (contactId: number) => {
    setCompanyData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        contacts: prev.contactInfo.contacts.filter((contact) => contact.id !== contactId),
      },
    }))
  }

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-chart-2" />
      case "pending":
        return <Clock className="h-4 w-4 text-accent" />
      case "missing":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return "default"
      case "pending":
        return "secondary"
      case "missing":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleSave = () => {
    // Handle save logic
    console.log("Saving company data:", companyData)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Company Profile</h1>
          <p className="text-muted-foreground text-pretty">Manage your company information and verification status</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Verification Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Profile Completion
                <Badge variant={companyData.verification.overallStatus === "verified" ? "default" : "secondary"}>
                  {companyData.verification.overallStatus}
                </Badge>
              </CardTitle>
              <CardDescription>Complete your profile to unlock all ConnectHub features</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{companyData.verification.completionPercentage}%</div>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={companyData.verification.completionPercentage} className="w-full" />
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="contact">Contact Details</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Basic details about your company</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={companyData.basicInfo.companyName}
                    onChange={(e) => handleInputChange("basicInfo", "companyName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abn">ABN *</Label>
                  <Input
                    id="abn"
                    value={companyData.basicInfo.abn}
                    onChange={(e) => handleInputChange("basicInfo", "abn", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={companyData.basicInfo.registrationNumber}
                    onChange={(e) => handleInputChange("basicInfo", "registrationNumber", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearEstablished">Year Established *</Label>
                  <Input
                    id="yearEstablished"
                    type="number"
                    value={companyData.basicInfo.yearEstablished}
                    onChange={(e) => handleInputChange("basicInfo", "yearEstablished", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Industry Classification</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="industryCategory">Category *</Label>
                    <Select
                      value={companyData.basicInfo.industryCategory}
                      onValueChange={(value) => handleInputChange("basicInfo", "industryCategory", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(industryCategories).map(([key, category]) => (
                          <SelectItem key={key} value={key}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industrySubCategory">Sub-Category *</Label>
                    <Select
                      value={companyData.basicInfo.industrySubCategory}
                      onValueChange={(value) => handleInputChange("basicInfo", "industrySubCategory", value)}
                      disabled={!isEditing || !companyData.basicInfo.industryCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub-category" />
                      </SelectTrigger>
                      <SelectContent>
                        {companyData.basicInfo.industryCategory &&
                          Object.entries(
                            industryCategories[
                              companyData.basicInfo.industryCategory as keyof typeof industryCategories
                            ].subCategories,
                          ).map(([key, subCategory]) => (
                            <SelectItem key={key} value={key}>
                              {subCategory.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industrySpecialization">Specialization *</Label>
                    <Select
                      value={companyData.basicInfo.industrySpecialization}
                      onValueChange={(value) => handleInputChange("basicInfo", "industrySpecialization", value)}
                      disabled={!isEditing || !companyData.basicInfo.industrySubCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {companyData.basicInfo.industryCategory &&
                          companyData.basicInfo.industrySubCategory &&
                          (() => {
                            const subCategories =
                              industryCategories[
                                companyData.basicInfo.industryCategory as keyof typeof industryCategories
                              ].subCategories;
                            const subCategory =
                              subCategories[
                                companyData.basicInfo.industrySubCategory as keyof typeof subCategories
                              ] as { label: string; specializations: string[] } | undefined;
                            if (subCategory && Array.isArray(subCategory.specializations)) {
                              return subCategory.specializations.map((specialization) => (
                                <SelectItem key={specialization} value={specialization}>
                                  {specialization.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                </SelectItem>
                              ));
                            }
                            return null;
                          })()}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyType">Company Type *</Label>
                <Select
                  value={companyData.basicInfo.companyType}
                  onValueChange={(value) => handleInputChange("basicInfo", "companyType", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private Company</SelectItem>
                    <SelectItem value="public">Public Company</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="sole-trader">Sole Trader</SelectItem>
                    <SelectItem value="trust">Trust</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Addresses</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="registeredAddress">Registered Address *</Label>
                    <Textarea
                      id="registeredAddress"
                      value={companyData.basicInfo.registeredAddress}
                      onChange={(e) => handleInputChange("basicInfo", "registeredAddress", e.target.value)}
                      disabled={!isEditing}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="headOfficeAddress">Head Office Address</Label>
                    <Textarea
                      id="headOfficeAddress"
                      value={companyData.basicInfo.headOfficeAddress}
                      onChange={(e) => handleInputChange("basicInfo", "headOfficeAddress", e.target.value)}
                      disabled={!isEditing}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Primary Contact Information</CardTitle>
              <CardDescription>Main contact details for your company</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryEmail">Primary Email *</Label>
                  <Input
                    id="primaryEmail"
                    type="email"
                    value={companyData.contactInfo.primaryEmail}
                    onChange={(e) => handleInputChange("contactInfo", "primaryEmail", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryPhone">Primary Phone *</Label>
                  <Input
                    id="primaryPhone"
                    value={companyData.contactInfo.primaryPhone}
                    onChange={(e) => handleInputChange("contactInfo", "primaryPhone", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={companyData.contactInfo.website}
                    onChange={(e) => handleInputChange("contactInfo", "website", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn Company Page</Label>
                  <Input
                    id="linkedinUrl"
                    type="url"
                    value={companyData.contactInfo.linkedinUrl}
                    onChange={(e) => handleInputChange("contactInfo", "linkedinUrl", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contact Persons</CardTitle>
                  <CardDescription>Key contacts within your organization</CardDescription>
                </div>
                {isEditing && (
                  <Button onClick={addContact} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {companyData.contactInfo.contacts.map((contact) => (
                <div key={contact.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Contact Person</h4>
                      {contact.isPrimary && <Badge variant="default">Primary</Badge>}
                    </div>
                    {isEditing && !contact.isPrimary && (
                      <Button variant="ghost" size="sm" onClick={() => removeContact(contact.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input
                        value={contact.name}
                        onChange={(e) => handleContactChange(contact.id, "name", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        value={contact.title}
                        onChange={(e) => handleContactChange(contact.id, "title", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={contact.email}
                        onChange={(e) => handleContactChange(contact.id, "email", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={contact.phone}
                        onChange={(e) => handleContactChange(contact.id, "phone", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Description</CardTitle>
              <CardDescription>Tell partners about your company and what you do</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="companyDescription">Company Description *</Label>
                <Textarea
                  id="companyDescription"
                  value={companyData.branding.companyDescription}
                  onChange={(e) => handleInputChange("branding", "companyDescription", e.target.value)}
                  disabled={!isEditing}
                  rows={8}
                  placeholder="Describe your company, mission, services, and what makes you unique..."
                />
                <p className="text-sm text-muted-foreground">
                  {companyData.branding.companyDescription.length} characters
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Company Logo</CardTitle>
                <CardDescription>Upload your company logo for partner materials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {companyData.branding.logoUrl ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={companyData.branding.logoUrl || "/placeholder.svg"}
                      alt="Company Logo"
                      className="w-16 h-16 object-contain border rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Current Logo</p>
                      <p className="text-sm text-muted-foreground">PNG, JPG up to 2MB</p>
                    </div>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Change
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Upload company logo</p>
                    <p className="text-xs text-muted-foreground mb-3">PNG, JPG up to 2MB</p>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Profile Deck</CardTitle>
                <CardDescription>Upload a presentation about your company</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {companyData.branding.profileDeckUrl ? (
                  <div className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">Company Profile Deck</p>
                      <p className="text-sm text-muted-foreground">PDF, PPT up to 10MB</p>
                    </div>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Replace
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Upload profile deck</p>
                    <p className="text-xs text-muted-foreground mb-3">PDF, PPT up to 10MB</p>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>Upload required documents to verify your company</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentTypes.map((docType) => {
                  const document = companyData.verification.documents.find((doc) => doc.type === docType.type)
                  return (
                    <div key={docType.type} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getVerificationStatusIcon(document?.status || "missing")}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{docType.label}</p>
                            {docType.required && <Badge variant="outline">Required</Badge>}
                          </div>
                          {document?.uploadedDate && (
                            <p className="text-sm text-muted-foreground">
                              Uploaded {new Date(document.uploadedDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={getVerificationStatusBadge(document?.status || "missing")}>
                          {document?.status || "missing"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          {document?.status ? "Replace" : "Upload"}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification Progress</CardTitle>
              <CardDescription>Track your verification status and next steps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {companyData.verification.completionPercentage}% Complete
                </span>
              </div>
              <Progress value={companyData.verification.completionPercentage} className="w-full" />

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-chart-2" />
                  <span className="text-sm">Basic company information completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-chart-2" />
                  <span className="text-sm">Contact information verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  <span className="text-sm">Insurance certificate under review</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">Financial statements required for full verification</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
