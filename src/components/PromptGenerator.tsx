import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Wand2, Shield, Bug, Code, Zap, FileCode, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AnalysisResults } from '@/hooks/useAnalysis';

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: 'security' | 'quality' | 'performance' | 'general';
  icon: React.ReactNode;
  prompt: string;
  tags: string[];
}

interface PromptGeneratorProps {
  analysisResults?: AnalysisResults | null;
}

const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'security-audit',
    title: 'Security Vulnerability Scanner',
    description: 'Find and fix security issues in your code',
    category: 'security',
    icon: <Shield className="w-4 h-4" />,
    tags: ['Security', 'Vulnerabilities', 'Fix'],
    prompt: `You are a security expert. Analyze this code and find security vulnerabilities.

For each security issue you find:
1. Show the exact vulnerable code line
2. Explain why it's dangerous
3. Provide the fixed code
4. Rate severity: Critical/High/Medium/Low

Focus on:
- SQL injection
- XSS attacks
- Authentication bypass
- Data exposure
- Input validation
- Access control

Format your response like this:

**VULNERABILITY FOUND:**
Severity: [Level]
File: [filename:line]
Issue: [brief description]

Vulnerable code:
\`\`\`
[show bad code]
\`\`\`

Why dangerous: [explanation]

Fixed code:
\`\`\`
[show secure code]
\`\`\`

Provide practical fixes I can copy-paste into my code.`
  },
  {
    id: 'code-quality',
    title: 'Code Quality Fixer',
    description: 'Improve code quality and fix bad practices',
    category: 'quality',
    icon: <Code className="w-4 h-4" />,
    tags: ['Quality', 'Clean Code', 'Refactor'],
    prompt: `You are a senior developer. Review this code and fix quality issues.

Find and fix:
- Complex functions (break them down)
- Duplicate code (make it reusable)
- Poor naming (make it clear)
- Missing error handling
- Hard-to-read code
- Performance issues

For each issue:
1. Show the problematic code
2. Explain the problem
3. Provide the improved version

Format like this:

**ISSUE FOUND:**
Problem: [what's wrong]
File: [filename:line]

Bad code:
\`\`\`
[current code]
\`\`\`

Improved code:
\`\`\`
[better version]
\`\`\`

Why better: [explanation]

Give me clean, readable code I can use immediately.`
  },
  {
    id: 'performance-optimizer',
    title: 'Performance Optimizer',
    description: 'Make code faster while keeping it secure',
    category: 'performance',
    icon: <Zap className="w-4 h-4" />,
    tags: ['Performance', 'Speed', 'Optimization'],
    prompt: `You are a performance expert. Make this code faster while keeping it secure.

Find and fix:
- Slow database queries
- Memory leaks
- Inefficient loops
- Blocking operations
- Large data processing
- Unnecessary API calls

For each optimization:
1. Show the slow code
2. Explain why it's slow
3. Provide the faster version
4. Ensure security isn't compromised

Format like this:

**PERFORMANCE ISSUE:**
Problem: [what's slow]
File: [filename:line]

Slow code:
\`\`\`
[current code]
\`\`\`

Faster code:
\`\`\`
[optimized version]
\`\`\`

Speed improvement: [explanation]
Security check: [still secure? yes/no]

Give me production-ready optimized code.`
  },
  {
    id: 'bug-finder',
    title: 'Bug Hunter',
    description: 'Find and fix bugs before they cause problems',
    category: 'quality',
    icon: <Bug className="w-4 h-4" />,
    tags: ['Bugs', 'Errors', 'Debug'],
    prompt: `You are a debugging expert. Find bugs in this code that could cause crashes or errors.

Look for:
- Null pointer exceptions
- Array out of bounds
- Memory leaks
- Race conditions
- Logic errors
- Exception handling issues
- Resource cleanup problems

For each bug:
1. Show the buggy code
2. Explain what could go wrong
3. Provide the fixed version

Format like this:

**BUG FOUND:**
Type: [bug type]
File: [filename:line]
Problem: [what will break]

Buggy code:
\`\`\`
[current code]
\`\`\`

What happens: [error scenario]

Fixed code:
\`\`\`
[corrected version]
\`\`\`

Why fix works: [explanation]

Help me catch bugs before users do.`
  },
  {
    id: 'api-security',
    title: 'API Security Checker',
    description: 'Secure your APIs and endpoints',
    category: 'security',
    icon: <Shield className="w-4 h-4" />,
    tags: ['API', 'Endpoints', 'REST'],
    prompt: `You are an API security expert. Make my API endpoints secure.

Check for:
- Missing authentication
- Weak authorization
- Rate limiting issues
- Input validation gaps
- Data exposure in responses
- CORS misconfigurations
- Insecure HTTP methods

For each API security issue:
1. Show the vulnerable endpoint code
2. Explain the security risk
3. Provide the secure version

Format like this:

**API SECURITY ISSUE:**
Endpoint: [route/path]
Method: [GET/POST/etc.]
Risk: [what attacker can do]
Severity: [Critical/High/Medium/Low]

Vulnerable code:
\`\`\`
[current endpoint code]
\`\`\`

Secure code:
\`\`\`
[protected version]
\`\`\`

Security added: [what protection was added]

Make my APIs bulletproof against attacks.`
  },
  {
    id: 'dependency-checker',
    title: 'Dependency Checker',
    description: 'Find vulnerable packages and outdated dependencies',
    category: 'security',
    icon: <Bug className="w-4 h-4" />,
    tags: ['Dependencies', 'Packages', 'Updates'],
    prompt: `You are a dependency security expert. Check my packages for vulnerabilities.

Analyze:
- package.json / requirements.txt / composer.json
- Outdated versions
- Known security vulnerabilities
- Abandoned packages
- Safer alternatives

For each risky dependency:
1. Show the current version
2. Explain the security risk
3. Recommend the safe version
4. Provide update command

Format like this:

**RISKY DEPENDENCY:**
Package: [package-name]
Current: [current-version]
Risk: [security issue]
Severity: [Critical/High/Medium/Low]

Vulnerability: [what's wrong]

Safe version: [recommended-version]
Update command: [exact command to run]

Alternative: [better package if needed]

Give me exact commands to fix my dependencies safely.`
  }
];

