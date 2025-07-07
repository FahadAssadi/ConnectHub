"use client"

import { Key, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, CheckCircle, XCircle, Inbox, Calendar, Star } from "lucide-react"

export function EOIsFromCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedEOI, setSelectedEOI] = useState<any>(null)

  const receivedEOIs = [
    {
      id: 1,
      companyName: "TechFlow Solutions",
      productName: "Manufacturing Software Suite",
      eoiDate: "2024-01-22",
      status: "New",
      companyMessage:
        "We've reviewed your profile and believe your industrial software expertise and enterprise customer relationships make you an ideal partner for our manufacturing optimization suite. We're particularly impressed with your track record in the APAC region.",
      matchScore: 92,
      companyDetails: {
        industry: "Manufacturing Technology",
        businessType: "SME",
        location: "Perth, WA",
        website: "https://techflowsolutions.com",
        description:
          "Leading provider of manufacturing optimization software helping industrial companies reduce waste and improve efficiency.",
      },
      productDetails: {
        targetCustomers: ["Enterprises", "Distributors"],
        commission: "15% of annual contract value",
        salesSupport: "Full technical support, ROI calculators, case studies",
        features: ["Process optimization", "Real-time monitoring", "Predictive maintenance", "Custom reporting"],
      },
      whySelected: [
        "Your industrial software sales expertise",
        "Strong relationships with enterprise customers",
        "Proven track record in APAC markets",
        "Experience with complex B2B sales cycles",
      ],
    },
    {
      id: 2,
      companyName: "CloudSecure Systems",
      productName: "Enterprise Security Platform",
      eoiDate: "2024-01-21",
      status: "New",
      companyMessage:
        "Your security systems background and enterprise customer base align perfectly with our cybersecurity platform. We're looking for partners who understand both physical and digital security - your profile shows exactly this combination.",
      matchScore: 88,
      companyDetails: {
        industry: "Cybersecurity",
        businessType: "Enterprise",
        location: "Sydney, NSW",
        website: "https://cloudsecuresystems.com",
        description:
          "Enterprise cybersecurity platform providing comprehensive threat detection and response solutions.",
      },
      productDetails: {
        targetCustomers: ["Enterprises", "Government"],
        commission: "20% recurring commission",
        salesSupport: "Technical sales engineers, security assessments, compliance documentation",
        features: ["Threat detection", "Incident response", "Compliance reporting", "24/7 monitoring"],
      },
      whySelected: [
        "Security systems sales experience",
        "Enterprise customer relationships",
        "Understanding of compliance requirements",
        "Track record with high-value deals",
      ],
    },
    {
      id: 3,
      companyName: "DataInsights Pro",
      productName: "Business Analytics Suite",
      eoiDate: "2024-01-19",
      status: "Reviewed",
      companyMessage:
        "We're interested in partnering with you to represent our business analytics platform. Your data analytics expertise and SME customer focus would be valuable for our mid-market expansion strategy.",
      matchScore: 85,
      companyDetails: {
        industry: "Data Analytics",
        businessType: "SME",
        location: "Melbourne, VIC",
        website: "https://datainsightspro.com",
        description:
          "Business analytics platform helping SMEs make data-driven decisions with easy-to-use dashboards and insights.",
      },
      productDetails: {
        targetCustomers: ["SMEs", "Enterprises"],
        commission: "18% recurring commission",
        salesSupport: "Demo environment, training materials, customer success support",
        features: ["Real-time dashboards", "Predictive analytics", "Custom reports", "API integrations"],
      },
      whySelected: [
        "Data analytics sales expertise",
        "Strong SME customer relationships",
        "Technical background for complex solutions",
        "Proven ability to explain technical concepts",
      ],
    },
    {
      id: 4,
      companyName: "HealthTech Innovations",
      productName: "Patient Management System",
      eoiDate: "2024-01-17",
      status: "Accepted",
      companyMessage:
        "Thank you for accepting our partnership proposal! We're excited to work with you on expanding our patient management system in the Australian healthcare market. Your healthcare IT experience will be invaluable.",
      matchScore: 90,
      companyDetails: {
        industry: "Healthcare Technology",
        businessType: "SME",
        location: "Brisbane, QLD",
        website: "https://healthtechinnovations.com",
        description:
          "Healthcare technology company developing patient management and clinical workflow solutions for healthcare providers.",
      },
      productDetails: {
        targetCustomers: ["Healthcare Providers", "Clinics"],
        commission: "16% recurring commission",
        salesSupport: "Clinical specialists, implementation support, training programs",
        features: ["Patient records", "Appointment scheduling", "Clinical workflows", "Reporting tools"],
      },
      whySelected: [
        "Healthcare IT sales experience",
        "Understanding of healthcare compliance",
        "Relationships with healthcare providers",
        "Experience with clinical software",
      ],
      contactDetails: {
        email: "partnerships@healthtechinnovations.com",
        phone: "+61 7 3123 4567",
        contact: "Dr. Sarah Chen, Business Development Director",
      },
    },
    {
      id: 5,
      companyName: "RetailOptimize",
      productName: "Inventory Management Platform",
      eoiDate: "2024-01-15",
      status: "Rejected",
      companyMessage:
        "Thank you for considering our partnership opportunity. While we appreciate your interest, we've decided to focus on partners with more specific retail technology experience at this time.",
      matchScore: 65,
      companyDetails: {
        industry: "Retail Technology",
        businessType: "Startup",
        location: "Adelaide, SA",
        website: "https://retailoptimize.com",
        description:
          "Retail technology startup providing inventory management and optimization solutions for small to medium retailers.",
      },
      productDetails: {
        targetCustomers: ["SMEs", "Retailers"],
        commission: "25% first year, 12% recurring",
        salesSupport: "Product demos, setup assistance, customer support",
        features: ["Inventory tracking", "Demand forecasting", "Supplier management", "Analytics dashboard"],
      },
      whySelected: ["General sales experience", "SME customer focus", "Interest in technology solutions"],
    },
  ]

  const filteredEOIs = receivedEOIs.filter((eoi) => {
    const matchesSearch =
      eoi.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eoi.productName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || eoi.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Inbox className="h-3 w-3 mr-1" />
            New
          </Badge>
        )
      case "Reviewed":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Eye className="h-3 w-3 mr-1" />
            Reviewed
          </Badge>
        )
      case "Accepted":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        )
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusCounts = () => {
    const counts = {
      total: receivedEOIs.length,
      new: receivedEOIs.filter((eoi) => eoi.status === "New").length,
      reviewed: receivedEOIs.filter((eoi) => eoi.status === "Reviewed").length,
      accepted: receivedEOIs.filter((eoi) => eoi.status === "Accepted").length,
      rejected: receivedEOIs.filter((eoi) => eoi.status === "Rejected").length,
    }
    return counts
  }

  const handleAcceptEOI = (eoiId: number) => {
    console.log("Accepting EOI:", eoiId)
    // Here you would update the EOI status to "Accepted"
    // This would trigger notifications to the company and make contact details available
  }

  const handleRejectEOI = (eoiId: number) => {
    console.log("Rejecting EOI:", eoiId)
    // Here you would update the EOI status to "Rejected"
    // This would trigger a notification to the company
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">EOIs from Companies</h1>
        <p className="text-gray-600">Review and respond to expressions of interest from companies</p>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total EOIs</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
              <Inbox className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.new}</p>
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reviewed</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.reviewed}</p>
              </div>
              <Eye className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.accepted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by company or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* EOIs Table */}
      <Card>
        <CardHeader>
          <CardTitle>EOIs from Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Match Score</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEOIs.map((eoi) => (
                  <TableRow key={eoi.id} className={eoi.status === "New" ? "bg-blue-50" : ""}>
                    <TableCell className="font-medium">{eoi.companyName}</TableCell>
                    <TableCell>{eoi.productName}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-blue-600">{eoi.matchScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(eoi.eoiDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(eoi.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedEOI(eoi)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>EOI Details</DialogTitle>
                            </DialogHeader>
                            {selectedEOI && (
                              <div className="space-y-6">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold">{selectedEOI.productName}</h3>
                                    <p className="text-blue-600 font-medium">{selectedEOI.companyName}</p>
                                    <div className="flex items-center space-x-2 mt-2">
                                      {getStatusBadge(selectedEOI.status)}
                                      <div className="flex items-center space-x-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium text-blue-600">
                                          {selectedEOI.matchScore}% match
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <p className="font-medium text-gray-700 mb-2">Company's Message</p>
                                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-blue-800">{selectedEOI.companyMessage}</p>
                                  </div>
                                </div>

                                <div>
                                  <p className="font-medium text-gray-700 mb-2">Why They Selected You</p>
                                  <div className="space-y-2">
                                    {selectedEOI.whySelected.map((reason: any, index: Key | null | undefined) => (
                                      <div key={index} className="flex items-start text-sm">
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-green-700">{reason}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <p className="font-medium text-gray-700 mb-2">Company Information</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Industry</p>
                                      <p className="text-sm text-gray-800">{selectedEOI.companyDetails.industry}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Business Type</p>
                                      <p className="text-sm text-gray-800">{selectedEOI.companyDetails.businessType}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Location</p>
                                      <p className="text-sm text-gray-800">{selectedEOI.companyDetails.location}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Website</p>
                                      <a
                                        href={selectedEOI.companyDetails.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline"
                                      >
                                        {selectedEOI.companyDetails.website}
                                      </a>
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <p className="text-sm font-medium text-gray-600">Description</p>
                                    <p className="text-sm text-gray-800">{selectedEOI.companyDetails.description}</p>
                                  </div>
                                </div>

                                <div>
                                  <p className="font-medium text-gray-700 mb-2">Product Details</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Target Customers</p>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {selectedEOI.productDetails.targetCustomers.map((customer: any, index: Key | null | undefined) => (
                                          <Badge key={index} variant="outline" className="text-xs">
                                            {customer}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Commission</p>
                                      <p className="text-sm text-green-600 font-medium">
                                        {selectedEOI.productDetails.commission}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <p className="text-sm font-medium text-gray-600">Sales Support</p>
                                    <p className="text-sm text-gray-800">{selectedEOI.productDetails.salesSupport}</p>
                                  </div>
                                  <div className="mt-3">
                                    <p className="text-sm font-medium text-gray-600">Key Features</p>
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                      {selectedEOI.productDetails.features.map((feature: any, index: Key | null | undefined) => (
                                        <div key={index} className="flex items-center text-sm text-gray-600">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                          {feature}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {selectedEOI.contactDetails && (
                                  <div>
                                    <p className="font-medium text-gray-700 mb-2">Contact Details</p>
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                      <div className="space-y-1 text-sm">
                                        <p>
                                          <span className="font-medium">Contact:</span>{" "}
                                          {selectedEOI.contactDetails.contact}
                                        </p>
                                        <p>
                                          <span className="font-medium">Email:</span> {selectedEOI.contactDetails.email}
                                        </p>
                                        <p>
                                          <span className="font-medium">Phone:</span> {selectedEOI.contactDetails.phone}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {(selectedEOI.status === "New" || selectedEOI.status === "Reviewed") && (
                                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                                    <Button
                                      variant="outline"
                                      onClick={() => handleRejectEOI(selectedEOI.id)}
                                      className="flex-1"
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject EOI
                                    </Button>
                                    <Button
                                      onClick={() => handleAcceptEOI(selectedEOI.id)}
                                      className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Accept EOI
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {(eoi.status === "New" || eoi.status === "Reviewed") && (
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm" onClick={() => handleRejectEOI(eoi.id)}>
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptEOI(eoi.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Accept
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredEOIs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No EOIs found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
