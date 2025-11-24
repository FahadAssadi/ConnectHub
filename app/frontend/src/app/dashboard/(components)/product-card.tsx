"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/product"
import Image from "next/image"

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 group" onClick={onClick}>
      <CardHeader className="p-0">
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-muted">
          {/* <Image
            src={product.productImageUrl || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          /> */}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-2 mb-3">
          <CardTitle className="text-xl text-balance">{product.name}</CardTitle>
          {product.isPublished && (
            <Badge variant="secondary" className="shrink-0">
              Published
            </Badge>
          )}
        </div>
        <CardDescription className="text-pretty line-clamp-2">{product.shortDescription}</CardDescription>
      </CardContent>
    </Card>
  )
}
