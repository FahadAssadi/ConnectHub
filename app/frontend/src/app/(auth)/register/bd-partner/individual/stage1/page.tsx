"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import RegistrationLayout from "@/components/registration/registration-layout"
import { useRegistration } from "@/hooks/use-registration"
import { ErrorDisplay, FieldError } from "@/components/ui/error-display"

export default function IndividualBdStage1() {
  const router = useRouter()
  const { createAccount, isLoading, error, clearError } = useRegistration()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setFieldErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    clearError()
    
    const result = await createAccount(formData.email, formData.password, "individual_bd")
    
    if (result?.success) {
      // Store user data in localStorage for subsequent stages
      localStorage.setItem("registrationData", JSON.stringify({
        userId: result.userId,
        userType: result.userType,
        currentStage: result.currentStage,
        totalStages: result.totalStages
      }))
      
      // Navigate to next stage
      router.push("/register/bd-partner/individual/stage2")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const retryAccountCreation = async () => {
    if (validateForm()) {
      const result = await createAccount(formData.email, formData.password, "individual_bd")
      if (result?.success) {
        localStorage.setItem("registrationData", JSON.stringify({
          userId: result.userId,
          userType: result.userType,
          currentStage: result.currentStage,
          totalStages: result.totalStages
        }))
        router.push("/register/bd-partner/individual/stage2")
      }
    }
  }

  return (
    <RegistrationLayout
      title="Create Your BD Partner Account"
      description="Start your journey as an individual business development partner"
      currentStage={1}
      totalStages={3}
      userType="individual_bd"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <ErrorDisplay 
          error={error} 
          onRetry={retryAccountCreation}
          onDismiss={clearError}
        />

        <div className="grid gap-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="your.email@example.com"
              className={fieldErrors.email ? "border-red-500" : ""}
            />
            <FieldError error={fieldErrors.email} />
            <p className="text-sm text-gray-500">This will be your login email address</p>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Create a strong password"
                className={fieldErrors.password ? "border-red-500" : ""}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <FieldError error={fieldErrors.password} />
            <p className="text-sm text-gray-500">Must be at least 8 characters long</p>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="Confirm your password"
                className={fieldErrors.confirmPassword ? "border-red-500" : ""}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <FieldError error={fieldErrors.confirmPassword} />
          </div>
        </div>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">What's Next?</h4>
                <p className="text-sm text-green-700 mt-1">
                  After creating your account, you'll complete your professional profile including your 
                  experience, expertise, and engagement preferences to help companies find the right 
                  partnerships with you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button type="submit" disabled={isLoading || !formData.email || !formData.password || !formData.confirmPassword}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </div>
      </form>
    </RegistrationLayout>
  )
}
