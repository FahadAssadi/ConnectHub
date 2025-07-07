"use client"

import { useState } from "react"
import { RegistrationHeader } from "../(components)/registration-header"
import { PersonalDetailsStep } from "./(components)/personal-details-step"
import { IndustryExpertiseStep } from "./(components)/industry-expertise-step"
import { MarketAccessStep } from "./(components)/market-access-step"
import { EngagementPreferencesStep } from "./(components)/engagement-preferences-step"
import { OptionalShowcaseStep } from "./(components)/optional-showcase-step"
import { DeclarationStep } from "./(components)/declaration-step"

export default function PartnerRegistrationFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})

  const steps = [
    { id: 1, title: "Personal Details", component: PersonalDetailsStep },
    { id: 2, title: "Industry & Domain Expertise", component: IndustryExpertiseStep },
    { id: 3, title: "Market Access & Influence", component: MarketAccessStep },
    { id: 4, title: "Engagement & Preferences", component: EngagementPreferencesStep },
    { id: 5, title: "Optional Showcase", component: OptionalShowcaseStep },
    { id: 6, title: "Declaration", component: DeclarationStep },
  ]

  const currentStepData = steps.find((step) => step.id === currentStep)
  const CurrentStepComponent = currentStepData?.component

  const progress = (currentStep / steps.length) * 100
  const timeEstimates = ["2 minutes", "3 minutes", "2 minutes", "2 minutes", "3 minutes", "1 minute"]

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
