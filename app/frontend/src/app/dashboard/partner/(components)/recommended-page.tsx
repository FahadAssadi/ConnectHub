"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Key, useState } from "react"
import { Star, Send, Eye, CheckCircle, MapPin, Target, Building, TrendingUp, Zap } from "lucide-react"

export function RecommendedPage() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null)
  const [eoiDialogOpen, setEoiDialogOpen] = useState(false)
  const [eoiMessage, setEoiMessage] = useState("")

  const recommendedOpportunities = [
    {
      id: 1,
      type: "product",
      companyName: "InnovateTech Solutions",
      productName: "AI-Powered CRM Platform",
      description:
        "Advanced customer relationship management platform with AI-driven insights, automation, and predictive analytics for sales teams.",
      matchScore: 95,
      matchingReasons: [
        "Matches your expertise in SaaS Sales",
        "Matches your target customers: SMEs & Enterprises",
        "Matches your regions: Australia & APAC",
        "High commission potential: 18% recurring",
      ],
      location: "Sydney, NSW",
      industry: "Software & Technology",
      targetCustomers: ["SMEs", "Enterprises"],
      commissionStructure: "18% recurring commission",
      isNew: true,
      urgency: "high",
      estimatedEarnings: "$15,000-25,000/quarter",
      productDetails: {
        features: ["AI-powered lead scoring", "Automated workflows", "Advanced analytics", "Mobile app"],
        pricing: "$199-999/month per user",
        marketSize: "Growing 25% YoY",
        competitiveAdvantage: "Only CRM with built-in AI sales coach",
      },
    },
    {
      id: 2,
      type: "product",
      companyName: "SecureHome Systems",
      productName: "Smart Security Solutions",
      description:
        "Comprehensive smart home security systems with IoT integration, mobile monitoring, and professional installation services.",
      matchScore: 92,
      matchingReasons: [
        "Perfect match for your Security Systems expertise",
        "Matches your target customers: End Consumers",
        "Strong in your regions: Australia",
        "High-volume opportunity with recurring revenue",
      ],
      location: "Melbourne, VIC",
      industry: "Security Technology",
      targetCustomers: ["End Consumers", "SMEs"],
      commissionStructure: "20% upfront + 5% recurring",
      isNew: false,
      urgency: "medium",
      estimatedEarnings: "$8,000-12,000/quarter",
      productDetails: {
        features: ["24/7 monitoring", "Smart sensors", "Mobile app", "Professional installation"],
        pricing: "$199 setup + $29/month",
        marketSize: "Expanding rapidly in residential market",
        competitiveAdvantage: "Lowest false alarm rate, award-winning app",
      },
    },
    {
      id: 3,
      type: "company",
      companyName: "DataFlow Analytics",
      description:
        "Leading provider of business intelligence and data analytics solutions for enterprises looking to leverage big data for competitive advantage.",
      matchScore: 90,
      matchingReasons: [
        "Matches your expertise in Data Analytics & BI",
        "Perfect for your Enterprise customer focus",
        "Strong presence in your regions: Australia & APAC",
        "Multiple high-value products to represent",
      ],
      location: "Brisbane, QLD",
      industry: "Analytics & Data",
      productCount: 4,
      averageCommission: "15-20%",
      isNew: true,
      urgency: "high",
      estimatedEarnings: "$20,000-35,000/quarter",
      products: [
        "Business Intelligence Suite",
        "Real-time Analytics Platform",
        "Data Visualization Tools",
        "Predictive Analytics Engine",
      ],
    },
    {
      id: 4,
      type: "product",
      companyName: "ManufacturingPro",
      productName: "Production Optimization Software",
      description:
        "Industrial software solution for optimizing manufacturing processes, reducing waste, and improving operational efficiency.",
      matchScore: 88,
      matchingReasons: [
        "Matches your Industrial Software expertise",
        "Perfect for your Enterprise customer base",
        "Global opportunity matching your APAC focus",
        "High-value deals with long sales cycles you excel at",
      ],
      location: "Perth, WA",
      industry: "Manufacturing",
      targetCustomers: ["Enterprises", "Distributors"],
      commissionStructure: "12% of annual contract value",
      isNew: false,
      urgency: "low",
      estimatedEarnings: "$25,000-40,000/quarter",
      productDetails: {
        features: ["Process optimization", "Waste reduction", "Real-time monitoring", "ROI tracking"],
        pricing: "Custom enterprise pricing",
        marketSize: "Large enterprises adopting Industry 4.0",
        competitiveAdvantage: "Average 25% efficiency improvement proven",
      },
    },
    {
      id: 5,
      type: "product",
      companyName: "HealthTech Innovations",
      productName: "Telemedicine Platform",
      description:
        "HIPAA-compliant telemedicine solution enabling healthcare providers to deliver remote consultations and patient monitoring.",
      matchScore: 85,
      matchingReasons: [
        "Growing market matching your Healthcare IT interest",
        "Matches your Government & Enterprise customer focus",
        "Strong regulatory compliance - your strength",
        "Recurring revenue model you prefer",
      ],
      location: "Adelaide, SA",
      industry: "Healthcare Technology",
      targetCustomers: ["Healthcare Providers", "Government"],
      commissionStructure: "16% recurring commission",
      isNew: true,
      urgency: "medium",
      estimatedEarnings: "$12,000-18,000/quarter",
      productDetails: {
        features: ["HIPAA compliance", "Video consultations", "Patient monitoring", "EMR integration"],
        pricing: "$150-500/month per provider",
        marketSize: "Accelerated by telehealth adoption",
        competitiveAdvantage: "Only platform with full compliance certification",
      },
    },
  ]

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <Zap className="h-3 w-3 mr-1" />
      case "medium":
        return <TrendingUp className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }

  const handleSubmitEOI = () => {
    console.log("Submitting EOI:", {
      opportunityId: selectedOpportunity?.id,
      message: eoiMessage,
    })
    setEoiDialogOpen(false)
    setEoiMessage("")
    setSelectedOpportunity(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Star className="h-6 w-6 mr-2 text-yellow-500" />
          Recommended for You
        </h1>
        <p className="text-gray-600">Opportunities perfectly matched to your expertise, experience, and preferences</p>
      </div>

      {/* Match Explanation */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">How We Match You</h3>
              <p className="text-sm text-blue-800">
                These recommendations are based on your profile:{" "}
                <strong>SaaS Sales, Security Systems, Data Analytics</strong> expertise, targeting{" "}
                <strong>SMEs & Enterprises</strong> in <strong>Australia & APAC</strong> regions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Opportunities */}
      <div className="space-y-4">
        {recommendedOpportunities.map((opportunity) => (
          <Card key={opportunity.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-lg text-blue-600">{opportunity.matchScore}%</span>
                      <span className="text-sm text-gray-600">match</span>
                    </div>
                    {opportunity.isNew && <Badge className="bg-green-500 text-white text-xs">New</Badge>}
                    <Badge className={`text-xs ${getUrgencyColor(opportunity.urgency)}`}>
                      {getUrgencyIcon(opportunity.urgency)}
                      {opportunity.urgency} priority
                    </Badge>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {opportunity.type === "product" ? opportunity.productName : opportunity.companyName}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">{opportunity.companyName}</p>
                  <p className="text-gray-600 mb-3">{opportunity.description}</p>
                </div>

                <div className="text-right ml-4">
                  <p className="text-sm font-medium text-green-600 mb-1">Estimated Earnings</p>
                  <p className="text-lg font-bold text-green-700">{opportunity.estimatedEarnings}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    <span>{opportunity.industry}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{opportunity.location}</span>
                  </div>
                  {opportunity.targetCustomers && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="h-4 w-4 mr-2" />
                      <span>{opportunity.targetCustomers.join(", ")}</span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Why this is perfect for you:</p>
                  <div className="space-y-1">
                    {opportunity.matchingReasons.slice(0, 2).map((reason, index) => (
                      <div key={index} className="flex items-start text-sm text-green-700">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                    {opportunity.matchingReasons.length > 2 && (
                      <p className="text-xs text-gray-500 ml-6">
                        +{opportunity.matchingReasons.length - 2} more reasons
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {opportunity.type === "product" ? (
                    <span className="font-medium">{opportunity.commissionStructure}</span>
                  ) : (
                    <span className="font-medium">
                      {opportunity.productCount} products • {opportunity.averageCommission} avg commission
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedOpportunity(opportunity)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {selectedOpportunity?.type === "product" ? "Product" : "Company"} Details
                        </DialogTitle>
                      </DialogHeader>
                      {selectedOpportunity && (
                        <div className="space-y-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold">
                                {selectedOpportunity.type === "product"
                                  ? selectedOpportunity.productName
                                  : selectedOpportunity.companyName}
                              </h3>
                              <p className="text-blue-600 font-medium">{selectedOpportunity.companyName}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                  <span className="font-bold text-lg text-blue-600">
                                    {selectedOpportunity.matchScore}%
                                  </span>
                                  <span className="text-sm text-gray-600">match</span>
                                </div>
                                <Badge className={`text-xs ${getUrgencyColor(selectedOpportunity.urgency)}`}>
                                  {selectedOpportunity.urgency} priority
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-green-600">Estimated Earnings</p>
                              <p className="text-lg font-bold text-green-700">
                                {selectedOpportunity.estimatedEarnings}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                            <p className="text-gray-600">{selectedOpportunity.description}</p>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Why This Matches You Perfectly</h4>
                            <div className="space-y-2">
                              {selectedOpportunity.matchingReasons.map((reason: any, index: Key | null | undefined) => (
                                <div key={index} className="flex items-start text-sm">
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-green-700">{reason}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {selectedOpportunity.type === "product" && selectedOpportunity.productDetails && (
                            <>
                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">Key Features</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {selectedOpportunity.productDetails.features.map((feature: any, index: Key | null | undefined) => (
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
                                  <p className="text-gray-600">{selectedOpportunity.productDetails.pricing}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-2">Commission</h4>
                                  <p className="text-green-600 font-medium">
                                    {selectedOpportunity.commissionStructure}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">Market Opportunity</h4>
                                <p className="text-gray-600">{selectedOpportunity.productDetails.marketSize}</p>
                              </div>

                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">Competitive Advantage</h4>
                                <p className="text-gray-600">
                                  {selectedOpportunity.productDetails.competitiveAdvantage}
                                </p>
                              </div>
                            </>
                          )}

                          {selectedOpportunity.type === "company" && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Available Products</h4>
                              <div className="grid grid-cols-1 gap-2">
                                {selectedOpportunity.products.map((product: any, index: Key | null | undefined) => (
                                  <div
                                    key={index}
                                    className="flex items-center text-sm text-gray-600 p-2 bg-gray-50 rounded"
                                  >
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                    {product}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Dialog open={eoiDialogOpen} onOpenChange={setEoiDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={() => setSelectedOpportunity(opportunity)}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Submit EOI
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Submit Expression of Interest</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-blue-600">{selectedOpportunity?.matchScore}% Match</span>
                          </div>
                          <p className="text-sm text-blue-800">
                            This is a highly recommended opportunity based on your profile!
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Submitting EOI for:{" "}
                            <span className="font-medium">
                              {selectedOpportunity?.type === "product"
                                ? selectedOpportunity?.productName
                                : selectedOpportunity?.companyName}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Company: <span className="font-medium">{selectedOpportunity?.companyName}</span>
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="message" className="text-sm font-medium">
                            Message to Company
                          </Label>
                          <Textarea
                            id="message"
                            placeholder="Highlight why you're the perfect partner for this opportunity based on the match reasons shown above..."
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
                          <Button
                            onClick={handleSubmitEOI}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                          >
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

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Want More Recommendations?</h3>
          <p className="text-gray-600 mb-4">
            Update your profile to get even better matches based on your latest experience and preferences.
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Update My Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
