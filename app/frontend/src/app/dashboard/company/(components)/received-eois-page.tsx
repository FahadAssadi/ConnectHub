"use client"

import { Key, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Eye, Check, X, Star, MapPin } from "lucide-react"

export function ReceivedEOIsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [productFilter, setProductFilter] = useState("all")
  const [selectedEOI, setSelectedEOI] = useState<any>(null)

  const eois = [
    {
      id: 1,
      bdPartnerName: "TechSales Pro",
      productName: "Cloud Analytics Platform",
      eoiDate: "2024-01-25",
      status: "New",
      statusColor: "bg-blue-100 text-blue-800",
      message:
        "I have extensive experience selling cloud-based analytics solutions to enterprise clients in the APAC region. I'd love to discuss representing your platform.",
      bdPartner: {
        name: "TechSales Pro",
        industry: "Software & Technology",
        expertise: ["SaaS Sales", "Cloud Solutions", "Enterprise Software"],
        regions: "North America, APAC",
        experience: "8 years",
        rating: 4.8,
        background:
          "Former VP of Sales at CloudTech Solutions with a track record of $50M+ in software sales. Specialized in enterprise SaaS platforms and cloud migration services.",
      },
    },
    {
      id: 2,
      bdPartnerName: "GlobalSales Network",
      productName: "Manufacturing Software",
      eoiDate: "2024-01-24",
      status: "New",
      statusColor: "bg-blue-100 text-blue-800",
      message:
        "Your manufacturing optimization software aligns perfectly with my client base. I work with 50+ manufacturing companies across Europe.",
      bdPartner: {
        name: "GlobalSales Network",
        industry: "Manufacturing",
        expertise: ["Industrial Software", "B2B Sales", "Supply Chain"],
        regions: "Europe, Middle East",
        experience: "12 years",
        rating: 4.9,
        background:
          "Industrial sales specialist with deep connections in European manufacturing sector. Successfully launched 15+ software products in manufacturing space.",
      },
    },
    {
      id: 3,
      bdPartnerName: "DataFlow Solutions",
      productName: "Cloud Analytics Platform",
      eoiDate: "2024-01-22",
      status: "Reviewed",
      statusColor: "bg-gray-100 text-gray-800",
      message:
        "I specialize in data analytics solutions and have strong relationships with mid-market companies looking for advanced analytics capabilities.",
      bdPartner: {
        name: "DataFlow Solutions",
        industry: "Analytics & Data",
        expertise: ["Data Analytics", "Business Intelligence", "Cloud Platforms"],
        regions: "Europe, Australia",
        experience: "6 years",
        rating: 4.7,
        background:
          "Data analytics consultant turned BD professional. Strong technical background helps in selling complex analytics solutions to technical decision makers.",
      },
    },
    {
      id: 4,
      bdPartnerName: "HealthTech Partners",
      productName: "Healthcare Data Analytics",
      eoiDate: "2024-01-20",
      status: "Accepted",
      statusColor: "bg-green-100 text-green-800",
      message:
        "I have been working in healthcare technology sales for over 10 years and have established relationships with major healthcare providers.",
      bdPartner: {
        name: "HealthTech Partners",
        industry: "Healthcare Technology",
        expertise: ["Healthcare IT", "Data Analytics", "Compliance"],
        regions: "North America",
        experience: "10 years",
        rating: 4.9,
        background:
          "Healthcare IT sales veteran with deep understanding of HIPAA compliance and healthcare data requirements. Network includes 200+ healthcare organizations.",
      },
    },
    {
      id: 5,
      bdPartnerName: "SecureTech Sales",
      productName: "Smart Home Security",
      eoiDate: "2024-01-18",
      status: "Rejected",
      statusColor: "bg-red-100 text-red-800",
      message:
        "I have experience in security solutions and would like to represent your smart home security system in the residential market.",
      bdPartner: {
        name: "SecureTech Sales",
        industry: "Security Technology",
        expertise: ["Security Systems", "Residential Sales", "IoT Devices"],
        regions: "Australia, New Zealand",
        experience: "5 years",
        rating: 4.5,
        background:
          "Security systems specialist with focus on residential and small business markets. Strong relationships with security installers and retailers.",
      },
    },
  ]

  const filteredEOIs = eois.filter((eoi) => {
    const matchesSearch =
      eoi.bdPartnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eoi.productName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || eoi.status.toLowerCase() === statusFilter
    const matchesProduct = productFilter === "all" || eoi.productName === productFilter

    return matchesSearch && matchesStatus && matchesProduct
  })

  const handleAcceptEOI = (eoiId: number) => {
    console.log("Accept EOI:", eoiId)
    // Update EOI status to accepted
  }

  const handleRejectEOI = (eoiId: number) => {
    console.log("Reject EOI:", eoiId)
    // Update EOI status to rejected
  }

  const products = [...new Set(eois.map((eoi) => eoi.productName))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Received EOIs</h1>
        <p className="text-gray-600">Manage expressions of interest from BD partners</p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by BD partner or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product} value={product}>
                    {product}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* EOIs Table */}
      <Card>
        <CardHeader>
          <CardTitle>EOIs ({filteredEOIs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>BD Partner</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEOIs.map((eoi) => (
                  <TableRow key={eoi.id}>
                    <TableCell className="font-medium">{eoi.bdPartnerName}</TableCell>
                    <TableCell>{eoi.productName}</TableCell>
                    <TableCell>{new Date(eoi.eoiDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={eoi.statusColor}>{eoi.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedEOI(eoi)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>EOI Details</DialogTitle>
                            </DialogHeader>
                            {selectedEOI && (
                              <div className="space-y-6">
                                {/* BD Partner Profile */}
                                <div className="border rounded-lg p-4">
                                  <div className="flex items-start justify-between mb-4">
                                    <div>
                                      <h3 className="text-lg font-semibold">{selectedEOI.bdPartner.name}</h3>
                                      <p className="text-gray-600">{selectedEOI.bdPartner.industry}</p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      <span className="text-sm font-medium">{selectedEOI.bdPartner.rating}</span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <p className="text-sm font-medium text-gray-700 mb-1">Experience</p>
                                      <p className="text-sm text-gray-600">{selectedEOI.bdPartner.experience}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-700 mb-1">Regions</p>
                                      <p className="text-sm text-gray-600 flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {selectedEOI.bdPartner.regions}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Top Expertise</p>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedEOI.bdPartner.expertise.map((skill: any, index: Key | null | undefined) => (
                                        <Badge key={index} variant="secondary">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Background</p>
                                    <p className="text-sm text-gray-600">{selectedEOI.bdPartner.background}</p>
                                  </div>
                                </div>

                                {/* EOI Message */}
                                <div className="border rounded-lg p-4">
                                  <h4 className="font-medium text-gray-900 mb-2">EOI Message</h4>
                                  <p className="text-gray-600">{selectedEOI.message}</p>
                                </div>

                                {/* Actions */}
                                {selectedEOI.status === "New" && (
                                  <div className="flex space-x-3">
                                    <Button
                                      className="flex-1 bg-green-600 hover:bg-green-700"
                                      onClick={() => handleAcceptEOI(selectedEOI.id)}
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      Accept EOI
                                    </Button>
                                    <Button
                                      variant="outline"
                                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                                      onClick={() => handleRejectEOI(selectedEOI.id)}
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Reject EOI
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {eoi.status === "New" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleAcceptEOI(eoi.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                              onClick={() => handleRejectEOI(eoi.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
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
              <p className="text-gray-500">No EOIs found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