const PromptGenerator: React.FC<PromptGeneratorProps> = ({ analysisResults }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [showAllPrompts, setShowAllPrompts] = useState<boolean>(false);

  // Check if we have valid analysis results from actual code files
  const hasValidAnalysisResults = analysisResults && 
    analysisResults.totalFiles > 0 && 
    analysisResults.issues.length >= 0; // Allow 0 issues (clean code)

  const generateCodebasePrompt = () => {
    // Only generate prompts if we have actual analysis results from uploaded code
    if (!hasValidAnalysisResults) {
      toast({
        title: "No Code Analysis Available",
        description: "Please upload a ZIP file with your code first to generate accurate prompts based on real analysis results.",
        variant: "destructive",
      });
      return;
    }

    const { issues, totalFiles } = analysisResults;
    const criticalIssues = issues.filter(i => i.severity === 'Critical');
    const highIssues = issues.filter(i => i.severity === 'High');
    const mediumIssues = issues.filter(i => i.severity === 'Medium');
    const lowIssues = issues.filter(i => i.severity === 'Low');
    
    const securityIssues = issues.filter(i => i.type?.toLowerCase().includes('security') || i.type?.toLowerCase().includes('vulnerability'));
    const qualityIssues = issues.filter(i => i.type?.toLowerCase().includes('quality') || i.type?.toLowerCase().includes('smell') || i.type?.toLowerCase().includes('maintainability'));
    const bugIssues = issues.filter(i => i.type?.toLowerCase().includes('bug') || i.type?.toLowerCase().includes('error'));
    
    // Get all unique issue types
    const allIssueTypes = [...new Set(issues.map(i => i.type))].filter(Boolean);
    
    // Get all unique files with issues
    const allFiles = [...new Set(issues.map(i => i.filename))];
    
    // Get OWASP categories if available
    const owaspCategories = [...new Set(issues.map(i => i.owaspCategory).filter(Boolean))];
    
    // Get CWE IDs if available
    const cweIds = [...new Set(issues.map(i => i.cweId).filter(Boolean))];
    
    // Build detailed issue breakdown
    let issueBreakdown = '';
    if (criticalIssues.length > 0) {
      issueBreakdown += `\n\nCRITICAL ISSUES (${criticalIssues.length}):\n`;
      criticalIssues.slice(0, 5).forEach(issue => {
        issueBreakdown += `- ${issue.message} (${issue.filename}:${issue.line})\n`;
      });
      if (criticalIssues.length > 5) issueBreakdown += `... and ${criticalIssues.length - 5} more critical issues\n`;
    }
    
    if (highIssues.length > 0) {
      issueBreakdown += `\n\nHIGH SEVERITY ISSUES (${highIssues.length}):\n`;
      highIssues.slice(0, 5).forEach(issue => {
        issueBreakdown += `- ${issue.message} (${issue.filename}:${issue.line})\n`;
      });
      if (highIssues.length > 5) issueBreakdown += `... and ${highIssues.length - 5} more high severity issues\n`;
    }
    
    if (securityIssues.length > 0) {
      issueBreakdown += `\n\nSECURITY VULNERABILITIES (${securityIssues.length}):\n`;
      securityIssues.slice(0, 5).forEach(issue => {
        issueBreakdown += `- ${issue.message} (${issue.filename}:${issue.line})${issue.owaspCategory ? ` [${issue.owaspCategory}]` : ''}${issue.cweId ? ` [CWE-${issue.cweId}]` : ''}\n`;
      });
      if (securityIssues.length > 5) issueBreakdown += `... and ${securityIssues.length - 5} more security issues\n`;
    }
    
    // Generate comprehensive prompt based on actual analysis results
    const customPrompt = generateDetailedAnalysisPrompt(analysisResults);

    setGeneratedPrompt(customPrompt);
  };

  const generateDetailedAnalysisPrompt = (results: AnalysisResults): string => {
    const { issues, totalFiles, summary, metrics, languageDetection } = results;
    const criticalIssues = issues.filter(i => i.severity === 'Critical');
    const highIssues = issues.filter(i => i.severity === 'High');
    const mediumIssues = issues.filter(i => i.severity === 'Medium');
    const lowIssues = issues.filter(i => i.severity === 'Low');
    
    const securityIssues = issues.filter(i => 
      i.type?.toLowerCase().includes('security') || 
      i.category?.toLowerCase().includes('security') ||
      i.type?.toLowerCase().includes('vulnerability')
    );
    const qualityIssues = issues.filter(i => 
      i.type?.toLowerCase().includes('quality') || 
      i.type?.toLowerCase().includes('smell') || 
      i.type?.toLowerCase().includes('maintainability')
    );
    
    // Get all unique issue types and categories
    const allIssueTypes = [...new Set(issues.map(i => i.type))].filter(Boolean);
    const allFiles = [...new Set(issues.map(i => i.filename))];
    const owaspCategories = [...new Set(issues.map(i => i.owaspCategory).filter(Boolean))];
    const cweIds = [...new Set(issues.map(i => i.cweId).filter(Boolean))];
    
    // Build detailed issue breakdown with actual examples
    let issueBreakdown = '';
    
    if (criticalIssues.length > 0) {
      issueBreakdown += `\n\n🚨 CRITICAL SECURITY ISSUES (${criticalIssues.length}) - IMMEDIATE ACTION REQUIRED:\n`;
      criticalIssues.slice(0, 5).forEach((issue, index) => {
        issueBreakdown += `${index + 1}. ${issue.message}\n`;
        issueBreakdown += `   📁 File: ${issue.filename}:${issue.line}\n`;
        issueBreakdown += `   🏷️ Type: ${issue.type}${issue.owaspCategory ? ` [${issue.owaspCategory}]` : ''}\n`;
        issueBreakdown += `   💥 Impact: ${issue.impact}\n`;
        if (issue.codeSnippet) {
          issueBreakdown += `   📝 Code: ${issue.codeSnippet.substring(0, 100)}...\n`;
        }
        issueBreakdown += `\n`;
      });
      if (criticalIssues.length > 5) {
        issueBreakdown += `   ... and ${criticalIssues.length - 5} more critical issues\n`;
      }
    }
    
    if (highIssues.length > 0) {
      issueBreakdown += `\n⚠️ HIGH SEVERITY ISSUES (${highIssues.length}) - HIGH PRIORITY:\n`;
      highIssues.slice(0, 3).forEach((issue, index) => {
        issueBreakdown += `${index + 1}. ${issue.message} (${issue.filename}:${issue.line})\n`;
        if (issue.owaspCategory) issueBreakdown += `   🛡️ OWASP: ${issue.owaspCategory}\n`;
        if (issue.cweId) issueBreakdown += `   🔍 CWE: ${issue.cweId}\n`;
      });
      if (highIssues.length > 3) {
        issueBreakdown += `   ... and ${highIssues.length - 3} more high severity issues\n`;
      }
    }
    
    if (securityIssues.length > 0) {
      issueBreakdown += `\n🔒 SECURITY VULNERABILITIES SUMMARY (${securityIssues.length}):\n`;
      const securityByType = securityIssues.reduce((acc, issue) => {
        const key = issue.category || issue.type;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      Object.entries(securityByType).forEach(([type, count]) => {
        issueBreakdown += `   • ${type}: ${count} issue${count > 1 ? 's' : ''}\n`;
      });
    }
    
    // Generate language-specific context
    const languageContext = languageDetection ? 
      `\nDETECTED LANGUAGES & FRAMEWORKS:\n${Object.entries(languageDetection.languages)
        .map(([lang, confidence]) => `- ${lang}: ${confidence}% confidence`)
        .join('\n')}\n${languageDetection.frameworks.length > 0 ? 
          `\nFRAMEWORKS DETECTED:\n${languageDetection.frameworks.map(f => `- ${f}`).join('\n')}\n` : ''}` : '';
    
    // Build the comprehensive prompt
    return `You are an expert code security and quality analyst. I have performed a comprehensive analysis of my codebase using Code Guardian and need your help to fix the identified issues.

=== 📊 CODEBASE ANALYSIS RESULTS ===
🗂️ Total Files Analyzed: ${totalFiles}
🐛 Total Issues Found: ${issues.length}
📈 Security Score: ${summary.securityScore}/100
📊 Quality Score: ${summary.qualityScore}/100
📏 Lines of Code Analyzed: ${summary.linesAnalyzed.toLocaleString()}
⚡ Analysis Time: ${results.analysisTime}

=== 🎯 ISSUE SEVERITY BREAKDOWN ===
🚨 Critical Issues: ${criticalIssues.length} ${criticalIssues.length > 0 ? '(URGENT - Fix immediately!)' : ''}
⚠️ High Severity: ${highIssues.length}
🟡 Medium Severity: ${mediumIssues.length}
🔵 Low Severity: ${lowIssues.length}

=== 🔍 ISSUE CATEGORIES ===
🛡️ Security Vulnerabilities: ${securityIssues.length}
📝 Code Quality Issues: ${qualityIssues.length}
🏗️ Technical Debt Score: ${metrics.technicalDebt}
🔄 Maintainability Index: ${metrics.maintainabilityIndex}/100
📋 Vulnerability Density: ${metrics.vulnerabilityDensity.toFixed(2)} issues per 1000 lines

=== 📂 AFFECTED FILES ===
${allFiles.length > 0 ? 
  allFiles.slice(0, 8).map((file, i) => {
    const fileIssues = issues.filter(issue => issue.filename === file);
    const criticalCount = fileIssues.filter(i => i.severity === 'Critical').length;
    const highCount = fileIssues.filter(i => i.severity === 'High').length;
    return `${i + 1}. ${file} (${fileIssues.length} issue${fileIssues.length !== 1 ? 's' : ''}${criticalCount > 0 ? ` - ${criticalCount} CRITICAL` : ''}${highCount > 0 ? ` - ${highCount} HIGH` : ''})`;
  }).join('\n') : 'No files with issues'}
${allFiles.length > 8 ? `\n... and ${allFiles.length - 8} more files with issues` : ''}

=== 🏷️ ISSUE TYPES DETECTED ===
${allIssueTypes.length > 0 ? allIssueTypes.map(type => `• ${type}`).join('\n') : 'No specific issue types detected'}

${owaspCategories.length > 0 ? `=== 🛡️ OWASP TOP 10 VIOLATIONS ===\n${owaspCategories.map(cat => `• ${cat}`).join('\n')}\n\n` : ''}${cweIds.length > 0 ? `=== 🔍 CWE WEAKNESSES IDENTIFIED ===\n${cweIds.map(cwe => `• ${cwe}`).join('\n')}\n\n` : ''}${languageContext}

=== 🚨 DETAILED ISSUE BREAKDOWN ===${issueBreakdown}

=== 🎯 YOUR MISSION ===
I need you to help me fix these REAL issues found in my actual codebase. This is not a theoretical exercise - these are genuine problems that need solutions.

📋 FOR EACH ISSUE YOU ADDRESS:
1. 🎯 Reference the EXACT issue from my analysis above
2. 📍 Show the problematic code (use the file and line info provided)
3. ⚠️ Explain why this specific issue is dangerous/problematic
4. ✅ Provide the complete, working fixed code
5. 🔧 Explain how your fix addresses the root cause
6. 🛡️ Describe what security/quality improvement this provides

📝 RESPONSE FORMAT:
**🔧 ISSUE FIXED #[number]**
🚨 Severity: [Critical/High/Medium/Low]
📁 File: [exact filename:line number from analysis]
🏷️ Type: [issue type from analysis]
❌ Problem: [clear description of the specific issue]

**Vulnerable/Problematic Code:**
\`\`\`[language]
[show the exact problematic code from the file]
\`\`\`

**✅ Fixed Code:**
\`\`\`[language]
[show the complete, secure, improved code]
\`\`\`

**🔍 Why This Fix Works:**
[Detailed explanation of how the fix addresses the root cause]

**🛡️ Security/Quality Improvement:**
[What this fix prevents or improves]

**⚡ Implementation Notes:**
[Any additional context, dependencies, or considerations]

---

=== 🎯 PRIORITY ORDER FOR FIXES ===
1. 🚨 **CRITICAL ISSUES FIRST** - These pose immediate security risks
2. ⚠️ **HIGH SEVERITY** - Significant security or functionality risks
3. 🛡️ **SECURITY VULNERABILITIES** - All security issues regardless of severity
4. 📝 **CODE QUALITY** - Maintainability and best practices
5. 🔵 **LOW PRIORITY** - Minor improvements and optimizations

=== ✅ SUCCESS CRITERIA ===
• Provide production-ready, copy-paste code fixes
• Address the ROOT CAUSE, not just symptoms
• Ensure fixes don't introduce new vulnerabilities
• Include proper error handling and validation
• Follow security best practices for the detected languages/frameworks
• Prioritize fixes that will improve my security score the most

🚀 **Ready to transform my codebase from ${summary.securityScore}/100 to a much higher security score!**

Please start with the most critical issues and work your way down. Focus on providing practical, implementable solutions that I can apply immediately to my codebase.`;
  };

  const copyToClipboard = async (text: string, title: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${title} prompt ready to use`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy manually",
        variant: "destructive",
      });
    }
  };



  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'quality': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'performance': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            AI Code Assistant Prompts
          </CardTitle>
          <CardDescription>
            {hasValidAnalysisResults 
              ? 'Generate smart prompts based on your actual code analysis results, or use general templates below' 
              : 'Upload your code first for smart prompts, or use general templates below'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Card className={`bg-gradient-to-r border-2 transition-all duration-300 ${
              hasValidAnalysisResults 
                ? 'from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800 hover:shadow-lg' 
                : 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-300 dark:border-gray-600'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      hasValidAnalysisResults 
                        ? 'bg-blue-100 dark:bg-blue-900' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      <Wand2 className={`w-5 h-5 ${
                        hasValidAnalysisResults 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${
                        hasValidAnalysisResults 
                          ? 'text-blue-900 dark:text-blue-100' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {hasValidAnalysisResults ? 'Smart Prompt Generator' : 'Upload Code First'}
                      </h3>
                      <p className={`text-sm ${
                        hasValidAnalysisResults 
                          ? 'text-blue-700 dark:text-blue-300' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {hasValidAnalysisResults ? 
                          `Generate custom prompt based on your ${analysisResults.issues.length} real code issues from ${analysisResults.totalFiles} files` :
                          'Upload a ZIP file with your code to generate accurate, results-based prompts'
                        }
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={generateCodebasePrompt} 
                    disabled={!hasValidAnalysisResults}
                    className={`${
                      hasValidAnalysisResults 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {hasValidAnalysisResults ? 'Generate Prompt' : 'Need Code Analysis'}
                  </Button>
                </div>
                {!hasValidAnalysisResults && (
                  <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <strong>📁 Upload Required:</strong> To generate accurate, results-based prompts, please upload a ZIP file containing your source code. The prompts will be tailored to your actual code issues and analysis results.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Default Security Scanner */}
          <div className="mb-4">
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow border-red-200 dark:border-red-800 relative"
              onClick={() => setSelectedTemplate(PROMPT_TEMPLATES[0])}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <CardTitle className="text-sm">Security Vulnerability Scanner</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      security
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      template
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-xs">
                  General security analysis template - use Smart Generator for better results
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {['Security', 'Vulnerabilities', 'Fix', 'Template'].map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Collapsible Section for Other Prompts */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowAllPrompts(!showAllPrompts)}
              className="w-full mb-4 flex items-center justify-center gap-2"
            >
              {showAllPrompts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showAllPrompts ? 'Hide Template Prompts' : 'Show Template Prompts'}
              <Badge variant="secondary" className="ml-2">
                {PROMPT_TEMPLATES.length - 1} templates
              </Badge>
            </Button>
            
            {!hasValidAnalysisResults && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>💡 Pro Tip:</strong> These are general template prompts. For much better results, upload your code first and use the Smart Prompt Generator above to get prompts tailored to your specific codebase issues.
                </p>
              </div>
            )}
            
            {showAllPrompts && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROMPT_TEMPLATES.slice(1).map((template) => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {template.icon}
                          <CardTitle className="text-sm">{template.title}</CardTitle>
                        </div>
                        <div className="flex gap-1">
                          <Badge className={getCategoryColor(template.category)}>
                            {template.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            template
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-xs">
                        {template.description} (General template)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1">
                        {[...template.tags, 'Template'].map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>


        </CardContent>
      </Card>

      {generatedPrompt && (
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-green-600" />
                <CardTitle className="text-green-800 dark:text-green-200">Your Custom Prompt</CardTitle>
              </div>
              <Button
                onClick={() => copyToClipboard(generatedPrompt, 'Custom Codebase Prompt')}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Prompt
              </Button>
            </div>
            <CardDescription className="text-green-700 dark:text-green-300">
              {hasValidAnalysisResults ? 
                `🎯 Tailored for your codebase: ${analysisResults.issues.length} real issues from ${analysisResults.totalFiles} files (Security Score: ${analysisResults.summary.securityScore}/100)` :
                'Results-based prompt generated from your code analysis'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4 border border-green-200 dark:border-green-800">
              <pre className="whitespace-pre-wrap text-sm font-mono text-green-900 dark:text-green-100">
                {generatedPrompt}
              </pre>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">🚀 Ready to use with your actual code:</h4>
              <ol className="text-sm space-y-1 text-gray-600 dark:text-gray-300 list-decimal list-inside">
                <li>Copy the detailed prompt above (based on your real analysis results)</li>
                <li>Open Cursor, Windsurf, Claude, or ChatGPT</li>
                <li>Paste the prompt + attach your code files</li>
                <li>Get targeted fixes for your specific ${analysisResults?.issues.length || 0} issues!</li>
                <li>Focus on Critical ({analysisResults?.summary.criticalIssues || 0}) and High ({analysisResults?.summary.highIssues || 0}) severity issues first</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedTemplate.icon}
                <CardTitle>{selectedTemplate.title}</CardTitle>
              </div>
              <Button
                onClick={() => copyToClipboard(selectedTemplate.prompt, selectedTemplate.title)}
                size="sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Prompt
              </Button>
            </div>
            <CardDescription>{selectedTemplate.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {selectedTemplate.prompt}
              </pre>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-4">
              <h4 className="font-semibold text-sm mb-2 text-amber-800 dark:text-amber-200">⚠️ Important Note:</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                This is a general template prompt. For the most accurate and targeted results, use the <strong>Smart Prompt Generator</strong> above after uploading your actual code files. It will create a customized prompt based on your real analysis results.
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">💡 How to use this template:</h4>
              <ol className="text-sm space-y-1 text-gray-600 dark:text-gray-300 list-decimal list-inside">
                <li>Copy the template prompt above</li>
                <li>Open your AI assistant (Cursor, Windsurf, Claude, ChatGPT)</li>
                <li>Paste the prompt</li>
                <li>Add your actual code files or paste your code</li>
                <li>Get general analysis - but consider using the Smart Generator for better results!</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromptGenerator;