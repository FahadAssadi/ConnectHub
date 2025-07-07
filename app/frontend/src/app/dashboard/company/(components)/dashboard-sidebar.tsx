"use client"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Home,
  Package,
  Users,
  User,
  BarChart3,
  CreditCard,
  HelpCircle,
  Plus,
  Eye,
  Inbox,
  Send,
  UserCheck,
  Search,
  ChevronDown,
  X,
} from "lucide-react"
import { useState } from "react"

interface DashboardSidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  isOpen: boolean
  onClose: () => void
}

export function DashboardSidebar({ currentPage, onPageChange, isOpen, onClose }: DashboardSidebarProps) {
  const [bdEngagementsOpen, setBdEngagementsOpen] = useState(true)
  const [myProductsOpen, setMyProductsOpen] = useState(true)

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard Home",
      icon: Home,
      onClick: () => onPageChange("dashboard"),
    },
  ]

  const myProductsItems = [
    {
      id: "my-products",
      label: "View All Products",
      icon: Eye,
      onClick: () => onPageChange("my-products"),
    },
    {
      id: "add-product",
      label: "Add New Product",
      icon: Plus,
      onClick: () => onPageChange("add-product"),
    },
  ]

  const bdEngagementItems = [
    {
      id: "received-eois",
      label: "Received EOIs",
      icon: Inbox,
      onClick: () => onPageChange("received-eois"),
      badge: 3,
    },
    {
      id: "sent-eois",
      label: "Sent EOIs",
      icon: Send,
      onClick: () => onPageChange("sent-eois"),
    },
    {
      id: "connected-partners",
      label: "My Connected BD Partners",
      icon: UserCheck,
      onClick: () => onPageChange("connected-partners"),
    },
    {
      id: "browse-partners",
      label: "Browse BD Partners",
      icon: Search,
      onClick: () => onPageChange("browse-partners"),
    },
  ]

  const bottomMenuItems = [
    {
      id: "my-profile",
      label: "My Profile",
      icon: User,
      onClick: () => onPageChange("my-profile"),
    },
    {
      id: "analytics",
      label: "Analytics & Reports",
      icon: BarChart3,
      onClick: () => onPageChange("analytics"),
      disabled: true,
    },
    {
      id: "billing",
      label: "Billing & Payments",
      icon: CreditCard,
      onClick: () => onPageChange("billing"),
      disabled: true,
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      onClick: () => onPageChange("help"),
    },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 py-6">
        <nav className="space-y-2 px-3">
          {/* Main menu items */}
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  item.onClick()
                  onClose()
                }}
              >
                <IconComponent className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            )
          })}

          {/* My Products Section */}
          <Collapsible open={myProductsOpen} onOpenChange={setMyProductsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-3" />
                  My Products
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${myProductsOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 ml-4">
              {myProductsItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      item.onClick()
                      onClose()
                    }}
                  >
                    <IconComponent className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                )
              })}
            </CollapsibleContent>
          </Collapsible>

          {/* BD Partner Engagements Section */}
          <Collapsible open={bdEngagementsOpen} onOpenChange={setBdEngagementsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-3" />
                  BD Partner Engagements
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${bdEngagementsOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 ml-4">
              {bdEngagementItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      item.onClick()
                      onClose()
                    }}
                  >
                    <IconComponent className="h-4 w-4 mr-3" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                )
              })}
            </CollapsibleContent>
          </Collapsible>
        </nav>
      </div>

      {/* Bottom menu items */}
      <div className="border-t border-gray-200 py-4">
        <nav className="space-y-2 px-3">
          {bottomMenuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick()
                    onClose()
                  }
                }}
                disabled={item.disabled}
              >
                <IconComponent className="h-4 w-4 mr-3" />
                {item.label}
                {item.disabled && <span className="ml-auto text-xs text-gray-400">Soon</span>}
              </Button>
            )
          })}
        </nav>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:top-16 lg:bg-white lg:border-r lg:border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:text-white hover:bg-gray-600"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}
