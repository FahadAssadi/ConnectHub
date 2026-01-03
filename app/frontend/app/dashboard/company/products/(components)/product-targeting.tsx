import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface TargetIndustry {
  category: string
  subCategory?: string
}

export interface TargetRegion {
  name: string
}

export interface PreferredProfile {
  specialisation: string
}

export interface PreferredCertification {
  name: string
}

interface ProductTargetingProps {
  targetIndustries: TargetIndustry[]
  targetRegions: TargetRegion[]
  preferredProfiles: PreferredProfile[]
  preferredCertifications: PreferredCertification[]
}

export function ProductTargeting({
  targetIndustries,
  targetRegions,
  preferredProfiles,
  preferredCertifications,
}: ProductTargetingProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Target Customer Industries</CardTitle>
          <CardDescription>Industries this product is designed for</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {targetIndustries.map((industry, index) => (
              <Badge key={index} variant="default">
                {industry.category}
                {industry.subCategory && ` • ${industry.subCategory}`}
              </Badge>
            ))}
            {targetIndustries.length === 0 && (
              <p className="text-sm text-muted-foreground">No target industries specified</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Target Regions</CardTitle>
          <CardDescription>Geographic markets for this product</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {targetRegions.map((region, index) => (
              <Badge key={index} variant="secondary">
                {region.name}
              </Badge>
            ))}
            {targetRegions.length === 0 && <p className="text-sm text-muted-foreground">No target regions specified</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferred BD Partner Profile</CardTitle>
          <CardDescription>Ideal specializations for partners selling this product</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {preferredProfiles.map((profile, index) => (
              <Badge key={index} variant="outline">
                {profile.specialisation}
              </Badge>
            ))}
            {preferredProfiles.length === 0 && (
              <p className="text-sm text-muted-foreground">No preferred profiles specified</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferred Certifications</CardTitle>
          <CardDescription>Certifications that would benefit partners</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {preferredCertifications.map((cert, index) => (
              <Badge key={index} variant="default" className="bg-info/10 text-info border-info/20">
                {cert.name}
              </Badge>
            ))}
            {preferredCertifications.length === 0 && (
              <p className="text-sm text-muted-foreground">No preferred certifications specified</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
