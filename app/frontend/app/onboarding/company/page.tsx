"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { CommonCompanyDetailsForm } from "../(components)/common-company-form"

/**
 * Onboarding Step 2a: Company Profile Registration
 * Collects company details and creates CompanyProfile
 */
export default function RegisterCompanyPage() {
  const router = useRouter()
  const [countries, setCountries] = useState<Array<{ id: string; name: string }>>([])
  const [formData, setFormData] = useState({
    commonDetails: {
      companyName: "",
      businessRegNumber: "",
      registeredBuisnessName: "",
      countryOfRegistrationId: "",
      registeredAddress: "",
      contactPersonName: "",
      contactPersonDesignation: "",
      contactPersonEmail: "",
      contactPersonPhone: "",
      websiteURL: "",
      linkedInURL: "",
      logoURL: "",
      profileDeckURL: "",
      yearOfEstablishment: undefined as number | undefined,
      description: "",
    },
    ndaAgreed: false,
    headOfficeLocation: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/countries", {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          setCountries(data)
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error)
      } finally {
        setIsLoadingCountries(false)
      }
    }

    fetchCountries()
  }, [])

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (field.startsWith("commonDetails.")) {
      const fieldName = field.replace("commonDetails.", "")
      setFormData((prev) => ({
        ...prev,
        commonDetails: {
          ...prev.commonDetails,
          [fieldName]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.commonDetails.companyName.trim()) {
      newErrors.companyName = "Company name is required"
    }
    if (!formData.commonDetails.businessRegNumber.trim()) {
      newErrors.businessRegNumber = "Business registration number is required"
    }
    if (!formData.commonDetails.countryOfRegistrationId) {
      newErrors.countryOfRegistrationId = "Country is required"
    }
    if (!formData.commonDetails.registeredAddress.trim()) {
      newErrors.registeredAddress = "Registered address is required"
    }
    if (!formData.commonDetails.contactPersonName.trim()) {
      newErrors.contactPersonName = "Contact person name is required"
    }
    if (!formData.commonDetails.contactPersonDesignation.trim()) {
      newErrors.contactPersonDesignation = "Designation is required"
    }
    if (!formData.commonDetails.contactPersonEmail.trim()) {
      newErrors.contactPersonEmail = "Contact email is required"
    }
    if (!formData.commonDetails.contactPersonPhone.trim()) {
      newErrors.contactPersonPhone = "Contact phone is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch("http://localhost:3000/registration/company", {
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

  if (isLoadingCountries) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Link
          href="/onboarding"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to role selection
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Register Your Company</h1>
          <p className="text-gray-600">
            Provide your company details to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Company Details */}
          <CommonCompanyDetailsForm
            data={formData.commonDetails}
            errors={errors}
            onChange={handleInputChange}
            countries={countries}
          />

          {/* Company-Specific Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Company Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headOfficeLocation">Head Office Location</Label>
                <Input
                  id="headOfficeLocation"
                  value={formData.headOfficeLocation}
                  onChange={(e) => handleInputChange("headOfficeLocation", e.target.value)}
                  placeholder="City or region"
                />
              </div>

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
              {errors.ndaAgreed && <p className="text-sm text-red-500">{errors.ndaAgreed}</p>}
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
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register Company"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
