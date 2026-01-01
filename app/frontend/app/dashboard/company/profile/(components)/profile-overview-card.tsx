"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Building2, Edit, ExternalLink, Mail, Phone, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export interface ProfileOverviewData {
  companyName: string
  logoURL?: string
  status: "draft" | "pending" | "approved" | "verified" | "rejected" | "suspended"
  ndaStatus: boolean
  contactPerson: {
    name: string
    designation: string
    email: string
    phone: string
  }
  websiteURL?: string
  linkedInURL?: string
  description?: string
}

interface ProfileOverviewCardProps {
  data: ProfileOverviewData
  onEdit?: () => void
}

export function ProfileOverviewCard({ data, onEdit }: ProfileOverviewCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
            {data.logoURL ? (
              <img
                src={data.logoURL || "/placeholder.svg"}
                alt={data.companyName}
                className="h-14 w-14 rounded-lg object-cover"
              />
            ) : (
              <Building2 className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl">{data.companyName}</CardTitle>
            <div className="flex items-center gap-2">
              <StatusBadge status={data.status} />
              {data.ndaStatus && (
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  NDA Signed
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description */}
        {data.description && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">About</h4>
            <p className="text-sm leading-relaxed">{data.description}</p>
          </div>
        )}

        {/* Contact Information */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Contact Person</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{data.contactPerson.name}</p>
                <p className="text-xs text-muted-foreground">{data.contactPerson.designation}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Email</p>
                <p className="font-medium">{data.contactPerson.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Phone</p>
                <p className="font-medium">{data.contactPerson.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        {(data.websiteURL || data.linkedInURL) && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Links</h4>
            <div className="flex flex-wrap gap-2">
              {data.websiteURL && (
                <Button variant="outline" size="sm" asChild>
                  <a href={data.websiteURL} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Website
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              )}
              {data.linkedInURL && (
                <Button variant="outline" size="sm" asChild>
                  <a href={data.linkedInURL} target="_blank" rel="noopener noreferrer">
                    <span className="mr-2">in</span>
                    LinkedIn
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
