import { LayoutDashboard, Building2, Package, FileText, Settings, Users } from "lucide-react"
import type { NavItem } from "./(components)/dashboard-sidebar"

export const companyNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/company",
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
    title: "EOIs",
    href: "/dashboard/company/EOIs",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export const bdPartnerNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/bd-partner",
    icon: LayoutDashboard,
  },
  {
    title: "Partner Profile",
    href: "/dashboard/bd-partner/profile",
    icon: Users,
  },
  {
    title: "Marketplace",
    href: "/dashboard/bd-partner/marketplace",
    icon: Package,
  },
  {
    title: "EOIs",
    href: "/dashboard/bd-partner/eois",
    icon: FileText,
  },
  {
    title: "My Partnerships",
    href: "/dashboard/bd-partner/partnerships",
    icon: Building2,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]
