import type * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type Status =
  | "draft"
  | "pending"
  | "approved"
  | "verified"
  | "rejected"
  | "suspended"
  | "active"
  | "inactive"
  | "under_review"
  | "withdrawn"
  | "expired"
  | "accepted"

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: Status
  size?: "sm" | "md" | "lg"
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-muted/50 text-muted-foreground border-muted",
  },
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  approved: {
    label: "Approved",
    className: "bg-success/10 text-success border-success/20",
  },
  verified: {
    label: "Verified",
    className: "bg-info/10 text-info border-info/20",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  suspended: {
    label: "Suspended",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  active: {
    label: "Active",
    className: "bg-success/10 text-success border-success/20",
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted/50 text-muted-foreground border-muted",
  },
  under_review: {
    label: "Under Review",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-muted/50 text-muted-foreground border-muted",
  },
  expired: {
    label: "Expired",
    className: "bg-muted/50 text-muted-foreground border-muted",
  },
  accepted: {
    label: "Accepted",
    className: "bg-success/10 text-success border-success/20",
  },
}

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-0.5",
  lg: "text-sm px-3 py-1",
}

export function StatusBadge({ status, size = "md", className, ...props }: StatusBadgeProps) {
  const config = statusConfig[status]

  if (!config) {
    return (
      <Badge variant="outline" className={cn("bg-muted/50 text-muted-foreground border-muted", sizeClasses[size], "font-medium", className)} {...props}>
        Unknown
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className={cn(config.className, sizeClasses[size], "font-medium", className)} {...props}>
      {config.label}
    </Badge>
  )
}
