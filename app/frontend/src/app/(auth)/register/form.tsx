"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, Users, ArrowLeft } from "lucide-react"
import { signUp, signInGoogle } from "@/lib/auth-client"

interface RegisterFormProps {
  role: "company" | "bd-partner"
  profileType: "" | "individual" | "company"
}

export default function RegisterFormPage({ role, profileType }: RegisterFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Role configuration
  const roleConfig = {
    "bd-partner": {
      title: "BD Partner Registration",
      description: "Join as a business development partner to connect companies with opportunities",
      icon: Users,
      badge: profileType === "individual" ? "Individual" : "Company",
      color: "green",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    company: {
      title: "Company Registration",
      description: "Register your company to showcase products and services, connect with BD partners",
      icon: Building2,
      badge: "Business",
      color: "blue",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  }

  const currentRole = roleConfig[role]
  const Icon = currentRole.icon

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Name / Company field
    if (role === "company" || (role === "bd-partner" && profileType === "company")) {
      if (!formData.companyName.trim()) newErrors.companyName = "Company name is required"
    } else {
      if (!formData.name.trim()) newErrors.name = "Full name is required"
    }

    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      let extraFields: Record<string, any> = {}

      if (role === "company") {
        extraFields = { companyName: formData.companyName }
      } else if (role === "bd-partner") {
        extraFields =
          profileType === "individual"
            ? { profileType: "individual", fullName: formData.name }
            : { profileType: "company", companyName: formData.companyName }
      }

      const { data, error } = await signUp(
        formData.email,
        formData.password,
        role === "company" || (role === "bd-partner" && profileType === "company")
          ? formData.companyName
          : formData.name,
        { role, ...extraFields }
      )

      if (error) setErrors({ submit: error.message || "Registration failed" })
      else if (data) router.push("/dashboard")
    } catch (err) {
      console.error(err)
      setErrors({ submit: "Registration failed" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    setErrors({})
    try {
      await signInGoogle()
      router.push("/dashboard")
    } catch (err) {
      console.error(err)
      setErrors({ submit: "Google authentication failed" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Link href="/register" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-12">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to role selection
        </Link>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center space-y-4">
            <div className={`mx-auto w-16 h-16 ${currentRole.bgColor} rounded-full flex items-center justify-center mb-4`}>
              <Icon className={`h-8 w-8 ${currentRole.iconColor}`} />
            </div>
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className={`${currentRole.color === "blue" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
              >
                {currentRole.badge}
              </Badge>
              <CardTitle className="text-2xl">{currentRole.title}</CardTitle>
              <CardDescription className="text-base">{currentRole.description}</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent mb-4"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              Continue with Google
            </Button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name or Company field */}
              {role === "company" || (role === "bd-partner" && profileType === "company") ? (
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className={errors.companyName ? "border-red-500" : ""}
                  />
                  {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              {errors.submit && <p className="text-sm text-red-500 text-center">{errors.submit}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm mt-2">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
