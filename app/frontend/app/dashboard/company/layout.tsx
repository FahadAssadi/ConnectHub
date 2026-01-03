"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "../(components)/dashboard-layout"
import { companyNavItems } from "../nav-config"
import type { NavItem } from "../(components)/dashboard-sidebar"

export default function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [profileName, setProfileName] = useState("Acme Corp")
  const [profileLogo, setProfileLogo] = useState<string | undefined>()
  const [userInfo, setUserInfo] = useState({ name: "", email: "" })
  const [profileStatus, setProfileStatus] = useState<"draft" | "pending" | "approved" | "verified" | "rejected" | "suspended">("approved")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
        const res = await fetch(`${API_BASE}/user-profile`, {
          credentials: "include",
        })

        if (res.ok) {
          const profile = await res.json()

          // Set user info
          setUserInfo({
            name: profile.name || "User",
            email: profile.email || "",
          })

          // Set company profile info
          if (profile.companyProfile) {
            setProfileName(profile.companyProfile.commonDetails?.companyName || "Company")
            setProfileLogo(profile.companyProfile.commonDetails?.logoURL)
            setProfileStatus((profile.companyProfile.status || "approved").toLowerCase() as any)
          }
        }
      } catch (error) {
        console.error("Error fetching company profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <AppLayout
      name={profileName}
      logo={profileLogo}
      navItems={companyNavItems}
      userInfo={userInfo}
      profileStatus={profileStatus}
      notificationCount={3}
    >
      {children}
    </AppLayout>
  )
}
