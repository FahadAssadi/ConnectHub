"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Building2 } from "lucide-react"

export default function BDPartnerTypeSelection() {
  const router = useRouter()
  const [partnerType, setPartnerType] = useState("")

  const handleContinue = () => {
    if (partnerType === "individual") {
      router.push("/onboarding/bd-individual")
    } else if (partnerType === "company") {
      router.push("/onboarding/bd-org")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>BD Partner Registration</CardTitle>
            <CardDescription>Choose your partner type to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <RadioGroup value={partnerType} onValueChange={setPartnerType}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual" className="flex-1 cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <User className="w-6 h-6 text-blue-600 mt-1" />
                        <div>
                          <h3 className="font-medium">Individual BD Partner</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Register as an individual business development professional with your own expertise and
                            network
                          </p>
                          <ul className="text-xs text-gray-500 mt-2 space-y-1">
                            <li>• Personal profile and experience</li>
                            <li>• Individual capacity and availability</li>
                            <li>• Direct engagement with companies</li>
                          </ul>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="company" id="company" />
                    <Label htmlFor="company" className="flex-1 cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <Building2 className="w-6 h-6 text-green-600 mt-1" />
                        <div>
                          <h3 className="font-medium">Company BD Partner</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Register your company as a business development partner with team capabilities
                          </p>
                          <ul className="text-xs text-gray-500 mt-2 space-y-1">
                            <li>• Company profile and team expertise</li>
                            <li>• Scalable capacity and resources</li>
                            <li>• Enterprise-level partnerships</li>
                          </ul>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              <Button onClick={handleContinue} className="w-full" size="lg" disabled={!partnerType}>
                Continue with {partnerType === "individual" ? "Individual" : "Company"} Registration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}