import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface EngagementModel {
  name: string
  description?: string
}

export interface Tool {
  name: string
}

export interface Certification {
  name: string
}

interface ProfileEngagementToolsProps {
  engagementModels: EngagementModel[]
  tools: Tool[]
  certifications: Certification[]
}

export function ProfileEngagementTools({ engagementModels, tools, certifications }: ProfileEngagementToolsProps) {
  return (
    <div className="space-y-6">
      {/* Engagement Models */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Models</CardTitle>
          <CardDescription>Preferred ways of working with BD partners</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {engagementModels.map((model, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {model.name}
              </Badge>
            ))}
            {engagementModels.length === 0 && (
              <p className="text-sm text-muted-foreground">No engagement models specified</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tools & Platforms */}
      <Card>
        <CardHeader>
          <CardTitle>Tools & Platforms</CardTitle>
          <CardDescription>Technologies and platforms you work with</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {tool.name}
              </Badge>
            ))}
            {tools.length === 0 && <p className="text-sm text-muted-foreground">No tools specified</p>}
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
          <CardDescription>Professional certifications and accreditations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert, index) => (
              <Badge key={index} variant="default" className="bg-info/10 text-info border-info/20 text-sm">
                {cert.name}
              </Badge>
            ))}
            {certifications.length === 0 && <p className="text-sm text-muted-foreground">No certifications added</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
