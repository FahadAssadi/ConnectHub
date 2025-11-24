"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"
import Image from "next/image"
import { CheckCircle2, XCircle } from "lucide-react"
import { useState } from "react"

interface ProductModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (productId: string) => Promise<void>
}

export function ProductModal({ product, open, onOpenChange, onApply }: ProductModalProps) {
  const [loading, setLoading] = useState(false)

  if (!product) return null

  async function handleApply() {
    if (!product) return;
    setLoading(true)
    try {
      await onApply(product.id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* Cover image */}
          <div className="relative w-full h-64 mb-6 -mt-6 -mx-6 overflow-hidden bg-muted rounded-t-lg">
            <Image
              src={product.productImageUrl?.startsWith("http") ? product.productImageUrl : "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Title + badges */}
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-3xl font-bold">{product.name}</DialogTitle>
            <div className="flex gap-2 shrink-0">
              {product.isPublished && <Badge variant="secondary">Published</Badge>}
              {product.isActive && <Badge variant="default">Active</Badge>}
            </div>
          </div>

          {/* Short description */}
          <DialogDescription className="text-base text-muted-foreground mt-2">
            {product.shortDescription}
          </DialogDescription>
        </DialogHeader>

        {/* Details */}
        <div className="space-y-6 mt-6">
          {/* About */}
          <section>
            <h3 className="text-lg font-semibold mb-2">About this product</h3>
            <p className="text-muted-foreground leading-relaxed">{product.detailedDescription}</p>
          </section>

          {/* Key info grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Payment Model</h4>
                <p>{product.paymentModel || "—"}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Indicative Incentive</h4>
                <p>{product.indicativeIncentive || "—"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Product Type</h4>
                <p className="capitalize">{product.productType}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Sales Training</h4>
                <div className="flex items-center gap-2">
                  {product.salesTrainingAvailable ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                      <span>Available</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                      <span>Not available</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-mono">
              Company ID: {product.companyId}
            </p>

            <Button onClick={handleApply} disabled={loading}>
              {loading ? "Applying..." : "Apply"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
