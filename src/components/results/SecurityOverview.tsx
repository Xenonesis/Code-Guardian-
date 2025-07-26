import React, { useState } from 'react';
import { Shield, ChevronDown, Code2, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalysisResults } from '@/hooks/useAnalysis';
import { SecuritySummaryCards } from '@/components/security/SecuritySummaryCards';
import { SecurityIssueItem } from '@/components/security/SecurityIssueItem';
import { SecretDetectionCard } from '@/components/security/SecretDetectionCard';
import { SecureCodeSearchCard } from '@/components/security/SecureCodeSearchCard';
import { CodeProvenanceCard } from '@/components/security/CodeProvenanceCard';
import { LanguageDetectionSummary } from '@/components/LanguageDetectionSummary';
import { FixSuggestion } from '@/services/aiFixSuggestionsService';
import { toast } from 'sonner';

interface SecurityOverviewProps {
  results: AnalysisResults;
}

export const SecurityOverview: React.FC<SecurityOverviewProps> = ({ results }) => {
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());

  const toggleIssueExpansion = (issueId: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  const handleApplyFix = (suggestion: FixSuggestion) => {
    // For now, just show a toast with the fix information
    // In a real implementation, this would apply the fix to the actual code
    toast.success(`Fix suggestion "${suggestion.title}" would be applied`, {
      description: `This would apply ${suggestion.codeChanges.length} code changes with ${suggestion.confidence}% confidence.`
    });

    // TODO: Implement actual fix application logic
    console.log('Applying fix suggestion:', suggestion);
  };

  // Extract language and framework information from detection results
  const primaryLanguage = results.languageDetection?.primaryLanguage?.name || 'unknown';
  const primaryFramework = results.languageDetection?.frameworks?.[0]?.name;

  // Separate secret detection issues from other security issues
  const secretIssues = results.issues.filter(issue => issue.category === 'Secret Detection' || issue.type === 'Secret');
  const otherIssues = results.issues.filter(issue => issue.category !== 'Secret Detection' && issue.type !== 'Secret');

  // Prepare files for provenance monitoring
  const filesForProvenance = otherIssues.map(issue => ({
    filename: issue.filename,
    content: issue.codeSnippet || `// File: ${issue.filename}\n// Issue: ${issue.message}`
  }));

  return (
    <div className="space-y-6 px-4 sm:px-0">
      {/* Enhanced Header Section with Language Context */}
      <div className="space-y-4">
        {/* Security Overview Header with Language Context */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl p-6 border border-blue-200/50 dark:border-slate-600/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Security Analysis Overview
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Comprehensive security assessment for {primaryLanguage} project
                  {primaryFramework && ` using ${primaryFramework}`}
                </p>
              </div>
            </div>
            
            {/* Quick Language Info */}
            {results.languageDetection && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-blue-200/30 dark:border-slate-600/30">
                  <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {results.languageDetection.totalFiles} files analyzed
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-blue-200/30 dark:border-slate-600/30">
                  <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {results.languageDetection.analysisTime}ms
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Language Detection Summary - Collapsible */}
        {results.languageDetection && (
          <details className="group">
            <summary className="cursor-pointer list-none">
              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-2">
                  <ChevronDown className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Language & Framework Details
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Click to expand
                </span>
              </div>
            </summary>
            <div className="mt-2">
              <LanguageDetectionSummary
                detectionResult={results.languageDetection}
                className="border-l-4 border-l-blue-500 dark:border-l-blue-400"
              />
            </div>
          </details>
        )}
        
        {/* Security Summary Cards */}
        <SecuritySummaryCards results={results} />
      </div>

      {/* Security Analysis Tools Section */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-slate-700">
          <Shield className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Security Analysis Tools
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Language-aware security scanning for {primaryLanguage}
            {primaryFramework && ` & ${primaryFramework}`}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
          {/* Secret Detection Section */}
          <div className="xl:col-span-2">
            <SecretDetectionCard secretIssues={secretIssues} />
          </div>

          {/* Secure Code Search Section */}
          <SecureCodeSearchCard
            language={primaryLanguage}
            framework={primaryFramework}
            vulnerabilityType={otherIssues.length > 0 ? otherIssues[0].type : undefined}
          />

          {/* Code Provenance & Integrity Monitoring Section */}
          <CodeProvenanceCard
            files={filesForProvenance}
            onInitializeMonitoring={() => {
              toast.success('File integrity monitoring initialized');
            }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                Detailed Security Issues ({otherIssues.length})
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {primaryLanguage}-specific security analysis with OWASP classifications and CVSS scoring
                {primaryFramework && ` • Optimized for ${primaryFramework} framework`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {otherIssues.length > 0 && (
                <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
                  <div>Language-aware analysis</div>
                  <div className="font-medium">{primaryLanguage} patterns detected</div>
                </div>
              )}
              <ChevronDown className="h-5 w-5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="p-6 space-y-4">
          {otherIssues.map((issue) => (
            <SecurityIssueItem
              key={issue.id}
              issue={issue}
              isExpanded={expandedIssues.has(issue.id)}
              onToggle={() => toggleIssueExpansion(issue.id)}
              codeContext={issue.codeSnippet || `// Code context for ${issue.filename}:${issue.line}\n// ${issue.message}`}
              language={primaryLanguage}
              framework={primaryFramework}
              onApplyFix={handleApplyFix}
            />
          ))}
          {otherIssues.length === 0 && (
            <p className="text-slate-400 text-center py-4">
              No other security issues detected.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};