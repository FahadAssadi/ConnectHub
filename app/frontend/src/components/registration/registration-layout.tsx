"use client"

import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

interface RegistrationLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  currentStage: number
  totalStages: number
  userType: "company" | "individual_bd" | "company_bd"
  onBack?: () => void
  showBackButton?: boolean
}

const getUserTypeLabel = (userType: string) => {
  switch (userType) {
    case "company":
      return "Company"
    case "individual_bd":
      return "Individual BD Partner"
    case "company_bd":
      return "Company BD Partner"
    default:
      return "Registration"
  }
}

const getStageLabel = (stage: number, userType: string) => {
  const stageLabels = {
    company: ["Authentication", "Company Details", "Primary Contact", "Complete"],
    individual_bd: ["Authentication", "Personal & Professional", "Engagement & Documents"],
    company_bd: ["Authentication", "Company & Contact", "Profile & Engagement", "Documents & Declarations"]
  }
  
  return stageLabels[userType as keyof typeof stageLabels]?.[stage - 1] || `Stage ${stage}`
}

export default function RegistrationLayout({
  children,
  title,
  description,
  currentStage,
  totalStages,
  userType,
  onBack,
  showBackButton = true
}: RegistrationLayoutProps) {
  const router = useRouter()
  const progressPercentage = (currentStage / totalStages) * 100

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/register">Register</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={userType === "company" ? "/register/company" : "/register/bd-partner"}>
                  {getUserTypeLabel(userType)}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{getStageLabel(currentStage, userType)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Progress Section */}
        <Card className="mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 mt-1">{description}</p>
            </div>
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Step {currentStage} of {totalStages}: {getStageLabel(currentStage, userType)}
              </span>
              <span className="text-gray-600">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Stage Indicators */}
          <div className="flex justify-between mt-4">
            {Array.from({ length: totalStages }, (_, index) => {
              const stage = index + 1
              const isCompleted = stage < currentStage
              const isCurrent = stage === currentStage
              
              return (
                <div key={stage} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? "✓" : stage}
                  </div>
                  <span className="text-xs text-gray-500 mt-1 text-center max-w-20">
                    {getStageLabel(stage, userType)}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Main Content */}
        <Card className="p-8">
          {children}
        </Card>
      </div>
    </div>
  )
}
