"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRegistration } from '@/hooks/use-registration';
import { RegistrationLayout } from '@/components/registration/registration-layout';
import { FormNavigation } from '@/components/registration/form-navigation';
import { ErrorDisplay } from '@/components/ui/error-display';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface RegistrationPageProps {
  userType: 'bd_partner' | 'company';
  userId: string;
}

export function RegistrationPage({ userType, userId }: RegistrationPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [initialStage, setInitialStage] = useState<string | undefined>();

  // Get initial stage from URL params
  useEffect(() => {
    const stage = searchParams.get('stage');
    if (stage) {
      setInitialStage(stage);
    }
  }, [searchParams]);

  // Registration hook
  const {
    isLoading,
    error,
    progress,
    stages,
    currentStage,
    form,
    goToStage,
    nextStage,
    previousStage,
    saveAndContinue,
    saveAsDraft,
    resetRegistration,
    isFirstStage,
    isLastStage,
    canGoNext,
    canGoPrevious,
    progressPercentage,
  } = useRegistration({
    userId,
    userType,
    initialStage,
  });

  // Update URL when stage changes
  useEffect(() => {
    if (currentStage) {
      const params = new URLSearchParams(searchParams);
      params.set('stage', currentStage);
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [currentStage, router, searchParams]);

  // Handle form submission
  const handleSubmit = async (data: any) => {
    try {
      await saveAndContinue(data);
      
      // If registration is complete, redirect to dashboard
      if (progress?.isComplete) {
        toast.success('Registration completed successfully!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Handle save as draft
  const handleSaveAsDraft = async () => {
    try {
      const formData = form.getValues();
      await saveAsDraft(formData);
      toast.success('Progress saved as draft');
    } catch (error) {
      console.error('Save draft error:', error);
    }
  };

  // Handle previous navigation
  const handlePrevious = () => {
    previousStage();
  };

  // Get current stage component - placeholder for now
  const getCurrentStageComponent = () => {
    if (!currentStage || stages.length === 0) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </CardContent>
        </Card>
      );
    }

    // Placeholder stage content
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">
              {currentStage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Stage
            </h3>
            <p className="text-gray-600">
              Form components for {currentStage} will be implemented here.
            </p>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This is a placeholder. The actual form components for this stage are being developed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Get current stage info
  const getCurrentStageInfo = () => {
    const stage = stages.find(s => s.id === currentStage);
    return stage || { title: 'Loading...', description: 'Please wait...' };
  };

  // Loading state
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Loading registration...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    const errorDetails = {
      error: 'Registration Error',
      details: error,
      isServerDown: false,
      isValidationError: false,
    };
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ErrorDisplay
          error={errorDetails}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const currentStageInfo = getCurrentStageInfo();
  const completedStages = progress?.completedStages || [];
  
  // Transform stages to match layout requirements
  const layoutStages = stages.map(stage => ({
    ...stage,
    required: true, // Assuming all stages are required for now
  }));

  return (
    <RegistrationLayout
      title={currentStageInfo.title}
      description={currentStageInfo.description}
      currentStage={currentStage}
      stages={layoutStages}
      progressPercentage={progressPercentage}
      userType={userType}
      completedStages={completedStages}
      isLoading={isLoading}
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {getCurrentStageComponent()}
        
        <FormNavigation
          isFirstStage={isFirstStage}
          isLastStage={isLastStage}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          isLoading={isLoading}
          isFormValid={form.formState.isValid}
          onPrevious={handlePrevious}
          onNext={form.handleSubmit(handleSubmit)}
          onSaveAsDraft={handleSaveAsDraft}
          onSubmit={form.handleSubmit(handleSubmit)}
        />
      </form>
    </RegistrationLayout>
  );
}
