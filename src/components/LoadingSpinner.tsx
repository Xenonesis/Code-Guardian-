import React, { useState, useEffect } from 'react';
import { Loader2, Brain, Shield, Zap, Search } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  variant?: 'default' | 'analysis' | 'security' | 'processing';
  progress?: number; // 0-100 for progress indication
  steps?: string[]; // Array of step descriptions
}

const loadingMessages = {
  analysis: [
    'Initializing AI analysis engine...',
    'Scanning code structure...',
    'Detecting languages and frameworks...',
    'Running security analysis...',
    'Generating insights...',
    'Finalizing results...'
  ],
  security: [
    'Scanning for vulnerabilities...',
    'Checking for secrets...',
    'Analyzing dependencies...',
    'Running OWASP checks...',
    'Generating security report...'
  ],
  processing: [
    'Processing your request...',
    'Analyzing data...',
    'Generating results...',
    'Almost done...'
  ]
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  variant = 'default',
  progress,
  steps
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(text);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  };

  useEffect(() => {
    if (variant !== 'default' && !steps) {
      const messages = loadingMessages[variant as keyof typeof loadingMessages] || loadingMessages.processing;
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % messages.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [variant, steps]);

  useEffect(() => {
    if (variant !== 'default' && !text) {
      const messages = steps || loadingMessages[variant as keyof typeof loadingMessages] || loadingMessages.processing;
      setCurrentMessage(messages[currentStep]);
    }
  }, [currentStep, variant, text, steps]);

  const getVariantIcon = () => {
    switch (variant) {
      case 'analysis':
        return <Brain className={`${iconSizes[size]} text-purple-500 animate-pulse`} />;
      case 'security':
        return <Shield className={`${iconSizes[size]} text-blue-500 animate-pulse`} />;
      case 'processing':
        return <Zap className={`${iconSizes[size]} text-yellow-500 animate-pulse`} />;
      default:
        return null;
    }
  };

  if (variant === 'default') {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
        <Loader2 className={`animate-spin text-blue-600 dark:text-blue-400 ${sizeClasses[size]}`} />
        {text && (
          <p className="text-sm text-slate-600 dark:text-slate-400">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-4 p-6 ${className}`}>
      {/* Enhanced Loading Animation */}
      <div className="relative">
        {/* Outer spinning ring */}
        <div className={`${sizeClasses[size === 'xl' ? 'xl' : 'lg']} border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin`}></div>
        
        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {getVariantIcon()}
        </div>
        
        {/* Pulsing background */}
        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping opacity-75"></div>
      </div>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Dynamic Message */}
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-slate-900 dark:text-white animate-fade-in">
          {currentMessage}
        </p>
        
        {/* Step Indicator */}
        {(steps || loadingMessages[variant as keyof typeof loadingMessages]) && (
          <div className="flex justify-center space-x-1">
            {(steps || loadingMessages[variant as keyof typeof loadingMessages] || []).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-blue-500 w-6' 
                    : index < currentStep 
                      ? 'bg-green-500' 
                      : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Subtle hint text */}
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-sm">
        {variant === 'analysis' && 'Our AI is analyzing your code for security vulnerabilities and quality issues'}
        {variant === 'security' && 'Running comprehensive security scans using industry-standard tools'}
        {variant === 'processing' && 'Processing your request with advanced algorithms'}
      </p>
    </div>
  );
};
