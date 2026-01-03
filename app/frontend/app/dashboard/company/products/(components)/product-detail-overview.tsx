import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

export interface ProductDetailData {
  id: string
  name: string
  type: "product" | "service"
  status: "draft" | "pending" | "approved" | "rejected" | "inactive"
  shortDescription: string
  detailedDescription: string
  imageURL?: string
  paymentModel: string
  indicativeIncentive?: string
  salesTrainingAvailable: boolean
  engagementMethod?: string
  preferredYearsOfExperience?: string
}

interface ProductDetailOverviewProps {
  product: ProductDetailData
}

export function ProductDetailOverview({ product }: ProductDetailOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-6">
            {product.imageURL && (
              <div className="h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-muted">
                <img
                  src={product.imageURL || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-start justify-between">
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                  <StatusBadge status={product.status} size="lg" />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline" className="capitalize">
                    {product.type}
                  </Badge>
                  <Badge variant="secondary">{product.paymentModel}</Badge>
                  {product.salesTrainingAvailable && (
                    <Badge variant="default" className="bg-success/10 text-success border-success/20">
                      Training Available
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{product.detailedDescription}</p>
        </CardContent>
      </Card>

      {/* Commercial Details */}
      <Card>
        <CardHeader>
          <CardTitle>Commercial Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Payment Model</Label>
              <p className="text-sm">{product.paymentModel}</p>
            </div>
            {product.indicativeIncentive && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Indicative Incentive</Label>
                <p className="text-sm">{product.indicativeIncentive}</p>
              </div>
            )}
            {product.engagementMethod && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Engagement Method</Label>
                <p className="text-sm">{product.engagementMethod}</p>
              </div>
            )}
            {product.preferredYearsOfExperience && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Preferred Experience</Label>
                <p className="text-sm">{product.preferredYearsOfExperience}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Sales Training</Label>
              <p className="text-sm">{product.salesTrainingAvailable ? "Available" : "Not Available"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
