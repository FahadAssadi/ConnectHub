"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Package, TrendingUp, DollarSign, Plus, Eye, Clock, CheckCircle } from "lucide-react"

const recentActivities = [
  {
    id: 1,
    type: "partner_application",
    title: "New BD Partner Application",
    description: "TechSolutions Inc. applied for partnership",
    time: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    type: "product_update",
    title: "Product Updated",
    description: "Cloud Analytics Platform - Updated pricing",
    time: "4 hours ago",
    status: "completed",
  },
  {
    id: 3,
    type: "partner_approved",
    title: "Partner Approved",
    description: "DataFlow Systems partnership activated",
    time: "1 day ago",
    status: "completed",
  },
  {
    id: 4,
    type: "product_created",
    title: "New Product Added",
    description: "AI Marketing Suite launched",
    time: "2 days ago",
    status: "completed",
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Dashboard Overview</h1>
          <p className="text-muted-foreground text-pretty">
            Monitor your ConnectHub performance and manage partnerships
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active BD Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Listed</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$82,000</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.2%</div>
          </CardContent>
        </Card>
      </div>


      {/* Quick Actions and Recent Activity */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Quick Actions Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Review Partner Applications
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Performance Reports
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analyze Market Trends
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0 mt-1">
                    {activity.status === "pending" ? (
                      <Clock className="h-4 w-4 text-accent" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-chart-2" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <Badge variant={activity.status === "pending" ? "secondary" : "outline"} className="text-xs">
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
