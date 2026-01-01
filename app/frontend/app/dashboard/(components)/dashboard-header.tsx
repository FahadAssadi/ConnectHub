"use client"
import { Bell, Search, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export interface StatusBadgeProps {
  status: "draft" | "pending" | "approved" | "verified" | "rejected" | "suspended"
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
    pending: { label: "Pending", className: "bg-warning/20 text-warning" },
    approved: { label: "Approved", className: "bg-success/20 text-success" },
    verified: { label: "Verified", className: "bg-info/20 text-info" },
    rejected: { label: "Rejected", className: "bg-destructive/20 text-destructive" },
    suspended: { label: "Suspended", className: "bg-destructive/20 text-destructive" },
  }

  const variant = variants[status]

  return <Badge className={variant.className}>{variant.label}</Badge>
}

interface AppHeaderProps {
  title?: string
  profileStatus?: "draft" | "pending" | "approved" | "verified" | "rejected" | "suspended"
  notificationCount?: number
}

export function AppHeader({ title, profileStatus = "approved", notificationCount = 3 }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
        <StatusBadge status={profileStatus} />
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden w-64 md:block">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="pl-8" />
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Help */}
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-xs bg-primary text-primary-foreground">
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>

          {/* JUST FILLER FOR */}
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <p className="text-sm font-medium">New application received</p>
              <p className="text-xs text-muted-foreground">BD Partner applied to Product X - 2 hours ago</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <p className="text-sm font-medium">Product approved</p>
              <p className="text-xs text-muted-foreground">Your product "Product Y" has been approved - 1 day ago</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <p className="text-sm font-medium">EOI accepted</p>
              <p className="text-xs text-muted-foreground">Partner accepted your EOI - 2 days ago</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
