"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FileUpload } from "@/components/ui/file-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, Shield, CheckCircle } from "lucide-react"
import RegistrationLayout from "@/components/registration/registration-layout"

export default function CompanyBDStage4() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    companyProfileDeck: null as File | null,
    businessLicenseProof: null as File | null,
    declaration: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyProfileDeck) {
      newErrors.companyProfileDeck = "Please upload your company profile/deck"
    }

    if (!formData.businessLicenseProof) {
      newErrors.businessLicenseProof = "Business license/registration proof is mandatory"
    }

    if (!formData.declaration) {
      newErrors.declaration = "Please confirm the declaration to proceed"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      console.log("Completing company BD registration:", formData)
      await new Promise(resolve => setTimeout(resolve, 2000))
      router.push("/register/bd-partner/company/complete")
    } catch (error) {
      console.error("Registration error:", error)
      setErrors({ submit: "Failed to complete registration. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: File | null | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <RegistrationLayout
      title="Documents & Declarations"
      description="Upload required documents and complete your registration"
      currentStage={4}
      totalStages={4}
      userType="company_bd"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.submit && (
          <Alert variant="destructive">
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        {/* Documents Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                <span className="font-medium">Company Profile / Deck</span>
              </div>
              <FileUpload
                file={formData.companyProfileDeck}
                onFileSelect={(file) => handleInputChange("companyProfileDeck", file)}
                accept=".pdf,.ppt,.pptx,.doc,.docx"
                maxSize={10}
                placeholder="Upload your company profile or presentation deck"
                required
              />
              {errors.companyProfileDeck && (
                <p className="text-sm text-red-500">{errors.companyProfileDeck}</p>
              )}
              <p className="text-sm text-gray-500">
                PDF, PowerPoint, or Word document showcasing your company capabilities (max 10MB)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4" />
                <span className="font-medium">Business License / Registration Proof</span>
                <span className="text-red-500 text-sm">*Mandatory</span>
              </div>
              <FileUpload
                file={formData.businessLicenseProof}
                onFileSelect={(file) => handleInputChange("businessLicenseProof", file)}
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={5}
                placeholder="Upload business license or registration certificate"
                required
              />
              {errors.businessLicenseProof && (
                <p className="text-sm text-red-500">{errors.businessLicenseProof}</p>
              )}
              <p className="text-sm text-gray-500">
                Official business registration document or license (PDF or image format, max 5MB)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Declaration Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <CheckCircle className="w-5 h-5" />
              Declaration & Agreement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              <Checkbox
                id="declaration"
                checked={formData.declaration}
                onCheckedChange={(checked) => handleInputChange("declaration", checked as boolean)}
                className={errors.declaration ? "border-red-500" : ""}
              />
              <div className="space-y-2">
                <label 
                  htmlFor="declaration" 
                  className="text-sm font-medium cursor-pointer text-blue-900"
                >
                  Company Declaration and Compliance Agreement
                </label>
                <div className="text-sm text-blue-800 space-y-2">
                  <p>
                    We, as an authorized representative of the company, hereby confirm and declare that:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>All information provided in this registration is true, accurate, and verifiable</li>
                    <li>We have the authority to represent the company in business development partnerships</li>
                    <li>We will maintain strict confidentiality regarding client information and business dealings</li>
                    <li>We agree to act professionally and ethically in all partnership activities</li>
                    <li>We understand that false information may result in rejection or termination of partnership</li>
                    <li>We consent to background verification and reference checks as deemed necessary</li>
                  </ul>
                  <p className="mt-3 font-medium">
                    By checking this box, we agree to comply with ConnectHub's terms of service and partnership guidelines.
                  </p>
                </div>
              </div>
            </div>
            {errors.declaration && (
              <p className="text-sm text-red-500 mt-2 ml-7">{errors.declaration}</p>
            )}
          </CardContent>
        </Card>

        {/* Review Summary */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900 mb-2">Ready to Submit Your Application</h4>
                <p className="text-sm text-green-800 mb-3">
                  Once submitted, your company BD partner application will undergo a comprehensive review process:
                </p>
                <ul className="text-sm text-green-700 space-y-1 ml-4">
                  <li>• Document verification and business license validation</li>
                  <li>• Company profile and capability assessment</li>
                  <li>• Reference checks and background verification</li>
                  <li>• Review by our partnership committee</li>
                </ul>
                <p className="text-sm text-green-800 mt-3 font-medium">
                  You'll receive an email notification within 3-5 business days with the decision.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            size="lg" 
            disabled={isLoading}
            className="min-w-40"
          >
            {isLoading ? "Submitting Application..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </RegistrationLayout>
  )
}
