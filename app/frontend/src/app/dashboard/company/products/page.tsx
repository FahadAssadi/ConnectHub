"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Grid, List, MoreHorizontal, Edit, Eye, Trash2, Users, DollarSign, Package, Loader2 } from "lucide-react"
import Link from "next/link"
import { getSession } from "@/lib/auth-client"

export default function ProductCatalog() {
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Fetch products from API
        const fetchProducts = async () => {
            setLoading(true)
            setError(null)
            
            try {
                const { data } = await getSession();
                const userId = data?.session?.userId;

                if (!userId) {
                    throw new Error('User not authenticated')
                }

                console.log(data)

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/protected/products/company/${userId}`, 
                    { credentials: 'include',}
                );
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                
                const result = await response.json();
                
                if (result.success && result.products) {
                    setProducts(result.products)
                } else {
                    console.error('Failed to fetch products:', result.error)
                    setError(result.error || 'Failed to fetch products')
                    setProducts([])
                }

                console.log("Fetched products:", result)
            } catch (error) {
                console.error('Error fetching products:', error)
                setError(error instanceof Error ? error.message : 'An error occurred')
                setProducts([])
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Product Management</h1>
          <p className="text-muted-foreground text-pretty">Manage your products and services for BD partnerships</p>
        </div>
        <Link href="/dashboard/company/products/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-4 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Software">Software</SelectItem>
              <SelectItem value="SaaS">SaaS</SelectItem>
              <SelectItem value="Service">Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="text-center py-12">
          <CardContent>
            <Loader2 className="h-8 w-8 text-muted-foreground mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium mb-2">Loading products...</h3>
            <p className="text-muted-foreground">Please wait while we fetch your products</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="text-center py-12 border-destructive">
          <CardContent>
            <Package className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2 text-destructive">Error loading products</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Product Display */}
      {!loading && !error && (
        <Tabs value={viewMode} className="w-full">
        <TabsContent value="grid" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={product.productImageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={product.isPublished ? "default" : "secondary"}>
                      {product.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {product.productType} • {product.industrySpecializationId || 'General'}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <Link href={`/products/${product.id}/edit`}>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Product
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.shortDescription || product.detailedDescription}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>0 interested</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>{product.indicativeIncentive || 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table" className="mt-0">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Interested Partners</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.productImageUrl || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{product.shortDescription || product.detailedDescription}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.productType}</TableCell>
                    <TableCell>{product.industrySpecializationId || 'General'}</TableCell>
                    <TableCell>
                      <Badge variant={product.isPublished ? "default" : "secondary"}>
                        {product.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{product.indicativeIncentive || 'N/A'}</TableCell>
                    <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/dashboard/company/products/${product.id}/applications`}>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Applications
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/products/${product.id}/edit`}>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Product
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
      )}

      {/* Empty State */}
      {products.length === 0 && !loading && !error && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by adding your first product"}
            </p>
            <Link href="/dashboard/company/products/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
