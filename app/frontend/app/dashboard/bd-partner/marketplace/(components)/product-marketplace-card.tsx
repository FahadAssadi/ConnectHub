import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name?: string
  shortDescription?: string
  detailedDescription?: string
  type?: string
  imageURL?: string
  paymentModel?: string
  companyProfileId?: string
  companyProfile?: {
    id?: string
    commonDetails?: {
      companyName?: string
    }
  }
  createdAt?: string
}

interface Props {
  product: Product
  onApply: () => void
}

export function ProductMarketplaceCard({ product, onApply }: Props) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
      {/* Product Image */}
      {product.imageURL && (
        <div className="relative h-40 bg-gray-100">
          <Image
            src={product.imageURL}
            alt={product.name || "Product"}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        {/* Company Info */}
        {product.companyProfile && (
          <div className="flex items-center gap-3 mb-4">
            <div>
              <p className="text-xs text-gray-500">By</p>
              <p className="font-medium text-sm">
                {product.companyProfile.commonDetails?.companyName || "Unknown Company"}
              </p>
            </div>
          </div>
        )}

        {/* Product Info */}
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{product.name || "Unnamed Product"}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
          {product.shortDescription || product.detailedDescription || "No description available"}
        </p>

        {/* Tags */}
        <div className="space-y-3 mb-4">
          <div className="flex flex-wrap gap-2">
            {product.type && <Badge variant="outline">{product.type}</Badge>}
          </div>

          {product.paymentModel && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {product.paymentModel}
              </Badge>
            </div>
          )}
        </div>

        {/* Apply Button */}
        <Button onClick={onApply} className="w-full mt-auto">
          Apply Now
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
