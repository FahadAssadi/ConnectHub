"use client"

import { Key, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Clock, CheckCircle, XCircle, Send, Calendar, Building } from "lucide-react"

export function MySubmittedEOIsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedEOI, setSelectedEOI] = useState<any>(null)

  const submittedEOIs = [
    {
      id: 1,
      companyName: "Acme Corp",
      productName: "Cloud Analytics Platform",
      eoiDate: "2024-01-20",
      status: "Accepted by Company",
      message:
        "I have 8 years of experience in SaaS sales with a proven track record of $2M+ in annual sales. I specialize in enterprise analytics solutions and have strong relationships with CTOs and data teams in the Australian market.",
      responseDate: "2024-01-22",
      companyResponse:
        "We're impressed with your background and would love to work with you. Please find our contact details and product materials attached.",
      contactDetails: {
        email: "partnerships@acmecorp.com",
        phone: "+61 2 8123 4567",
        contact: "John Smith, VP Sales",
      },
      productDetails: {
        industry: "Software & Technology",
        targetCustomers: ["Enterprises", "SMEs"],
        commission: "15% recurring",
      },
    },
    {
      id: 2,
      companyName: "SecureHome Tech",
      productName: "Smart Home Security System",
      eoiDate: "2024-01-18",
      status: "Pending Company Acceptance",
      message:
        "I have extensive experience in security systems sales with a focus on residential markets. I've successfully launched 3 security products in the Australian market and have relationships with major retailers and installers.",
      responseDate: null,
      companyResponse: null,
      contactDetails: null,
      productDetails: {
        industry: "Security Technology",
        targetCustomers: ["End Consumers", "SMEs"],
        commission: "20% upfront + 5% recurring",
      },
    },
    {
      id: 3,
      companyName: "MedTech Solutions",
      productName: "Healthcare Data Analytics",
      eoiDate: "2024-01-15",
      status: "Accepted by Company",
      message:
        "I specialize in healthcare IT sales with deep understanding of HIPAA compliance and healthcare data requirements. I have relationships with 50+ healthcare organizations across Australia and New Zealand.",
      responseDate: "2024-01-17",
      companyResponse:
        "Your healthcare expertise is exactly what we need. We'd like to schedule a call to discuss partnership terms and provide you with our sales materials.",
      contactDetails: {
        email: "bd@medtechsolutions.com",
        phone: "+1 416 555 0123",
        contact: "Sarah Johnson, Business Development Director",
      },
      productDetails: {
        industry: "Healthcare Technology",
        targetCustomers: ["Enterprises", "Government"],
        commission: "18% recurring",
      },
    },
    {
      id: 4,
      companyName: "RetailTech Pro",
      productName: "E-commerce Automation Suite",
      eoiDate: "2024-01-12",
      status: "Rejected by Company",
      message:
        "I have experience in retail technology sales and have worked with several e-commerce platforms. I understand the challenges small businesses face with inventory management and order processing.",
      responseDate: "2024-01-14",
      companyResponse:
        "Thank you for your interest. While your background is impressive, we're currently looking for partners with more specific e-commerce platform experience.",
      contactDetails: null,
      productDetails: {
        industry: "Retail Technology",
        targetCustomers: ["SMEs", "End Consumers"],
        commission: "25% first year, 10% recurring",
      },
    },
    {
      id: 5,
      companyName: "IndustrialFlow Solutions",
      productName: "Manufacturing Optimization Software",
      eoiDate: "2024-01-10",
      status: "Pending Company Acceptance",
      message:
        "I have 12 years of experience in industrial software sales with a focus on manufacturing optimization. I've successfully sold similar solutions to major manufacturers across APAC and understand the ROI requirements for these investments.",
      responseDate: null,
      companyResponse: null,
      contactDetails: null,
      productDetails: {
        industry: "Manufacturing",
        targetCustomers: ["Enterprises", "Distributors"],
        commission: "12% of annual contract value",
      },
    },
    {
      id: 6,
      companyName: "DataFlow Analytics",
      productName: "Business Intelligence Suite",
      eoiDate: "2024-01-08",
      status: "Pending Company Acceptance",
      message:
        "I specialize in data analytics and business intelligence solutions with a strong technical background. I can effectively communicate complex analytics concepts to both technical and business stakeholders.",
      responseDate: null,
      companyResponse: null,
      contactDetails: null,
      productDetails: {
        industry: "Analytics & Data",
        targetCustomers: ["Enterprises", "Government"],
        commission: "16% recurring",
      },
    },
    {
      id: 7,
      companyName: "HealthTech Innovations",
      productName: "Telemedicine Platform",
      eoiDate: "2024-01-05",
      status: "Rejected by Company",
      message:
        "I have experience in healthcare technology and understand the regulatory requirements for telemedicine solutions. I have relationships with several healthcare providers who are looking for telehealth solutions.",
      responseDate: "2024-01-07",
      companyResponse:
        "We appreciate your interest, but we're currently focusing on partners with established telemedicine sales experience and existing relationships with large hospital systems.",
      contactDetails: null,
      productDetails: {
        industry: "Healthcare Technology",
        targetCustomers: ["Healthcare Providers", "Government"],
        commission: "16% recurring",
      },
    },
  ]

  const filteredEOIs = submittedEOIs.filter((eoi) => {
    const matchesSearch =
      eoi.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eoi.productName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || eoi.status.toLowerCase().includes(statusFilter.toLowerCase())

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Accepted by Company":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        )
      case "Pending Company Acceptance":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "Rejected by Company":
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
      total: submittedEOIs.length,
      pending: submittedEOIs.filter((eoi) => eoi.status === "Pending Company Acceptance").length,
      accepted: submittedEOIs.filter((eoi) => eoi.status === "Accepted by Company").length,
      rejected: submittedEOIs.filter((eoi) => eoi.status === "Rejected by Company").length,
    }
    return counts
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Submitted EOIs</h1>
        <p className="text-gray-600">Track the status of your expressions of interest sent to companies</p>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total EOIs</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
              <Send className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
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
                <SelectItem value="pending">Pending</SelectItem>
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
          <CardTitle>Your EOI Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEOIs.map((eoi) => (
                  <TableRow key={eoi.id}>
                    <TableCell className="font-medium">{eoi.companyName}</TableCell>
                    <TableCell>{eoi.productName}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(eoi.eoiDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(eoi.status)}</TableCell>
                    <TableCell>
                      {eoi.responseDate ? (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(eoi.responseDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedEOI(eoi)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
                                    <Badge variant="outline" className="text-xs">
                                      <Building className="h-3 w-3 mr-1" />
                                      {selectedEOI.productDetails.industry}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="font-medium text-gray-700 mb-1">Submitted Date</p>
                                  <p className="text-gray-600">{new Date(selectedEOI.eoiDate).toLocaleDateString()}</p>
                                </div>
                                {selectedEOI.responseDate && (
                                  <div>
                                    <p className="font-medium text-gray-700 mb-1">Response Date</p>
                                    <p className="text-gray-600">
                                      {new Date(selectedEOI.responseDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="font-medium text-gray-700 mb-2">Your Message</p>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                  <p className="text-gray-700 text-sm">{selectedEOI.message}</p>
                                </div>
                              </div>

                              {selectedEOI.companyResponse && (
                                <div>
                                  <p className="font-medium text-gray-700 mb-2">Company Response</p>
                                  <div
                                    className={`p-3 rounded-lg ${
                                      selectedEOI.status === "Accepted by Company"
                                        ? "bg-green-50 border border-green-200"
                                        : "bg-red-50 border border-red-200"
                                    }`}
                                  >
                                    <p
                                      className={`text-sm ${
                                        selectedEOI.status === "Accepted by Company" ? "text-green-800" : "text-red-800"
                                      }`}
                                    >
                                      {selectedEOI.companyResponse}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {selectedEOI.contactDetails && (
                                <div>
                                  <p className="font-medium text-gray-700 mb-2">Contact Details</p>
                                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
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

                              <div>
                                <p className="font-medium text-gray-700 mb-2">Product Information</p>
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
                                    <p className="text-sm font-medium text-gray-600">Commission Structure</p>
                                    <p className="text-sm text-green-600 font-medium mt-1">
                                      {selectedEOI.productDetails.commission}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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
