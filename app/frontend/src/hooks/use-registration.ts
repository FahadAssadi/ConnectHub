"use client";

import { useState, useEffect, useCallback } from 'react';
import { useForm, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationAPI, type RegistrationProgress, type RegistrationStage } from '@/lib/registration-api';

export interface UseRegistrationProps {
  userId: string;
  userType: 'bd_partner' | 'company';
  initialStage?: string;
}

export interface UseRegistrationReturn {
  // State
  isLoading: boolean;
  error: string | null;
  progress: RegistrationProgress | null;
  stages: RegistrationStage[];
  currentStage: string;
  
  // Form
  form: UseFormReturn<FieldValues>;
  
  // Actions
  goToStage: (stage: string) => void;
  nextStage: () => void;
  previousStage: () => void;
  saveAndContinue: (data: any) => Promise<void>;
  saveAsDraft: (data: any) => Promise<void>;
  resetRegistration: () => Promise<void>;
  
  // Computed
  isFirstStage: boolean;
  isLastStage: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  progressPercentage: number;
}

export const useRegistration = ({
  userId,
  userType,
  initialStage,
}: UseRegistrationProps): UseRegistrationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<RegistrationProgress | null>(null);
  const [stages, setStages] = useState<RegistrationStage[]>([]);
  const [currentStage, setCurrentStage] = useState<string>(initialStage || '');

  // Initialize form without resolver initially
  const form = useForm<FieldValues>({
    mode: 'onChange',
  });

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Load stages and progress concurrently
        const [stagesData, progressData] = await Promise.all([
          registrationAPI.getStages(userType),
          registrationAPI.getProgress(userId).catch(() => null), // Don't fail if no progress exists
        ]);

        setStages(stagesData.stages);
        setProgress(progressData);

        // Set initial stage
        const initialStageToUse = initialStage || 
          progressData?.nextStage || 
          stagesData.stages[0]?.id || '';
        
        setCurrentStage(initialStageToUse);

        // Load existing data for current stage if available
        if (progressData?.registrationData) {
          loadStageData(initialStageToUse, progressData.registrationData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load registration data');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && userType) {
      loadInitialData();
    }
  }, [userId, userType, initialStage]);

  // Load data for a specific stage
  const loadStageData = useCallback((stage: string, registrationData: any) => {
    if (!registrationData) return;

    // Extract stage-specific data based on user type and stage
    let stageData: Record<string, any> = {};
    
    if (userType === 'bd_partner') {
      switch (stage) {
        case 'basic_info':
          stageData = {
            fullName: registrationData.fullName,
            displayName: registrationData.displayName,
            title: registrationData.title,
            email: registrationData.email,
            phone: registrationData.phone,
            country: registrationData.country,
            city: registrationData.city,
            state: registrationData.state,
            timezone: registrationData.timezone,
          };
          break;
        case 'professional':
          stageData = {
            bio: registrationData.bio,
            professionalBackground: registrationData.professionalBackground,
            availability: registrationData.availability,
            availabilityHours: registrationData.availabilityHours,
            hourlyRate: registrationData.hourlyRate,
            languages: registrationData.languages ? JSON.parse(registrationData.languages) : [],
          };
          break;
        case 'expertise':
          const metadata = registrationData.metadata ? JSON.parse(registrationData.metadata) : {};
          stageData = metadata.expertise || {};
          break;
        case 'verification':
          const verificationMetadata = registrationData.metadata ? JSON.parse(registrationData.metadata) : {};
          stageData = verificationMetadata.verification || {};
          break;
      }
    } else if (userType === 'company') {
      switch (stage) {
        case 'company_info':
          stageData = {
            companyName: registrationData.companyName,
            registrationNumber: registrationData.registrationNumber,
            taxId: registrationData.taxId,
            industry: registrationData.industry,
            businessType: registrationData.businessType,
            companySize: registrationData.companySize,
            foundedYear: registrationData.foundedYear,
            website: registrationData.website,
            description: registrationData.description,
          };
          break;
        case 'contact_info':
          const contactMetadata = registrationData.metadata ? JSON.parse(registrationData.metadata) : {};
          stageData = {
            primaryContactName: contactMetadata.primaryContact?.name,
            primaryContactTitle: contactMetadata.primaryContact?.title,
            primaryContactEmail: registrationData.email,
            primaryContactPhone: registrationData.phone,
            country: registrationData.country,
            city: registrationData.city,
            state: registrationData.state,
            address: registrationData.addressLine1,
            postalCode: registrationData.postalCode,
          };
          break;
        case 'business_details':
          const businessMetadata = registrationData.metadata ? JSON.parse(registrationData.metadata) : {};
          stageData = businessMetadata.businessDetails || {};
          break;
        case 'partnership_goals':
          const partnershipMetadata = registrationData.metadata ? JSON.parse(registrationData.metadata) : {};
          stageData = partnershipMetadata.partnershipGoals || {};
          break;
        case 'verification':
          const verificationMetadata = registrationData.metadata ? JSON.parse(registrationData.metadata) : {};
          stageData = verificationMetadata.verification || {};
          break;
      }
    }

    form.reset(stageData);
  }, [userType, form]);

  // Navigate to specific stage
  const goToStage = useCallback((stage: string) => {
    if (stages.find(s => s.id === stage)) {
      setCurrentStage(stage);
      if (progress?.registrationData) {
        loadStageData(stage, progress.registrationData);
      }
    }
  }, [stages, progress, loadStageData]);

  // Navigate to next stage
  const nextStage = useCallback(() => {
    const currentIndex = stages.findIndex(s => s.id === currentStage);
    if (currentIndex !== -1 && currentIndex < stages.length - 1) {
      goToStage(stages[currentIndex + 1].id);
    }
  }, [stages, currentStage, goToStage]);

  // Navigate to previous stage
  const previousStage = useCallback(() => {
    const currentIndex = stages.findIndex(s => s.id === currentStage);
    if (currentIndex > 0) {
      goToStage(stages[currentIndex - 1].id);
    }
  }, [stages, currentStage, goToStage]);

  // Save current stage and continue
  const saveAndContinue = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      await registrationAPI.saveStage(userId, userType, currentStage, data);
      
      // Reload progress
      const updatedProgress = await registrationAPI.getProgress(userId);
      setProgress(updatedProgress);

      // Move to next stage if not complete
      if (!updatedProgress.isComplete) {
        nextStage();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save stage');
      throw err; // Re-throw for form handling
    } finally {
      setIsLoading(false);
    }
  }, [userId, userType, currentStage, nextStage]);

  // Save as draft without moving to next stage
  const saveAsDraft = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      await registrationAPI.saveStage(userId, userType, currentStage, data);
      
      // Reload progress
      const updatedProgress = await registrationAPI.getProgress(userId);
      setProgress(updatedProgress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, userType, currentStage]);

  // Reset entire registration
  const resetRegistration = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await registrationAPI.reset(userId);
      
      // Reset to first stage
      if (stages.length > 0) {
        setCurrentStage(stages[0].id);
        form.reset({});
      }
      
      setProgress(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset registration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, stages, form]);

  // Computed values
  const currentStageIndex = stages.findIndex(s => s.id === currentStage);
  const isFirstStage = currentStageIndex === 0;
  const isLastStage = currentStageIndex === stages.length - 1;
  const canGoNext = currentStageIndex < stages.length - 1;
  const canGoPrevious = currentStageIndex > 0;
  const progressPercentage = stages.length > 0 ? Math.round(((currentStageIndex + 1) / stages.length) * 100) : 0;

  return {
    // State
    isLoading,
    error,
    progress,
    stages,
    currentStage,
    
    // Form
    form,
    
    // Actions
    goToStage,
    nextStage,
    previousStage,
    saveAndContinue,
    saveAsDraft,
    resetRegistration,
    
    // Computed
    isFirstStage,
    isLastStage,
    canGoNext,
    canGoPrevious,
    progressPercentage,
  };
};
