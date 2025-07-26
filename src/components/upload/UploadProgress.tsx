import React from 'react';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import ProgressIndicator from '@/components/ui/progress-indicator';
import { Sparkles, Upload, Brain, Shield, Search, FileText, Zap } from 'lucide-react';

interface UploadProgressProps {
  isUploading: boolean;
  isAnalyzing: boolean;
  uploadProgress: number;
  analysisProgress?: number;
  currentAnalysisStep?: number;
}

const analysisSteps = [
  {
    id: 'init',
    title: 'Initialize',
    description: 'Setting up analysis engine',
    icon: <Zap className="h-4 w-4" />,
    estimatedTime: 2
  },
  {
    id: 'scan',
    title: 'Scan Structure',
    description: 'Analyzing project structure',
    icon: <FileText className="h-4 w-4" />,
    estimatedTime: 3
  },
  {
    id: 'detect',
    title: 'Language Detection',
    description: 'Detecting languages and frameworks',
    icon: <Search className="h-4 w-4" />,
    estimatedTime: 2
  },
  {
    id: 'security',
    title: 'Security Analysis',
    description: 'Running security scans',
    icon: <Shield className="h-4 w-4" />,
    estimatedTime: 4
  },
  {
    id: 'insights',
    title: 'Generate Insights',
    description: 'Creating AI-powered insights',
    icon: <Brain className="h-4 w-4" />,
    estimatedTime: 3
  },
  {
    id: 'finalize',
    title: 'Finalize',
    description: 'Preparing results',
    icon: <Sparkles className="h-4 w-4" />,
    estimatedTime: 1
  }
];

export const UploadProgress: React.FC<UploadProgressProps> = ({
  isUploading,
  isAnalyzing,
  uploadProgress,
  analysisProgress = 0,
  currentAnalysisStep = 0
}) => {
  if (isUploading) {
    return (
      <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3">
            <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-bounce" />
            <span className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              Uploading file...
            </span>
          </div>
          <span className="text-sm text-blue-700 dark:text-blue-300 font-mono bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
            {uploadProgress}%
          </span>
        </div>
        
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full h-3 bg-blue-100 dark:bg-blue-900" />
          <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400">
            <span>Validating ZIP file...</span>
            <span>{uploadProgress < 100 ? 'In progress' : 'Complete'}</span>
          </div>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="space-y-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border border-purple-200 dark:border-purple-800 animate-fade-in">
        {/* Mobile-friendly header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400 animate-pulse" />
            <div>
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                AI Security Analysis
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                {analysisSteps[currentAnalysisStep]?.description || 'Processing...'}
              </p>
            </div>
          </div>
          
          {/* Progress circle for mobile */}
          <div className="sm:hidden">
            <LoadingSpinner 
              variant="analysis" 
              size="lg" 
              progress={analysisProgress}
              className="scale-75"
            />
          </div>
        </div>

        {/* Desktop progress indicator */}
        <div className="hidden sm:block">
          <ProgressIndicator
            steps={analysisSteps}
            currentStep={currentAnalysisStep}
            variant="horizontal"
            showEstimatedTime={true}
            animated={true}
          />
        </div>

        {/* Mobile progress indicator */}
        <div className="sm:hidden">
          <ProgressIndicator
            steps={analysisSteps}
            currentStep={currentAnalysisStep}
            variant="circular"
            showEstimatedTime={true}
            animated={true}
            className="scale-90"
          />
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-purple-700 dark:text-purple-300 font-medium">
              Overall Progress
            </span>
            <span className="text-purple-600 dark:text-purple-400 font-mono">
              {Math.round(analysisProgress)}%
            </span>
          </div>
          <Progress 
            value={analysisProgress} 
            className="w-full h-2 bg-purple-100 dark:bg-purple-900" 
          />
        </div>

        {/* Status message */}
        <div className="text-center">
          <p className="text-sm text-purple-600 dark:text-purple-400">
            Step {currentAnalysisStep + 1} of {analysisSteps.length} • 
            {analysisSteps[currentAnalysisStep]?.title || 'Processing'}
          </p>
        </div>
      </div>
    );
  }

  return null;
};