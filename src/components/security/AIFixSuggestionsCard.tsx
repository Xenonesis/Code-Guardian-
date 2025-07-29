import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Brain,
  Lightbulb,
  Code,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Copy,
  Download,
  Play,
  ChevronDown,
  ChevronRight,
  Loader2,
  Zap,
  Shield,
  Target,
  Info
} from 'lucide-react';
import { SecurityIssue } from '@/hooks/useAnalysis';
import { FixSuggestion, AIFixSuggestionsService, FixSuggestionRequest } from '@/services/aiFixSuggestionsService';
import { toast } from 'sonner';
import { ExternalLink, CreditCard } from 'lucide-react';
import { parseErrorMessage, showErrorToast } from '../../utils/errorUtils';

interface AIFixSuggestionsCardProps {
  issue: SecurityIssue;
  codeContext: string;
  language: string;
  framework?: string;
  onApplyFix?: (suggestion: FixSuggestion) => void;
}

export const AIFixSuggestionsCard: React.FC<AIFixSuggestionsCardProps> = ({
  issue,
  codeContext,
  language,
  framework,
  onApplyFix
}) => {
  const [suggestions, setSuggestions] = useState<FixSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Generating AI suggestions...');
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [fixService] = useState(() => new AIFixSuggestionsService());

  const generateFixSuggestions = useCallback(async () => {
    // Don't generate if no code context
    if (!codeContext || codeContext.trim() === '') {
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingMessage('Analyzing vulnerability...');

    // Show progress messages
    const progressTimer = setTimeout(() => {
      setLoadingMessage('Generating secure code solutions...');
    }, 5000);

    const timeoutTimer = setTimeout(() => {
      setLoadingMessage('This is taking longer than usual. Trying alternative approach...');
    }, 15000);

    try {
      const request: FixSuggestionRequest = {
        issue,
        codeContext,
        language,
        framework
      };

      const fixSuggestions = await fixService.generateFixSuggestions(request);
      setSuggestions(fixSuggestions);

      // Show success message if it took a while
      if (fixSuggestions.length > 0) {
        toast.success(`Generated ${fixSuggestions.length} AI fix suggestion${fixSuggestions.length > 1 ? 's' : ''}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate fix suggestions';
      setError(errorMessage);

      // Show user-friendly error toast with more context
      if (errorMessage.includes('timeout')) {
        showErrorToast(err instanceof Error ? err : errorMessage, {
          title: 'AI Request Timed Out',
          description: 'The AI service is taking longer than expected. You can try again or use the fallback suggestions below.'
        });
      } else {
        showErrorToast(err instanceof Error ? err : errorMessage, {
          title: 'AI Fix Generation Failed'
        });
      }
    } finally {
      clearTimeout(progressTimer);
      clearTimeout(timeoutTimer);
      setIsLoading(false);
      setLoadingMessage('Generating AI suggestions...');
    }
  }, [issue, codeContext, language, framework, fixService]);

  useEffect(() => {
    // Only generate suggestions if we have code context
    if (codeContext && codeContext.trim() !== '') {
      generateFixSuggestions();
    }
  }, [generateFixSuggestions, codeContext]);

  const cancelGeneration = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setIsLoading(false);
    setLoadingMessage('Generating AI suggestions...');
    toast.info('AI suggestion generation cancelled');
  }, [abortController]);

  const toggleSuggestionExpansion = (suggestionId: string) => {
    setExpandedSuggestion(
      expandedSuggestion === suggestionId ? null : suggestionId
    );
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(label);
      toast.success(`${label} copied to clipboard`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700';
      case 'High': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700';
    return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
  };

  const renderPriorityStars = (priority: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < priority
            ? 'text-yellow-400 fill-current dark:text-yellow-300'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Fix Suggestions
            <Badge variant="outline" className="text-purple-600 border-purple-300">
              Generating...
            </Badge>
          </CardTitle>
          <CardDescription>
            AI is analyzing the vulnerability and generating fix suggestions...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="flex items-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-3 text-slate-600 dark:text-slate-300 font-medium">
                {loadingMessage}
              </span>
            </div>
            <div className="text-center text-sm text-slate-500 dark:text-slate-400 max-w-md">
              <p>AI is analyzing your code and generating secure implementations...</p>
              <p className="mt-2 text-xs">This may take up to 30 seconds for complex vulnerabilities.</p>
            </div>
            <Button
              onClick={cancelGeneration}
              variant="outline"
              size="sm"
              className="mt-4 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
            >
              Cancel Generation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!codeContext || codeContext.trim() === '') {
    return (
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-yellow-600" />
            AI Fix Suggestions
            <Badge variant="outline" className="text-yellow-600 border-yellow-300">
              Code Required
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              AI fix suggestions require code context
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const renderErrorCard = () => {
    const errorInfo = parseErrorMessage(error || '');
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
              onClick={generateFixSuggestions}
              variant="outline"
              disabled={type === 'quota' && provider === 'gemini'}
            >
              <Zap className="h-4 w-4 mr-2" />
              {type === 'quota' && provider === 'gemini' ? 'Try Again Tomorrow' :
               type === 'rate_limit' ? 'Retry in a Moment' :
               'Retry Generation'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (error) {
    return renderErrorCard();
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-900/30 border-purple-200 dark:border-purple-700 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          AI Fix Suggestions ({suggestions?.length || 0})
          <Badge variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-600 bg-white/50 dark:bg-slate-800/50">
            AI-Powered
          </Badge>
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-300">
          Intelligent fix suggestions with confidence scores and implementation guidance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!suggestions || suggestions.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              No fix suggestions available for this issue.
            </p>
            <Button
              onClick={generateFixSuggestions}
              className="mt-4 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
              variant="outline"
            >
              <Zap className="h-4 w-4 mr-2" />
              Generate Suggestions
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions?.map((suggestion) => (
              <div key={suggestion.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800/50 shadow-sm">
                <button
                  type="button"
                  onClick={() => toggleSuggestionExpansion(suggestion.id)}
                  className="w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge className={getConfidenceColor(suggestion.confidence)}>
                          {suggestion.confidence}% confidence
                        </Badge>
                        <Badge className={getEffortColor(suggestion.effort)}>
                          {suggestion.effort} effort
                        </Badge>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority:</span>
                          <div className="flex">
                            {renderPriorityStars(suggestion.priority)}
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-base">
                        {suggestion.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {suggestion.description}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {expandedSuggestion === suggestion.id ? (
                        <ChevronDown className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                      )}
                    </div>
                  </div>
                </button>

                {expandedSuggestion === suggestion.id && (
                  <div className="border-t border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/30 p-4">
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-700">
                        <TabsTrigger value="overview" className="text-slate-700 dark:text-slate-300 data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-600 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100">Overview</TabsTrigger>
                        <TabsTrigger value="code" className="text-slate-700 dark:text-slate-300 data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-600 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100">Code Changes</TabsTrigger>
                        <TabsTrigger value="testing" className="text-slate-700 dark:text-slate-300 data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-600 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100">Testing</TabsTrigger>
                        <TabsTrigger value="security" className="text-slate-700 dark:text-slate-300 data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-600 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100">Security</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4 mt-4">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2 text-slate-900 dark:text-slate-100">
                            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            Explanation
                          </h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {suggestion.explanation}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2 text-slate-900 dark:text-slate-100">
                            <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                            Security Benefit
                          </h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {suggestion.securityBenefit}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2 text-slate-900 dark:text-slate-100">
                            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            Risk Assessment
                          </h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {suggestion.riskAssessment}
                          </p>
                        </div>

                        {suggestion.relatedPatterns.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Related Security Patterns</h4>
                            <div className="flex flex-wrap gap-2">
                              {suggestion.relatedPatterns.map((pattern, index) => (
                                <Badge key={index} variant="outline" className="text-xs border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                                  {pattern}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="code" className="space-y-4 mt-4">
                        {suggestion.codeChanges.map((change, index) => (
                          <div key={index} className="space-y-3 border border-slate-200 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-800/30">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                                {change.type.charAt(0).toUpperCase() + change.type.slice(1)} in {change.filename}
                              </h4>
                              <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                                Lines {change.startLine}-{change.endLine}
                              </Badge>
                            </div>

                            {change.originalCode && (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-red-600 dark:text-red-400">Before:</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(change.originalCode, `Original code ${index + 1}`)}
                                    className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                                  >
                                    {copiedCode === `Original code ${index + 1}` ? (
                                      <CheckCircle className="h-4 w-4" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                                <pre className="bg-red-50 dark:bg-red-950/30 p-3 rounded border border-red-200 dark:border-red-800 text-sm overflow-x-auto text-slate-800 dark:text-slate-200">
                                  <code>{change.originalCode}</code>
                                </pre>
                              </div>
                            )}

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-green-600 dark:text-green-400">After:</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyToClipboard(change.suggestedCode, `Suggested code ${index + 1}`)}
                                  className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                                >
                                  {copiedCode === `Suggested code ${index + 1}` ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                              <pre className="bg-green-50 dark:bg-green-950/30 p-3 rounded border border-green-200 dark:border-green-800 text-sm overflow-x-auto text-slate-800 dark:text-slate-200">
                                <code>{change.suggestedCode}</code>
                              </pre>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-700/50 p-2 rounded">
                              {change.reasoning}
                            </p>
                          </div>
                        ))}

                        <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-600">
                          <Button
                            onClick={() => onApplyFix?.(suggestion)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Apply Fix
                          </Button>
                          <Button
                            onClick={() => copyToClipboard(
                              suggestion.codeChanges.map(c => c.suggestedCode).join('\n\n'),
                              'All suggested code'
                            )}
                            variant="outline"
                            size="sm"
                            className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export Changes
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="testing" className="space-y-4 mt-4">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2 text-slate-900 dark:text-slate-100">
                            <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            Testing Recommendations
                          </h4>
                          <ul className="space-y-3">
                            {suggestion.testingRecommendations.map((test, index) => (
                              <li key={index} className="flex items-start gap-3 text-sm bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{test}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="security" className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                            <h4 className="font-semibold mb-3 text-slate-900 dark:text-slate-100">Security Metrics</h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-700 dark:text-slate-300">Confidence:</span>
                                <Badge className={getConfidenceColor(suggestion.confidence)}>
                                  {suggestion.confidence}%
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-700 dark:text-slate-300">Implementation Effort:</span>
                                <Badge className={getEffortColor(suggestion.effort)}>
                                  {suggestion.effort}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-700 dark:text-slate-300">Priority:</span>
                                <div className="flex">
                                  {renderPriorityStars(suggestion.priority)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {suggestion.frameworkSpecific && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                              <h4 className="font-semibold mb-3 text-slate-900 dark:text-slate-100">Framework-Specific</h4>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-700 dark:text-slate-300">Framework:</span>
                                  <Badge variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">{suggestion.frameworkSpecific.framework}</Badge>
                                </div>
                                {suggestion.frameworkSpecific.version && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-slate-700 dark:text-slate-300">Version:</span>
                                    <span className="text-slate-600 dark:text-slate-300 font-mono">
                                      {suggestion.frameworkSpecific.version}
                                    </span>
                                  </div>
                                )}
                                {suggestion.frameworkSpecific.dependencies && (
                                  <div>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Dependencies:</span>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {suggestion.frameworkSpecific.dependencies.map((dep, index) => (
                                        <Badge key={index} variant="outline" className="text-xs border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                                          {dep}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
