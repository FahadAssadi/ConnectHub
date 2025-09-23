"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Package, Users, Building2, Menu, Bell, Search, Plus, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">CH</span>
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">ConnectHub</span>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6",
                          )}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              {/* Quick Actions Section */}
              <li className="mt-auto">
                <div className="text-xs font-semibold leading-6 text-sidebar-foreground/60 mb-2">Quick Actions</div>
                <ul role="list" className="-mx-2 space-y-1">
                  <li>
                    <Link
                      href="/dashboard/company/products/add"
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group flex gap-x-3 rounded-md p-2 text-sm leading-6"
                    >
                      <Plus className="h-4 w-4 shrink-0" />
                      Add Product
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/partners/applications"
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group flex gap-x-3 rounded-md p-2 text-sm leading-6"
                    >
                      <FileText className="h-4 w-4 shrink-0" />
                      Review Applications
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">CH</span>
                </div>
                <span className="text-xl font-bold text-sidebar-foreground">ConnectHub</span>
              </div>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              isActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6",
                            )}
                          >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {item.name}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
                {/* Quick Actions Section for Mobile */}
                <li className="mt-auto">
                  <div className="text-xs font-semibold leading-6 text-sidebar-foreground/60 mb-2">Quick Actions</div>
                  <ul role="list" className="-mx-2 space-y-1">
                    <li>
                      <Link
                        href="/dashboard/company/products/add"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group flex gap-x-3 rounded-md p-2 text-sm leading-6"
                      >
                        <Plus className="h-4 w-4 shrink-0" />
                        Add Product
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/partners/applications"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group flex gap-x-3 rounded-md p-2 text-sm leading-6"
                      >
                        <FileText className="h-4 w-4 shrink-0" />
                        Review Applications
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground pl-3" />
              <Input className="pl-10 w-full max-w-lg" placeholder="Search products, partners..." type="search" />
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Navigation */}
            <BreadcrumbNavigation />
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

const navigation = [
  { name: "Dashboard", href: "/dashboard/", icon: LayoutDashboard },
  { name: "Products", href: "/dashboard/company/products", icon: Package },
  { name: "Partners", href: "/dashboard/company/partners", icon: Users },
  { name: "Company Profile", href: "/dashboard/company/profile", icon: Building2 },
]
