"use client";

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormNavigationProps {
  // State
  isFirstStage: boolean;
  isLastStage: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLoading: boolean;
  isFormValid: boolean;
  
  // Actions
  onPrevious: () => void;
  onNext: () => void;
  onSaveAsDraft: () => void;
  onSubmit: () => void;
  
  // Customization
  previousLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  saveAsDraftLabel?: string;
  showSaveAsDraft?: boolean;
  className?: string;
}

export function FormNavigation({
  isFirstStage,
  isLastStage,
  canGoNext,
  canGoPrevious,
  isLoading,
  isFormValid,
  onPrevious,
  onNext,
  onSaveAsDraft,
  onSubmit,
  previousLabel = "Previous",
  nextLabel = "Next",
  submitLabel = "Complete Registration",
  saveAsDraftLabel = "Save as Draft",
  showSaveAsDraft = true,
  className,
}: FormNavigationProps) {
  return (
    <div className={cn("flex items-center justify-between border-t pt-6 mt-8", className)}>
      {/* Left side - Previous button or Save as Draft */}
      <div className="flex items-center space-x-3">
        {canGoPrevious && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={isLoading}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {previousLabel}
          </Button>
        )}
        
        {showSaveAsDraft && (
          <Button
            type="button"
            variant="ghost"
            onClick={onSaveAsDraft}
            disabled={isLoading}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <Save className="h-4 w-4 mr-2" />
            {saveAsDraftLabel}
          </Button>
        )}
      </div>

      {/* Right side - Next/Submit button */}
      <div className="flex items-center space-x-3">
        {/* Form validation indicator */}
        {!isFormValid && !isLastStage && (
          <span className="text-sm text-gray-500 flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            Complete required fields to continue
          </span>
        )}
        
        {isLastStage ? (
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={isLoading || !isFormValid}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                {submitLabel}
              </>
            )}
          </Button>
        ) : (
          <Button
            type="submit"
            onClick={onNext}
            disabled={isLoading || !isFormValid || !canGoNext}
            className="flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                {nextLabel}
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
