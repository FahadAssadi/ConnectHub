"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Edit, Copy, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface ProductListItemData {
  id: string
  name: string
  type: "product" | "service"
  status: "draft" | "pending" | "approved" | "rejected" | "inactive"
  shortDescription: string
  applicationsCount: number
  lastUpdated: string
  paymentModel: string
}

interface ProductListItemProps {
  product: ProductListItemData
  onDuplicate?: (id: string) => void
  onDelete?: (id: string) => void
}

export function ProductListItem({ product, onDuplicate, onDelete }: ProductListItemProps) {
  return (
    <Card className="overflow-hidden transition-all hover:border-primary/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/dashboard/company/products/${product.id}`} className="hover:underline">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                </Link>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={product.status} size="sm" />
              <Badge variant="outline" className="capitalize">
                {product.type}
              </Badge>
              <Badge variant="secondary">{product.paymentModel}</Badge>
              <Badge variant="secondary">{product.applicationsCount} Applications</Badge>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Updated {product.lastUpdated}</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/company/products/${product.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link href={`/dashboard/company/products/${product.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onDuplicate?.(product.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete?.(product.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
