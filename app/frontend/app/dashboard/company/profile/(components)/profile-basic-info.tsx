import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export interface BasicInfoData {
  companyName: string
  businessRegNumber: string
  registeredBusinessName?: string
  countryOfRegistration: string
  registeredAddress: string
  yearOfEstablishment?: number
  headOfficeLocation?: string
}

interface ProfileBasicInfoProps {
  data: BasicInfoData
}

export function ProfileBasicInfo({ data }: ProfileBasicInfoProps) {
  const fields = [
    { label: "Company Name", value: data.companyName },
    { label: "Business Registration Number", value: data.businessRegNumber },
    { label: "Registered Business Name", value: data.registeredBusinessName || "—" },
    { label: "Country of Registration", value: data.countryOfRegistration },
    { label: "Registered Address", value: data.registeredAddress },
    { label: "Year of Establishment", value: data.yearOfEstablishment || "—" },
    { label: "Head Office Location", value: data.headOfficeLocation || "—" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Company registration and legal details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          {fields.map((field, index) => (
            <div key={index} className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">{field.label}</Label>
              <p className="text-sm">{field.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
