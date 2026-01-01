"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductListItem, type ProductListItemData } from "./(components)/product-list-item"
import { ProductFilters } from "./(components)/product-filters"
import { Plus } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductListItemData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        // First get the user profile to get company profile ID
        const profileRes = await fetch(`${API_BASE}/user-profile`, {
          credentials: "include",
        })
        if (!profileRes.ok) throw new Error("Failed to fetch profile")
        const profileData = await profileRes.json()
        const companyProfileId = profileData?.companyProfile?.id

        if (!companyProfileId) {
          throw new Error("Company profile not found")
        }

        // Then fetch products for this company
        const productsRes = await fetch(`${API_BASE}/products/company/${companyProfileId}`, {
          credentials: "include",
        })
        if (!productsRes.ok) throw new Error("Failed to fetch products")
        const productsData = await productsRes.json()

        // Map API response to component format
        const mappedProducts: ProductListItemData[] = productsData.map((p: any) => ({
          id: p.id,
          name: p.name,
          type: p.type.toLowerCase(),
          status: p.status.toLowerCase(),
          shortDescription: p.shortDescription,
          applicationsCount: 0, // TODO: This needs to come from EOI count when available
          lastUpdated: new Date(p.updatedAt).toLocaleDateString(),
          paymentModel: formatPaymentModel(p.paymentModel),
        }))

        setProducts(mappedProducts)
        setError(null)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Unable to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  function formatPaymentModel(model: string): string {
    return model
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ")
  }

  const handleDuplicate = (id: string) => {
    console.log("Duplicate product:", id)
    // TODO: Implement duplicate functionality
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Failed to delete product")

      // Remove from local state
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Error deleting product:", err)
      alert("Failed to delete product")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-lg">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">{error}</p>
          <p className="text-sm text-gray-600 mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Products & Services</h2>
            <p className="text-sm text-muted-foreground">Manage your product catalog and track performance</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/company/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <ProductFilters />

        {/* Products List */}
        <div className="space-y-4">
          {products.map((product) => (
            <ProductListItem key={product.id} product={product} onDuplicate={handleDuplicate} onDelete={handleDelete} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
            <p className="text-sm text-muted-foreground">No products found</p>
            <Button variant="outline" className="mt-4 bg-transparent" asChild>
              <Link href="/dashboard/company/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Link>
            </Button>
          </div>
        )}
      </div>
  )
}
