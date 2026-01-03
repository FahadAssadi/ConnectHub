"use client"

import { useEffect, useMemo, useState } from "react"
import { KPICard } from "../company/(components)/KPI-card"
import { ActivityFeed, type ActivityItem } from "../company/(components)/activity-feed"
import { EOIStatusBreakdown } from "./(components)/eoi-status-breakdown"
import { ProductEngagementTable, type ProductEngagement } from "./(components)/product-engagement-table"
import { FileText, CheckCircle, XCircle, Clock, TrendingUp, Package } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"

function formatTimeAgo(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function mapEOIToActivityItem(eoi: any): ActivityItem {
  const statusMap: Record<string, ActivityItem["status"]> = {
    ACCEPTED: "success",
    REJECTED: "warning",
    PENDING: "info",
    WITHDRAWN: "warning",
    EXPIRED: "warning",
  }

  const initiator = eoi.initiator === "BD_PARTNER" ? "You" : eoi.product?.companyProfile?.commonDetails?.companyName || "A company"
  const productName = eoi.product?.name || "a product"
  const companyName =
    eoi.initiator === "COMPANY"
      ? eoi.product?.companyProfile?.commonDetails?.companyName || "Company"
      : eoi.bdpartnerIndividualProfile?.commonDetails?.firstName || eoi.bdPartnerOrganizationProfile?.commonDetails?.organizationName || "Partner"

  return {
    id: eoi.id,
    type: "eoi",
    title: `EOI ${eoi.status.toLowerCase()}`,
    description: `${initiator} ${eoi.status === "ACCEPTED" ? "accepted" : eoi.status === "REJECTED" ? "rejected" : "sent"} EOI for ${productName} ${eoi.initiator === "COMPANY" ? "to you" : ""}`,
    timestamp: formatTimeAgo(eoi.createdAt),
    status: statusMap[eoi.status] || "info",
  }
}

export default function BDPartnerDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalEOIs: 0,
    sentEOIs: 0,
    receivedEOIs: 0,
    pendingEOIs: 0,
    acceptedEOIs: 0,
    rejectedEOIs: 0,
    withdrawnEOIs: 0,
    expiredEOIs: 0,
    newEOIsThisWeek: 0,
    newEOIsThisMonth: 0,
    activePartnerships: 0,
    pendingResponses: 0,
    distinctProductsEngaged: 0,
    acceptanceRate: 0,
    acceptedSent: 0,
    decidedSent: 0,
  })
  const [profileType, setProfileType] = useState<"individual" | "organization" | null>(null)
  const [profileId, setProfileId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [productEngagements, setProductEngagements] = useState<ProductEngagement[]>([])

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // First, get user profile to determine BD partner type and ID
        const profileRes = await fetch(`${API_BASE}/user-profile`, {
          credentials: "include",
        })

        if (!profileRes.ok) throw new Error("Failed to fetch profile")

        const profileData = await profileRes.json()

        // Determine if individual or organization BD partner
        let pType: "individual" | "organization" | null = null
        let pId: string | null = null

        if (profileData.type === "BD_PARTNER_INDIVIDUAL") {
          pType = "individual"
          pId = profileData.bdpartnerIndividualProfile?.id
        } else if (profileData.type === "BD_PARTNER_ORGANIZATION") {
          pType = "organization"
          pId = profileData.bdpartnerOrganizationProfile?.id
        }

        if (!pType || !pId) {
          throw new Error("BD partner profile not found")
        }

        setProfileType(pType)
        setProfileId(pId)

        // Fetch dashboard metrics
        const metricsRes = await fetch(`${API_BASE}/dashboard/bd-partner/${pType}/${pId}/summary`, {
          credentials: "include",
        })

        if (!metricsRes.ok) throw new Error("Failed to fetch metrics")

        const metricsData = await metricsRes.json()
        setMetrics(metricsData)

        // Fetch EOIs for this BD partner
        const eoiRes = await fetch(`${API_BASE}/eoi/bd-partner/${pType}/${pId}`, {
          credentials: "include",
        })

        if (eoiRes.ok) {
          const eoiData = await eoiRes.json()
          const eois = Array.isArray(eoiData) ? eoiData : eoiData.data || []

          // Map EOIs to activity items (show last 5)
          const activityItems = eois.slice(0, 5).map(mapEOIToActivityItem)
          setActivities(activityItems)

          // Group EOIs by product for engagement table
          const engagementMap = new Map<string, ProductEngagement>()
          eois.forEach((eoi: any) => {
            const productName = eoi.product?.name || "Unknown Product"
            const companyName =
              eoi.product?.companyProfile?.commonDetails?.companyName || "Unknown Company"

            if (!engagementMap.has(productName)) {
              engagementMap.set(productName, {
                productName,
                companyName,
                eoiStatus: eoi.status.toLowerCase(),
                lastActivity: formatTimeAgo(eoi.updatedAt || eoi.createdAt),
              })
            } else {
              // Keep the most recent status
              const existing = engagementMap.get(productName)!
              if (new Date(eoi.updatedAt || eoi.createdAt) > new Date(existing.lastActivity)) {
                existing.eoiStatus = eoi.status.toLowerCase()
                existing.lastActivity = formatTimeAgo(eoi.updatedAt || eoi.createdAt)
              }
            }
          })

          setProductEngagements(Array.from(engagementMap.values()))
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Unable to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-lg">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">{error}</p>
          <p className="text-sm text-gray-600 mt-2">Please check your profile setup and try again.</p>
        </div>
      </div>
    )
  }

  const kpiData = [
    {
      title: "Total EOIs",
      value: metrics.totalEOIs.toString(),
      icon: FileText,
      trend: { value: metrics.newEOIsThisWeek, label: "new this week", positive: true },
    },
    {
      title: "Active Partnerships",
      value: metrics.activePartnerships.toString(),
      icon: CheckCircle,
      description: "Accepted collaborations",
    },
    {
      title: "Pending Responses",
      value: metrics.pendingResponses.toString(),
      icon: Clock,
      description: "Awaiting your action",
    },
    {
      title: "Products Engaged",
      value: metrics.distinctProductsEngaged.toString(),
      icon: Package,
      description: `${metrics.acceptanceRate.toFixed(0)}% acceptance rate`,
    },
    {
      title: "Sent EOIs",
      value: metrics.sentEOIs.toString(),
      icon: TrendingUp,
      trend: { value: metrics.newEOIsThisMonth, label: "new this month", positive: true },
    },
    {
      title: "Received EOIs",
      value: metrics.receivedEOIs.toString(),
      icon: FileText,
      description: "Companies reaching out",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your partnership activities and opportunities
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2 sections stacked */}
        <div className="lg:col-span-2 space-y-6">
          {/* EOI Status Breakdown */}
          <EOIStatusBreakdown
            pending={metrics.pendingEOIs}
            accepted={metrics.acceptedEOIs}
            rejected={metrics.rejectedEOIs}
            withdrawn={metrics.withdrawnEOIs}
            expired={metrics.expiredEOIs}
          />

          {/* Product Engagement Table */}
          <ProductEngagementTable engagements={productEngagements} />
        </div>

        {/* Right Column - Activity Feed */}
        <div className="lg:col-span-1">
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  )
}
