"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface CommonCompanyDetailsFormProps {
  data: {
    companyName: string
    businessRegNumber: string
    country: string
    countryIso2Code: string
    stateOrProvince: string
    address: string
    contactPersonEmail: string
    contactPersonPhone: string
    officialWebsite?: string
    linkedInProfileURL?: string
    yearOfEstablishment?: number
    description?: string
  }
  errors: Record<string, string>
  onChange: (field: string, value: string | number) => void
  countries: Array<{ id: string; name: string }>
}

export function CommonCompanyDetailsForm({
  data,
  errors,
  onChange,
  countries,
}: CommonCompanyDetailsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={data.companyName}
            onChange={(e) => onChange("commonDetails.companyName", e.target.value)}
            className={errors.companyName ? "border-red-500" : ""}
            placeholder="Acme Corporation"
          />
          {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
        </div>

        {/* Business Registration Number */}
        <div className="space-y-2">
          <Label htmlFor="businessRegNumber">Business Registration Number *</Label>
          <Input
            id="businessRegNumber"
            value={data.businessRegNumber}
            onChange={(e) => onChange("commonDetails.businessRegNumber", e.target.value)}
            className={errors.businessRegNumber ? "border-red-500" : ""}
            placeholder="123456789"
          />
          {errors.businessRegNumber && (
            <p className="text-sm text-red-500">{errors.businessRegNumber}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            value={data.address}
            onChange={(e) => onChange("commonDetails.address", e.target.value)}
            className={errors.address ? "border-red-500" : ""}
            placeholder="Street address, city, postal code"
            rows={3}
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address}</p>
          )}
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country">Country of Registration *</Label>
          <select
            id="country"
            value={data.country}
            onChange={(e) => {
              const selected = countries.find(c => c.name === e.target.value)
              onChange("commonDetails.country", e.target.value)
              if (selected?.id) {
                onChange("commonDetails.countryIso2Code", selected.id)
              }
            }}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.country ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="text-sm text-red-500">{errors.country}</p>
          )}
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold text-lg mb-4">Contact Information</h3>

          {/* Contact Email */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="contactPersonEmail">Email *</Label>
            <Input
              id="contactPersonEmail"
              type="email"
              value={data.contactPersonEmail}
              onChange={(e) => onChange("commonDetails.contactPersonEmail", e.target.value)}
              className={errors.contactPersonEmail ? "border-red-500" : ""}
              placeholder="contact@acme.com"
            />
            {errors.contactPersonEmail && (
              <p className="text-sm text-red-500">{errors.contactPersonEmail}</p>
            )}
          </div>

          {/* Contact Phone */}
          <div className="space-y-2">
            <Label htmlFor="contactPersonPhone">Phone *</Label>
            <Input
              id="contactPersonPhone"
              type="tel"
              value={data.contactPersonPhone}
              onChange={(e) => onChange("commonDetails.contactPersonPhone", e.target.value)}
              className={errors.contactPersonPhone ? "border-red-500" : ""}
              placeholder="+1-555-0123"
            />
            {errors.contactPersonPhone && (
              <p className="text-sm text-red-500">{errors.contactPersonPhone}</p>
            )}
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold text-lg mb-4">Additional Information</h3>

          {/* Website */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="officialWebsite">Website</Label>
            <Input
              id="officialWebsite"
              type="url"
              value={data.officialWebsite || ""}
              onChange={(e) => onChange("commonDetails.officialWebsite", e.target.value)}
              placeholder="https://www.acme.com"
            />
          </div>

          {/* LinkedIn */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="linkedInProfileURL">LinkedIn Profile</Label>
            <Input
              id="linkedInProfileURL"
              type="url"
              value={data.linkedInProfileURL || ""}
              onChange={(e) => onChange("commonDetails.linkedInProfileURL", e.target.value)}
              placeholder="https://linkedin.com/company/acme"
            />
          </div>

          {/* Year of Establishment */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="yearOfEstablishment">Year of Establishment</Label>
            <Input
              id="yearOfEstablishment"
              type="number"
              value={data.yearOfEstablishment || ""}
              onChange={(e) => onChange("commonDetails.yearOfEstablishment", e.target.value ? parseInt(e.target.value) : "")}
              placeholder="2020"
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              value={data.description || ""}
              onChange={(e) => onChange("commonDetails.description", e.target.value)}
              placeholder="Tell us about your company..."
              rows={4}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}