"use client"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Home,
  Search,
  Building,
  Package,
  Star,
  Send,
  Inbox,
  UserCheck,
  User,
  DollarSign,
  HelpCircle,
  ChevronDown,
  X,
} from "lucide-react"
import { useState } from "react"

interface PartnerDashboardSidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  isOpen: boolean
  onClose: () => void
}

export function PartnerDashboardSidebar({ currentPage, onPageChange, isOpen, onClose }: PartnerDashboardSidebarProps) {
  const [browseOpportunitiesOpen, setBrowseOpportunitiesOpen] = useState(true)
  const [myEngagementsOpen, setMyEngagementsOpen] = useState(true)

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard Home",
      icon: Home,
      onClick: () => onPageChange("dashboard"),
    },
  ]

  const browseOpportunityItems = [
    {
      id: "all-products",
      label: "All Product Listings",
      icon: Package,
      onClick: () => onPageChange("all-products"),
    },
    {
      id: "all-companies",
      label: "All Companies",
      icon: Building,
      onClick: () => onPageChange("all-companies"),
    },
    {
      id: "recommended",
      label: "Recommended for You",
      icon: Star,
      onClick: () => onPageChange("recommended"),
      badge: 12,
    },
  ]

  const myEngagementItems = [
    {
      id: "my-submitted-eois",
      label: "My Submitted EOIs",
      icon: Send,
      onClick: () => onPageChange("my-submitted-eois"),
    },
    {
      id: "eois-from-companies",
      label: "EOIs from Companies",
      icon: Inbox,
      onClick: () => onPageChange("eois-from-companies"),
      badge: 2,
    },
    {
      id: "my-connected-companies",
      label: "My Connected Companies",
      icon: UserCheck,
      onClick: () => onPageChange("my-connected-companies"),
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
      id: "my-earnings",
      label: "My Earnings",
      icon: DollarSign,
      onClick: () => onPageChange("my-earnings"),
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

          {/* Browse Opportunities Section */}
          <Collapsible open={browseOpportunitiesOpen} onOpenChange={setBrowseOpportunitiesOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <div className="flex items-center">
                  <Search className="h-4 w-4 mr-3" />
                  Browse Opportunities
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${browseOpportunitiesOpen ? "rotate-180" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 ml-4">
              {browseOpportunityItems.map((item) => {
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
                      <span className="ml-auto bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                )
              })}
            </CollapsibleContent>
          </Collapsible>

          {/* My Engagements Section */}
          <Collapsible open={myEngagementsOpen} onOpenChange={setMyEngagementsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <div className="flex items-center">
                  <UserCheck className="h-4 w-4 mr-3" />
                  My Engagements
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${myEngagementsOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 ml-4">
              {myEngagementItems.map((item) => {
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
