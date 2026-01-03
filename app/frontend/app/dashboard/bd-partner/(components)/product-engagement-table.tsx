import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/ui/status-badge"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export interface ProductEngagement {
  productName: string
  companyName: string
  eoiStatus: string
  lastActivity: string
}

interface ProductEngagementTableProps {
  engagements: ProductEngagement[]
}

export function ProductEngagementTable({ engagements }: ProductEngagementTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Engagements</CardTitle>
        <CardDescription>Products you&apos;re currently engaged with through EOIs</CardDescription>
      </CardHeader>
      <CardContent>
        {engagements.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No product engagements yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Start by browsing available products and sending EOIs
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {engagements.map((engagement, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{engagement.productName}</TableCell>
                  <TableCell>{engagement.companyName}</TableCell>
                  <TableCell>
                    <StatusBadge status={"approved"} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{engagement.lastActivity}</TableCell>
                  <TableCell>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                      title="View details"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
