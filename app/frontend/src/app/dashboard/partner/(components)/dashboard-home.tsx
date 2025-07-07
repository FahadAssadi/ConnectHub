"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send, Inbox, Building, DollarSign, Eye, CheckCircle, Clock, Star, MapPin, Target } from "lucide-react"

export function PartnerDashboardHome() {
  const metrics = [
    {
      title: "Active Submitted EOIs",
      value: "7",
      subtitle: "3 Pending Company Acceptance",
      icon: Send,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "New EOIs from Companies",
      value: "2",
      subtitle: "Awaiting Your Response",
      icon: Inbox,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      action: "Review Now",
    },
    {
      title: "Connected Companies",
      value: "5",
      subtitle: "Active Partnerships",
      icon: Building,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Estimated Potential Earnings",
      value: "$12,500",
      subtitle: "This Quarter",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const recentActivity = [
    {
      type: "Company Accepted Your EOI",
      entity: "for Cloud Analytics Platform from Acme Corp",
      time: "1 hour ago",
      action: "View Engagement",
      status: "success",
    },
    {
      type: "New EOI from Company",
      entity: "from TechFlow Solutions for Manufacturing Software",
      time: "3 hours ago",
      action: "View EOI",
      status: "new",
    },
    {
      type: "Product Updated",
      entity: "Smart Home Security product details updated",
      time: "1 day ago",
      action: "View Product Details",
      status: "info",
    },
    {
      type: "Your Profile Approved",
      entity: "Profile updates have been approved",
      time: "2 days ago",
      action: "View Profile",
      status: "success",
    },
    {
      type: "Company Accepted Your EOI",
      entity: "for Healthcare Analytics from MedTech Solutions",
      time: "3 days ago",
      action: "View Engagement",
      status: "success",
    },
  ]

  const recommendedOpportunities = [
    {
      id: 1,
      companyName: "InnovateTech Solutions",
      productName: "AI-Powered CRM Platform",
      description: "Advanced customer relationship management platform with AI-driven insights and automation.",
      matchingPoints: ["Matches your expertise in SaaS Sales", "Matches your target customers: SMEs"],
      location: "Sydney, NSW",
      industry: "Software & Technology",
      targetCustomers: ["SMEs", "Enterprises"],
      isNew: true,
    },
    {
      id: 2,
      companyName: "SecureHome Systems",
      productName: "Smart Security Solutions",
      description: "Comprehensive smart home security systems with IoT integration and mobile monitoring.",
      matchingPoints: ["Matches your expertise in Security Systems", "Matches your regions: Australia"],
      location: "Melbourne, VIC",
      industry: "Security Technology",
      targetCustomers: ["End Consumers", "SMEs"],
      isNew: false,
    },
    {
      id: 3,
      companyName: "DataFlow Analytics",
      productName: "Business Intelligence Suite",
      description: "Enterprise-grade business intelligence and data analytics platform for data-driven decisions.",
      matchingPoints: ["Matches your expertise in Data Analytics", "Matches your target customers: Enterprises"],
      location: "Brisbane, QLD",
      industry: "Analytics & Data",
      targetCustomers: ["Enterprises", "Government"],
      isNew: true,
    },
    {
      id: 4,
      companyName: "ManufacturingPro",
      productName: "Production Optimization Software",
      description: "Industrial software solution for optimizing manufacturing processes and supply chain management.",
      matchingPoints: ["Matches your expertise in Industrial Software", "Matches your regions: APAC"],
      location: "Perth, WA",
      industry: "Manufacturing",
      targetCustomers: ["Enterprises", "Distributors"],
      isNew: false,
    },
  ]

  const latestProducts = [
    {
      id: 1,
      companyName: "HealthTech Innovations",
      productName: "Telemedicine Platform",
      description: "HIPAA-compliant telemedicine solution for healthcare providers.",
      industry: "Healthcare Technology",
      addedTime: "2 hours ago",
    },
    {
      id: 2,
      companyName: "EcoSolutions",
      productName: "Renewable Energy Management",
      description: "Smart grid management system for renewable energy optimization.",
      industry: "Clean Technology",
      addedTime: "5 hours ago",
    },
    {
      id: 3,
      companyName: "RetailTech Pro",
      productName: "Inventory Management System",
      description: "Cloud-based inventory management for retail and e-commerce businesses.",
      industry: "Retail Technology",
      addedTime: "1 day ago",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "info":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <div className="w-2 h-2 bg-gray-300 rounded-full" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, Jane Doe!</h1>
        <p className="text-gray-600">Discover new opportunities and manage your business development partnerships.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{metric.subtitle}</p>
                    {metric.action && (
                      <Button size="sm" className="mt-3">
                        {metric.action}
                      </Button>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className="mt-1">{getStatusIcon(activity.status)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                      <p className="text-sm text-gray-600">{activity.entity}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">{activity.time}</p>
                        <Button variant="ghost" size="sm">
                          {activity.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Latest Product Listings */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Latest Product Listings</CardTitle>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {latestProducts.map((product, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900">{product.productName}</h4>
                        <p className="text-xs text-gray-600">{product.companyName}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {product.industry}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{product.addedTime}</span>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          View
                        </Button>
                        <Button size="sm" className="h-6 px-2 text-xs">
                          EOI
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommended Products & Companies */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Recommended for You
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Opportunities matching your expertise and preferences</p>
          </div>
          <Button variant="outline">View All Recommendations</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow relative">
                {opportunity.isNew && (
                  <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">New</Badge>
                )}

                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900 mb-1">{opportunity.companyName}</h4>
                  <h5 className="font-medium text-blue-600 text-sm mb-2">{opportunity.productName}</h5>
                  <p className="text-sm text-gray-600 line-clamp-2">{opportunity.description}</p>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-xs text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Target className="h-3 w-3 mr-1" />
                    <span>{opportunity.targetCustomers.join(", ")}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Why this matches you:</p>
                  <div className="space-y-1">
                    {opportunity.matchingPoints.map((point, index) => (
                      <div key={index} className="flex items-center text-xs text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Send className="h-3 w-3 mr-1" />
                    Submit EOI
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
