"use client"

import { Key, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, Eye, Send, MapPin, Target, Building, Calendar, Star } from 'lucide-react'

export function AllProductListingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [productTypeFilter, setProductTypeFilter] = useState("all")
  const [customerTypeFilter, setCustomerTypeFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [eoiDialogOpen, setEoiDialogOpen] = useState(false)
  const [eoiMessage, setEoiMessage] = useState("")

  const products = [
    {
      id: 1,
      productName: "Cloud Analytics Platform",
      companyName: "Acme Corp",
      description: "Advanced cloud-based analytics platform with real-time data processing and machine learning capabilities for enterprise clients.",
      industry: "Software & Technology",
      productType: "Product",
      targetCustomers: ["Enterprises", "SMEs"],
      regions: "Australia, New Zealand",
      companyType: "SME",
      addedDate: "2024-01-15",
      isNew: true,
      matchScore: 95,
      salesSupport: "Full training provided, dedicated support team, marketing materials included",
      commissionStructure: "15% recurring commission",
      productDetails: {
        features: ["Real-time analytics", "Machine learning insights", "Custom dashboards", "API integration"],
        pricing: "Starting from $299/month",
        targetMarket: "Mid to large enterprises looking to leverage data analytics",
        competitiveAdvantage: "30% faster processing than competitors, award-winning UI/UX",
      }
    },
    {
      id: 2,
      productName: "Smart Home Security System",
      companyName: "SecureHome Tech",
      description: "Comprehensive smart home security solution with IoT sensors, mobile app control, and 24/7 monitoring services.",
      industry: "Security Technology",
      productType: "Product",
      targetCustomers: ["End Consumers", "SMEs"],
      regions: "Australia",
      companyType: "Startup",
      addedDate: "2024-01-12",
      isNew: true,
      matchScore: 88,
      salesSupport: "Product demos available, installation support, customer service backup",
      commissionStructure: "20% upfront + 5% recurring",
      productDetails: {
        features: ["24/7 monitoring", "Mobile app control", "Smart sensors", "Professional installation"],
        pricing: "$199 setup + $29/month monitoring",
        targetMarket: "Homeowners and small businesses seeking security solutions",
        competitiveAdvantage: "Lowest false alarm rate in industry, award-winning mobile app",
      }
    },
    {
      id: 3,
      productName: "Manufacturing Optimization Software",
      companyName: "IndustrialFlow Solutions",
      description: "AI-powered manufacturing optimization software that reduces waste and improves efficiency in production lines.",
      industry: "Manufacturing",
      productType: "Service",
      targetCustomers: ["Enterprises", "Distributors"],
      regions: "Global",
      companyType: "Enterprise",
      addedDate: "2024-01-10",
      isNew: false,
      matchScore: 82,
      salesSupport: "Technical sales support, ROI calculators, case studies provided",
      commissionStructure: "12% of annual contract value",
      productDetails: {
        features: ["AI-powered optimization", "Real-time monitoring", "Predictive maintenance", "Custom reporting"],
        pricing: "Custom pricing based on facility size",
        targetMarket: "Large manufacturing facilities with complex production lines",
        competitiveAdvantage: "Average 25% efficiency improvement, proven ROI within 6 months",
      }
    },
    {
      id: 4,
      productName: "Healthcare Data Analytics",
      companyName: "MedTech Solutions",
      description: "HIPAA-compliant healthcare data analytics platform for hospitals and clinics to improve patient outcomes.",
      industry: "Healthcare Technology",
      productType: "Product",
      targetCustomers: ["Enterprises", "Government"],
      regions: "North America, Australia",
      companyType: "SME",
      addedDate: "2024-01-08",
      isNew: false,
      matchScore: 90,
      salesSupport: "Clinical specialist support, compliance documentation, implementation assistance",
      commissionStructure: "18% recurring commission",
      productDetails: {
        features: ["HIPAA compliance", "Patient outcome tracking", "Predictive analytics", "Integration with EMR systems"],
        pricing: "$500-2000/month based on bed count",
        targetMarket: "Hospitals, clinics, and healthcare systems",
        competitiveAdvantage: "Only platform with full HIPAA compliance and real-time patient monitoring",
      }
    },
    {
      id: 5,
      productName: "E-commerce Automation Suite",
      companyName: "RetailTech Pro",
      description: "Complete e-commerce automation platform including inventory management, order processing, and customer service tools.",
      industry: "Retail Technology",
      productType: "Product",
      targetCustomers: ["SMEs", "End Consumers"],
      regions: "Australia, UK",
      companyType: "SME",
      addedDate: "2024-01-05",
      isNew: false,
      matchScore: 75,
      salesSupport: "Setup assistance, training videos, dedicated account manager",
      commissionStructure: "25% first year, 10% recurring",
      productDetails: {
        features: ["Inventory automation", "Order processing", "Customer service tools", "Analytics dashboard"],
        pricing: "$99-499/month based on order volume",
        targetMarket: "Small to medium e-commerce businesses",
        competitiveAdvantage: "All-in-one solution, 50% faster setup than competitors",
      }
    },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = industryFilter === "all" || product.industry.toLowerCase().includes(industryFilter.toLowerCase())
    const matchesProductType = productTypeFilter === "all" || product.productType.toLowerCase() === productTypeFilter.toLowerCase()
    const matchesCustomerType = customerTypeFilter === "all" || product.targetCustomers.some(customer => customer.toLowerCase().includes(customerTypeFilter.toLowerCase()))
    const matchesRegion = regionFilter === "all" || product.regions.toLowerCase().includes(regionFilter.toLowerCase())

    return matchesSearch && matchesIndustry && matchesProductType && matchesCustomerType && matchesRegion
  })

  const handleSubmitEOI = () => {
    console.log("Submitting EOI:", {
      productId: selectedProduct?.id,
      message: eoiMessage,
    })
    setEoiDialogOpen(false)
    setEoiMessage("")
    setSelectedProduct(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Product Listings</h1>
        <p className="text-gray-600">Discover products and services looking for business development partners</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for products or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="software">Software & Technology</SelectItem>
                <SelectItem value="security">Security Technology</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="healthcare">Healthcare Technology</SelectItem>
                <SelectItem value="retail">Retail Technology</SelectItem>
              </SelectContent>
            </Select>
            <Select value={productTypeFilter} onValueChange={setProductTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
            <Select value={customerTypeFilter} onValueChange={setCustomerTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Customers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="enterprises">Enterprises</SelectItem>
                <SelectItem value="smes">SMEs</SelectItem>
                <SelectItem value="consumers">End Consumers</SelectItem>
                <SelectItem value="government">Government</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="australia">Australia</SelectItem>
                <SelectItem value="north america">North America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="uk">UK</SelectItem>
                <SelectItem value="global">Global</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} opportunities
        </p>
        <Select defaultValue="match">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="match">Best Match</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="company">Company Name</SelectItem>
            <SelectItem value="industry">Industry</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow relative">
            <CardContent className="p-6">
              {product.isNew && (
                <Badge className="absolute top-4 right-4 bg-green-500 text-white text-xs">New</Badge>
              )}
              
              {product.matchScore >= 85 && (
                <div className="absolute top-4 left-4 flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-yellow-600">{product.matchScore}% match</span>
                </div>
              )}

              <div className="mt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.productName}</h3>
                    <p className="text-sm text-blue-600 font-medium">{product.companyName}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {product.productType}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{product.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-gray-600">
                    <Building className="h-3 w-3 mr-1" />
                    <span>{product.industry}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Target className="h-3 w-3 mr-1" />
                    <span>{product.targetCustomers.join(", ")}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{product.regions}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Added {new Date(product.addedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Product Details</DialogTitle>
                      </DialogHeader>
                      {selectedProduct && (
                        <div className="space-y-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold">{selectedProduct.productName}</h3>
                              <p className="text-blue-600 font-medium">{selectedProduct.companyName}</p>
                              <Badge variant="secondary" className="mt-2">{selectedProduct.industry}</Badge>
                            </div>
                            {selectedProduct.matchScore >= 85 && (
                              <div className="flex items-center space-x-1">
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium text-yellow-600">{selectedProduct.matchScore}% match</span>
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Product Description</h4>
                            <p className="text-gray-600">{selectedProduct.description}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Target Customers</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedProduct.targetCustomers.map((customer: any, index: Key | null | undefined) => (
                                  <Badge key={index} variant="outline">{customer}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Regions</h4>
                              <p className="text-gray-600 flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {selectedProduct.regions}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Key Features</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {selectedProduct.productDetails.features.map((feature: any, index: Key | null | undefined) => (
                                <div key={index} className="flex items-center text-sm text-gray-600">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Pricing</h4>
                              <p className="text-gray-600">{selectedProduct.productDetails.pricing}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Commission Structure</h4>
                              <p className="text-green-600 font-medium">{selectedProduct.commissionStructure}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Sales Support Provided</h4>
                            <p className="text-gray-600">{selectedProduct.salesSupport}</p>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Competitive Advantage</h4>
                            <p className="text-gray-600">{selectedProduct.productDetails.competitiveAdvantage}</p>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Dialog open={eoiDialogOpen} onOpenChange={setEoiDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex-1" onClick={() => setSelectedProduct(product)}>
                        <Send className="h-3 w-3 mr-1" />
                        Submit EOI
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Submit Expression of Interest</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Submitting EOI for: <span className="font-medium">{selectedProduct?.productName}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Company: <span className="font-medium">{selectedProduct?.companyName}</span>
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="message" className="text-sm font-medium">
                            Message to Company
                          </Label>
                          <Textarea
                            id="message"
                            placeholder="Introduce yourself and explain why you're interested in representing this product..."
                            value={eoiMessage}
                            onChange={(e) => setEoiMessage(e.target.value)}
                            rows={4}
                            className="mt-1"
                          />
                        </div>

                        <div className="flex space-x-3">
                          <Button variant="outline" onClick={() => setEoiDialogOpen(false)} className="flex-1">
                            Cancel
                          </Button>
                          <Button onClick={handleSubmitEOI} className="flex-1">
                            Submit EOI
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setIndustryFilter("all")
                setProductTypeFilter("all")
                setCustomerTypeFilter("all")
                setRegionFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
