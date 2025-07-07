"use client"

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Eye, Send, Star, MapPin, Briefcase, Clock } from "lucide-react"

export function BrowsePartnersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [selectedPartner, setSelectedPartner] = useState<any>(null)
  const [eoiDialogOpen, setEoiDialogOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [eoiMessage, setEoiMessage] = useState("")

  const partners = [
    {
      id: 1,
      name: "TechSales Pro",
      industry: "Software & Technology",
      expertise: ["SaaS Sales", "Cloud Solutions", "Enterprise Software", "API Integration"],
      regions: "North America, APAC",
      availability: "Full-time",
      experience: "8 years",
      rating: 4.8,
      background:
        "Former VP of Sales at CloudTech Solutions with a track record of $50M+ in software sales. Specialized in enterprise SaaS platforms and cloud migration services.",
      customerTypes: ["Enterprises", "SMEs"],
      preferredCategories: ["SaaS & Software", "Professional Services"],
    },
    {
      id: 2,
      name: "GlobalSales Network",
      industry: "Manufacturing",
      expertise: ["Industrial Software", "B2B Sales", "Supply Chain", "Process Optimization"],
      regions: "Europe, Middle East",
      availability: "Part-time",
      experience: "12 years",
      rating: 4.9,
      background:
        "Industrial sales specialist with deep connections in European manufacturing sector. Successfully launched 15+ software products in manufacturing space.",
      customerTypes: ["Enterprises", "Distributors"],
      preferredCategories: ["Manufacturing & Industrial", "Professional Services"],
    },
    {
      id: 3,
      name: "DataFlow Solutions",
      industry: "Analytics & Data",
      expertise: ["Data Analytics", "Business Intelligence", "Cloud Platforms", "Machine Learning"],
      regions: "Europe, Australia",
      availability: "Flexible",
      experience: "6 years",
      rating: 4.7,
      background:
        "Data analytics consultant turned BD professional. Strong technical background helps in selling complex analytics solutions to technical decision makers.",
      customerTypes: ["Enterprises", "SMEs", "Government"],
      preferredCategories: ["SaaS & Software", "Professional Services"],
    },
    {
      id: 4,
      name: "HealthTech Partners",
      industry: "Healthcare Technology",
      expertise: ["Healthcare IT", "Data Analytics", "Compliance", "Digital Health"],
      regions: "North America",
      availability: "Full-time",
      experience: "10 years",
      rating: 4.9,
      background:
        "Healthcare IT sales veteran with deep understanding of HIPAA compliance and healthcare data requirements. Network includes 200+ healthcare organizations.",
      customerTypes: ["Enterprises", "Government"],
      preferredCategories: ["Healthcare & MedTech", "SaaS & Software"],
    },
    {
      id: 5,
      name: "SecureTech Sales",
      industry: "Security Technology",
      expertise: ["Security Systems", "Residential Sales", "IoT Devices", "Cybersecurity"],
      regions: "Australia, New Zealand",
      availability: "Project-based",
      experience: "5 years",
      rating: 4.5,
      background:
        "Security systems specialist with focus on residential and small business markets. Strong relationships with security installers and retailers.",
      customerTypes: ["SMEs", "End Consumers", "Retailers"],
      preferredCategories: ["Security & IoT", "Consumer Electronics"],
    },
  ]

  const myProducts = [
    "Cloud Analytics Platform",
    "Smart Home Security System",
    "AI-Powered CRM Platform",
    "Manufacturing Optimization Software",
    "Healthcare Data Analytics",
  ]

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.expertise.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      partner.industry.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry =
      industryFilter === "all" || partner.industry.toLowerCase().includes(industryFilter.toLowerCase())
    const matchesRegion = regionFilter === "all" || partner.regions.toLowerCase().includes(regionFilter.toLowerCase())
    const matchesAvailability =
      availabilityFilter === "all" || partner.availability.toLowerCase() === availabilityFilter.toLowerCase()

    return matchesSearch && matchesIndustry && matchesRegion && matchesAvailability
  })

  const handleSendEOI = () => {
    console.log("Sending EOI:", {
      partnerId: selectedPartner?.id,
      products: selectedProducts,
      message: eoiMessage,
    })
    setEoiDialogOpen(false)
    setSelectedProducts([])
    setEoiMessage("")
    setSelectedPartner(null)
  }

  const handleProductToggle = (product: string) => {
    setSelectedProducts((prev) => (prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Browse BD Partners</h1>
        <p className="text-gray-600">Find and connect with qualified business development partners</p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search partners, skills..."
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
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="healthcare">Healthcare Technology</SelectItem>
                <SelectItem value="security">Security Technology</SelectItem>
                <SelectItem value="analytics">Analytics & Data</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="north america">North America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="apac">APAC</SelectItem>
                <SelectItem value="australia">Australia</SelectItem>
                <SelectItem value="middle east">Middle East</SelectItem>
              </SelectContent>
            </Select>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
                <SelectItem value="project-based">Project-based</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <Card key={partner.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                  <p className="text-sm text-gray-600">{partner.industry}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{partner.rating}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Top Expertise</p>
                  <div className="flex flex-wrap gap-1">
                    {partner.expertise.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {partner.expertise.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{partner.expertise.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{partner.regions}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{partner.availability}</span>
                  </div>
                </div>

                <div className="flex items-center text-xs text-gray-600">
                  <Briefcase className="h-3 w-3 mr-1" />
                  <span>{partner.experience} experience</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{partner.background}</p>

              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setSelectedPartner(partner)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>BD Partner Profile</DialogTitle>
                    </DialogHeader>
                    {selectedPartner && (
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold">{selectedPartner.name}</h3>
                            <p className="text-gray-600">{selectedPartner.industry}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{selectedPartner.rating}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-gray-700 mb-1">Experience</p>
                            <p className="text-gray-600">{selectedPartner.experience}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700 mb-1">Availability</p>
                            <p className="text-gray-600">{selectedPartner.availability}</p>
                          </div>
                        </div>

                        <div>
                          <p className="font-medium text-gray-700 mb-2">Regions Covered</p>
                          <p className="text-gray-600 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {selectedPartner.regions}
                          </p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-700 mb-2">Areas of Expertise</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedPartner.expertise.map((skill: any, index: Key | null | undefined) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="font-medium text-gray-700 mb-2">Customer Types</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedPartner.customerTypes.map((type: any, index: Key | null | undefined) => (
                              <Badge key={index} variant="outline">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="font-medium text-gray-700 mb-2">Preferred Categories</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedPartner.preferredCategories.map((category: any, index: Key | null | undefined) => (
                              <Badge key={index} variant="outline">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="font-medium text-gray-700 mb-2">Professional Background</p>
                          <p className="text-gray-600">{selectedPartner.background}</p>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Dialog open={eoiDialogOpen} onOpenChange={setEoiDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex-1" onClick={() => setSelectedPartner(partner)}>
                      <Send className="h-3 w-3 mr-1" />
                      Send EOI
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Send Expression of Interest</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Sending EOI to: <span className="font-medium">{selectedPartner?.name}</span>
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Select Products</Label>
                        <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                          {myProducts.map((product) => (
                            <div key={product} className="flex items-center space-x-2">
                              <Checkbox
                                id={product}
                                checked={selectedProducts.includes(product)}
                                onCheckedChange={() => handleProductToggle(product)}
                              />
                              <Label htmlFor={product} className="text-sm cursor-pointer">
                                {product}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-sm font-medium">
                          Message (Optional)
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Introduce your products and explain why you'd like to work with this BD partner..."
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
                        <Button onClick={handleSendEOI} disabled={selectedProducts.length === 0} className="flex-1">
                          Send EOI
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPartners.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">No BD partners found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setIndustryFilter("all")
                setRegionFilter("all")
                setAvailabilityFilter("all")
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
