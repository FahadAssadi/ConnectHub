"use client";

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  stages: Array<{
    id: string;
    title: string;
    description: string;
    required: boolean;
  }>;
  currentStage: string;
  completedStages: string[];
  progressPercentage: number;
  userType: 'bd_partner' | 'company';
  variant?: 'full' | 'compact' | 'minimal';
}

export function ProgressIndicator({
  stages,
  currentStage,
  completedStages,
  progressPercentage,
  userType,
  variant = 'full',
}: ProgressIndicatorProps) {
  const getStageStatus = (stageId: string) => {
    if (completedStages.includes(stageId)) return 'completed';
    if (stageId === currentStage) return 'current';
    return 'pending';
  };

  const getStageIcon = (status: string, required: boolean) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return required ? (
          <AlertCircle className="h-5 w-5 text-orange-500" />
        ) : (
          <Circle className="h-5 w-5 text-gray-400" />
        );
    }
  };

  const userTypeLabels = {
    bd_partner: 'BD Partner',
    company: 'Company'
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center space-x-4">
        <Badge variant="outline" className="text-xs">
          {userTypeLabels[userType]}
        </Badge>
        <Progress value={progressPercentage} className="flex-1 h-2" />
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {Math.round(progressPercentage)}%
        </span>
      </div>
    );
  }

  if (variant === 'compact') {
    const currentStageIndex = stages.findIndex(s => s.id === currentStage);
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            {userTypeLabels[userType]} Registration
          </Badge>
          <span className="text-sm text-gray-600">
            Step {currentStageIndex + 1} of {stages.length}
          </span>
        </div>
        
        <Progress value={progressPercentage} className="h-2" />
        
        <div className="flex justify-between">
          {stages.map((stage, index) => {
            const status = getStageStatus(stage.id);
            
            return (
              <div key={stage.id} className="flex flex-col items-center space-y-1">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2",
                  status === 'completed' && "bg-green-500 text-white border-green-500",
                  status === 'current' && "bg-blue-500 text-white border-blue-500",
                  status === 'pending' && "bg-gray-100 text-gray-500 border-gray-300"
                )}>
                  {status === 'completed' ? '✓' : index + 1}
                </div>
                <span className="text-xs text-gray-500 text-center max-w-16 leading-tight">
                  {stage.title.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {userTypeLabels[userType]} Registration Progress
        </h3>
        <Badge variant="outline">
          {Math.round(progressPercentage)}% Complete
        </Badge>
      </div>
      
      <Progress value={progressPercentage} className="h-3" />
      
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.id);
          const isActive = stage.id === currentStage;
          
          return (
            <div
              key={stage.id}
              className={cn(
                "flex items-start space-x-4 p-4 rounded-lg border transition-all",
                isActive && "bg-blue-50 border-blue-200",
                status === 'completed' && "bg-green-50 border-green-200",
                status === 'pending' && "bg-gray-50 border-gray-200"
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getStageIcon(status, stage.required)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={cn(
                    "text-sm font-medium",
                    isActive && "text-blue-900",
                    status === 'completed' && "text-green-800",
                    status === 'pending' && "text-gray-700"
                  )}>
                    {index + 1}. {stage.title}
                  </h4>
                  
                  <div className="flex items-center space-x-2">
                    {stage.required && (
                      <Badge variant="secondary" className="text-xs">
                        Required
                      </Badge>
                    )}
                    
                    <Badge 
                      variant={
                        status === 'completed' ? 'default' : 
                        status === 'current' ? 'default' : 
                        'secondary'
                      }
                      className={cn(
                        "text-xs",
                        status === 'completed' && "bg-green-100 text-green-800",
                        status === 'current' && "bg-blue-100 text-blue-800",
                        status === 'pending' && "bg-gray-100 text-gray-600"
                      )}
                    >
                      {status === 'completed' ? 'Completed' : 
                       status === 'current' ? 'In Progress' : 
                       'Pending'}
                    </Badge>
                  </div>
                </div>
                
                <p className={cn(
                  "text-sm",
                  isActive && "text-blue-700",
                  status === 'completed' && "text-green-600",
                  status === 'pending' && "text-gray-600"
                )}>
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="pt-4 border-t">
        <p className="text-sm text-gray-600">
          <strong>{completedStages.length}</strong> of <strong>{stages.length}</strong> stages completed
        </p>
      </div>
    </div>
  );
}
