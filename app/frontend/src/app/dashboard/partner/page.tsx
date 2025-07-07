"use client"

import { useState } from "react"
import { PartnerDashboardHeader } from "./(components)/dashboard-header"
import { PartnerDashboardSidebar } from "./(components)/dashboard-sidebar"
import { PartnerDashboardHome } from "./(components)/dashboard-home"
import { AllProductListingsPage } from "./(components)/all-product-listings-page"
import { AllCompaniesPage } from "./(components)/all-companies-page"
import { RecommendedPage } from "./(components)/recommended-page"
import { MySubmittedEOIsPage } from "./(components)/my-submitted-eois-page"
import { EOIsFromCompaniesPage } from "./(components)/eois-from-companies-page"
import { MyConnectedCompaniesPage } from "./(components)/my-connected-companies-page"
import { PartnerProfilePage } from "./(components)/profile-page"

export default function PartnerDashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <PartnerDashboardHome />
      case "all-products":
        return <AllProductListingsPage />
      case "all-companies":
        return <AllCompaniesPage />
      case "recommended":
        return <RecommendedPage />
      case "my-submitted-eois":
        return <MySubmittedEOIsPage />
      case "eois-from-companies":
        return <EOIsFromCompaniesPage />
      case "my-connected-companies":
        return <MyConnectedCompaniesPage />
      case "my-profile":
        return <PartnerProfilePage />
      default:
        return <PartnerDashboardHome />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PartnerDashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} onPageChange={setCurrentPage} />

      <div className="flex">
        <PartnerDashboardSidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 lg:ml-64">
          <div className="p-6">{renderCurrentPage()}</div>
        </main>
      </div>
    </div>
  )
}
