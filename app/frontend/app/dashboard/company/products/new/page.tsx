"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"

interface YearsOfExperience {
  id: string
  yearsRange: string
}

interface EngagementModel {
  id: string
  name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [companyProfileId, setCompanyProfileId] = useState<string | null>(null)
  const [yoeOptions, setYoeOptions] = useState<YearsOfExperience[]>([])
  const [engagementOptions, setEngagementOptions] = useState<EngagementModel[]>([])

  const [formData, setFormData] = useState({
    name: "",
    type: "PRODUCT",
    shortDescription: "",
    detailedDescription: "",
    imageURL: "",
    paymentModel: "COMMISSION_BASED",
    indicativeIncentive: "",
    preferredYearsOfExperienceId: "",
    engagementMethodId: "",
    salesTrainingAvailable: false,
    status: "DRAFT",
  })

  useEffect(() => {
    async function fetchInitialData() {
      try {
        // Fetch user profile for company ID
        const profileRes = await fetch(`${API_BASE}/user-profile`, {
          credentials: "include",
        })
        if (profileRes.ok) {
          const profileData = await profileRes.json()
          setCompanyProfileId(profileData?.companyProfile?.id)
        }

        // Fetch years of experience options
        const yoeRes = await fetch(`${API_BASE}/lov/years-of-experience`, {
          credentials: "include",
        })
        if (yoeRes.ok) {
          const yoeData = await yoeRes.json()
          setYoeOptions(yoeData)
        }

        // Fetch engagement model options
        const engagementRes = await fetch(`${API_BASE}/lov/engagement-models`, {
          credentials: "include",
        })
        if (engagementRes.ok) {
          const engagementData = await engagementRes.json()
          setEngagementOptions(engagementData)
        }
      } catch (error) {
        console.error("Error fetching initial data:", error)
      }
    }

    fetchInitialData()
  }, [])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!companyProfileId) {
      alert("Company profile not found. Please try refreshing the page.")
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...formData,
        companyProfileId,
        // Remove empty optional fields
        ...(formData.imageURL === "" && { imageURL: undefined }),
        ...(formData.indicativeIncentive === "" && { indicativeIncentive: undefined }),
        ...(formData.preferredYearsOfExperienceId === "" && { preferredYearsOfExperienceId: undefined }),
        ...(formData.engagementMethodId === "" && { engagementMethodId: undefined }),
      }

      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to create product")
      }

      const newProduct = await res.json()
      router.push(`/dashboard/company/products`)
    } catch (error: any) {
      console.error("Error creating product:", error)
      alert(error.message || "Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/company/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Add New Product</h2>
          <p className="text-sm text-muted-foreground">Create a new product or service listing</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential details about your product or service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product/Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., CRM Software, Marketing Consultancy"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRODUCT">Product</SelectItem>
                    <SelectItem value="SERVICE">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => handleChange("shortDescription", e.target.value)}
                placeholder="Brief overview (1-2 sentences)"
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailedDescription">Detailed Description *</Label>
              <Textarea
                id="detailedDescription"
                value={formData.detailedDescription}
                onChange={(e) => handleChange("detailedDescription", e.target.value)}
                placeholder="Comprehensive description including features, benefits, and use cases"
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageURL">Image URL (Optional)</Label>
              <Input
                id="imageURL"
                type="url"
                value={formData.imageURL}
                onChange={(e) => handleChange("imageURL", e.target.value)}
                placeholder="https://example.com/product-image.jpg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Incentives */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Incentives</CardTitle>
            <CardDescription>Define how BD partners will be compensated</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentModel">Payment Model *</Label>
              <Select value={formData.paymentModel} onValueChange={(value) => handleChange("paymentModel", value)}>
                <SelectTrigger id="paymentModel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMMISSION_BASED">Commission Based</SelectItem>
                  <SelectItem value="FIXED_FEE">Fixed Fee</SelectItem>
                  <SelectItem value="REVENUE_SHARE">Revenue Share</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                  <SelectItem value="RETAINER">Retainer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="indicativeIncentive">Indicative Incentive (Optional)</Label>
              <Input
                id="indicativeIncentive"
                value={formData.indicativeIncentive}
                onChange={(e) => handleChange("indicativeIncentive", e.target.value)}
                placeholder="e.g., 10-15% commission, $5000 per deal"
              />
              <p className="text-xs text-muted-foreground">
                Provide an estimated compensation range to attract BD partners
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Partner Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Partner Requirements</CardTitle>
            <CardDescription>Specify your ideal BD partner profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preferredYearsOfExperience">Preferred Years of Experience (Optional)</Label>
              <Select
                value={formData.preferredYearsOfExperienceId}
                onValueChange={(value) => handleChange("preferredYearsOfExperienceId", value)}
              >
                <SelectTrigger id="preferredYearsOfExperience">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {yoeOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.yearsRange}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="engagementMethod">Engagement Method (Optional)</Label>
              <Select
                value={formData.engagementMethodId}
                onValueChange={(value) => handleChange("engagementMethodId", value)}
              >
                <SelectTrigger id="engagementMethod">
                  <SelectValue placeholder="Select engagement method" />
                </SelectTrigger>
                <SelectContent>
                  {engagementOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="salesTrainingAvailable"
                checked={formData.salesTrainingAvailable}
                onCheckedChange={(checked) => handleChange("salesTrainingAvailable", checked)}
              />
              <Label htmlFor="salesTrainingAvailable" className="cursor-pointer">
                Sales training available for partners
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild disabled={loading}>
            <Link href="/dashboard/company/products">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}
