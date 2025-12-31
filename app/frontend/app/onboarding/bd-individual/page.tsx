"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"

/**
 * Onboarding Step 2b: BD Partner Individual Profile Registration
 * Collects personal and professional details
 */
export default function RegisterBdIndividualPage() {
  const router = useRouter()
  const [countries, setCountries] = useState<Array<{ id: string; name: string }>>([])
  const [states, setStates] = useState<Array<{ id: string; name: string }>>([])
  const [yearsOfExp, setYearsOfExp] = useState<Array<{ id: string; range: string }>>([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryId: "",
    stateOrProvinceId: "",
    city: "",
    ndaAgreed: false,
    yearsOfExperienceId: "",
    fluencyInEnglish: "",
    referralNetworkDescription: "",
    availabilityHoursPerWeek: undefined as number | undefined,
    linkedInURL: "",
    resumeURL: "",
    idProofURL: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Fetch lookup data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countriesRes, yearsRes] = await Promise.all([
          fetch("http://localhost:3000/api/countries", { credentials: "include" }),
          fetch("http://localhost:3000/api/years-of-experience", { credentials: "include" }),
        ])

        if (countriesRes.ok) {
          const data = await countriesRes.json()
          setCountries(data)
        }

        if (yearsRes.ok) {
          const data = await yearsRes.json()
          setYearsOfExp(data)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [])

  // Fetch states when country changes
  useEffect(() => {
    if (!formData.countryId) {
      setStates([])
      return
    }

    const fetchStates = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/countries/${formData.countryId}/states`,
          { credentials: "include" }
        )
        if (response.ok) {
          const data = await response.json()
          setStates(data)
        }
      } catch (error) {
        console.error("Failed to fetch states:", error)
      }
    }

    fetchStates()
  }, [formData.countryId])

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.countryId) newErrors.countryId = "Country is required"
    if (!formData.stateOrProvinceId) newErrors.stateOrProvinceId = "State/Province is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.yearsOfExperienceId) newErrors.yearsOfExperienceId = "Years of experience is required"
    if (!formData.ndaAgreed) newErrors.ndaAgreed = "You must agree to the NDA"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch("http://localhost:3000/registration/bd-individual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 409 || response.status === 400) {
          setErrors({ submit: errorData.message || "Invalid data. Please try again." })
        } else {
          setErrors({ submit: "Failed to register. Please try again." })
        }
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Submission error:", error)
      setErrors({ submit: "An unexpected error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Link
          href="/onboarding"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to role selection
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Register as BD Partner (Individual)</h1>
          <p className="text-gray-600">
            Create your professional profile to connect with companies
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-red-500" : ""}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={errors.lastName ? "border-red-500" : ""}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                  placeholder="+1-555-0123"
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="countryId">Country *</Label>
                <select
                  id="countryId"
                  value={formData.countryId}
                  onChange={(e) => handleInputChange("countryId", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.countryId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.countryId && <p className="text-sm text-red-500">{errors.countryId}</p>}
              </div>

              {states.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="stateOrProvinceId">State/Province *</Label>
                  <select
                    id="stateOrProvinceId"
                    value={formData.stateOrProvinceId}
                    onChange={(e) => handleInputChange("stateOrProvinceId", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.stateOrProvinceId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a state/province</option>
                    {states.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.stateOrProvinceId && (
                    <p className="text-sm text-red-500">{errors.stateOrProvinceId}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={errors.city ? "border-red-500" : ""}
                  placeholder="New York"
                />
                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="yearsOfExperienceId">Years of Experience *</Label>
                <select
                  id="yearsOfExperienceId"
                  value={formData.yearsOfExperienceId}
                  onChange={(e) => handleInputChange("yearsOfExperienceId", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.yearsOfExperienceId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select experience level</option>
                  {yearsOfExp.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.range}
                    </option>
                  ))}
                </select>
                {errors.yearsOfExperienceId && (
                  <p className="text-sm text-red-500">{errors.yearsOfExperienceId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fluencyInEnglish">English Fluency</Label>
                <select
                  id="fluencyInEnglish"
                  value={formData.fluencyInEnglish}
                  onChange={(e) => handleInputChange("fluencyInEnglish", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                >
                  <option value="">Select fluency level</option>
                  <option value="BASIC">Basic</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="FLUENT">Fluent</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availabilityHoursPerWeek">Availability (hours per week)</Label>
                <Input
                  id="availabilityHoursPerWeek"
                  type="number"
                  step="0.5"
                  value={formData.availabilityHoursPerWeek || ""}
                  onChange={(e) =>
                    handleInputChange("availabilityHoursPerWeek", e.target.value ? parseFloat(e.target.value) : "")
                  }
                  placeholder="20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralNetworkDescription">Referral Network Description</Label>
                <Textarea
                  id="referralNetworkDescription"
                  value={formData.referralNetworkDescription}
                  onChange={(e) => handleInputChange("referralNetworkDescription", e.target.value)}
                  placeholder="Describe your network and how you can help..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedInURL">LinkedIn Profile</Label>
                <Input
                  id="linkedInURL"
                  type="url"
                  value={formData.linkedInURL}
                  onChange={(e) => handleInputChange("linkedInURL", e.target.value)}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resumeURL">Resume/CV URL</Label>
                <Input
                  id="resumeURL"
                  type="url"
                  value={formData.resumeURL}
                  onChange={(e) => handleInputChange("resumeURL", e.target.value)}
                  placeholder="https://cdn.example.com/resume.pdf"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idProofURL">ID Proof URL</Label>
                <Input
                  id="idProofURL"
                  type="url"
                  value={formData.idProofURL}
                  onChange={(e) => handleInputChange("idProofURL", e.target.value)}
                  placeholder="https://cdn.example.com/id.pdf"
                />
              </div>
            </CardContent>
          </Card>

          {/* Agreements */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ndaAgreed"
                  checked={formData.ndaAgreed}
                  onCheckedChange={(checked) => handleInputChange("ndaAgreed", checked as boolean)}
                />
                <Label htmlFor="ndaAgreed" className="font-normal cursor-pointer">
                  I agree to the NDA and terms of service *
                </Label>
              </div>
              {errors.ndaAgreed && <p className="text-sm text-red-500 mt-2">{errors.ndaAgreed}</p>}
            </CardContent>
          </Card>

          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register as BD Partner"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
