"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Bell, Plus, User, Settings, HelpCircle, LogOut, Menu } from "lucide-react"

interface DashboardHeaderProps {
  onMenuClick: () => void
  onPageChange: (page: string) => void
}

export function DashboardHeader({ onMenuClick, onPageChange }: DashboardHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const notifications = [
    {
      id: 1,
      type: "New EOI Received",
      message: "TechSales Pro is interested in your Cloud Analytics Platform",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      type: "Product Approved",
      message: "Your Smart Home Security product has been approved",
      time: "1 day ago",
      unread: true,
    },
    {
      id: 3,
      type: "EOI Accepted",
      message: "DataFlow Solutions accepted your EOI",
      time: "2 days ago",
      unread: false,
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onMenuClick} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <button onClick={() => onPageChange("dashboard")} className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">CH</span>
              </div>
              <span className="font-bold text-lg text-gray-900 hidden sm:block">ConnectHub</span>
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Add New Product Button */}
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => onPageChange("add-product")}
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add New Product</span>
              <span className="sm:hidden">Add</span>
            </Button>

            {/* Notifications */}
            <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.unread ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{notification.type}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                        </div>
                        {notification.unread && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">Acme Corp.</p>
                    <p className="text-xs text-gray-500">Premium Plan</p>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => onPageChange("my-profile")}>
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help/Support
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
