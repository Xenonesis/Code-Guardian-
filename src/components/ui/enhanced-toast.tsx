import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { CheckCircle, AlertCircle, XCircle, Info, Zap, Shield, Brain, Upload, Download } from 'lucide-react';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

const getIcon = (type: string, customIcon?: React.ReactNode) => {
  if (customIcon) return customIcon;
  
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
    default:
      return null;
  }
};

export const enhancedToast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: getIcon('success', options?.icon),
      action: options?.action,
      className: 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800',
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      description: options?.description,
      duration: options?.duration || 6000,
      icon: getIcon('error', options?.icon),
      action: options?.action,
      className: 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800',
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      icon: getIcon('warning', options?.icon),
      action: options?.action,
      className: 'bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800',
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: getIcon('info', options?.icon),
      action: options?.action,
      className: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
    });
  },

  // Specialized toasts for common actions
  analysisStarted: (filename: string) => {
    return sonnerToast.info('Analysis Started', {
      description: `Analyzing ${filename} for security vulnerabilities...`,
      icon: <Brain className="h-5 w-5 text-purple-500 animate-pulse" />,
      duration: 3000,
      className: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800',
    });
  },

  analysisComplete: (issueCount: number, duration: string) => {
    return sonnerToast.success('Analysis Complete', {
      description: `Found ${issueCount} issues in ${duration}`,
      icon: <Shield className="h-5 w-5 text-green-500" />,
      duration: 5000,
      className: 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800',
    });
  },

  fileUploaded: (filename: string, size: string) => {
    return sonnerToast.success('File Uploaded', {
      description: `${filename} (${size}) uploaded successfully`,
      icon: <Upload className="h-5 w-5 text-blue-500" />,
      duration: 3000,
      className: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
    });
  },

  downloadReady: (filename: string, onDownload: () => void) => {
    return sonnerToast.success('Report Ready', {
      description: `${filename} is ready for download`,
      icon: <Download className="h-5 w-5 text-green-500" />,
      duration: 8000,
      action: {
        label: 'Download',
        onClick: onDownload,
      },
      className: 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800',
    });
  },

  securityAlert: (severity: 'critical' | 'high' | 'medium' | 'low', count: number) => {
    const colors = {
      critical: 'red',
      high: 'orange', 
      medium: 'yellow',
      low: 'blue'
    };
    
    const color = colors[severity];
    
    return sonnerToast.warning(`${severity.toUpperCase()} Security Issues`, {
      description: `Found ${count} ${severity} severity issues that need attention`,
      icon: <Shield className={`h-5 w-5 text-${color}-500`} />,
      duration: severity === 'critical' ? 10000 : 6000,
      className: `bg-${color}-50 dark:bg-${color}-950/50 border-${color}-200 dark:border-${color}-800`,
    });
  },

  aiInsight: (insight: string) => {
    return sonnerToast.info('AI Insight', {
      description: insight,
      icon: <Brain className="h-5 w-5 text-purple-500 animate-pulse" />,
      duration: 7000,
      className: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800',
    });
  },

  performanceOptimization: (improvement: string) => {
    return sonnerToast.success('Performance Tip', {
      description: improvement,
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      duration: 6000,
      className: 'bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800',
    });
  },

  // Promise-based toast for async operations
  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: (data: T) => string;
      error: (error: any) => string;
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
      className: 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800',
    });
  },
};

export default enhancedToast;