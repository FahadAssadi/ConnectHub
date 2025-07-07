"use client"

import { useState } from "react"
import { RegistrationHeader } from "../(components)/registration-header"
import { CompanyDetailsStep } from "./(components)/company-details-step"
import { PrimaryContactStep } from "./(components)/primary-contact-step"
import { CompanyOverviewStep } from "./(components)/company-overview-step"
import { BusinessRegistrationStep } from "./(components)/business-registration-step"

export default function CompanyRegistrationFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})

  const steps = [
    { id: 1, title: "Company Details", component: CompanyDetailsStep },
    { id: 2, title: "Primary Contact", component: PrimaryContactStep },
    { id: 3, title: "Company Overview", component: CompanyOverviewStep },
    { id: 4, title: "Business Registration", component: BusinessRegistrationStep },
  ]

  const currentStepData = steps.find((step) => step.id === currentStep)
  const CurrentStepComponent = currentStepData?.component

  const progress = (currentStep / steps.length) * 100
  const timeEstimates = ["2 minutes", "1 minute", "3 minutes", "1 minute"]

  const handleNext = (stepData: any) => {
    setFormData((prev) => ({ ...prev, ...stepData }))
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RegistrationHeader
        progress={progress}
        currentStep={currentStep}
        totalSteps={steps.length}
        stepTitle={currentStepData?.title || ""}
        timeEstimate={timeEstimates[currentStep - 1]}
      />

      <main className="container mx-auto px-4 py-8">
        {CurrentStepComponent && (
          <CurrentStepComponent
            onNext={handleNext}
            onPrevious={handlePrevious}
            formData={formData}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === steps.length}
          />
        )}
      </main>
    </div>
  )
}
