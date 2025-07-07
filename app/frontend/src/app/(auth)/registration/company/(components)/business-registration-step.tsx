"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ClipboardCheck, ChevronDown, ChevronUp, Loader2 } from "lucide-react"

interface BusinessRegistrationStepProps {
  onNext: (data: any) => void
  onPrevious: () => void
  formData: any
  isFirstStep: boolean
  isLastStep: boolean
}

export function BusinessRegistrationStep({ onNext, onPrevious, formData }: BusinessRegistrationStepProps) {
  const [data, setData] = useState({
    businessRegistrationNumber: formData.businessRegistrationNumber || "",
    partnershipAgreement: formData.partnershipAgreement || false,
    termsOfService: formData.termsOfService || false,
  })

  const [expandedAgreement, setExpandedAgreement] = useState(false)
  const [expandedTerms, setExpandedTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = () => {
    return data.partnershipAgreement && data.termsOfService
  }

  const handleSubmit = async () => {
    if (isFormValid()) {
      setIsSubmitting(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsSubmitting(false)
      onNext(data)
    }
  }

  const partnershipAgreementText = `
    PARTNERSHIP AGREEMENT - KEY POINTS

    1. COMMISSION STRUCTURE
    • You set your own commission rates for BD partners
    • Payments are processed through our secure escrow system
    • Commission payments are made within 7 days of deal completion

    2. PARTNER RESPONSIBILITIES
    • BD partners represent your products professionally
    • All partners undergo background verification
    • Partners must comply with your brand guidelines

    3. YOUR RESPONSIBILITIES
    • Provide accurate product information and pricing
    • Supply marketing materials and product training
    • Honor agreed commission rates and payment terms

    4. INTELLECTUAL PROPERTY
    • You retain all rights to your products and brand
    • Partners receive limited license to use your materials
    • All confidential information remains protected

    5. TERMINATION
    • Either party may terminate with 30 days notice
    • Outstanding commissions will be honored
    • All materials must be returned upon termination
  `

  const termsOfServiceText = `
    TERMS OF SERVICE - SUMMARY

    1. PLATFORM USAGE
    • Use our platform in accordance with applicable laws
    • Maintain accurate and up-to-date information
    • Respect intellectual property rights

    2. FEES AND PAYMENTS
    • Registration fee: $99 AUD (one-time)
    • Monthly platform fee: $49 AUD
    • Success fee: 5-8% of completed deals

    3. DATA AND PRIVACY
    • We protect your data according to our Privacy Policy
    • You control what information is shared with partners
    • All communications are encrypted and secure

    4. DISPUTE RESOLUTION
    • Mediation services available for partner disputes
    • Binding arbitration for unresolved conflicts
    • Australian law governs all agreements

    5. LIMITATION OF LIABILITY
    • Platform provided "as is" with reasonable care
    • We facilitate connections but don't guarantee outcomes
    • Maximum liability limited to fees paid in past 12 months
  `

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Final details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Business Registration Number */}
          <div className="space-y-2">
            <Label htmlFor="businessRegistrationNumber" className="text-sm font-medium">
              ABN/Business Registration Number <span className="text-gray-500">(Optional)</span>
            </Label>
            <Input
              id="businessRegistrationNumber"
              placeholder="e.g., 12 345 678 901 (Australian ABN format)"
              value={data.businessRegistrationNumber}
              onChange={(e) => handleInputChange("businessRegistrationNumber", e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Providing your business registration number helps build trust with potential partners
            </p>
          </div>

          {/* Partnership Agreement */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="partnershipAgreement"
                checked={data.partnershipAgreement}
                onCheckedChange={(checked) => handleInputChange("partnershipAgreement", checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="partnershipAgreement" className="text-sm font-medium cursor-pointer">
                  I accept the Partnership Agreement <span className="text-red-500">*</span>
                </Label>
                <Collapsible open={expandedAgreement} onOpenChange={setExpandedAgreement}>
                  <CollapsibleTrigger asChild>
                    <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
                      View Agreement{" "}
                      {expandedAgreement ? (
                        <ChevronUp className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-3 p-4 border rounded-lg bg-gray-50 text-sm text-gray-700 max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-sans">{partnershipAgreementText}</pre>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>

          {/* Terms of Service */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="termsOfService"
                checked={data.termsOfService}
                onCheckedChange={(checked) => handleInputChange("termsOfService", checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="termsOfService" className="text-sm font-medium cursor-pointer">
                  I agree to ConnectHub's Terms of Service <span className="text-red-500">*</span>
                </Label>
                <Collapsible open={expandedTerms} onOpenChange={setExpandedTerms}>
                  <CollapsibleTrigger asChild>
                    <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
                      View Terms{" "}
                      {expandedTerms ? (
                        <ChevronUp className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-3 p-4 border rounded-lg bg-gray-50 text-sm text-gray-700 max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-sans">{termsOfServiceText}</pre>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button variant="ghost" onClick={onPrevious}>
              Previous
            </Button>
            <div className="flex space-x-3">
              <Button variant="ghost" className="text-blue-600">
                Save as Draft
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting}
                className="bg-green-600 hover:bg-green-700 min-w-[160px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
