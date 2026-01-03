"use client"

import { useEffect, useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, AlertCircle } from "lucide-react"
import { ProductMarketplaceCard } from "./(components)/product-marketplace-card"
import { ApplyModal } from "./(components)/apply-modal"

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

interface UserProfile {
  id: string
  email: string
  bdpartnerIndividualProfile?: {
    id: string
    commonDetails?: {
      firstName: string
    }
  }
  bdPartnerOrganizationProfile?: {
    id: string
    commonDetails?: {
      organizationName: string
    }
  }
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [profileId, setProfileId] = useState<string>("")

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"

        // Fetch user profile first
        const profileRes = await fetch(`${API_BASE}/user-profile`, {
          credentials: "include",
        })

        if (profileRes.ok) {
            const profileData = await profileRes.json()

            // Determine if individual or organization BD partner
            let pType: "individual" | "organization" | null = null
            let pId: string | null = null

            if (profileData.type === "BD_PARTNER_INDIVIDUAL") {
                pType = "individual"
                pId = profileData.bdpartnerIndividualProfile?.id
            } else if (profileData.type === "BD_PARTNER_ORGANIZATION") {
                pType = "organization"
                pId = profileData.bdpartnerOrganizationProfile?.id
            }

            console.log(pId);

            setProfileId(pId || "")
        }

        // Fetch all products
        const productsRes = await fetch(`${API_BASE}/products`, {
          credentials: "include",
        })

        if (productsRes.ok) {
          const data = await productsRes.json()
          setProducts(Array.isArray(data) ? data : data.data || [])
          setError(null)
        } else {
          setError("Failed to load products")
        }
      } catch (err) {
        console.error("Error fetching marketplace data:", err)
        setError("An error occurred while loading products")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (product.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (product.detailedDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (product.companyProfile?.commonDetails?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

      const matchesType = filterType === "all" || product.type === filterType

      return matchesSearch && matchesType
    })
  }, [products, searchTerm, filterType])

  const productTypes = useMemo(() => {
    const types = new Set(products.map((p) => p.type).filter((type) => type !== undefined))
    return Array.from(types).sort() as string[]
  }, [products])

  const handleApplyClick = (product: Product) => {
    setSelectedProduct(product)
    setShowApplyModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-gray-500 mt-2">
          Browse and apply to available products from our partners
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {productTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-600">
            Showing <strong>{filteredProducts.length}</strong> of{" "}
            <strong>{products.length}</strong> products
          </div>
        </div>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </Card>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductMarketplaceCard
              key={product.id}
              product={product}
              onApply={() => handleApplyClick(product)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">No products found matching your criteria</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setFilterType("all")
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}

      {/* Apply Modal */}
      {selectedProduct && (
        <ApplyModal
          product={selectedProduct}
          profileId={profileId}
          open={showApplyModal}
          onOpenChange={setShowApplyModal}
        />
      )}
    </div>
  )
}
