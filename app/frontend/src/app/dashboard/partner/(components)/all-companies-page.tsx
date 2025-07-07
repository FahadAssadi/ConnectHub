"use client"

import { Key, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Eye, Send, Building, MapPin, Calendar, Package } from 'lucide-react'

export function AllCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [businessTypeFilter, setBusinessTypeFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")
  const [selectedCompany, setSelectedCompany] = useState<any>(null)

  const companies = [
    {
      id: 1,
      companyName: "Acme Corp",
      description: "Leading provider of cloud-based analytics solutions for enterprise clients, specializing in data transformation and business intelligence.",
      industry: "Software & Technology",
      businessType: "SME",
      country: "Australia",
      registrationDate: "2018-03-15",
      productCount: 3,
      activePartners: 8,
      website: "https://acmecorp.com",
      headquarters: "Sydney, NSW",
      employeeCount: "50-200",
      yearlyRevenue: "$5M-10M",
      products: [
        "Cloud Analytics Platform",
        "Business Intelligence Suite", 
        "Data Visualization Tools"
      ]
    },
    {
      id: 2,
      companyName: "SecureHome Tech",
      description: "Innovative smart home security solutions provider offering comprehensive IoT-based security systems for residential and commercial use.",
      industry: "Security Technology",
      businessType: "Startup",
      country: "Australia",
      registrationDate: "2021-08-20",
      productCount: 2,
      activePartners: 5,
      website: "https://securehometech.com",
      headquarters: "Melbourne, VIC",
      employeeCount: "10-50",
      yearlyRevenue: "$1M-5M",
      products: [
        "Smart Home Security System",
        "Commercial Security Solutions"
      ]
    },
    {
      id: 3,
      companyName: "IndustrialFlow Solutions",
      description: "Global leader in manufacturing optimization software, helping industrial companies reduce waste and improve operational efficiency.",
      industry: "Manufacturing",
      businessType: "Enterprise",
      country: "United States",
      registrationDate: "2015-11-10",
      productCount: 5,
      activePartners: 25,
      website: "https://industrialflow.com",
      headquarters: "Detroit, MI",
      employeeCount: "500+",
      yearlyRevenue: "$50M+",
      products: [
        "Manufacturing Optimization Software",
        "Supply Chain Management",
        "Quality Control Systems",
        "Predictive Maintenance Platform",
        "Industrial IoT Solutions"
      ]
    },
    {
      id: 4,
      companyName: "MedTech Solutions",
      description: "Healthcare technology company focused on developing HIPAA-compliant data analytics platforms for hospitals and healthcare providers.",
      industry: "Healthcare Technology",
      businessType: "SME",
      country: "Canada",
      registrationDate: "2019-05-22",
      productCount: 4,
      activePartners: 12,
      website: "https://medtechsolutions.ca",
      headquarters: "Toronto, ON",
      employeeCount: "100-500",
      yearlyRevenue: "$10M-50M",
      products: [
        "Healthcare Data Analytics",
        "Patient Management System",
        "Telemedicine Platform",
        "Clinical Decision Support"
      ]
    },
    {
      id: 5,
      companyName: "RetailTech Pro",
      description: "E-commerce automation specialists providing comprehensive solutions for online retailers to streamline operations and improve customer experience.",
      industry: "Retail Technology",
      businessType: "SME",
      country: "United Kingdom",
      registrationDate: "2020-02-14",
      productCount: 3,
      activePartners: 7,
      website: "https://retailtechpro.co.uk",
      headquarters: "London, UK",
      employeeCount: "50-100",
      yearlyRevenue: "$5M-10M",
      products: [
        "E-commerce Automation Suite",
        "Inventory Management System",
        "Customer Service Platform"
      ]
    },
  ]

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = industryFilter === "all" || company.industry.toLowerCase().includes(industryFilter.toLowerCase())
    const matchesBusinessType = businessTypeFilter === "all" || company.businessType.toLowerCase() === businessTypeFilter.toLowerCase()
    const matchesCountry = countryFilter === "all" || company.country.toLowerCase() === countryFilter.toLowerCase()

    return matchesSearch && matchesIndustry && matchesBusinessType && matchesCountry
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Companies</h1>
        <p className="text-gray-600">Browse companies looking for business development partners</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for companies..."
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
            <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Business Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="startup">Startup</SelectItem>
                <SelectItem value="sme">SME</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="australia">Australia</SelectItem>
                <SelectItem value="united states">United States</SelectItem>
                <SelectItem value="canada">Canada</SelectItem>
                <SelectItem value="united kingdom">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredCompanies.length} of {companies.length} companies
        </p>
        <Select defaultValue="name">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Company Name</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="industry">Industry</SelectItem>
            <SelectItem value="size">Company Size</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Company Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{company.companyName}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {company.businessType}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{company.productCount} products</p>
                  <p className="text-xs text-gray-500">{company.activePartners} partners</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{company.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-600">
                  <Building className="h-3 w-3 mr-1" />
                  <span>{company.industry}</span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{company.headquarters}</span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Founded {new Date(company.registrationDate).getFullYear()}</span>
                </div>
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
                      View Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Company Profile</DialogTitle>
                    </DialogHeader>
                    {selectedCompany && (
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold">{selectedCompany.companyName}</h3>
                            <p className="text-gray-600">{selectedCompany.industry}</p>
                            <Badge variant="secondary" className="mt-2">{selectedCompany.businessType}</Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{selectedCompany.productCount} Products</p>
                            <p className="text-sm text-gray-600">{selectedCompany.activePartners} Active Partners</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Company Description</h4>
                          <p className="text-gray-600">{selectedCompany.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Headquarters</h4>
                            <p className="text-gray-600 flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {selectedCompany.headquarters}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Country</h4>
                            <p className="text-gray-600">{selectedCompany.country}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Employee Count</h4>
                            <p className="text-gray-600">{selectedCompany.employeeCount}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Annual Revenue</h4>
                            <p className="text-gray-600">{selectedCompany.yearlyRevenue}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Website</h4>
                          <a
                            href={selectedCompany.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedCompany.website}
                          </a>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Products & Services</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {selectedCompany.products.map((product: any, index: Key | null | undefined) => (
                              <div key={index} className="flex items-center text-sm text-gray-600 p-2 bg-gray-50 rounded">
                                <Package className="h-4 w-4 mr-2 text-blue-500" />
                                {product}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Registration Date</h4>
                          <p className="text-gray-600 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(selectedCompany.registrationDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button size="sm" className="flex-1">
                  <Package className="h-3 w-3 mr-1" />
                  View Products
                </Button>
              </div>

              <div className="mt-3">
                <Button size="sm" className="w-full" variant="outline">
                  <Send className="h-3 w-3 mr-1" />
                  Send EOI to Company
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">No companies found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setIndustryFilter("all")
                setBusinessTypeFilter("all")
                setCountryFilter("all")
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
