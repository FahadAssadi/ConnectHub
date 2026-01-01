"use client";

import { useEffect, useMemo, useState } from "react";
import { KPICard } from "./(components)/KPI-card"
import { ActivityFeed, type ActivityItem } from "./(components)/activity-feed"
import { ProductPerformanceTable, type ProductPerformance } from "./(components)/product-performance"
import { Package, FileText, CheckCircle, Clock } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"

// Mock data
const activities: ActivityItem[] = [
  {
    id: "1",
    type: "application",
    title: "New application received",
    description: "BD Partner John Smith applied to CloudSync Pro",
    timestamp: "2 hours ago",
    status: "info",
  },
  {
    id: "2",
    type: "product",
    title: "Product approved",
    description: "Your product 'Analytics Dashboard' has been approved by admin",
    timestamp: "5 hours ago",
    status: "success",
  },
  {
    id: "3",
    type: "eoi",
    title: "EOI accepted",
    description: "TechCorp Partners accepted your Expression of Interest",
    timestamp: "1 day ago",
    status: "success",
  },
  {
    id: "4",
    type: "application",
    title: "Application reviewed",
    description: "You reviewed application from Sarah Johnson",
    timestamp: "1 day ago",
    status: "info",
  },
  {
    id: "5",
    type: "profile",
    title: "Profile updated",
    description: "Company profile information has been updated",
    timestamp: "2 days ago",
    status: "info",
  },
]

const products: ProductPerformance[] = [
  {
    id: "1",
    name: "CloudSync Pro",
    status: "approved",
    applicationsCount: 12,
    lastUpdated: "2 days ago",
    type: "product",
  },
  {
    id: "2",
    name: "Analytics Dashboard",
    status: "approved",
    applicationsCount: 8,
    lastUpdated: "5 days ago",
    type: "product",
  },
  {
    id: "3",
    name: "Consulting Services",
    status: "pending",
    applicationsCount: 0,
    lastUpdated: "1 week ago",
    type: "service",
  },
  {
    id: "4",
    name: "Data Migration Tool",
    status: "approved",
    applicationsCount: 15,
    lastUpdated: "1 week ago",
    type: "product",
  },
  {
    id: "5",
    name: "Security Audit Service",
    status: "draft",
    applicationsCount: 0,
    lastUpdated: "2 weeks ago",
    type: "service",
  },
]


export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    activeProducts: 0,
    totalEOIs: 0,
    activePartnerships: 0,
    newEOIsThisWeek: 0,
    newEOIsThisMonth: 0,
    pendingApprovalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const summaryUrl = useMemo(() => `${API_BASE}/dashboard/company/summary`, []);

    useEffect(() => {
        async function fetchMetrics() {
            try {
        const response = await fetch(summaryUrl, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }
        const data = await response.json();
        setMetrics(data);
        setError(null);
            } catch (error) {
                console.error("Error fetching dashboard metrics:", error);
        setError("Unable to load dashboard metrics");
      } finally {
        setLoading(false);
            }
        }

        fetchMetrics();
  }, [summaryUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-lg">Loading dashboard metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">{error}</p>
          <p className="text-sm text-gray-600 mt-2">Check API base URL and company profile id.</p>
        </div>
      </div>
    );
  }

    const kpiData = [
        {
            title: "Active Products",
            value: metrics.activeProducts.toString(),
            icon: Package,
            trend: { value: metrics.newEOIsThisWeek, label: "new EOIs this week", positive: true },
        },
        {
            title: "Total EOIs",
            value: metrics.totalEOIs.toString(),
            icon: FileText,
            trend: { value: metrics.newEOIsThisMonth, label: "new this month", positive: true },
        },
        {
            title: "Approved Products",
            value: metrics.activeProducts.toString(),
            icon: CheckCircle,
            description: `${metrics.pendingApprovalProducts} pending approval`,
        },
        {
            title: "Active Partnerships",
            value: metrics.activePartnerships.toString(),
            icon: Clock,
            description: "Accepted EOIs",
        },
    ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Product Performance Table - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ProductPerformanceTable products={products} />
        </div>

        {/* Activity Feed - Takes 1 column */}
        <div className="lg:col-span-1">
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  )
}
