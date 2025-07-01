"use client"

import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Dot } from "lucide-react"

interface RegistrationHeaderProps {
  progress: number
  currentStep: number
  totalSteps: number
  stepTitle: string
  timeEstimate: string
}

export function RegistrationHeader({
  progress,
  currentStep,
  totalSteps,
  stepTitle,
  timeEstimate,
}: RegistrationHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CH</span>
            </div>
            <span className="font-bold text-lg text-gray-900">ConnectHub</span>
          </Link>

          {/* Step Info */}
          <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
            <span>
              Step {currentStep} of {totalSteps} - {stepTitle}
            </span>
            <span className="text-blue-600">About {timeEstimate} remaining</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, index) => {
                const stepNumber = index + 1
                const isCompleted = stepNumber < currentStep
                const isCurrent = stepNumber === currentStep

                return (
                  <div key={stepNumber} className="flex items-center">
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : isCurrent ? (
                      <Dot className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-300" />
                    )}
                    {stepNumber < totalSteps && (
                      <div className={`w-8 h-0.5 mx-1 ${stepNumber < currentStep ? "bg-green-600" : "bg-gray-300"}`} />
                    )}
                  </div>
                )
              })}
            </div>
            <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
          </div>

          <Progress value={progress} className="h-2 bg-gray-200" />
        </div>

        {/* Mobile Step Info */}
        <div className="md:hidden pb-4 text-center text-sm text-gray-600">
          <div>
            Step {currentStep} of {totalSteps} - {stepTitle}
          </div>
          <div className="text-blue-600">About {timeEstimate} remaining</div>
        </div>
      </div>
    </header>
  )
}
