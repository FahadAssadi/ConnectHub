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
import { ArrowLeft, Loader2 } from "lucide-react"

interface Country {
  id: string
  name: string
}

interface State {
  id: string
  name: string
}

interface YearsOfExp {
  id: string
  range: string
}

interface BusinessStructure {
  id: string
  name: string
}

/**
 * Onboarding Step 2c: BD Partner Organization Profile Registration
 * Collects organization and professional details
 */
export default function RegisterBdOrgPage() {
  const router = useRouter()

  // Lookup data
  const [countries, setCountries] = useState<Country[]>([])
  const [states, setStates] = useState<State[]>([])
  const [yearsOfExp, setYearsOfExp] = useState<YearsOfExp[]>([])
  const [businessStructures, setBusinessStructures] = useState<BusinessStructure[]>([])

  // Form data
  const [formData, setFormData] = useState({
    // Company details
    companyName: "",
    businessRegNumber: "",
    countryId: "",
    stateOrProvinceId: "",
    address: "",
    contactEmail: "",
    contactPhoneNumber: "",
    officialWebsite: "",
    linkedInProfileURL: "",
    yearFounded: undefined as number | undefined,
    companyDescription: "",

    // Professional details
    businessStructureId: "",
    employeeCount: "",
    yearsOfExperienceId: "",
    referralNetworkDescription: "",
    availabilityHoursPerWeek: undefined as number | undefined,
    existingClientBase: "",
    ndaAgreed: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Fetch lookup data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countriesRes, yearsRes, structuresRes] = await Promise.all([
          fetch("http://localhost:3000/api/countries", { credentials: "include" }),
          fetch("http://localhost:3000/api/years-of-experience", { credentials: "include" }),
          fetch("http://localhost:3000/api/business-structures", { credentials: "include" }),
        ])

        if (countriesRes.ok) {
          const data = await countriesRes.json()
          setCountries(data)
        }

        if (yearsRes.ok) {
          const data = await yearsRes.json()
          setYearsOfExp(data)
        }

        if (structuresRes.ok) {
          const data = await structuresRes.json()
          setBusinessStructures(data)
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

    // Company details validation
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required"
    if (!formData.businessRegNumber.trim())
      newErrors.businessRegNumber = "Business registration number is required"
    if (!formData.countryId) newErrors.countryId = "Country is required"
    if (!formData.stateOrProvinceId) newErrors.stateOrProvinceId = "State/Province is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.contactEmail.trim()) newErrors.contactEmail = "Contact email is required"
    if (!formData.contactPhoneNumber.trim()) newErrors.contactPhoneNumber = "Contact phone is required"

    // Professional details validation
    if (!formData.businessStructureId) newErrors.businessStructureId = "Business structure is required"
    if (!formData.employeeCount) newErrors.employeeCount = "Employee count is required"
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
      const response = await fetch("http://localhost:3000/registration/bd-org", {
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Link
          href="/onboarding"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to role selection
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Register as BD Partner Organization</h1>
          <p className="text-gray-600">
            Create your organization profile to connect with companies
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className={errors.companyName ? "border-red-500" : ""}
                  placeholder="Acme Corporation"
                />
                {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessRegNumber">Business Registration Number *</Label>
                <Input
                  id="businessRegNumber"
                  value={formData.businessRegNumber}
                  onChange={(e) => handleInputChange("businessRegNumber", e.target.value)}
                  className={errors.businessRegNumber ? "border-red-500" : ""}
                  placeholder="123456789"
                />
                {errors.businessRegNumber && (
                  <p className="text-sm text-red-500">{errors.businessRegNumber}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={errors.address ? "border-red-500" : ""}
                  placeholder="123 Business St, Suite 100"
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    className={errors.contactEmail ? "border-red-500" : ""}
                    placeholder="contact@acme.com"
                  />
                  {errors.contactEmail && (
                    <p className="text-sm text-red-500">{errors.contactEmail}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhoneNumber">Contact Phone *</Label>
                  <Input
                    id="contactPhoneNumber"
                    type="tel"
                    value={formData.contactPhoneNumber}
                    onChange={(e) => handleInputChange("contactPhoneNumber", e.target.value)}
                    className={errors.contactPhoneNumber ? "border-red-500" : ""}
                    placeholder="+1-555-0123"
                  />
                  {errors.contactPhoneNumber && (
                    <p className="text-sm text-red-500">{errors.contactPhoneNumber}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearFounded">Year Founded</Label>
                <Input
                  id="yearFounded"
                  type="number"
                  value={formData.yearFounded || ""}
                  onChange={(e) =>
                    handleInputChange("yearFounded", e.target.value ? parseInt(e.target.value) : "")
                  }
                  placeholder="2020"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  value={formData.companyDescription}
                  onChange={(e) => handleInputChange("companyDescription", e.target.value)}
                  placeholder="Tell us about your company..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Organization Links */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="officialWebsite">Official Website</Label>
                <Input
                  id="officialWebsite"
                  type="url"
                  value={formData.officialWebsite}
                  onChange={(e) => handleInputChange("officialWebsite", e.target.value)}
                  placeholder="https://acme.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedInProfileURL">LinkedIn Profile</Label>
                <Input
                  id="linkedInProfileURL"
                  type="url"
                  value={formData.linkedInProfileURL}
                  onChange={(e) => handleInputChange("linkedInProfileURL", e.target.value)}
                  placeholder="https://linkedin.com/company/acme"
                />
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
                <Label htmlFor="businessStructureId">Business Structure *</Label>
                <select
                  id="businessStructureId"
                  value={formData.businessStructureId}
                  onChange={(e) => handleInputChange("businessStructureId", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.businessStructureId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select business structure</option>
                  {businessStructures.map((bs) => (
                    <option key={bs.id} value={bs.id}>
                      {bs.name}
                    </option>
                  ))}
                </select>
                {errors.businessStructureId && (
                  <p className="text-sm text-red-500">{errors.businessStructureId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeCount">Employee Count *</Label>
                <select
                  id="employeeCount"
                  value={formData.employeeCount}
                  onChange={(e) => handleInputChange("employeeCount", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.employeeCount ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select employee count</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
                {errors.employeeCount && (
                  <p className="text-sm text-red-500">{errors.employeeCount}</p>
                )}
              </div>

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
                <Label htmlFor="availabilityHoursPerWeek">Availability (hours per week)</Label>
                <Input
                  id="availabilityHoursPerWeek"
                  type="number"
                  step="0.5"
                  value={formData.availabilityHoursPerWeek || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "availabilityHoursPerWeek",
                      e.target.value ? parseFloat(e.target.value) : ""
                    )
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

              <div className="space-y-2">
                <Label htmlFor="existingClientBase">Existing Client Base</Label>
                <Textarea
                  id="existingClientBase"
                  value={formData.existingClientBase}
                  onChange={(e) => handleInputChange("existingClientBase", e.target.value)}
                  placeholder="Describe your existing clients..."
                  rows={3}
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
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register Organization"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
