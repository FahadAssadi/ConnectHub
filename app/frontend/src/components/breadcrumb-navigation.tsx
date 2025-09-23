"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb" 

const routeLabels: Record<string, string> = {
  "/dashboard/bd-partner": "BD Partner",
  "/dashboard/bd-partner/profile": "Profile",
  "/dashboard/bd-partner/partners": "Partners",

  "/dashboard/company/profile": "Profile",
  "/dashboard/company/products": "Products",
  "/dashboard/company/products/[productId]": "Product Details",
  "/dashboard/company/partners": "Partners",
  "/dashboard/company/partners/applications": "Applications",
}

const getRouteSegments = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs = [{ label: "Home", href: "/dashboard" }]

  let currentPath = ""
  const updatedSegments = segments.slice(2)

  updatedSegments.forEach((segment) => {
    currentPath += `/${segment}`

    // Use routeLabels if available, otherwise fallback to capitalized segment
    if (routeLabels[currentPath]) {
      breadcrumbs.push({
        label: routeLabels[currentPath],
        href: currentPath,
      })
    } else {
      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
      })
    }
  })

  return breadcrumbs
}

export function BreadcrumbNavigation() {
  const pathname = usePathname()
  const breadcrumbs = getRouteSegments(pathname)

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.href}>
            <BreadcrumbItem>
              {index === 0 && <Home className="h-4 w-4 mr-1" />}
              {index < breadcrumbs.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link href={breadcrumb.href}>
                    {breadcrumb.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
