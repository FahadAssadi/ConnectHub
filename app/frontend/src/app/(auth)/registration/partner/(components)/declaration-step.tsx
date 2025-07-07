"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Shield, ChevronDown, ChevronUp, Loader2, CheckCircle } from "lucide-react"

interface DeclarationStepProps {
  onNext: (data: any) => void
  onPrevious: () => void
  formData: any
  isFirstStep: boolean
  isLastStep: boolean
}

export function DeclarationStep({ onNext, onPrevious, formData }: DeclarationStepProps) {
  const [data, setData] = useState({
    accuracyDeclaration: formData.accuracyDeclaration || false,
    codeOfConduct: formData.codeOfConduct || false,
    compensationUnderstanding: formData.compensationUnderstanding || false,
  })

  const [expandedCode, setExpandedCode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setData((prev) => ({ ...prev, [field]: checked }))
  }

  const isFormValid = () => {
    return data.accuracyDeclaration && data.codeOfConduct && data.compensationUnderstanding
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

  const codeOfConductText = `
    CODE OF CONDUCT FOR BD PARTNERS

    1. PROFESSIONAL STANDARDS
    • Maintain the highest standards of professional conduct
    • Represent partner businesses accurately and honestly
    • Respect confidential information and intellectual property
    • Comply with all applicable laws and regulations

    2. CLIENT RELATIONSHIPS
    • Act in the best interests of both the business and the client
    • Provide accurate product information and pricing
    • Disclose any potential conflicts of interest
    • Maintain professional communication at all times

    3. BUSINESS PRACTICES
    • Use only approved marketing materials and messaging
    • Follow agreed pricing and commission structures
    • Report all leads and opportunities transparently
    • Maintain accurate records of all business activities

    4. ETHICAL GUIDELINES
    • No misrepresentation of products or services
    • No unauthorized promises or commitments
    • Respect competitor information and practices
    • Maintain client confidentiality and data protection

    5. PLATFORM USAGE
    • Use the ConnectHub platform responsibly
    • Keep profile information current and accurate
    • Respond promptly to business inquiries
    • Participate in required training and certification programs

    6. CONSEQUENCES
    • Violations may result in account suspension or termination
    • Serious breaches may affect commission payments
    • Appeals process available for disputed violations
    • Continuous improvement and feedback encouraged
  `

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Final confirmation</CardTitle>
          <p className="text-gray-600 mt-2">Please review and accept the following declarations</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Accuracy Declaration */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="accuracyDeclaration"
                checked={data.accuracyDeclaration}
                onCheckedChange={(checked) => handleCheckboxChange("accuracyDeclaration", checked as boolean)}
                className="mt-1 w-5 h-5"
              />
              <div className="flex-1">
                <Label htmlFor="accuracyDeclaration" className="text-sm font-medium cursor-pointer flex items-center">
                  <CheckCircle
                    className={`h-4 w-4 mr-2 ${data.accuracyDeclaration ? "text-green-600" : "text-gray-400"}`}
                  />
                  Accuracy Declaration <span className="text-red-500 ml-1">*</span>
                </Label>
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                  I confirm that all the information provided in this registration is true, complete, and accurate to
                  the best of my knowledge. I understand that providing false information may result in account
                  termination.
                </p>
              </div>
            </div>
          </div>

          {/* Code of Conduct */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="codeOfConduct"
                checked={data.codeOfConduct}
                onCheckedChange={(checked) => handleCheckboxChange("codeOfConduct", checked as boolean)}
                className="mt-1 w-5 h-5"
              />
              <div className="flex-1">
                <Label htmlFor="codeOfConduct" className="text-sm font-medium cursor-pointer flex items-center">
                  <CheckCircle className={`h-4 w-4 mr-2 ${data.codeOfConduct ? "text-green-600" : "text-gray-400"}`} />
                  Code of Conduct Agreement <span className="text-red-500 ml-1">*</span>
                </Label>
                <p className="text-sm text-gray-700 mt-2 mb-3 leading-relaxed">
                  I agree to abide by ConnectHub's Code of Conduct for BD Partners, maintaining professional standards
                  and ethical business practices at all times.
                </p>

                <Collapsible open={expandedCode} onOpenChange={setExpandedCode}>
                  <CollapsibleTrigger asChild>
                    <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
                      View Code of Conduct{" "}
                      {expandedCode ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-3 p-4 border rounded-lg bg-gray-50 text-sm text-gray-700 max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-sans">{codeOfConductText}</pre>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>

          {/* Compensation Understanding */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="compensationUnderstanding"
                checked={data.compensationUnderstanding}
                onCheckedChange={(checked) => handleCheckboxChange("compensationUnderstanding", checked as boolean)}
                className="mt-1 w-5 h-5"
              />
              <div className="flex-1">
                <Label
                  htmlFor="compensationUnderstanding"
                  className="text-sm font-medium cursor-pointer flex items-center"
                >
                  <CheckCircle
                    className={`h-4 w-4 mr-2 ${data.compensationUnderstanding ? "text-green-600" : "text-gray-400"}`}
                  />
                  Compensation Understanding <span className="text-red-500 ml-1">*</span>
                </Label>
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                  I understand that compensation as a BD Partner is based solely on successful referrals or completed
                  deals. There are no guaranteed payments, salaries, or minimum earnings. Commission rates and payment
                  terms are agreed upon with each business partner.
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          {isFormValid() && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">All declarations completed</span>
              </div>
              <p className="text-sm text-green-700 mt-1">You're ready to complete your BD Partner registration!</p>
            </div>
          )}

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
                className="bg-green-600 hover:bg-green-700 min-w-[180px]"
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
