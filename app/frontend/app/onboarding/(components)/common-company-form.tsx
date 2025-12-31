"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface CommonCompanyDetailsFormProps {
  data: {
    companyName: string
    businessRegNumber: string
    registeredBuisnessName?: string
    countryOfRegistrationId: string
    registeredAddress: string
    contactPersonName: string
    contactPersonDesignation: string
    contactPersonEmail: string
    contactPersonPhone: string
    websiteURL?: string
    linkedInURL?: string
    logoURL?: string
    profileDeckURL?: string
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
            onChange={(e) => onChange("companyName", e.target.value)}
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
            onChange={(e) => onChange("businessRegNumber", e.target.value)}
            className={errors.businessRegNumber ? "border-red-500" : ""}
            placeholder="123456789"
          />
          {errors.businessRegNumber && (
            <p className="text-sm text-red-500">{errors.businessRegNumber}</p>
          )}
        </div>

        {/* Registered Business Name */}
        <div className="space-y-2">
          <Label htmlFor="registeredBuisnessName">Registered Business Name</Label>
          <Input
            id="registeredBuisnessName"
            value={data.registeredBuisnessName || ""}
            onChange={(e) => onChange("registeredBuisnessName", e.target.value)}
            placeholder="Full registered legal name"
          />
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="countryOfRegistrationId">Country of Registration *</Label>
          <select
            id="countryOfRegistrationId"
            value={data.countryOfRegistrationId}
            onChange={(e) => onChange("countryOfRegistrationId", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.countryOfRegistrationId ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.countryOfRegistrationId && (
            <p className="text-sm text-red-500">{errors.countryOfRegistrationId}</p>
          )}
        </div>

        {/* Registered Address */}
        <div className="space-y-2">
          <Label htmlFor="registeredAddress">Registered Address *</Label>
          <Textarea
            id="registeredAddress"
            value={data.registeredAddress}
            onChange={(e) => onChange("registeredAddress", e.target.value)}
            className={errors.registeredAddress ? "border-red-500" : ""}
            placeholder="Street address, city, postal code"
            rows={3}
          />
          {errors.registeredAddress && (
            <p className="text-sm text-red-500">{errors.registeredAddress}</p>
          )}
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold text-lg mb-4">Contact Person</h3>

          {/* Contact Name */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="contactPersonName">Name *</Label>
            <Input
              id="contactPersonName"
              value={data.contactPersonName}
              onChange={(e) => onChange("contactPersonName", e.target.value)}
              className={errors.contactPersonName ? "border-red-500" : ""}
              placeholder="John Doe"
            />
            {errors.contactPersonName && (
              <p className="text-sm text-red-500">{errors.contactPersonName}</p>
            )}
          </div>

          {/* Contact Designation */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="contactPersonDesignation">Designation *</Label>
            <Input
              id="contactPersonDesignation"
              value={data.contactPersonDesignation}
              onChange={(e) => onChange("contactPersonDesignation", e.target.value)}
              className={errors.contactPersonDesignation ? "border-red-500" : ""}
              placeholder="CEO"
            />
            {errors.contactPersonDesignation && (
              <p className="text-sm text-red-500">{errors.contactPersonDesignation}</p>
            )}
          </div>

          {/* Contact Email */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="contactPersonEmail">Email *</Label>
            <Input
              id="contactPersonEmail"
              type="email"
              value={data.contactPersonEmail}
              onChange={(e) => onChange("contactPersonEmail", e.target.value)}
              className={errors.contactPersonEmail ? "border-red-500" : ""}
              placeholder="john@acme.com"
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
              onChange={(e) => onChange("contactPersonPhone", e.target.value)}
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
            <Label htmlFor="websiteURL">Website</Label>
            <Input
              id="websiteURL"
              type="url"
              value={data.websiteURL || ""}
              onChange={(e) => onChange("websiteURL", e.target.value)}
              placeholder="https://www.acme.com"
            />
          </div>

          {/* LinkedIn */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="linkedInURL">LinkedIn Profile</Label>
            <Input
              id="linkedInURL"
              type="url"
              value={data.linkedInURL || ""}
              onChange={(e) => onChange("linkedInURL", e.target.value)}
              placeholder="https://linkedin.com/company/acme"
            />
          </div>

          {/* Logo */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="logoURL">Logo URL</Label>
            <Input
              id="logoURL"
              type="url"
              value={data.logoURL || ""}
              onChange={(e) => onChange("logoURL", e.target.value)}
              placeholder="https://cdn.acme.com/logo.png"
            />
          </div>

          {/* Profile Deck */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="profileDeckURL">Profile Deck URL</Label>
            <Input
              id="profileDeckURL"
              type="url"
              value={data.profileDeckURL || ""}
              onChange={(e) => onChange("profileDeckURL", e.target.value)}
              placeholder="https://cdn.acme.com/profile-deck.pdf"
            />
          </div>

          {/* Year of Establishment */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="yearOfEstablishment">Year of Establishment</Label>
            <Input
              id="yearOfEstablishment"
              type="number"
              value={data.yearOfEstablishment || ""}
              onChange={(e) => onChange("yearOfEstablishment", e.target.value ? parseInt(e.target.value) : "")}
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
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Tell us about your company..."
              rows={4}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
