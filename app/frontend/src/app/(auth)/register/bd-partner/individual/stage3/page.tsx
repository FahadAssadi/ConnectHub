"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FileUpload } from "@/components/ui/file-upload"
import { MultiSelectTags } from "@/components/ui/multi-select-tags"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, Upload, FileText, Shield, Target } from "lucide-react"
import RegistrationLayout from "@/components/registration/registration-layout"

// Mock data
const engagementTypes = [
  "Project-based consulting",
  "Ongoing partnership",
  "Commission-based sales",
  "Retainer agreement",
  "Revenue sharing",
  "Equity partnership"
]

export default function IndividualBDStage3() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    // Engagement Preferences
    preferredEngagementType: [] as string[],
    availabilityHoursPerWeek: "",
    
    // Documents & Declarations
    resumeProfileSummary: null as File | null,
    idProof: null as File | null,
    declaration: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.preferredEngagementType.length === 0) {
      newErrors.preferredEngagementType = "Please select at least one engagement type"
    }

    if (!formData.availabilityHoursPerWeek) {
      newErrors.availabilityHoursPerWeek = "Please specify your availability"
    } else if (isNaN(Number(formData.availabilityHoursPerWeek)) || Number(formData.availabilityHoursPerWeek) <= 0) {
      newErrors.availabilityHoursPerWeek = "Please enter a valid number of hours"
    }

    if (!formData.resumeProfileSummary) {
      newErrors.resumeProfileSummary = "Please upload your resume or profile summary"
    }

    if (!formData.idProof) {
      newErrors.idProof = "Please upload a valid ID proof"
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
      console.log("Completing individual BD registration:", formData)
      await new Promise(resolve => setTimeout(resolve, 2000))
      router.push("/dashboard/individual-bd")
    } catch (error) {
      console.error("Registration error:", error)
      setErrors({ submit: "Failed to complete registration. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | string[] | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <RegistrationLayout
      title="Engagement & Documents"
      description="Set your preferences and upload required documents"
      currentStage={3}
      totalStages={3}
      userType="individual_bd"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.submit && (
          <Alert variant="destructive">
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        {/* Engagement Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Engagement Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Preferred Engagement Type</Label>
              <MultiSelectTags
                value={formData.preferredEngagementType}
                onChange={(value) => handleInputChange("preferredEngagementType", value)}
                suggestions={engagementTypes}
                placeholder="Select engagement types you're interested in..."
                className={errors.preferredEngagementType ? "border-red-500" : ""}
              />
              {errors.preferredEngagementType && (
                <p className="text-sm text-red-500">{errors.preferredEngagementType}</p>
              )}
              <p className="text-sm text-gray-500">
                Choose the types of business arrangements you prefer to work with
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Availability (Hours/Week)
              </Label>
              <Input
                id="availability"
                type="number"
                min="1"
                max="168"
                value={formData.availabilityHoursPerWeek}
                onChange={(e) => handleInputChange("availabilityHoursPerWeek", e.target.value)}
                placeholder="e.g., 20"
                className={errors.availabilityHoursPerWeek ? "border-red-500" : ""}
              />
              {errors.availabilityHoursPerWeek && (
                <p className="text-sm text-red-500">{errors.availabilityHoursPerWeek}</p>
              )}
              <p className="text-sm text-gray-500">
                Approximate time you can commit to BD activities per week
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Documents & Declarations Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Documents & Declarations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Resume / Profile Summary
              </Label>
              <FileUpload
                file={formData.resumeProfileSummary}
                onFileSelect={(file) => handleInputChange("resumeProfileSummary", file)}
                accept=".pdf,.doc,.docx"
                maxSize={5}
                placeholder="Upload your resume or professional profile"
                required
              />
              {errors.resumeProfileSummary && (
                <p className="text-sm text-red-500">{errors.resumeProfileSummary}</p>
              )}
              <p className="text-sm text-gray-500">
                PDF or Word document showcasing your professional experience
              </p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                ID Proof
              </Label>
              <FileUpload
                file={formData.idProof}
                onFileSelect={(file) => handleInputChange("idProof", file)}
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={5}
                placeholder="Upload your passport, license, or other ID"
                required
              />
              {errors.idProof && (
                <p className="text-sm text-red-500">{errors.idProof}</p>
              )}
              <p className="text-sm text-gray-500">
                Government-issued ID for verification (passport, driver's license, etc.)
              </p>
            </div>

            {/* Declaration */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="declaration"
                    checked={formData.declaration}
                    onCheckedChange={(checked) => handleInputChange("declaration", checked as boolean)}
                    className={errors.declaration ? "border-red-500" : ""}
                  />
                  <div className="space-y-1">
                    <Label 
                      htmlFor="declaration" 
                      className="text-sm font-medium cursor-pointer text-blue-900"
                    >
                      Declaration and Agreement
                    </Label>
                    <p className="text-sm text-blue-700">
                      I confirm that all information provided is accurate and complete. I understand that 
                      false information may result in rejection of my application. I agree to maintain 
                      confidentiality and act professionally in all business development activities.
                    </p>
                  </div>
                </div>
                {errors.declaration && (
                  <p className="text-sm text-red-500 mt-2 ml-7">{errors.declaration}</p>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Review Summary */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Ready to Submit</h4>
                <p className="text-sm text-green-700 mt-1">
                  Once you submit your registration, our team will review your application. 
                  You'll receive an email notification within 2-3 business days regarding the status.
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
            className="min-w-32"
          >
            {isLoading ? "Submitting..." : "Complete Registration"}
          </Button>
        </div>
      </form>
    </RegistrationLayout>
  )
}
