"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Building2, Package, FileText, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  disabled?: boolean
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Company Profile",
    href: "/dashboard/company/profile",
    icon: Building2,
  },
  {
    title: "Products",
    href: "/dashboard/company/products",
    icon: Package,
  },
  {
    title: "Applications",
    href: "/dashboard/company/applications",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  companyName?: string
  companyLogo?: string
}

export function AppSidebar({ className, companyName = "Acme Corp", companyLogo, ...props }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar", className)} {...props}>
      {/* Logo and Company Header */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            {companyLogo ? (
              <img src={companyLogo || "/placeholder.svg"} alt={companyName} className="h-6 w-6" />
            ) : (
              <Building2 className="h-5 w-5" />
            )}
          </div>
          <span className="text-sm">{companyName}</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  item.disabled && "pointer-events-none opacity-50",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className="h-5 min-w-5 rounded-full px-1.5 text-xs bg-sidebar-primary text-sidebar-primary-foreground"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-1 flex-col items-start text-left">
            <span className="text-xs font-medium">John Doe</span>
            <span className="text-xs text-sidebar-foreground/60">john@acme.com</span>
          </div>
        </Button>
      </div>
    </div>
  )
}
