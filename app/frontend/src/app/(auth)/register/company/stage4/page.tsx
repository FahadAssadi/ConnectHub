"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Building2, Users, BarChart3 } from "lucide-react"
import RegistrationLayout from "@/components/registration/registration-layout"

export default function CompanyStage4() {
  const router = useRouter()

  const handleContinueToProfile = () => {
    // TODO: Navigate to company dashboard/profile completion
    router.push("/home/onboarding")
  }

  const handleGoToDashboard = () => {
    // TODO: Navigate to main dashboard
    router.push("/home")
  }

  return (
    <RegistrationLayout
      title="Registration Complete!"
      description="Your company account has been successfully created"
      currentStage={4}
      totalStages={4}
      userType="company"
      showBackButton={false}
    >
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Success Message */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ConnectHub!</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your company registration is complete and your account is ready to use. You can now access 
            your dashboard and start connecting with business development partners.
          </p>
        </div>

        {/* What's Next Cards */}
        <div className="grid md:grid-cols-3 gap-4 my-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 text-center">
              <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-blue-900 mb-1">Complete Your Profile</h3>
              <p className="text-sm text-blue-700">
                Add company description, industry specialization, and logo
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-green-900 mb-1">Find BD Partners</h3>
              <p className="text-sm text-green-700">
                Browse and connect with qualified business development partners
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-purple-900 mb-1">Track Progress</h3>
              <p className="text-sm text-purple-700">
                Monitor your partnerships and business development activities
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Account Status */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✓</div>
                <p className="text-sm text-gray-600 mt-1">Account Created</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✓</div>
                <p className="text-sm text-gray-600 mt-1">Email Verified</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">⏳</div>
                <p className="text-sm text-gray-600 mt-1">Profile Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button 
            size="lg" 
            onClick={handleContinueToProfile}
            className="flex items-center gap-2"
          >
            Complete Profile Setup
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleGoToDashboard}
          >
            Go to Dashboard
          </Button>
        </div>

        {/* Additional Info */}
        <Card className="bg-blue-50 border-blue-200 mt-8">
          <CardContent className="p-4">
            <div className="text-left">
              <h4 className="font-medium text-blue-900 mb-2">Important Next Steps:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Complete your company profile to attract the right BD partners</li>
                <li>• Upload your company logo and business documents</li>
                <li>• Set your engagement preferences and capacity</li>
                <li>• Browse available BD partners in your industry</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </RegistrationLayout>
  )
}
