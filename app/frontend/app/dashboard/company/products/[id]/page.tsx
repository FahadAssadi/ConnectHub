"use client"

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
import { Edit, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data - replace with actual data fetching
const mockProduct: ProductDetailData = {
  id: "1",
  name: "CloudSync Pro",
  type: "product",
  status: "approved",
  shortDescription: "Enterprise-grade cloud synchronization solution for seamless data management",
  detailedDescription: `CloudSync Pro is a comprehensive cloud synchronization platform designed for enterprise organizations that need reliable, secure, and scalable data management across multiple cloud platforms.

Key Features:
• Real-time synchronization across AWS, Azure, and Google Cloud
• Advanced conflict resolution algorithms
• Enterprise-grade security with end-to-end encryption
• Detailed audit logs and compliance reporting
• Custom workflow automation
• 24/7 dedicated support

Perfect for organizations managing distributed teams and multi-cloud infrastructure.`,
  imageURL: "/cloud-sync-technology.jpg",
  paymentModel: "Commission Based",
  indicativeIncentive: "15-20% commission per sale",
  salesTrainingAvailable: true,
  engagementMethod: "Direct Sales Partnership",
  preferredYearsOfExperience: "3-5 years",
}

const targetIndustries: TargetIndustry[] = [
  { category: "Technology", subCategory: "Software Development" },
  { category: "Financial Services", subCategory: "Banking" },
  { category: "Healthcare", subCategory: "Health Tech" },
]

const targetRegions: TargetRegion[] = [{ name: "North America" }, { name: "Europe" }, { name: "Asia Pacific" }]

const preferredProfiles: PreferredProfile[] = [
  { specialisation: "Cloud Infrastructure" },
  { specialisation: "Enterprise Software" },
  { specialisation: "SaaS Solutions" },
]

const preferredCertifications: PreferredCertification[] = [
  { name: "AWS Solutions Architect" },
  { name: "Azure Administrator" },
  { name: "Salesforce Certified" },
]

const mockApplications = [
  { id: "1", bdPartner: "John Smith", status: "pending", date: "2 days ago" },
  { id: "2", bdPartner: "Sarah Johnson", status: "approved", date: "1 week ago" },
  { id: "3", bdPartner: "Mike Chen", status: "under_review", date: "2 weeks ago" },
]

export default function ProductDetailPage() {
  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/products/${mockProduct.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="targeting">Targeting</TabsTrigger>
            <TabsTrigger value="applications">Applications ({mockApplications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ProductDetailOverview product={mockProduct} />
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
                <div className="space-y-4">
                  {mockApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium">{app.bdPartner}</p>
                        <p className="text-xs text-muted-foreground">Applied {app.date}</p>
                      </div>
                      <Badge variant="outline">{app.status.replace("_", " ")}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}
