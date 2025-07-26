import { toast } from 'sonner';

export interface ErrorInfo {
  type: 'quota' | 'rate_limit' | 'auth' | 'server' | 'network' | 'unknown';
  provider?: string;
  isQuotaExceeded: boolean;
  isRateLimit: boolean;
  isAuthError: boolean;
  retryAfter?: number;
  userFriendlyMessage: string;
  actionableAdvice: string[];
  helpUrl?: string;
}

export function parseErrorMessage(error: string | Error): ErrorInfo {
  const errorMessage = error instanceof Error ? error.message : error;
  const lowerMessage = errorMessage.toLowerCase();

  // Detect provider
  let provider: string | undefined;
  if (lowerMessage.includes('gemini')) provider = 'gemini';
  else if (lowerMessage.includes('openai')) provider = 'openai';
  else if (lowerMessage.includes('claude')) provider = 'claude';
  else if (lowerMessage.includes('mistral')) provider = 'mistral';

  // Detect error type
  const isQuotaExceeded = lowerMessage.includes('quota exceeded') || lowerMessage.includes('quota limit');
  const isRateLimit = lowerMessage.includes('rate limit') || lowerMessage.includes('too many requests');
  const isAuthError = lowerMessage.includes('authentication failed') || lowerMessage.includes('unauthorized') || lowerMessage.includes('invalid api key');
  const isServerError = lowerMessage.includes('server error') || lowerMessage.includes('internal error');
  const isNetworkError = lowerMessage.includes('network') || lowerMessage.includes('connection');

  let type: ErrorInfo['type'] = 'unknown';
  let userFriendlyMessage = errorMessage;
  let actionableAdvice: string[] = [];
  let helpUrl: string | undefined;

  if (isQuotaExceeded) {
    type = 'quota';
    if (provider === 'gemini' && lowerMessage.includes('free tier')) {
      userFriendlyMessage = 'Gemini API daily quota exceeded (50 requests)';
      actionableAdvice = [
        'Wait 24 hours for your quota to reset',
        'Upgrade to a paid plan for higher limits',
        'Try using a different AI provider'
      ];
      helpUrl = 'https://ai.google.dev/gemini-api/docs/rate-limits';
    } else {
      userFriendlyMessage = `${provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : 'API'} quota exceeded`;
      actionableAdvice = [
        'Check your billing and usage limits',
        'Wait for your quota to reset',
        'Consider upgrading your plan'
      ];
    }
  } else if (isRateLimit) {
    type = 'rate_limit';
    userFriendlyMessage = `${provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : 'API'} rate limit exceeded`;
    actionableAdvice = [
      'Wait a few minutes before trying again',
      'Reduce the frequency of requests',
      'Check your rate limit settings'
    ];
  } else if (isAuthError) {
    type = 'auth';
    userFriendlyMessage = `${provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : 'API'} authentication failed`;
    actionableAdvice = [
      'Check your API key in the AI Configuration tab',
      'Verify your API key is valid and active',
      'Ensure you have the correct permissions'
    ];
  } else if (isServerError) {
    type = 'server';
    userFriendlyMessage = `${provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : 'API'} server temporarily unavailable`;
    actionableAdvice = [
      'Try again in a few minutes',
      'Check the service status page',
      'Use a different AI provider if available'
    ];
  } else if (isNetworkError) {
    type = 'network';
    userFriendlyMessage = 'Network connection issue';
    actionableAdvice = [
      'Check your internet connection',
      'Try again in a moment',
      'Verify firewall settings'
    ];
  }

  return {
    type,
    provider,
    isQuotaExceeded,
    isRateLimit,
    isAuthError,
    userFriendlyMessage,
    actionableAdvice,
    helpUrl
  };
}

export function showErrorToast(error: string | Error, options?: {
  title?: string;
  duration?: number;
}) {
  const errorInfo = parseErrorMessage(error);
  const title = options?.title || 'Operation Failed';
  const duration = options?.duration || (errorInfo.isQuotaExceeded ? 8000 : 6000);

  toast.error(title, {
    description: errorInfo.userFriendlyMessage,
    duration,
    action: errorInfo.helpUrl ? {
      label: 'Learn More',
      onClick: () => window.open(errorInfo.helpUrl, '_blank')
    } : undefined
  });

  return errorInfo;
}

export function getRetryDelay(error: string | Error): number {
  const errorMessage = error instanceof Error ? error.message : error;
  const lowerMessage = errorMessage.toLowerCase();

  // Extract retry delay from Gemini error messages
  const retryMatch = errorMessage.match(/(\d+)\s*seconds?/i);
  if (retryMatch) {
    return parseInt(retryMatch[1]) * 1000; // Convert to milliseconds
  }

  // Default retry delays based on error type
  if (lowerMessage.includes('quota exceeded')) {
    return 24 * 60 * 60 * 1000; // 24 hours for quota
  } else if (lowerMessage.includes('rate limit')) {
    return 60 * 1000; // 1 minute for rate limit
  }

  return 5 * 1000; // 5 seconds default
}
