import type * as React from "react"
import type { NavItem } from "./dashboard-sidebar"
import { AppSidebar } from "./dashboard-sidebar"
import { AppHeader } from "./dashboard-header"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  children: React.ReactNode
  title?: string
  profileStatus?: "draft" | "pending" | "approved" | "verified" | "rejected" | "suspended"
  notificationCount?: number
  name?: string
  logo?: string
  navItems: NavItem[]
  userInfo?: {
    name: string
    email: string
  }
  className?: string
}

export function AppLayout({
  children,
  title,
  profileStatus,
  notificationCount,
  name,
  logo,
  navItems,
  userInfo,
  className,
}: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar name={name} logo={logo} navItems={navItems} userInfo={userInfo} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title={title} profileStatus={profileStatus} notificationCount={notificationCount} />
        <main className={cn("flex-1 overflow-y-auto p-6", className)}>{children}</main>
      </div>
    </div>
  )
}