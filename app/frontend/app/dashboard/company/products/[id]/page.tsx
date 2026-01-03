"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductDetailOverview, type ProductDetailData } from "../(components)/product-detail-overview"
import {
  ProductTargeting,
  type TargetIndustry,
  type TargetRegion,
  type PreferredProfile,
  type PreferredCertification,
} from "../(components)/product-targeting"
import { Edit, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"

function formatPaymentModel(model: string): string {
  return model
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ")
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<ProductDetailData | null>(null)
  const [targetIndustries, setTargetIndustries] = useState<TargetIndustry[]>([])
  const [targetRegions, setTargetRegions] = useState<TargetRegion[]>([])
  const [preferredProfiles, setPreferredProfiles] = useState<PreferredProfile[]>([])
  const [preferredCertifications, setPreferredCertifications] = useState<PreferredCertification[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [applicationsLoading, setApplicationsLoading] = useState(false)

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const res = await fetch(`${API_BASE}/products/${productId}`, {
          credentials: "include",
        })

        if (!res.ok) throw new Error("Failed to fetch product")

        const data = await res.json()

        // Map API response to component format
        const mappedProduct: ProductDetailData = {
          id: data.id,
          name: data.name,
          type: data.type.toLowerCase(),
          status: data.status.toLowerCase(),
          shortDescription: data.shortDescription,
          detailedDescription: data.detailedDescription,
          imageURL: data.imageURL || undefined,
          paymentModel: formatPaymentModel(data.paymentModel),
          indicativeIncentive: data.indicativeIncentive || undefined,
          salesTrainingAvailable: data.salesTrainingAvailable,
          engagementMethod: data.engagementMethod?.name || undefined,
          preferredYearsOfExperience: data.preferredYearsOfExperience?.yearsRange || undefined,
        }

        setProduct(mappedProduct)

        // Map target industries
        if (data.productTargetCustomerIndustries) {
          const industries: TargetIndustry[] = data.productTargetCustomerIndustries.map((item: any) => ({
            category: item.industryCategory?.name || "",
            subCategory: item.industrySubCategory?.name || "",
          }))
          setTargetIndustries(industries)
        }

        // Map target regions
        if (data.productTargetRegions) {
          const regions: TargetRegion[] = data.productTargetRegions.map((item: any) => ({
            name: item.region?.name || "",
          }))
          setTargetRegions(regions)
        }

        // Map preferred profiles
        if (data.productPreferredBDProfiles) {
          const profiles: PreferredProfile[] = data.productPreferredBDProfiles.map((item: any) => ({
            specialisation: item.industrySpecialisation?.name || "",
          }))
          setPreferredProfiles(profiles)
        }

        // Map preferred certifications
        if (data.productPreferredCertifications) {
          const certs: PreferredCertification[] = data.productPreferredCertifications.map((item: any) => ({
            name: item.certification?.name || "",
          }))
          setPreferredCertifications(certs)
        }

        // TODO: Fetch EOI applications for this product
        // For now, set empty array
        setApplications([])

        setError(null)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }

    async function fetchApplications(productId: string) {
      try {
        setApplicationsLoading(true)
        const res = await fetch(`${API_BASE}/eoi/product/${productId}`, {
          credentials: "include",
        })

        if (!res.ok) throw new Error("Failed to fetch applications")

        const data = await res.json()
        setApplications(data.data || [])
      } catch (err) {
        console.error("Error fetching applications:", err)
        setApplications([])
      } finally {
        setApplicationsLoading(false)
      }
    }

    if (productId) {
      fetchProductDetails()
      fetchApplications(productId)
    }
  }, [productId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-4 text-lg">Loading product details...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">{error || "Product not found"}</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/company/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/company/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/company/products/${product.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="targeting">Targeting</TabsTrigger>
            <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ProductDetailOverview product={product} />
          </TabsContent>

          <TabsContent value="targeting" className="space-y-6">
            <ProductTargeting
              targetIndustries={targetIndustries}
              targetRegions={targetRegions}
              preferredProfiles={preferredProfiles}
              preferredCertifications={preferredCertifications}
            />
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Applications</CardTitle>
                <CardDescription>BD Partners who have applied to sell this product</CardDescription>
              </CardHeader>
              <CardContent>
                {applicationsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
                    <p className="text-sm text-muted-foreground">Loading applications...</p>
                  </div>
                ) : applications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No applications yet</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => {
                      const bdPartnerName = app.bdPartnerIndividualProfile
                        ? `${app.bdPartnerIndividualProfile.firstName} ${app.bdPartnerIndividualProfile.lastName}`
                        : app.bdPartnerOrganizationProfile?.commonDetails?.companyName || "Unknown Partner"
                      
                      const bdPartnerEmail = app.bdPartnerIndividualProfile?.email || 
                        app.bdPartnerOrganizationProfile?.commonDetails?.contactPersonEmail || 
                        "No email provided"

                      return (
                        <div key={app.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                          <div className="flex-1">
                            <p className="font-medium">{bdPartnerName}</p>
                            <p className="text-xs text-muted-foreground">{bdPartnerEmail}</p>
                            <p className="text-xs text-muted-foreground">
                              Applied {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                            {app.message && (
                              <p className="text-sm text-muted-foreground mt-1 italic">"{app.message}"</p>
                            )}
                          </div>
                          <Badge variant="outline" className="ml-4 shrink-0">
                            {app.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}
