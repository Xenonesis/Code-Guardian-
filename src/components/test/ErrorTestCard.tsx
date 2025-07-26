import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertTriangle, Brain, Zap, Clock, CreditCard, ExternalLink } from 'lucide-react';
import { parseErrorMessage, showErrorToast } from '../../utils/errorUtils';

const ErrorTestCard: React.FC = () => {
  const [selectedError, setSelectedError] = useState<string>('');

  const testErrors = [
    {
      name: 'Gemini Quota Exceeded',
      error: 'Gemini API quota exceeded: You have reached your daily free tier limit (50 requests). Please wait 24 hours for the quota to reset, or upgrade to a paid plan for higher limits.'
    },
    {
      name: 'OpenAI Rate Limit',
      error: 'OpenAI API quota exceeded: You have reached your usage limit. Please check your billing details or wait for your quota to reset.'
    },
    {
      name: 'Authentication Error',
      error: 'Gemini API authentication failed: Please check your API key in the AI Configuration tab.'
    },
    {
      name: 'Server Error',
      error: 'Claude API server error: The service is temporarily unavailable. Please try again later.'
    },
    {
      name: 'Network Error',
      error: 'Network connection issue'
    }
  ];

  const renderErrorCard = (error: string) => {
    if (!error) return null;

    const errorInfo = parseErrorMessage(error);
    const { type, provider, isQuotaExceeded, isAuthError, userFriendlyMessage, actionableAdvice, helpUrl } = errorInfo;
    
    return (
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-900/20 border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-red-600" />
            AI Fix Suggestions
            <Badge variant="outline" className="text-red-600 border-red-300">
              {type === 'quota' ? 'Quota Exceeded' : 
               type === 'rate_limit' ? 'Rate Limited' :
               type === 'auth' ? 'Auth Error' : 
               type === 'server' ? 'Server Error' :
               type === 'network' ? 'Network Error' : 'Error'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {userFriendlyMessage}
            </AlertDescription>
          </Alert>

          {actionableAdvice.length > 0 && (
            <div className={`border rounded-lg p-4 ${
              type === 'quota' ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' :
              type === 'rate_limit' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' :
              type === 'auth' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' :
              'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800'
            }`}>
              <div className="flex items-start gap-3">
                {type === 'quota' && <Clock className="h-5 w-5 text-blue-600 mt-0.5" />}
                {type === 'rate_limit' && <CreditCard className="h-5 w-5 text-amber-600 mt-0.5" />}
                {type === 'auth' && <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />}
                <div className="space-y-2">
                  <h4 className={`font-medium ${
                    type === 'quota' ? 'text-blue-900 dark:text-blue-100' :
                    type === 'rate_limit' ? 'text-amber-900 dark:text-amber-100' :
                    type === 'auth' ? 'text-red-900 dark:text-red-100' :
                    'text-gray-900 dark:text-gray-100'
                  }`}>
                    What you can do:
                  </h4>
                  <ul className={`text-sm space-y-1 ${
                    type === 'quota' ? 'text-blue-800 dark:text-blue-200' :
                    type === 'rate_limit' ? 'text-amber-800 dark:text-amber-200' :
                    type === 'auth' ? 'text-red-800 dark:text-red-200' :
                    'text-gray-800 dark:text-gray-200'
                  }`}>
                    {actionableAdvice.map((advice, index) => (
                      <li key={index}>• {advice}</li>
                    ))}
                  </ul>
                  {helpUrl && (
                    <a 
                      href={helpUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-sm hover:underline ${
                        type === 'quota' ? 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300' :
                        type === 'rate_limit' ? 'text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300' :
                        type === 'auth' ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300' :
                        'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      Learn more
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => showErrorToast(error, { title: 'Test Toast' })}
              variant="outline"
              disabled={type === 'quota' && provider === 'gemini'}
            >
              <Zap className="h-4 w-4 mr-2" />
              {type === 'quota' && provider === 'gemini' ? 'Try Again Tomorrow' : 
               type === 'rate_limit' ? 'Retry in a Moment' :
               'Test Toast'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Error Message Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {testErrors.map((testError) => (
                <Button
                  key={testError.name}
                  variant={selectedError === testError.error ? "default" : "outline"}
                  onClick={() => setSelectedError(testError.error)}
                  className="text-sm"
                >
                  {testError.name}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setSelectedError('')}
              className="w-full"
            >
              Clear Error
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedError && renderErrorCard(selectedError)}
    </div>
  );
};

export default ErrorTestCard;
