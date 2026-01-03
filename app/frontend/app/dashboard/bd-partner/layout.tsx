"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "../(components)/dashboard-layout"
import { bdPartnerNavItems } from "../nav-config"
import type { NavItem } from "../(components)/dashboard-sidebar"

export default function BDPartnerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [profileName, setProfileName] = useState("BD Partner")
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

          // Set BD partner profile info
          const bdProfile = profile.bdpartnerIndividualProfile || profile.bdPartnerOrganizationProfile
          if (bdProfile) {
            setProfileName(bdProfile.commonDetails?.firstName || bdProfile.commonDetails?.organizationName || "Partner")
            setProfileLogo(bdProfile.commonDetails?.logoURL)
            setProfileStatus((bdProfile.status || "approved").toLowerCase() as any)
          }
        }
      } catch (error) {
        console.error("Error fetching BD partner profile:", error)
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
      navItems={bdPartnerNavItems}
      userInfo={userInfo}
      profileStatus={profileStatus}
      notificationCount={3}
    >
      {children}
    </AppLayout>
  )
}
