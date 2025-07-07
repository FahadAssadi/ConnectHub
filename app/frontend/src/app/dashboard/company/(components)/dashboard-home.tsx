"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Users, Inbox, TrendingUp, Eye, Send, Clock, CheckCircle } from "lucide-react"

export function DashboardHome() {
  const metrics = [
    {
      title: "Total Products Listed",
      value: "12",
      subtitle: "3 Pending Approval",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active BD Engagements",
      value: "8",
      subtitle: "BD Partners",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "New EOIs Received",
      value: "5",
      subtitle: "Awaiting Review",
      icon: Inbox,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      action: "Review Now",
    },
    {
      title: "Performance Snapshot",
      value: "24",
      subtitle: "Leads This Month",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const recentActivity = [
    {
      type: "New EOI Received",
      entity: "from TechSales Pro for Cloud Analytics Platform",
      time: "2 hours ago",
      action: "View EOI",
      status: "new",
    },
    {
      type: "Product Approved",
      entity: "Smart Home Security",
      time: "1 day ago",
      action: "View Product",
      status: "success",
    },
    {
      type: "BD Partner Accepted EOI",
      entity: "DataFlow Solutions accepted your EOI",
      time: "2 days ago",
      action: "View Details",
      status: "success",
    },
    {
      type: "Product Submitted for Review",
      entity: "AI-Powered CRM Platform",
      time: "3 days ago",
      action: "View Product",
      status: "pending",
    },
    {
      type: "New EOI Received",
      entity: "from GlobalSales Network for Manufacturing Software",
      time: "4 days ago",
      action: "View EOI",
      status: "reviewed",
    },
  ]

  const myProducts = [
    {
      name: "Cloud Analytics Platform",
      status: "Approved",
      bdPartners: 3,
      statusColor: "bg-green-100 text-green-800",
    },
    {
      name: "Smart Home Security",
      status: "Approved",
      bdPartners: 2,
      statusColor: "bg-green-100 text-green-800",
    },
    {
      name: "AI-Powered CRM",
      status: "Pending Review",
      bdPartners: 0,
      statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
      name: "Manufacturing Software",
      status: "Draft",
      bdPartners: 0,
      statusColor: "bg-gray-100 text-gray-800",
    },
  ]

  const suggestedPartners = [
    {
      name: "TechSales Pro",
      industry: "Software & Technology",
      expertise: ["SaaS Sales", "Cloud Solutions", "Enterprise Software"],
      regions: "North America, APAC",
    },
    {
      name: "GlobalSales Network",
      industry: "Manufacturing",
      expertise: ["Industrial Software", "B2B Sales", "Supply Chain"],
      regions: "Global",
    },
    {
      name: "DataFlow Solutions",
      industry: "Analytics & Data",
      expertise: ["Data Analytics", "Business Intelligence", "Cloud Platforms"],
      regions: "Europe, Australia",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <div className="w-2 h-2 bg-gray-300 rounded-full" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, Acme Corp.!</h1>
        <p className="text-gray-600">Here's what's happening with your business development activities.</p>
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

        {/* My Products Quick View */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Products</CardTitle>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myProducts.map((product, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm text-gray-900">{product.name}</h4>
                      <Badge className={product.statusColor}>{product.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{product.bdPartners} BD Partners</span>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          Edit
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

      {/* Suggested BD Partners */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested BD Partners</CardTitle>
          <p className="text-sm text-gray-600">BD partners whose skills match your products and services</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedPartners.map((partner, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">{partner.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{partner.industry}</p>
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Top Expertise:</p>
                  <div className="flex flex-wrap gap-1">
                    {partner.expertise.slice(0, 2).map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {partner.expertise.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{partner.expertise.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3">{partner.regions}</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    View Profile
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Send className="h-3 w-3 mr-1" />
                    Send EOI
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
