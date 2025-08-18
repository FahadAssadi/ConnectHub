"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RegistrationResponse {
  success?: boolean;
  error?: string;
  details?: string;
  userId?: string;
  userType?: string;
  currentStage?: number;
  totalStages?: number;
  nextStage?: string;
  isComplete?: boolean;
  status?: string;
  profile?: any;
}

interface ErrorDetails {
  error: string;
  details: string;
  isServerDown?: boolean;
  isValidationError?: boolean;
  field?: string;
}

export function useRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorDetails | null>(null);
  const router = useRouter();

  const createAccount = async (email: string, password: string, userType: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/registration/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, userType }),
      });

      const data: RegistrationResponse = await response.json();

      if (!response.ok) {
        const errorDetails: ErrorDetails = {
          error: data.error || "Registration failed",
          details: data.details || "An unknown error occurred",
          isServerDown: response.status >= 500,
          isValidationError: response.status === 400,
        };
        
        setError(errorDetails);
        toast.error(errorDetails.error, {
          description: errorDetails.details,
        });
        
        return null;
      }

      toast.success("Account created successfully!", {
        description: "Welcome to ConnectHub. Let's complete your registration.",
      });

      return data;
    } catch (err) {
      const errorDetails: ErrorDetails = {
        error: "Network error",
        details: "Unable to connect to server. Please check your internet connection.",
        isServerDown: true,
      };
      
      setError(errorDetails);
      toast.error(errorDetails.error, {
        description: errorDetails.details,
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const submitStage = async (stageNumber: number, stageData: any, userId: string, userType: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/registration/stage/${stageNumber}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...stageData,
          userId,
          userType,
        }),
      });

      const data: RegistrationResponse = await response.json();

      if (!response.ok) {
        const errorDetails: ErrorDetails = {
          error: data.error || "Stage submission failed",
          details: data.details || "An unknown error occurred",
          isServerDown: response.status >= 500,
          isValidationError: response.status === 400,
        };
        
        setError(errorDetails);
        toast.error(errorDetails.error, {
          description: errorDetails.details,
        });
        
        return null;
      }

      if (data.isComplete) {
        toast.success("Registration completed!", {
          description: "Your application is now under review. We'll contact you soon.",
        });
      } else {
        toast.success("Stage completed successfully!", {
          description: `Moving to stage ${data.currentStage}`,
        });
      }

      return data;
    } catch (err) {
      const errorDetails: ErrorDetails = {
        error: "Network error",
        details: "Unable to connect to server. Please check your internet connection.",
        isServerDown: true,
      };
      
      setError(errorDetails);
      toast.error(errorDetails.error, {
        description: errorDetails.details,
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getRegistrationStatus = async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/registration/status/${userId}`);
      const data: RegistrationResponse = await response.json();

      if (!response.ok) {
        const errorDetails: ErrorDetails = {
          error: data.error || "Failed to get registration status",
          details: data.details || "An unknown error occurred",
          isServerDown: response.status >= 500,
        };
        
        setError(errorDetails);
        return null;
      }

      return data;
    } catch (err) {
      const errorDetails: ErrorDetails = {
        error: "Network error",
        details: "Unable to connect to server. Please check your internet connection.",
        isServerDown: true,
      };
      
      setError(errorDetails);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const retryLastAction = () => {
    setError(null);
    // This would need to be implemented based on the last action
    // For now, just clear the error
  };

  return {
    createAccount,
    submitStage,
    getRegistrationStatus,
    isLoading,
    error,
    clearError,
    retryLastAction,
  };
}

// Helper function to get user-friendly error messages
export function getErrorMessage(error: ErrorDetails): string {
  if (error.isServerDown) {
    return "Our servers are currently unavailable. Please try again in a few minutes.";
  }
  
  if (error.isValidationError) {
    return `Please check your input: ${error.details}`;
  }
  
  return error.details || error.error;
}

// Helper function to determine if user can retry
export function canRetry(error: ErrorDetails): boolean {
  return error.isServerDown || !error.isValidationError;
}
