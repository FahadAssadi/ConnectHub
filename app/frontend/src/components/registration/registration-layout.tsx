"use client";

import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegistrationLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  currentStage: string;
  stages: Array<{
    id: string;
    title: string;
    description: string;
    required: boolean;
  }>;
  progressPercentage: number;
  userType: 'bd_partner' | 'company';
  completedStages: string[];
  isLoading?: boolean;
}

export function RegistrationLayout({
  children,
  title,
  description,
  currentStage,
  stages,
  progressPercentage,
  userType,
  completedStages,
  isLoading = false,
}: RegistrationLayoutProps) {
  const getStageStatus = (stageId: string) => {
    if (completedStages.includes(stageId)) return 'completed';
    if (stageId === currentStage) return 'current';
    return 'pending';
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const userTypeLabels = {
    bd_partner: 'Business Development Partner',
    company: 'Company'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Badge variant="outline" className="mb-4">
            {userTypeLabels[userType]} Registration
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Registration
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fill in your information step by step to join the ConnectHub platform and start building meaningful business partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Registration Progress</CardTitle>
                <CardDescription>
                  {Math.round(progressPercentage)}% complete
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Progress */}
                <div>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-sm text-gray-500 mt-2">
                    {completedStages.length} of {stages.length} stages completed
                  </p>
                </div>

                {/* Stage List */}
                <div className="space-y-4">
                  {stages.map((stage, index) => {
                    const status = getStageStatus(stage.id);
                    const isActive = stage.id === currentStage;
                    
                    return (
                      <div
                        key={stage.id}
                        className={cn(
                          "flex items-start space-x-3 p-3 rounded-lg transition-colors",
                          isActive && "bg-blue-50 border-l-4 border-l-blue-500",
                          status === 'completed' && "bg-green-50"
                        )}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {getStageIcon(status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={cn(
                              "text-sm font-medium",
                              isActive && "text-blue-900",
                              status === 'completed' && "text-green-800",
                              status === 'pending' && "text-gray-600"
                            )}>
                              {index + 1}. {stage.title}
                            </p>
                            {stage.required && (
                              <Badge variant="secondary" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <p className={cn(
                            "text-xs mt-1",
                            isActive && "text-blue-700",
                            status === 'completed' && "text-green-600",
                            status === 'pending' && "text-gray-500"
                          )}>
                            {stage.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Help Section */}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Need Help?
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Having trouble with your registration? We're here to help.
                  </p>
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    Contact Support
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{title}</CardTitle>
                    <CardDescription className="mt-1">
                      {description}
                    </CardDescription>
                  </div>
                  {isLoading && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Saving...</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {children}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
