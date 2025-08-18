"use client";

import { AlertCircle, Wifi, RefreshCw, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { canRetry, getErrorMessage } from "@/hooks/use-registration";

interface ErrorDetails {
  error: string;
  details: string;
  isServerDown?: boolean;
  isValidationError?: boolean;
  field?: string;
}

interface ErrorDisplayProps {
  error: ErrorDetails | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorDisplay({ error, onRetry, onDismiss, className }: ErrorDisplayProps) {
  if (!error) return null;

  const showRetry = canRetry(error) && onRetry;
  const message = getErrorMessage(error);

  return (
    <Alert className={`border-destructive/50 text-destructive ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {error.isServerDown ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
        </div>
        
        <div className="flex-grow min-w-0">
          <AlertTitle className="text-sm font-medium">
            {error.isServerDown ? "Connection Problem" : "Registration Error"}
          </AlertTitle>
          <AlertDescription className="text-sm mt-1">
            {message}
          </AlertDescription>
          
          {showRetry && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="h-8 border-destructive/20 text-destructive hover:bg-destructive/5"
              >
                <RefreshCw className="h-3 w-3 mr-1.5" />
                Try Again
              </Button>
            </div>
          )}
        </div>
        
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="flex-shrink-0 h-6 w-6 p-0 text-destructive/60 hover:text-destructive hover:bg-destructive/5"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </Alert>
  );
}

// Inline error component for form fields
interface FieldErrorProps {
  error?: string;
  className?: string;
}

export function FieldError({ error, className }: FieldErrorProps) {
  if (!error) return null;

  return (
    <div className={`flex items-center gap-1.5 text-sm text-destructive mt-1 ${className}`}>
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
}

// Server status indicator
interface ServerStatusProps {
  isOnline: boolean;
  className?: string;
}

export function ServerStatus({ isOnline, className }: ServerStatusProps) {
  return (
    <div className={`flex items-center gap-2 text-xs ${className}`}>
      <div
        className={`w-2 h-2 rounded-full ${
          isOnline ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className={isOnline ? "text-green-600" : "text-red-600"}>
        {isOnline ? "Connected" : "Connection lost"}
      </span>
    </div>
  );
}
