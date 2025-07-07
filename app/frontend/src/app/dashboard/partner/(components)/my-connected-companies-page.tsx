"use client"

import { Key, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Eye, Mail, Phone, Globe, MessageCircle, UserX, Building, Package, Calendar } from "lucide-react"

export function MyConnectedCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<any>(null)

  const connectedCompanies = [
    {
      id: 1,
      companyName: "Acme Corp",
      description:
        "Leading provider of cloud-based analytics solutions for enterprise clients, specializing in data transformation and business intelligence.",
      industry: "Software & Technology",
      location: "Sydney, NSW",
      connectionDate: "2024-01-22",
      associatedProducts: [
        {
          name: "Cloud Analytics Platform",
          commission: "15% recurring",
          status: "Active",
        },
        {
          name: "Business Intelligence Suite",
          commission: "12% recurring",
          status: "Active",
        },
      ],
      contactDetails: {
        primaryContact: "John Smith",
        title: "VP Sales",
        email: "partnerships@acmecorp.com",
        phone: "+61 2 8123 4567",
        website: "https://acmecorp.com",
      },
      partnershipDetails: {
        totalDeals: 3,
        totalValue: "$45,000",
        lastActivity: "2024-01-25",
        performanceRating: "Excellent",
      },
      salesMaterials: [
        "Product Demo Videos",
        "Sales Presentation Deck",
        "ROI Calculator",
        "Case Studies",
        "Technical Specifications",
      ],
    },
    {
      id: 2,
      companyName: "MedTech Solutions",
      description:
        "Healthcare technology company focused on developing HIPAA-compliant data analytics platforms for hospitals and healthcare providers.",
      industry: "Healthcare Technology",
      location: "Toronto, ON",
      connectionDate: "2024-01-17",
      associatedProducts: [
        {
          name: "Healthcare Data Analytics",
          commission: "18% recurring",
          status: "Active",
        },
      ],
      contactDetails: {
        primaryContact: "Dr. Sarah Johnson",
        title: "Business Development Director",
        email: "bd@medtechsolutions.com",
        phone: "+1 416 555 0123",
        website: "https://medtechsolutions.ca",
      },
      partnershipDetails: {
        totalDeals: 2,
        totalValue: "$28,000",
        lastActivity: "2024-01-24",
        performanceRating: "Very Good",
      },
      salesMaterials: [
        "Clinical Case Studies",
        "HIPAA Compliance Documentation",
        "Implementation Guide",
        "Training Materials",
      ],
    },
    {
      id: 3,
      companyName: "HealthTech Innovations",
      description:
        "Healthcare technology company developing patient management and clinical workflow solutions for healthcare providers.",
      industry: "Healthcare Technology",
      location: "Brisbane, QLD",
      connectionDate: "2024-01-20",
      associatedProducts: [
        {
          name: "Patient Management System",
          commission: "16% recurring",
          status: "Active",
        },
        {
          name: "Clinical Workflow Platform",
          commission: "14% recurring",
          status: "Pending Setup",
        },
      ],
      contactDetails: {
        primaryContact: "Dr. Sarah Chen",
        title: "Business Development Director",
        email: "partnerships@healthtechinnovations.com",
        phone: "+61 7 3123 4567",
        website: "https://healthtechinnovations.com",
      },
      partnershipDetails: {
        totalDeals: 1,
        totalValue: "$12,000",
        lastActivity: "2024-01-23",
        performanceRating: "Good",
      },
      salesMaterials: [
        "Product Overview",
        "Clinical Workflow Diagrams",
        "Implementation Timeline",
        "Support Documentation",
      ],
    },
    {
      id: 4,
      companyName: "SecureHome Tech",
      description:
        "Innovative smart home security solutions provider offering comprehensive IoT-based security systems for residential and commercial use.",
      industry: "Security Technology",
      location: "Melbourne, VIC",
      connectionDate: "2024-01-15",
      associatedProducts: [
        {
          name: "Smart Home Security System",
          commission: "20% upfront + 5% recurring",
          status: "Active",
        },
      ],
      contactDetails: {
        primaryContact: "Mike Wilson",
        title: "Channel Sales Manager",
        email: "partners@securehometech.com",
        phone: "+61 3 9876 5432",
        website: "https://securehometech.com",
      },
      partnershipDetails: {
        totalDeals: 5,
        totalValue: "$35,000",
        lastActivity: "2024-01-26",
        performanceRating: "Excellent",
      },
      salesMaterials: [
        "Product Catalog",
        "Installation Guide",
        "Competitive Analysis",
        "Customer Testimonials",
        "Pricing Sheets",
      ],
    },
    {
      id: 5,
      companyName: "DataFlow Analytics",
      description:
        "Leading provider of business intelligence and data analytics solutions for enterprises looking to leverage big data for competitive advantage.",
      industry: "Analytics & Data",
      location: "Perth, WA",
      connectionDate: "2024-01-12",
      associatedProducts: [
        {
          name: "Business Intelligence Suite",
          commission: "15% recurring",
          status: "Active",
        },
        {
          name: "Real-time Analytics Platform",
          commission: "18% recurring",
          status: "Active",
        },
        {
          name: "Data Visualization Tools",
          commission: "12% recurring",
          status: "Active",
        },
      ],
      contactDetails: {
        primaryContact: "Lisa Thompson",
        title: "Partner Success Manager",
        email: "partners@dataflowanalytics.com",
        phone: "+61 8 6543 2109",
        website: "https://dataflowanalytics.com",
      },
      partnershipDetails: {
        totalDeals: 4,
        totalValue: "$52,000",
        lastActivity: "2024-01-25",
        performanceRating: "Outstanding",
      },
      salesMaterials: [
        "Technical Architecture Guide",
        "ROI Analysis Tools",
        "Demo Environment Access",
        "Sales Playbook",
        "Competitive Positioning",
      ],
    },
  ]

  const filteredCompanies = connectedCompanies.filter(
    (company) =>
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.associatedProducts.some((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getPerformanceColor = (rating: string) => {
    switch (rating) {
      case "Outstanding":
        return "bg-purple-100 text-purple-800"
      case "Excellent":
        return "bg-green-100 text-green-800"
      case "Very Good":
        return "bg-blue-100 text-blue-800"
      case "Good":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProductStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Pending Setup":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalStats = {
    totalCompanies: connectedCompanies.length,
    totalProducts: connectedCompanies.reduce((sum, company) => sum + company.associatedProducts.length, 0),
    totalValue: connectedCompanies.reduce(
      (sum, company) => sum + Number.parseInt(company.partnershipDetails.totalValue.replace(/[$,]/g, "")),
      0,
    ),
    activeDeals: connectedCompanies.reduce((sum, company) => sum + company.partnershipDetails.totalDeals, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Connected Companies</h1>
        <p className="text-gray-600">Manage your active partnerships and business relationships</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connected Companies</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalCompanies}</p>
              </div>
              <Building className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deals</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.activeDeals}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">${totalStats.totalValue.toLocaleString()}</p>
              </div>
              <div className="text-green-500 text-2xl font-bold">$</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search companies, products, or industries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Connected Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{company.companyName}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {company.industry} • {company.location}
                  </p>
                  <Badge className={`text-xs ${getPerformanceColor(company.partnershipDetails.performanceRating)}`}>
                    {company.partnershipDetails.performanceRating}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{company.partnershipDetails.totalDeals} deals</p>
                  <p className="text-sm text-green-600 font-medium">{company.partnershipDetails.totalValue}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{company.description}</p>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Associated Products ({company.associatedProducts.length})
                </p>
                <div className="space-y-2">
                  {company.associatedProducts.slice(0, 2).map((product, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-700">{product.name}</span>
                        <Badge className={`text-xs ${getProductStatusColor(product.status)}`}>{product.status}</Badge>
                      </div>
                      <span className="text-green-600 font-medium text-xs">{product.commission}</span>
                    </div>
                  ))}
                  {company.associatedProducts.length > 2 && (
                    <p className="text-xs text-gray-500">+{company.associatedProducts.length - 2} more products</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Connected: {new Date(company.connectionDate).toLocaleDateString()}</span>
                <span>Last activity: {new Date(company.partnershipDetails.lastActivity).toLocaleDateString()}</span>
              </div>

              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setSelectedCompany(company)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Company Partnership Details</DialogTitle>
                    </DialogHeader>
                    {selectedCompany && (
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold">{selectedCompany.companyName}</h3>
                            <p className="text-gray-600">{selectedCompany.industry}</p>
                            <p className="text-gray-600">{selectedCompany.location}</p>
                            <Badge
                              className={`mt-2 ${getPerformanceColor(selectedCompany.partnershipDetails.performanceRating)}`}
                            >
                              {selectedCompany.partnershipDetails.performanceRating} Performance
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Partnership Value</p>
                            <p className="text-2xl font-bold text-green-600">
                              {selectedCompany.partnershipDetails.totalValue}
                            </p>
                            <p className="text-sm text-gray-600">
                              {selectedCompany.partnershipDetails.totalDeals} deals completed
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Company Description</h4>
                          <p className="text-gray-600">{selectedCompany.description}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700 mb-3">Contact Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Primary Contact</p>
                              <p className="text-gray-900">{selectedCompany.contactDetails.primaryContact}</p>
                              <p className="text-sm text-gray-600">{selectedCompany.contactDetails.title}</p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                <a
                                  href={`mailto:${selectedCompany.contactDetails.email}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {selectedCompany.contactDetails.email}
                                </a>
                              </div>
                              <div className="flex items-center text-sm">
                                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                                <a
                                  href={`tel:${selectedCompany.contactDetails.phone}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {selectedCompany.contactDetails.phone}
                                </a>
                              </div>
                              <div className="flex items-center text-sm">
                                <Globe className="h-4 w-4 mr-2 text-gray-500" />
                                <a
                                  href={selectedCompany.contactDetails.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {selectedCompany.contactDetails.website}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700 mb-3">Associated Products</h4>
                          <div className="space-y-3">
                            {selectedCompany.associatedProducts.map((product: any, index: Key | null | undefined) => (
                              <div key={index} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium text-gray-900">{product.name}</h5>
                                  <Badge className={`text-xs ${getProductStatusColor(product.status)}`}>
                                    {product.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-green-600 font-medium">Commission: {product.commission}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700 mb-3">Available Sales Materials</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedCompany.salesMaterials.map((material: any, index: Key | null | undefined) => (
                              <div
                                key={index}
                                className="flex items-center text-sm text-gray-600 p-2 bg-gray-50 rounded"
                              >
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                {material}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-gray-700 mb-1">Partnership Started</p>
                            <p className="text-gray-600">
                              {new Date(selectedCompany.connectionDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700 mb-1">Last Activity</p>
                            <p className="text-gray-600">
                              {new Date(selectedCompany.partnershipDetails.lastActivity).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button size="sm" className="flex-1">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Message
                </Button>
              </div>

              <div className="flex space-x-2 mt-2">
                <Button variant="ghost" size="sm" className="flex-1 text-xs">
                  <Package className="h-3 w-3 mr-1" />
                  View Products
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 text-xs text-red-600 hover:text-red-700">
                  <UserX className="h-3 w-3 mr-1" />
                  End Partnership
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">No connected companies found matching your search.</p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
