"use client"

import { useState } from "react"
import { DashboardHeader } from "./(components)/dashboard-header"
import { DashboardSidebar } from "./(components)/dashboard-sidebar"
import { DashboardHome } from "./(components)/dashboard-home"
import { MyProductsPage } from "./(components)/my-products-page"
import { ReceivedEOIsPage } from "./(components)/received-eois-page"
// import { SentEOIsPage } from "./(components)/sent-eois-page"
// import { ConnectedPartnersPage } from "./(components)/connected-partners-page"
import { BrowsePartnersPage } from "./(components)/browse-partners-page"
import { MyProfilePage } from "./(components)/my-profile-page"

export default function CompanyDashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardHome />
      case "my-products":
        return <MyProductsPage />
      case "received-eois":
        return <ReceivedEOIsPage />
    //   case "sent-eois":
    //     return <SentEOIsPage />
    //   case "connected-partners":
    //     return <ConnectedPartnersPage />
      case "browse-partners":
        return <BrowsePartnersPage />
      case "my-profile":
        return <MyProfilePage />
      default:
        return <DashboardHome />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} onPageChange={setCurrentPage} />

      <div className="flex">
        <DashboardSidebar
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
