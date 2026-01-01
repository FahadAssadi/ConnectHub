"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { CheckCircle2, AlertCircle, Clock, XCircle, FileText } from "lucide-react"

export interface ActivityItem {
  id: string
  type: "application" | "product" | "eoi" | "profile"
  title: string
  description: string
  timestamp: string
  status?: "success" | "warning" | "error" | "info"
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  className?: string
}

const activityIcons = {
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
  info: Clock,
}

const activityColors = {
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
  info: "text-info",
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest platform updates</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = activity.status ? activityIcons[activity.status] : FileText
              const colorClass = activity.status ? activityColors[activity.status] : "text-muted-foreground"

              return (
                <div key={activity.id} className="flex gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted",
                      colorClass,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
