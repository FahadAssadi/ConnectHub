import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface IndustryData {
  category: string
  subCategory?: string
  specialisation?: string
}

interface ProfileIndustriesProps {
  industries: IndustryData[]
}

export function ProfileIndustries({ industries }: ProfileIndustriesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Industries & Expertise</CardTitle>
        <CardDescription>Your areas of industry focus and specializations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {industries.map((industry, index) => (
            <div key={index} className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" className="bg-primary">
                  {industry.category}
                </Badge>
                {industry.subCategory && (
                  <Badge variant="secondary" className="bg-secondary">
                    {industry.subCategory}
                  </Badge>
                )}
                {industry.specialisation && (
                  <Badge variant="outline" className="border-muted-foreground/20">
                    {industry.specialisation}
                  </Badge>
                )}
              </div>
            </div>
          ))}
          {industries.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No industries added yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
