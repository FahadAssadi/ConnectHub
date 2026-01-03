import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock, Ban, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface EOIStatusBreakdownProps {
  pending: number
  accepted: number
  rejected: number
  withdrawn: number
  expired: number
}

export function EOIStatusBreakdown({
  pending,
  accepted,
  rejected,
  withdrawn,
  expired,
}: EOIStatusBreakdownProps) {
  const total = pending + accepted + rejected + withdrawn + expired

  const statuses = [
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      percentage: total > 0 ? ((pending / total) * 100).toFixed(1) : "0.0",
    },
    {
      label: "Accepted",
      value: accepted,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      percentage: total > 0 ? ((accepted / total) * 100).toFixed(1) : "0.0",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      percentage: total > 0 ? ((rejected / total) * 100).toFixed(1) : "0.0",
    },
    {
      label: "Withdrawn",
      value: withdrawn,
      icon: Ban,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      percentage: total > 0 ? ((withdrawn / total) * 100).toFixed(1) : "0.0",
    },
    {
      label: "Expired",
      value: expired,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      percentage: total > 0 ? ((expired / total) * 100).toFixed(1) : "0.0",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>EOI Status Breakdown</CardTitle>
        <CardDescription>Distribution of all your expressions of interest</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-5">
          {statuses.map((status) => {
            const Icon = status.icon
            return (
              <div
                key={status.label}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg border p-4 text-center",
                  status.bgColor,
                )}
              >
                <Icon className={cn("h-8 w-8 mb-2", status.color)} />
                <div className="text-2xl font-bold">{status.value}</div>
                <div className="text-xs text-muted-foreground">{status.label}</div>
                <div className="text-xs font-medium mt-1">{status.percentage}%</div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
