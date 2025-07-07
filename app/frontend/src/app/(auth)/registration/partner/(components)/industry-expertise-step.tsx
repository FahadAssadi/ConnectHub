"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Briefcase, X, Plus } from "lucide-react"

interface IndustryExpertiseStepProps {
  onNext: (data: any) => void
  onPrevious: () => void
  formData: any
  isFirstStep: boolean
  isLastStep: boolean
}

export function IndustryExpertiseStep({ onNext, onPrevious, formData }: IndustryExpertiseStepProps) {
  const [data, setData] = useState({
    primaryIndustry: formData.primaryIndustry || "",
    subDomains: (formData.subDomains as string[]) || [],
    professionalBackground: formData.professionalBackground || "",
    expertiseAreas: formData.expertiseAreas || [],
  })

  const [newExpertiseTag, setNewExpertiseTag] = useState("")

  const industries = [
    { value: "software", label: "Software & Technology", icon: "💻" },
    { value: "realestate", label: "Real Estate", icon: "🏠" },
    { value: "fmcg", label: "FMCG", icon: "📦" },
    { value: "healthcare", label: "Healthcare", icon: "🏥" },
    { value: "manufacturing", label: "Manufacturing", icon: "🏭" },
    { value: "finance", label: "Finance", icon: "💰" },
    { value: "education", label: "Education", icon: "🎓" },
    { value: "retail", label: "Retail", icon: "🛍️" },
  ]

  const subDomainOptions: Record<string, string[]> = {
    software: ["SaaS", "Mobile Apps", "Enterprise Software", "AI/ML", "Cybersecurity", "Cloud Services"],
    realestate: ["Residential", "Commercial", "Property Management", "Real Estate Tech", "Investment"],
    fmcg: ["Food & Beverage", "Personal Care", "Household Products", "Health & Wellness"],
    healthcare: ["Medical Devices", "Pharmaceuticals", "Digital Health", "Healthcare Services"],
    manufacturing: ["Industrial Equipment", "Automotive", "Electronics", "Textiles"],
    finance: ["Fintech", "Banking", "Insurance", "Investment", "Accounting"],
    education: ["EdTech", "Training", "E-learning", "Corporate Education"],
    retail: ["E-commerce", "Fashion", "Electronics", "Home & Garden"],
  }

  const suggestedExpertise: Record<string, string[]> = {
    software: ["API Integration", "Cloud Migration", "Digital Transformation", "Product Management"],
    realestate: ["Market Analysis", "Property Valuation", "Investment Strategy", "Regulatory Compliance"],
    fmcg: ["Supply Chain", "Brand Management", "Retail Distribution", "Consumer Insights"],
    healthcare: ["Regulatory Affairs", "Clinical Research", "Healthcare IT", "Patient Care"],
    manufacturing: ["Process Optimization", "Quality Control", "Supply Chain", "Automation"],
    finance: ["Risk Management", "Compliance", "Digital Banking", "Investment Analysis"],
    education: ["Curriculum Development", "Learning Analytics", "Student Engagement", "Assessment"],
    retail: ["Customer Experience", "Inventory Management", "Digital Marketing", "Omnichannel"],
  }

  const handleSubDomainToggle = (subDomain: string) => {
    setData((prev) => ({
      ...prev,
      subDomains: prev.subDomains.includes(subDomain)
        ? prev.subDomains.filter((item: string) => item !== subDomain)
        : [...prev.subDomains, subDomain],
    }))
  }

  const handleAddExpertise = () => {
    if (newExpertiseTag.trim() && !data.expertiseAreas.includes(newExpertiseTag.trim())) {
      setData((prev) => ({
        ...prev,
        expertiseAreas: [...prev.expertiseAreas, newExpertiseTag.trim()],
      }))
      setNewExpertiseTag("")
    }
  }

  const handleRemoveExpertise = (expertise: string) => {
    setData((prev) => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.filter((item: string) => item !== expertise),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddExpertise()
    }
  }

  const isFormValid = () => {
    return data.primaryIndustry && data.professionalBackground.length >= 50
  }

  const handleSubmit = () => {
    if (isFormValid()) {
      onNext(data)
    }
  }

  const selectedIndustry = industries.find((ind) => ind.value === data.primaryIndustry)
  const availableSubDomains = data.primaryIndustry ? subDomainOptions[data.primaryIndustry] || [] : []
  const suggestedTags = data.primaryIndustry ? suggestedExpertise[data.primaryIndustry] || [] : []

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Your professional expertise</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Primary Industry Domain */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Primary Industry Domain <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.primaryIndustry}
              onValueChange={(value) => setData((prev) => ({ ...prev, primaryIndustry: value, subDomains: [] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your primary industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry.value} value={industry.value}>
                    <div className="flex items-center space-x-2">
                      <span>{industry.icon}</span>
                      <span>{industry.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Industry Sub-domains */}
          {availableSubDomains.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Industry Sub-domains <span className="text-gray-500">(Select all that apply)</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {availableSubDomains.map((subDomain) => (
                  <div
                    key={subDomain}
                    onClick={() => handleSubDomainToggle(subDomain)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      data.subDomains.includes(subDomain)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{subDomain}</span>
                      {data.subDomains.includes(subDomain) && (
                        <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {data.subDomains.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.subDomains.map((subDomain: string) => (
                    <Badge key={subDomain} variant="secondary" className="bg-blue-100 text-blue-800">
                      {subDomain}
                      <button
                        onClick={() => handleSubDomainToggle(subDomain)}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Professional Background */}
          <div className="space-y-2">
            <Label htmlFor="background" className="text-sm font-medium">
              Professional Background <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="background"
              placeholder="Describe your professional background, key achievements, and relevant experience. Include your years of experience, notable companies you've worked with, and specific accomplishments that demonstrate your expertise."
              value={data.professionalBackground}
              onChange={(e) => setData((prev) => ({ ...prev, professionalBackground: e.target.value }))}
              rows={6}
              className="resize-none"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Minimum 50 characters required</span>
              <span className={data.professionalBackground.length >= 50 ? "text-green-600" : "text-gray-500"}>
                {data.professionalBackground.length}/1000 characters
              </span>
            </div>
          </div>

          {/* Top 3 Areas of Expertise */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Top Areas of Expertise <span className="text-gray-500">(Add up to 10 tags)</span>
            </Label>

            <div className="flex space-x-2">
              <Input
                placeholder="Type an expertise area and press Enter"
                value={newExpertiseTag}
                onChange={(e) => setNewExpertiseTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                maxLength={50}
              />
              <Button
                type="button"
                onClick={handleAddExpertise}
                disabled={!newExpertiseTag.trim() || data.expertiseAreas.length >= 10}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Suggested Tags */}
            {suggestedTags.length > 0 && data.expertiseAreas.length < 10 && (
              <div>
                <p className="text-xs text-gray-600 mb-2">Suggested for {selectedIndustry?.label}:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags
                    .filter((tag) => !data.expertiseAreas.includes(tag))
                    .slice(0, 6)
                    .map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setData((prev) => ({ ...prev, expertiseAreas: [...prev.expertiseAreas, tag] }))}
                        className="text-xs h-7"
                      >
                        + {tag}
                      </Button>
                    ))}
                </div>
              </div>
            )}

            {/* Selected Expertise Tags */}
            {data.expertiseAreas.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.expertiseAreas.map((expertise: string, index: number) => (
                  <Badge
                    key={expertise}
                    className={`${
                      index < 3 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                    } hover:bg-opacity-80`}
                  >
                    {expertise}
                    <button
                      onClick={() => handleRemoveExpertise(expertise)}
                      className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {data.expertiseAreas.length > 3 && (
              <p className="text-xs text-gray-600">First 3 tags are highlighted as your primary expertise areas</p>
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
