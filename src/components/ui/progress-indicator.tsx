import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, Zap, Brain, Shield, Search, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStep {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  estimatedTime?: number; // in seconds
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep: number;
  variant?: 'horizontal' | 'vertical' | 'circular';
  showEstimatedTime?: boolean;
  className?: string;
  onStepClick?: (stepIndex: number) => void;
  animated?: boolean;
}

const defaultIcons = {
  upload: <FileText className="h-4 w-4" />,
  analyze: <Brain className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
  process: <Zap className="h-4 w-4" />,
  search: <Search className="h-4 w-4" />,
};

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  variant = 'horizontal',
  showEstimatedTime = false,
  className = '',
  onStepClick,
  animated = true
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (animated && currentStep < steps.length) {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentStep, steps.length, animated]);

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'pending';
  };

  const getStepIcon = (step: ProgressStep, status: string) => {
    if (status === 'completed') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (status === 'current') {
      return step.icon || <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
    }
    return step.icon || <Clock className="h-4 w-4 text-slate-400" />;
  };

  const getEstimatedTimeRemaining = () => {
    const remainingSteps = steps.slice(currentStep);
    return remainingSteps.reduce((total, step) => total + (step.estimatedTime || 5), 0);
  };

  if (variant === 'circular') {
    const progress = (currentStep / steps.length) * 100;
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-200 dark:text-slate-700"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-blue-500 transition-all duration-500 ease-out"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {Math.round(progress)}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>

        {/* Current step info */}
        {currentStep < steps.length && (
          <div className="text-center space-y-1">
            <div className="font-medium text-slate-900 dark:text-white">
              {steps[currentStep].title}
            </div>
            {steps[currentStep].description && (
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {steps[currentStep].description}
              </div>
            )}
            {showEstimatedTime && (
              <div className="text-xs text-slate-400 dark:text-slate-500">
                ~{getEstimatedTimeRemaining()}s remaining
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={cn("space-y-4", className)}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isClickable = onStepClick && status !== 'pending';

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start space-x-3 p-3 rounded-lg transition-all duration-200",
                status === 'current' && "bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800",
                status === 'completed' && "bg-green-50 dark:bg-green-950/20",
                isClickable && "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
              onClick={() => isClickable && onStepClick(index)}
            >
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                status === 'completed' && "bg-green-100 dark:bg-green-900",
                status === 'current' && "bg-blue-100 dark:bg-blue-900",
                status === 'pending' && "bg-slate-100 dark:bg-slate-800"
              )}>
                {getStepIcon(step, status)}
              </div>

              <div className="flex-1 min-w-0">
                <div className={cn(
                  "font-medium",
                  status === 'completed' && "text-green-700 dark:text-green-300",
                  status === 'current' && "text-blue-700 dark:text-blue-300",
                  status === 'pending' && "text-slate-500 dark:text-slate-400"
                )}>
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {step.description}
                  </div>
                )}
                {status === 'current' && showEstimatedTime && step.estimatedTime && (
                  <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                    ~{step.estimatedTime}s estimated
                  </div>
                )}
              </div>

              {status === 'current' && animated && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={cn("w-full", className)}>
      {/* Progress bar */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Progress
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {currentStep} of {steps.length} steps
          </span>
        </div>
        
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isClickable = onStepClick && status !== 'pending';

          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center space-y-2 flex-1",
                isClickable && "cursor-pointer"
              )}
              onClick={() => isClickable && onStepClick(index)}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                status === 'completed' && "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
                status === 'current' && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 ring-4 ring-blue-100 dark:ring-blue-900",
                status === 'pending' && "bg-slate-100 dark:bg-slate-800 text-slate-400",
                isClickable && "hover:scale-110"
              )}>
                {getStepIcon(step, status)}
              </div>
              
              <div className="text-center">
                <div className={cn(
                  "text-xs font-medium",
                  status === 'completed' && "text-green-600 dark:text-green-400",
                  status === 'current' && "text-blue-600 dark:text-blue-400",
                  status === 'pending' && "text-slate-400"
                )}>
                  {step.title}
                </div>
                {status === 'current' && showEstimatedTime && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    ~{getEstimatedTimeRemaining()}s
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current step details */}
      {currentStep < steps.length && steps[currentStep].description && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-blue-800 dark:text-blue-200">
            {steps[currentStep].description}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;