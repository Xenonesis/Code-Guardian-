import { SecurityIssue } from '@/hooks/useAnalysis';
import { AIService } from './aiService';

export interface FixSuggestion {
  id: string;
  issueId: string;
  title: string;
  description: string;
  confidence: number; // 0-100
  effort: 'Low' | 'Medium' | 'High';
  priority: number; // 1-5
  codeChanges: CodeChange[];
  explanation: string;
  securityBenefit: string;
  riskAssessment: string;
  testingRecommendations: string[];
  relatedPatterns: string[];
  frameworkSpecific?: FrameworkSpecificFix;
}

export interface CodeChange {
  type: 'replace' | 'insert' | 'delete' | 'refactor';
  filename: string;
  startLine: number;
  endLine: number;
  originalCode: string;
  suggestedCode: string;
  reasoning: string;
}

export interface FrameworkSpecificFix {
  framework: string;
  version?: string;
  dependencies?: string[];
  configChanges?: ConfigChange[];
}

export interface ConfigChange {
  file: string;
  changes: Record<string, unknown>;
  reasoning: string;
}

export interface AutoRefactorResult {
  success: boolean;
  appliedChanges: CodeChange[];
  warnings: string[];
  errors: string[];
  testSuggestions: string[];
}

export interface FixSuggestionRequest {
  issue: SecurityIssue;
  codeContext: string;
  language: string;
  framework?: string;
  projectStructure?: string[];
}

export class AIFixSuggestionsService {
  private aiService: AIService;
  private fixCache: Map<string, FixSuggestion[]> = new Map();

  constructor() {
    this.aiService = new AIService();
  }

  /**
   * Generate AI-powered fix suggestions for a security issue
   */
  public async generateFixSuggestions(request: FixSuggestionRequest): Promise<FixSuggestion[]> {
    const cacheKey = this.generateCacheKey(request);
    
    // Check cache first
    if (this.fixCache.has(cacheKey)) {
      return this.fixCache.get(cacheKey)!;
    }

    try {
      const suggestions = await this.generateAIFixSuggestions(request);
      
      // Cache the results
      this.fixCache.set(cacheKey, suggestions);
      
      return suggestions;
    } catch (error) {
      console.error('Error generating fix suggestions:', error);
      throw new Error(`Failed to generate fix suggestions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate multiple fix approaches using AI
   */
  private async generateAIFixSuggestions(request: FixSuggestionRequest): Promise<FixSuggestion[]> {
    const { issue, codeContext, language, framework } = request;

    // Always try AI generation first for real, contextual fixes
    try {
      const aiSuggestions = await this.generateContextualAIFixes(request);
      if (aiSuggestions.length > 0) {
        return aiSuggestions;
      }
    } catch (error) {
      console.warn('AI generation failed, trying quick fallback:', error);

      // If the main AI request failed due to timeout, try a quick, simple request
      if (error instanceof Error && error.message.includes('timeout')) {
        try {
          console.log('Attempting quick AI fallback...');
          const quickSuggestions = await this.generateQuickAIFix(request);
          if (quickSuggestions.length > 0) {
            return quickSuggestions;
          }
        } catch (quickError) {
          console.warn('Quick AI fallback also failed:', quickError);
        }
      }
    }

    // Fallback to rule-based suggestions if AI fails
    const realFixSuggestions = this.generateRealFixSuggestions(request);
    if (realFixSuggestions.length > 0) {
      return realFixSuggestions;
    }

    // Final fallback
    return [this.createFallbackSuggestion(request)].map((suggestion, index) => ({
      ...suggestion,
      id: this.generateFixId(request.issue.id, index),
      issueId: request.issue.id
    }));
  }

  /**
   * Generate contextual AI fixes with enhanced prompting for real code generation
   */
  private async generateContextualAIFixes(request: FixSuggestionRequest): Promise<FixSuggestion[]> {
    const { issue, codeContext, language, framework } = request;

    const systemPrompt = {
      role: 'system' as const,
      content: `You are a senior security engineer with expertise in ${language}${framework ? ` and ${framework}` : ''} development. Your task is to analyze real security vulnerabilities and generate production-ready, secure code implementations.

CRITICAL REQUIREMENTS:
1. Generate REAL, WORKING CODE - not pseudo-code or comments
2. Analyze the actual vulnerable code provided in the context
3. Create multiple concrete fix approaches with complete implementations
4. Ensure all code is syntactically correct and follows ${language} best practices
5. Include proper error handling, validation, and security measures
6. Provide framework-specific solutions when applicable

For each fix suggestion, you must provide:
- **Complete Code Implementation**: Full, working code that can be directly used
- **Multiple Approaches**: 2-3 different strategies (quick fix, comprehensive solution, enterprise-grade)
- **Real Security Measures**: Actual security implementations, not just comments
- **Production Readiness**: Include error handling, logging, and edge cases
- **Framework Integration**: Use actual ${framework || language} patterns and libraries

RESPONSE FORMAT: Return a valid JSON array with complete code implementations.`
    };

    const userPrompt = {
      role: 'user' as const,
      content: `Analyze this REAL security vulnerability and generate PRODUCTION-READY secure code:

**VULNERABILITY ANALYSIS:**
- Type: ${issue.type}
- Severity: ${issue.severity} (CVSS: ${issue.cvssScore || 'N/A'})
- Location: ${issue.filename}:${issue.line}
- CWE: ${issue.cweId || 'Not specified'}
- OWASP: ${issue.owaspCategory || 'Not specified'}
- Message: ${issue.message}

**ACTUAL VULNERABLE CODE:**
\`\`\`${language}
${codeContext}
\`\`\`

**ENVIRONMENT CONTEXT:**
- Language: ${language}
- Framework: ${framework || 'None detected'}
- File Type: ${issue.filename.split('.').pop()}
- Project Context: ${this.inferProjectContext(issue.filename, codeContext)}

**REQUIREMENTS:**
Generate 2 CONCISE, WORKING code implementations that:
1. Fix the specific vulnerability shown above
2. Are production-ready with proper error handling
3. Follow ${language}${framework ? ` and ${framework}` : ''} best practices
4. Keep explanations brief and focused

**RESPONSE FORMAT (MUST BE VALID JSON):**
[
  {
    "title": "Brief fix approach name",
    "description": "Concise technical description (max 100 words)",
    "confidence": 90,
    "effort": "Low|Medium|High",
    "priority": 1-5,
    "codeChanges": [
      {
        "type": "replace",
        "filename": "${issue.filename}",
        "startLine": ${issue.line},
        "endLine": ${issue.line},
        "originalCode": "actual vulnerable code from context",
        "suggestedCode": "complete working secure implementation",
        "reasoning": "brief technical explanation"
      }
    ],
    "explanation": "Brief explanation of why this approach works (max 50 words)",
    "securityBenefit": "Specific security improvements (max 30 words)",
    "riskAssessment": "Potential risks (max 30 words)",
    "testingRecommendations": ["brief test case 1", "brief test case 2"],
    "relatedPatterns": ["pattern1", "pattern2"],
    "dependencies": [],
    "configurationChanges": []
  }
]

IMPORTANT: Keep response under 4000 characters. Generate COMPLETE working code - not examples!`
    };

    try {
      const response = await this.generateResponseWithRetry([systemPrompt, userPrompt], 2);

      // Check if response is too short (likely truncated)
      if (response.length < 100) {
        console.warn('AI response appears to be too short, using fallback');
        throw new Error('AI response too short');
      }

      const suggestions = this.parseAIResponse(response, request);

      // Enhance suggestions with additional context
      const enhancedSuggestions = suggestions.map((suggestion, index) => ({
        ...suggestion,
        id: this.generateFixId(request.issue.id, index),
        issueId: request.issue.id,
        // Add metadata about AI generation
        metadata: {
          generatedBy: 'AI',
          language,
          framework,
          vulnerabilityType: issue.type,
          contextLines: codeContext.split('\n').length,
          responseLength: response.length
        }
      }));

      return enhancedSuggestions;
    } catch (error) {
      console.error('Contextual AI fix generation failed:', error);

      // Provide more specific error messages
      let errorMessage = 'AI fix generation failed';
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = 'AI request timed out. Please try again.';
        } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
          errorMessage = 'AI service quota exceeded. Please try again later.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = `AI service error: ${error.message}`;
        }
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Generate a quick AI fix with minimal prompt to avoid timeouts
   */
  private async generateQuickAIFix(request: FixSuggestionRequest): Promise<FixSuggestion[]> {
    const { issue, codeContext, language } = request;

    const quickPrompt = {
      role: 'user' as const,
      content: `Fix this ${issue.severity} ${issue.type} vulnerability in ${language}:

Code: ${codeContext.substring(0, 500)}
Issue: ${issue.message}

Respond with JSON only:
[{"title":"Quick Fix","description":"Brief fix","confidence":80,"effort":"Low","priority":3,"codeChanges":[{"type":"replace","filename":"${issue.filename}","startLine":${issue.line},"endLine":${issue.line},"originalCode":"vulnerable code","suggestedCode":"secure code","reasoning":"security fix"}],"explanation":"Brief explanation","securityBenefit":"Security improvement","riskAssessment":"Low risk","testingRecommendations":["test fix"],"relatedPatterns":[]}]`
    };

    try {
      // Use shorter timeout for quick fix
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Quick AI request timeout after 10 seconds')), 10000);
      });

      const responsePromise = this.aiService.generateResponse([quickPrompt]);
      const response = await Promise.race([responsePromise, timeoutPromise]);

      const suggestions = this.parseAIResponse(response, request);

      return suggestions.map((suggestion, index) => ({
        ...suggestion,
        id: this.generateFixId(request.issue.id, index),
        issueId: request.issue.id,
        metadata: {
          generatedBy: 'Quick AI',
          language,
          vulnerabilityType: issue.type,
          responseLength: response.length
        }
      }));

    } catch (error) {
      console.error('Quick AI fix failed:', error);
      throw error;
    }
  }

  /**
   * Generate AI response with retry logic and progressive timeout
   */
  private async generateResponseWithRetry(
    messages: Array<{ role: string; content: string }>,
    maxRetries: number = 2
  ): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Progressive timeout: start with 15s, then 30s, then 45s
        const timeoutMs = 15000 + (attempt * 15000);
        console.log(`AI request attempt ${attempt + 1}/${maxRetries + 1} with ${timeoutMs/1000}s timeout`);

        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`AI request timeout after ${timeoutMs/1000} seconds`)), timeoutMs);
        });

        const responsePromise = this.aiService.generateResponse(messages);
        const response = await Promise.race([responsePromise, timeoutPromise]);

        console.log(`AI request successful on attempt ${attempt + 1}, response length: ${response.length}`);
        return response;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.warn(`AI request attempt ${attempt + 1} failed:`, lastError.message);

        // Don't retry on certain errors
        if (lastError.message.includes('quota') ||
            lastError.message.includes('rate limit') ||
            lastError.message.includes('authentication') ||
            lastError.message.includes('unauthorized')) {
          console.log('Non-retryable error detected, skipping retries');
          break;
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          const waitTime = Math.min(1000 * Math.pow(2, attempt), 5000); // Max 5s wait
          console.log(`Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    throw lastError || new Error('All retry attempts failed');
  }

  /**
   * Infer project context from filename and code content
   */
  private inferProjectContext(filename: string, codeContext: string): string {
    const contexts: string[] = [];

    // Analyze filename patterns
    if (filename.includes('test') || filename.includes('spec')) {
      contexts.push('Test file');
    }
    if (filename.includes('config') || filename.includes('settings')) {
      contexts.push('Configuration file');
    }
    if (filename.includes('api') || filename.includes('controller')) {
      contexts.push('API endpoint');
    }
    if (filename.includes('model') || filename.includes('entity')) {
      contexts.push('Data model');
    }
    if (filename.includes('service') || filename.includes('util')) {
      contexts.push('Service layer');
    }

    // Analyze code patterns
    const lowerCode = codeContext.toLowerCase();
    if (lowerCode.includes('express') || lowerCode.includes('app.get') || lowerCode.includes('app.post')) {
      contexts.push('Express.js application');
    }
    if (lowerCode.includes('react') || lowerCode.includes('usestate') || lowerCode.includes('jsx')) {
      contexts.push('React component');
    }
    if (lowerCode.includes('django') || lowerCode.includes('models.model')) {
      contexts.push('Django application');
    }
    if (lowerCode.includes('spring') || lowerCode.includes('@restcontroller')) {
      contexts.push('Spring Boot application');
    }
    if (lowerCode.includes('database') || lowerCode.includes('connection') || lowerCode.includes('query')) {
      contexts.push('Database layer');
    }

    return contexts.length > 0 ? contexts.join(', ') : 'General application code';
  }

  /**
   * Parse AI response and validate fix suggestions
   */
  private parseAIResponse(response: string, request: FixSuggestionRequest): Omit<FixSuggestion, 'id' | 'issueId'>[] {
    try {
      // Log the raw response for debugging
      console.log('Raw AI response:', response.substring(0, 200) + '...');
      console.log('Response length:', response.length);

      // Try multiple extraction patterns
      let jsonString = '';

      // Pattern 1: JSON wrapped in markdown code blocks
      const markdownMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      if (markdownMatch) {
        jsonString = markdownMatch[1];
      } else {
        // Pattern 2: Look for array pattern anywhere in the response
        const arrayMatch = response.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          jsonString = arrayMatch[0];
        } else {
          // Pattern 3: Look for object pattern that might be part of an array
          const objectMatch = response.match(/\{[\s\S]*\}/);
          if (objectMatch) {
            // Wrap single object in array
            jsonString = `[${objectMatch[0]}]`;
          } else {
            // No valid JSON found, throw error to trigger fallback
            throw new Error('No valid JSON found in AI response');
          }
        }
      }

      // Clean up the JSON string
      jsonString = jsonString.trim();

      // Validate that we have something that looks like JSON
      if (!jsonString.startsWith('[') && !jsonString.startsWith('{')) {
        throw new Error('Extracted string does not appear to be valid JSON');
      }

      // Try to fix truncated JSON by attempting to repair common issues
      jsonString = this.repairTruncatedJSON(jsonString);

      const suggestions = JSON.parse(jsonString) as unknown[];

      if (!Array.isArray(suggestions)) {
        // If it's a single object, wrap it in an array
        if (typeof suggestions === 'object' && suggestions !== null) {
          return [this.validateAndEnhanceSuggestion(suggestions, request, 0)];
        }
        throw new Error('Response is not an array or object');
      }

      return suggestions.map((suggestion, index) => this.validateAndEnhanceSuggestion(suggestion, request, index));
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Response content:', response.substring(0, 1000) + (response.length > 1000 ? '...[truncated]' : ''));
      // Fallback to basic suggestion
      return [this.createFallbackSuggestion(request)];
    }
  }

  /**
   * Attempt to repair truncated JSON by fixing common issues
   */
  private repairTruncatedJSON(jsonString: string): string {
    try {
      // First, try parsing as-is
      JSON.parse(jsonString);
      return jsonString;
    } catch (error) {
      console.log('Attempting to repair truncated JSON...');

      let repaired = jsonString;

      // If it's an array, ensure it ends with ]
      if (repaired.startsWith('[')) {
        // Count open and close brackets
        const openBrackets = (repaired.match(/\[/g) || []).length;
        const closeBrackets = (repaired.match(/\]/g) || []).length;

        // If we have more open brackets, try to close them
        if (openBrackets > closeBrackets) {
          // Find the last complete object
          const lastCompleteObjectMatch = repaired.match(/.*\}(?=\s*,?\s*$)/s);
          if (lastCompleteObjectMatch) {
            repaired = lastCompleteObjectMatch[0];
            // Remove trailing comma if present
            repaired = repaired.replace(/,\s*$/, '');
            // Close the array
            repaired += ']';
          }
        }
      }

      // If it's an object, ensure it ends with }
      if (repaired.startsWith('{')) {
        const openBraces = (repaired.match(/\{/g) || []).length;
        const closeBraces = (repaired.match(/\}/g) || []).length;

        if (openBraces > closeBraces) {
          // Try to find the last complete property
          const lastCompletePropertyMatch = repaired.match(/.*"[^"]*"\s*:\s*(?:"[^"]*"|[^,\}]*?)(?=\s*,?\s*$)/s);
          if (lastCompletePropertyMatch) {
            repaired = lastCompletePropertyMatch[0];
            // Remove trailing comma if present
            repaired = repaired.replace(/,\s*$/, '');
            // Close the object
            repaired += '}';
          }
        }
      }

      // Try parsing the repaired JSON
      try {
        JSON.parse(repaired);
        console.log('Successfully repaired truncated JSON');
        return repaired;
      } catch (repairError) {
        console.log('Could not repair JSON, using original');
        return jsonString;
      }
    }
  }

  /**
   * Validate and enhance a single fix suggestion
   */
  private validateAndEnhanceSuggestion(
    suggestion: unknown, 
    request: FixSuggestionRequest, 
    index: number
  ): Omit<FixSuggestion, 'id' | 'issueId'> {
    const suggestionObj = suggestion as Record<string, unknown>;
    return {
      title: (suggestionObj.title as string) || `Fix Approach ${index + 1}`,
      description: (suggestionObj.description as string) || 'AI-generated fix suggestion',
      confidence: Math.min(100, Math.max(0, (suggestionObj.confidence as number) || 70)),
      effort: this.validateEffort(suggestionObj.effort),
      priority: Math.min(5, Math.max(1, (suggestionObj.priority as number) || 3)),
      codeChanges: this.validateCodeChanges((suggestionObj.codeChanges as unknown[]) || [], request),
      explanation: (suggestionObj.explanation as string) || 'This fix addresses the security vulnerability by implementing secure coding practices.',
      securityBenefit: (suggestionObj.securityBenefit as string) || 'Improves application security posture.',
      riskAssessment: (suggestionObj.riskAssessment as string) || 'Low risk of breaking changes.',
      testingRecommendations: Array.isArray(suggestionObj.testingRecommendations) 
        ? suggestionObj.testingRecommendations as string[]
        : ['Test the fix thoroughly before deployment'],
      relatedPatterns: Array.isArray(suggestionObj.relatedPatterns) 
        ? suggestionObj.relatedPatterns as string[]
        : [],
      frameworkSpecific: suggestionObj.frameworkSpecific as FrameworkSpecificFix | undefined
    };
  }

  /**
   * Validate effort level
   */
  private validateEffort(effort: unknown): 'Low' | 'Medium' | 'High' {
    const validEfforts = ['Low', 'Medium', 'High'];
    return validEfforts.includes(effort as string) ? (effort as 'Low' | 'Medium' | 'High') : 'Medium';
  }

  /**
   * Validate and enhance code changes
   */
  private validateCodeChanges(changes: unknown[], request: FixSuggestionRequest): CodeChange[] {
    if (!Array.isArray(changes)) {
      return [];
    }

    return changes.map(change => {
      const changeObj = change as Record<string, unknown>;
      return {
        type: this.validateChangeType(changeObj.type),
        filename: (changeObj.filename as string) || request.issue.filename,
        startLine: Math.max(1, (changeObj.startLine as number) || request.issue.line),
        endLine: Math.max((changeObj.startLine as number) || request.issue.line, (changeObj.endLine as number) || request.issue.line),
        originalCode: (changeObj.originalCode as string) || '',
        suggestedCode: (changeObj.suggestedCode as string) || '',
        reasoning: (changeObj.reasoning as string) || 'Security improvement'
      };
    });
  }

  /**
   * Validate change type
   */
  private validateChangeType(type: unknown): 'replace' | 'insert' | 'delete' | 'refactor' {
    const validTypes = ['replace', 'insert', 'delete', 'refactor'];
    return validTypes.includes(type as string) ? (type as 'replace' | 'insert' | 'delete' | 'refactor') : 'replace';
  }

  /**
   * Generate cache key for fix suggestions
   */
  private generateCacheKey(request: FixSuggestionRequest): string {
    const { issue, language, framework } = request;
    return `${issue.id}-${issue.type}-${language}-${framework || 'none'}-${issue.line}`;
  }

  /**
   * Generate unique fix ID
   */
  private generateFixId(issueId: string, index: number): string {
    return `fix-${issueId}-${index}-${Date.now()}`;
  }

  /**
   * Clear fix suggestions cache
   */
  public clearCache(): void {
    this.fixCache.clear();
  }

  /**
   * Get cached suggestions count
   */
  public getCacheSize(): number {
    return this.fixCache.size;
  }

  /**
   * Generate real fix suggestions based on vulnerability type and context
   */
  private generateRealFixSuggestions(request: FixSuggestionRequest): FixSuggestion[] {
    const { issue, codeContext, language, framework } = request;
    const suggestions: Omit<FixSuggestion, 'id' | 'issueId'>[] = [];

    // Handle different vulnerability types with real fixes
    switch (issue.type.toLowerCase()) {
      case 'secret':
      case 'jwt_token':
        suggestions.push(...this.generateSecretFixSuggestions(issue, codeContext, language));
        break;
      case 'sql injection':
      case 'sql_injection':
        suggestions.push(...this.generateSQLInjectionFixes(issue, codeContext, language, framework));
        break;
      case 'xss':
      case 'cross-site scripting':
        suggestions.push(...this.generateXSSFixes(issue, codeContext, language, framework));
        break;
      case 'path traversal':
      case 'directory traversal':
        suggestions.push(...this.generatePathTraversalFixes(issue, codeContext, language));
        break;
      case 'insecure randomness':
        suggestions.push(...this.generateInsecureRandomnessFixes(issue, codeContext, language));
        break;
      case 'hardcoded credentials':
      case 'hardcoded password':
        suggestions.push(...this.generateHardcodedCredentialsFixes(issue, codeContext, language));
        break;
      default:
        // Return empty array to fall back to AI generation
        return [];
    }

    return suggestions.map((suggestion, index) => ({
      ...suggestion,
      id: this.generateFixId(issue.id, index),
      issueId: issue.id
    }));
  }

  /**
   * Generate fix suggestions for secret/JWT token vulnerabilities
   */
  private generateSecretFixSuggestions(issue: SecurityIssue, codeContext: string, language: string): Omit<FixSuggestion, 'id' | 'issueId'>[] {
    const suggestions: Omit<FixSuggestion, 'id' | 'issueId'>[] = [];

    // Extract the vulnerable line and analyze the secret type
    const lines = codeContext.split('\n');
    const vulnerableLine = lines.find(line =>
      line.includes('eyJ') || line.includes('AKIA') || line.includes('ghp_') ||
      line.includes('sk-') || line.includes('password') || line.includes('secret')
    ) || lines[0];

    const secretType = this.detectSecretType(vulnerableLine, issue.type);
    const variableName = this.extractVariableName(vulnerableLine) || this.generateVariableName(secretType);

    // Suggestion 1: Environment Variables with Validation
    suggestions.push({
      title: 'Secure Environment Variable Implementation',
      description: 'Replace hardcoded secret with validated environment variable access including proper error handling',
      confidence: 95,
      effort: 'Low',
      priority: 5,
      codeChanges: [{
        type: 'replace',
        filename: issue.filename,
        startLine: issue.line,
        endLine: issue.line,
        originalCode: vulnerableLine.trim(),
        suggestedCode: this.generateSecureEnvironmentVariableCode(variableName, language, secretType),
        reasoning: 'Replace hardcoded secret with secure environment variable access with validation'
      }],
      explanation: 'Environment variables with validation ensure secrets are properly configured and provide clear error messages when missing.',
      securityBenefit: 'Prevents secret exposure in version control, enables secure secret management, and provides runtime validation.',
      riskAssessment: 'Very low risk - maintains functionality while significantly improving security posture.',
      testingRecommendations: [
        'Test application startup with missing environment variable',
        'Verify environment variable is set in all deployment environments',
        'Test secret rotation without code changes',
        'Validate error handling when secret is empty or invalid'
      ],
      relatedPatterns: ['Environment Variables', 'Secret Management', 'Configuration Management', 'Fail-Fast Pattern']
    });

    // Suggestion 2: Enterprise Secret Management Service
    suggestions.push({
      title: 'Enterprise Secret Management Integration',
      description: 'Integrate with enterprise-grade secret management service with automatic rotation and audit trails',
      confidence: 90,
      effort: 'Medium',
      priority: 4,
      codeChanges: [{
        type: 'replace',
        filename: issue.filename,
        startLine: issue.line,
        endLine: issue.line,
        originalCode: vulnerableLine.trim(),
        suggestedCode: this.generateEnterpriseSecretManagerCode(variableName, language, secretType),
        reasoning: 'Replace hardcoded secret with enterprise secret manager integration including caching and error handling'
      }],
      explanation: 'Enterprise secret management services provide encryption at rest and in transit, automatic rotation, audit trails, and fine-grained access controls.',
      securityBenefit: 'Enterprise-grade secret security with automatic rotation, access controls, audit trails, and compliance features.',
      riskAssessment: 'Medium risk - requires infrastructure setup and dependency management but provides superior security and compliance.',
      testingRecommendations: [
        'Test secret retrieval with proper authentication and authorization',
        'Verify fallback behavior when secret service is unavailable',
        'Test secret rotation scenarios and cache invalidation',
        'Validate audit logging and access controls',
        'Test performance impact of secret retrieval'
      ],
      relatedPatterns: ['Secret Management', 'Cloud Security', 'Zero Trust Architecture', 'Circuit Breaker Pattern']
    });

    // Suggestion 3: Secure Configuration with Runtime Validation
    suggestions.push({
      title: 'Secure Configuration with Runtime Validation',
      description: 'Implement comprehensive secret management with validation, encryption, and secure defaults',
      confidence: 85,
      effort: 'High',
      priority: 3,
      codeChanges: [{
        type: 'replace',
        filename: issue.filename,
        startLine: issue.line,
        endLine: issue.line,
        originalCode: vulnerableLine.trim(),
        suggestedCode: this.generateSecureConfigurationCode(variableName, language, secretType),
        reasoning: 'Implement comprehensive secure configuration management with validation and encryption'
      }],
      explanation: 'Comprehensive secure configuration includes input validation, encryption, secure defaults, and runtime checks.',
      securityBenefit: 'Multi-layered security with validation, encryption, secure defaults, and comprehensive error handling.',
      riskAssessment: 'Low risk - comprehensive approach that improves overall application security architecture.',
      testingRecommendations: [
        'Test all validation scenarios including edge cases',
        'Verify encryption and decryption functionality',
        'Test secure defaults and fallback mechanisms',
        'Validate error handling and logging',
        'Performance test configuration loading'
      ],
      relatedPatterns: ['Secure Configuration', 'Defense in Depth', 'Input Validation', 'Encryption at Rest']
    });

    return suggestions;
  }

  /**
   * Generate fix suggestions for SQL injection vulnerabilities
   */
  private generateSQLInjectionFixes(issue: SecurityIssue, codeContext: string, language: string, framework?: string): Omit<FixSuggestion, 'id' | 'issueId'>[] {
    const suggestions: Omit<FixSuggestion, 'id' | 'issueId'>[] = [];
    const lines = codeContext.split('\n');
    const vulnerableLine = lines.find(line => line.includes('query') || line.includes('SELECT') || line.includes('INSERT')) || lines[0];

    // Suggestion 1: Parameterized Queries
    suggestions.push({
      title: 'Use Parameterized Queries',
      description: 'Replace string concatenation with parameterized queries to prevent SQL injection',
      confidence: 98,
      effort: 'Low',
      priority: 5,
      codeChanges: [{
        type: 'replace',
        filename: issue.filename,
        startLine: issue.line,
        endLine: issue.line,
        originalCode: vulnerableLine.trim(),
        suggestedCode: this.generateParameterizedQueryCode(vulnerableLine, language, framework),
        reasoning: 'Use parameterized queries to safely handle user input in SQL statements'
      }],
      explanation: 'Parameterized queries separate SQL code from data, preventing injection attacks.',
      securityBenefit: 'Completely eliminates SQL injection risk by treating user input as data, not code.',
      riskAssessment: 'Very low risk - standard security practice with no functional impact.',
      testingRecommendations: [
        'Test with various input including SQL injection payloads',
        'Verify query performance is maintained',
        'Test edge cases like null values and special characters'
      ],
      relatedPatterns: ['Parameterized Queries', 'Input Validation', 'Database Security']
    });

    // Suggestion 2: ORM Usage
    if (framework) {
      suggestions.push({
        title: 'Use ORM Query Builder',
        description: 'Leverage ORM query builder methods that automatically handle parameterization',
        confidence: 95,
        effort: 'Medium',
        priority: 4,
        codeChanges: [{
          type: 'replace',
          filename: issue.filename,
          startLine: issue.line,
          endLine: issue.line,
          originalCode: vulnerableLine.trim(),
          suggestedCode: this.generateORMQueryCode(vulnerableLine, language, framework),
          reasoning: 'Use ORM query builder for automatic SQL injection protection'
        }],
        explanation: 'ORM query builders provide a safe abstraction layer over raw SQL queries.',
        securityBenefit: 'Built-in protection against SQL injection with improved code maintainability.',
        riskAssessment: 'Low risk - may require minor refactoring but improves overall code quality.',
        testingRecommendations: [
          'Test query functionality with ORM methods',
          'Verify performance meets requirements',
          'Test complex query scenarios'
        ],
        relatedPatterns: ['ORM Security', 'Query Builder', 'Database Abstraction']
      });
    }

    return suggestions;
  }

  /**
   * Create fallback suggestion when AI parsing fails
   */
  private createFallbackSuggestion(request: FixSuggestionRequest): Omit<FixSuggestion, 'id' | 'issueId'> {
    const { issue, codeContext } = request;

    // Try to provide a more specific fallback based on the issue type
    let title = 'Security Fix Required';
    let description = `Address ${issue.severity} severity ${issue.type} vulnerability`;
    let suggestedCode = 'Please review and apply appropriate security measures';
    let reasoning = 'Manual review required for this security issue';

    // Provide specific guidance based on common vulnerability types
    if (issue.rule?.includes('sql-injection') || issue.message?.toLowerCase().includes('sql')) {
      title = 'SQL Injection Fix';
      description = 'Use parameterized queries to prevent SQL injection';
      suggestedCode = '// Use parameterized queries or prepared statements\n// Example: db.query("SELECT * FROM users WHERE id = ?", [userId])';
      reasoning = 'Parameterized queries prevent SQL injection by separating SQL code from data';
    } else if (issue.rule?.includes('xss') || issue.message?.toLowerCase().includes('xss')) {
      title = 'XSS Prevention Fix';
      description = 'Sanitize and escape user input to prevent XSS attacks';
      suggestedCode = '// Sanitize user input and use proper encoding\n// Example: escapeHtml(userInput) or use framework-specific sanitization';
      reasoning = 'Input sanitization and output encoding prevent XSS vulnerabilities';
    } else if (issue.rule?.includes('hardcoded') || issue.message?.toLowerCase().includes('secret')) {
      title = 'Secret Management Fix';
      description = 'Move hardcoded secrets to environment variables';
      suggestedCode = '// Use environment variables\n// Example: process.env.SECRET_KEY or config.getSecret()';
      reasoning = 'Environment variables keep secrets out of source code';
    } else if (issue.rule?.includes('random') || issue.message?.toLowerCase().includes('random')) {
      title = 'Secure Random Fix';
      description = 'Use cryptographically secure random number generation';
      suggestedCode = '// Use crypto.getRandomValues() instead of Math.random()\n// Example: crypto.getRandomValues(new Uint32Array(1))[0]';
      reasoning = 'Cryptographically secure random numbers prevent prediction attacks';
    }

    return {
      title,
      description,
      confidence: 70,
      effort: 'Medium',
      priority: issue.severity === 'Critical' ? 5 : issue.severity === 'High' ? 4 : 3,
      codeChanges: [{
        type: 'replace',
        filename: issue.filename,
        startLine: issue.line,
        endLine: issue.line,
        originalCode: codeContext.split('\n')[0] || 'Vulnerable code',
        suggestedCode,
        reasoning
      }],
      explanation: `This ${issue.severity.toLowerCase()} severity vulnerability requires manual review and implementation of appropriate security measures.`,
      securityBenefit: `Addresses ${issue.type} vulnerability and improves overall security posture.`,
      riskAssessment: 'Manual review recommended. Test thoroughly before deployment.',
      testingRecommendations: [
        'Verify the fix addresses the specific vulnerability',
        'Test functionality is not broken',
        'Run security scans to confirm fix effectiveness'
      ],
      relatedPatterns: ['Secure Coding Practices', 'Input Validation', 'Output Encoding']
    };
  }

  /**
   * Detect the type of secret from the vulnerable line and issue type
   */
  private detectSecretType(vulnerableLine: string, issueType: string): string {
    const line = vulnerableLine.toLowerCase();
    const type = issueType.toLowerCase();

    if (line.includes('eyj') || type.includes('jwt')) return 'jwt';
    if (line.includes('akia') || line.includes('aws')) return 'aws_key';
    if (line.includes('ghp_') || line.includes('github')) return 'github_token';
    if (line.includes('sk-') || line.includes('openai')) return 'api_key';
    if (line.includes('password') || line.includes('pwd')) return 'password';
    if (line.includes('database') || line.includes('db')) return 'db_credential';
    if (line.includes('secret') || line.includes('token')) return 'secret_token';

    return 'generic_secret';
  }

  /**
   * Generate appropriate variable name based on secret type
   */
  private generateVariableName(secretType: string): string {
    switch (secretType) {
      case 'jwt': return 'JWT_SECRET';
      case 'aws_key': return 'AWS_ACCESS_KEY';
      case 'github_token': return 'GITHUB_TOKEN';
      case 'api_key': return 'API_KEY';
      case 'password': return 'DB_PASSWORD';
      case 'db_credential': return 'DATABASE_URL';
      case 'secret_token': return 'SECRET_TOKEN';
      default: return 'SECRET_VALUE';
    }
  }

  /**
   * Generate secure environment variable code with validation
   */
  private generateSecureEnvironmentVariableCode(variableName: string, language: string, secretType: string): string {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return `// Secure environment variable access with validation
const ${variableName.toLowerCase()} = (() => {
  const value = process.env.${variableName.toUpperCase()};
  if (!value || value.trim() === '') {
    throw new Error('${variableName.toUpperCase()} environment variable is required but not set');
  }
  ${this.getValidationCode(secretType, 'javascript')}
  return value;
})();

// Usage example:
// export ${variableName.toUpperCase()}="your-secure-${secretType.replace('_', '-')}-here"`;

      case 'python':
        return `# Secure environment variable access with validation
import os
import sys

def get_${variableName.toLowerCase()}():
    value = os.getenv('${variableName.toUpperCase()}')
    if not value or not value.strip():
        raise ValueError('${variableName.toUpperCase()} environment variable is required but not set')
    ${this.getValidationCode(secretType, 'python')}
    return value

${variableName.toLowerCase()} = get_${variableName.toLowerCase()}()

# Usage: export ${variableName.toUpperCase()}="your-secure-${secretType.replace('_', '-')}-here"`;

      case 'java':
        return `// Secure environment variable access with validation
public class SecureConfig {
    private static final String ${variableName.toUpperCase()};

    static {
        String value = System.getenv("${variableName.toUpperCase()}");
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalStateException("${variableName.toUpperCase()} environment variable is required but not set");
        }
        ${this.getValidationCode(secretType, 'java')}
        ${variableName.toUpperCase()} = value;
    }

    public static String get${variableName.charAt(0).toUpperCase() + variableName.slice(1).toLowerCase()}() {
        return ${variableName.toUpperCase()};
    }
}

// Usage: export ${variableName.toUpperCase()}="your-secure-${secretType.replace('_', '-')}-here"`;

      default:
        return `// Secure environment variable access with validation
const ${variableName.toLowerCase()} = process.env.${variableName.toUpperCase()};
if (!${variableName.toLowerCase()}) {
  throw new Error('${variableName.toUpperCase()} environment variable is required');
}

// Usage: export ${variableName.toUpperCase()}="your-secure-${secretType.replace('_', '-')}-here"`;
    }
  }

  /**
   * Get validation code based on secret type and language
   */
  private getValidationCode(secretType: string, language: string): string {
    switch (secretType) {
      case 'jwt':
        return language === 'javascript'
          ? `if (value.length < 32) throw new Error('JWT secret must be at least 32 characters long');`
          : language === 'python'
          ? `if len(value) < 32: raise ValueError('JWT secret must be at least 32 characters long')`
          : `if (value.length() < 32) throw new IllegalArgumentException("JWT secret must be at least 32 characters long");`;

      case 'aws_key':
        return language === 'javascript'
          ? `if (!value.startsWith('AKIA')) throw new Error('Invalid AWS access key format');`
          : language === 'python'
          ? `if not value.startswith('AKIA'): raise ValueError('Invalid AWS access key format')`
          : `if (!value.startsWith("AKIA")) throw new IllegalArgumentException("Invalid AWS access key format");`;

      case 'api_key':
        return language === 'javascript'
          ? `if (value.length < 16) throw new Error('API key must be at least 16 characters long');`
          : language === 'python'
          ? `if len(value) < 16: raise ValueError('API key must be at least 16 characters long')`
          : `if (value.length() < 16) throw new IllegalArgumentException("API key must be at least 16 characters long");`;

      default:
        return language === 'javascript'
          ? `if (value.length < 8) throw new Error('Secret must be at least 8 characters long');`
          : language === 'python'
          ? `if len(value) < 8: raise ValueError('Secret must be at least 8 characters long')`
          : `if (value.length() < 8) throw new IllegalArgumentException("Secret must be at least 8 characters long");`;
    }
  }

  /**
   * Generate enterprise secret manager integration code
   */
  private generateEnterpriseSecretManagerCode(variableName: string, language: string, secretType: string): string {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return `// Enterprise secret manager integration with caching and error handling
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
// or import AWS from 'aws-sdk'; for AWS Secrets Manager
// or import vault from 'node-vault'; for HashiCorp Vault

class SecureSecretManager {
  private cache = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async getSecret(secretName: string): Promise<string> {
    const cached = this.cache.get(secretName);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.value;
    }

    try {
      // Google Cloud Secret Manager example
      const client = new SecretManagerServiceClient();
      const [version] = await client.accessSecretVersion({
        name: \`projects/\${process.env.PROJECT_ID}/secrets/\${secretName}/versions/latest\`,
      });

      const secret = version.payload?.data?.toString();
      if (!secret) throw new Error(\`Secret \${secretName} not found\`);

      this.cache.set(secretName, { value: secret, timestamp: Date.now() });
      return secret;
    } catch (error) {
      console.error(\`Failed to retrieve secret \${secretName}:\`, error);
      throw new Error(\`Secret retrieval failed: \${error.message}\`);
    }
  }
}

const secretManager = new SecureSecretManager();
const ${variableName.toLowerCase()} = await secretManager.getSecret('${variableName.toLowerCase().replace('_', '-')}');

// Required environment variables:
// export PROJECT_ID="your-gcp-project-id"
// or configure AWS credentials for AWS Secrets Manager
// or set VAULT_ADDR and VAULT_TOKEN for HashiCorp Vault`;

      case 'python':
        return `# Enterprise secret manager integration with caching and error handling
import os
import time
import logging
from google.cloud import secretmanager
# or import boto3 for AWS Secrets Manager
# or import hvac for HashiCorp Vault

class SecureSecretManager:
    def __init__(self):
        self.cache = {}
        self.cache_timeout = 300  # 5 minutes
        self.client = secretmanager.SecretManagerServiceClient()

    def get_secret(self, secret_name: str) -> str:
        cached = self.cache.get(secret_name)
        if cached and time.time() - cached['timestamp'] < self.cache_timeout:
            return cached['value']

        try:
            project_id = os.getenv('PROJECT_ID')
            if not project_id:
                raise ValueError('PROJECT_ID environment variable required')

            name = f"projects/{project_id}/secrets/{secret_name}/versions/latest"
            response = self.client.access_secret_version(request={"name": name})
            secret = response.payload.data.decode("UTF-8")

            self.cache[secret_name] = {
                'value': secret,
                'timestamp': time.time()
            }
            return secret
        except Exception as error:
            logging.error(f"Failed to retrieve secret {secret_name}: {error}")
            raise ValueError(f"Secret retrieval failed: {error}")

secret_manager = SecureSecretManager()
${variableName.toLowerCase()} = secret_manager.get_secret('${variableName.toLowerCase().replace('_', '-')}')

# Required environment variables:
# export PROJECT_ID="your-gcp-project-id"
# export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account.json"`;

      case 'java':
        return `// Enterprise secret manager integration with caching and error handling
import com.google.cloud.secretmanager.v1.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

public class SecureSecretManager {
    private final SecretManagerServiceClient client;
    private final ConcurrentHashMap<String, CachedSecret> cache = new ConcurrentHashMap<>();
    private final long cacheTimeoutMs = TimeUnit.MINUTES.toMillis(5);

    public SecureSecretManager() throws Exception {
        this.client = SecretManagerServiceClient.create();
    }

    public String getSecret(String secretName) throws Exception {
        CachedSecret cached = cache.get(secretName);
        if (cached != null && System.currentTimeMillis() - cached.timestamp < cacheTimeoutMs) {
            return cached.value;
        }

        try {
            String projectId = System.getenv("PROJECT_ID");
            if (projectId == null) {
                throw new IllegalStateException("PROJECT_ID environment variable required");
            }

            SecretVersionName secretVersionName = SecretVersionName.of(projectId, secretName, "latest");
            AccessSecretVersionResponse response = client.accessSecretVersion(secretVersionName);
            String secret = response.getPayload().getData().toStringUtf8();

            cache.put(secretName, new CachedSecret(secret, System.currentTimeMillis()));
            return secret;
        } catch (Exception error) {
            throw new RuntimeException("Secret retrieval failed: " + error.getMessage(), error);
        }
    }

    private static class CachedSecret {
        final String value;
        final long timestamp;

        CachedSecret(String value, long timestamp) {
            this.value = value;
            this.timestamp = timestamp;
        }
    }
}

SecureSecretManager secretManager = new SecureSecretManager();
String ${variableName.toLowerCase()} = secretManager.getSecret("${variableName.toLowerCase().replace('_', '-')}");

// Required environment variables:
// export PROJECT_ID="your-gcp-project-id"
// export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account.json"`;

      default:
        return `// Enterprise secret manager integration
const secretManager = new SecretManager();
const ${variableName.toLowerCase()} = await secretManager.getSecret('${variableName.toLowerCase()}');`;
    }
  }

  /**
   * Generate secure configuration code with comprehensive validation
   */
  private generateSecureConfigurationCode(variableName: string, language: string, secretType: string): string {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return `// Comprehensive secure configuration management
import crypto from 'crypto';
import fs from 'fs';

class SecureConfiguration {
  private secrets = new Map<string, string>();
  private encryptionKey: Buffer;

  constructor() {
    this.encryptionKey = this.getOrCreateEncryptionKey();
    this.loadConfiguration();
  }

  private getOrCreateEncryptionKey(): Buffer {
    const keyPath = process.env.ENCRYPTION_KEY_PATH || './.encryption-key';
    try {
      return fs.readFileSync(keyPath);
    } catch {
      const key = crypto.randomBytes(32);
      fs.writeFileSync(keyPath, key, { mode: 0o600 });
      return key;
    }
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  private loadConfiguration(): void {
    const value = process.env.${variableName.toUpperCase()};
    if (!value) {
      throw new Error('${variableName.toUpperCase()} environment variable is required');
    }

    ${this.getValidationCode(secretType, 'javascript')}

    // Store encrypted in memory
    this.secrets.set('${variableName.toLowerCase()}', this.encrypt(value));
  }

  public getSecret(name: string): string {
    const encrypted = this.secrets.get(name);
    if (!encrypted) {
      throw new Error(\`Secret \${name} not found\`);
    }
    return this.decrypt(encrypted);
  }
}

const config = new SecureConfiguration();
const ${variableName.toLowerCase()} = config.getSecret('${variableName.toLowerCase()}');

// Usage: export ${variableName.toUpperCase()}="your-secure-${secretType.replace('_', '-')}-here"`;

      case 'python':
        return `# Comprehensive secure configuration management
import os
import base64
import logging
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

class SecureConfiguration:
    def __init__(self):
        self.encryption_key = self._get_or_create_encryption_key()
        self.fernet = Fernet(self.encryption_key)
        self.secrets = {}
        self._load_configuration()

    def _get_or_create_encryption_key(self) -> bytes:
        key_path = os.getenv('ENCRYPTION_KEY_PATH', './.encryption-key')
        try:
            with open(key_path, 'rb') as f:
                return f.read()
        except FileNotFoundError:
            password = os.urandom(32)
            salt = os.urandom(16)
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=100000,
            )
            key = base64.urlsafe_b64encode(kdf.derive(password))

            with open(key_path, 'wb') as f:
                f.write(key)
            os.chmod(key_path, 0o600)
            return key

    def _encrypt(self, text: str) -> bytes:
        return self.fernet.encrypt(text.encode())

    def _decrypt(self, encrypted_data: bytes) -> str:
        return self.fernet.decrypt(encrypted_data).decode()

    def _load_configuration(self):
        value = os.getenv('${variableName.toUpperCase()}')
        if not value:
            raise ValueError('${variableName.toUpperCase()} environment variable is required')

        ${this.getValidationCode(secretType, 'python')}

        # Store encrypted in memory
        self.secrets['${variableName.toLowerCase()}'] = self._encrypt(value)

    def get_secret(self, name: str) -> str:
        encrypted = self.secrets.get(name)
        if not encrypted:
            raise ValueError(f'Secret {name} not found')
        return self._decrypt(encrypted)

config = SecureConfiguration()
${variableName.toLowerCase()} = config.get_secret('${variableName.toLowerCase()}')

# Usage: export ${variableName.toUpperCase()}="your-secure-${secretType.replace('_', '-')}-here"`;

      default:
        return `// Secure configuration with validation
const ${variableName.toLowerCase()} = (() => {
  const value = process.env.${variableName.toUpperCase()};
  if (!value) throw new Error('${variableName.toUpperCase()} required');
  return value;
})();`;
    }
  }

  /**
   * Generate parameterized query code
   */
  private generateParameterizedQueryCode(originalLine: string, language: string, framework?: string): string {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        if (framework?.toLowerCase().includes('node')) {
          return 'const result = await db.query("SELECT * FROM users WHERE id = ?", [userId]);';
        }
        return 'const result = await query("SELECT * FROM users WHERE id = $1", [userId]);';
      case 'python':
        return 'cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))';
      case 'java':
        return 'PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE id = ?");\nstmt.setInt(1, userId);';
      case 'csharp':
        return 'var result = await connection.QueryAsync("SELECT * FROM users WHERE id = @userId", new { userId });';
      case 'php':
        return '$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");\n$stmt->execute([$userId]);';
      default:
        return '// Use parameterized queries to prevent SQL injection';
    }
  }

  /**
   * Generate ORM query code
   */
  private generateORMQueryCode(originalLine: string, language: string, framework?: string): string {
    switch (framework?.toLowerCase()) {
      case 'sequelize':
        return 'const user = await User.findByPk(userId);';
      case 'typeorm':
        return 'const user = await userRepository.findOne({ where: { id: userId } });';
      case 'prisma':
        return 'const user = await prisma.user.findUnique({ where: { id: userId } });';
      case 'django':
        return 'user = User.objects.get(id=user_id)';
      case 'sqlalchemy':
        return 'user = session.query(User).filter(User.id == user_id).first()';
      case 'hibernate':
        return 'User user = session.get(User.class, userId);';
      case 'entity framework':
        return 'var user = await context.Users.FindAsync(userId);';
      default:
        return '// Use ORM query methods instead of raw SQL';
    }
  }

  /**
   * Extract variable name from code line
   */
  private extractVariableName(line: string): string | null {
    // Try to extract variable name from various patterns
    const patterns = [
      /const\s+(\w+)/,
      /let\s+(\w+)/,
      /var\s+(\w+)/,
      /(\w+)\s*=/,
      /(\w+)\s*:/
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Generate XSS fix suggestions
   */
  private generateXSSFixes(issue: SecurityIssue, codeContext: string, language: string, framework?: string): Omit<FixSuggestion, 'id' | 'issueId'>[] {
    const suggestions: Omit<FixSuggestion, 'id' | 'issueId'>[] = [];
    const lines = codeContext.split('\n');
    const vulnerableLine = lines.find(line => line.includes('innerHTML') || line.includes('html') || line.includes('render')) || lines[0];

    suggestions.push({
      title: 'Use Safe HTML Rendering',
      description: 'Replace dangerous HTML injection with safe rendering methods',
      confidence: 95,
      effort: 'Low',
      priority: 5,
      codeChanges: [{
        type: 'replace',
        filename: issue.filename,
        startLine: issue.line,
        endLine: issue.line,
        originalCode: vulnerableLine.trim(),
        suggestedCode: this.generateSafeHTMLCode(vulnerableLine, language, framework),
        reasoning: 'Use safe HTML rendering to prevent XSS attacks'
      }],
      explanation: 'Safe HTML rendering automatically escapes user input to prevent script injection.',
      securityBenefit: 'Eliminates XSS vulnerabilities by properly encoding user-controlled data.',
      riskAssessment: 'Very low risk - maintains functionality while preventing attacks.',
      testingRecommendations: [
        'Test with XSS payloads to verify protection',
        'Verify HTML content displays correctly',
        'Test with various character encodings'
      ],
      relatedPatterns: ['Output Encoding', 'XSS Prevention', 'Safe Rendering']
    });

    return suggestions;
  }

  /**
   * Generate safe HTML rendering code
   */
  private generateSafeHTMLCode(originalLine: string, language: string, framework?: string): string {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        if (framework?.toLowerCase().includes('react')) {
          return 'element.textContent = userInput; // Safe text rendering';
        }
        return 'element.textContent = userInput; // Use textContent instead of innerHTML';
      case 'python':
        if (framework?.toLowerCase().includes('django')) {
          return '{{ user_input|escape }} <!-- Django auto-escaping -->';
        }
        return 'html.escape(user_input)  # Escape HTML characters';
      default:
        return '// Use safe HTML rendering methods to prevent XSS';
    }
  }

  /**
   * Generate path traversal fix suggestions
   */
  private generatePathTraversalFixes(issue: SecurityIssue, codeContext: string, language: string): Omit<FixSuggestion, 'id' | 'issueId'>[] {
    return [{
      title: 'Validate and Sanitize File Paths',
      description: 'Add path validation to prevent directory traversal attacks',
      confidence: 92,
      effort: 'Medium',
      priority: 4,
      codeChanges: [{
        type: 'replace',
        filename: issue.filename,
        startLine: issue.line,
        endLine: issue.line,
        originalCode: codeContext.split('\n')[0].trim(),
        suggestedCode: this.generatePathValidationCode(language),
        reasoning: 'Validate file paths to prevent directory traversal'
      }],
      explanation: 'Path validation ensures file access is restricted to allowed directories.',
      securityBenefit: 'Prevents unauthorized file system access and data exposure.',
      riskAssessment: 'Low risk - may require adjusting file access patterns.',
      testingRecommendations: [
        'Test with path traversal payloads (../, ..\\ etc.)',
        'Verify legitimate file access still works',
        'Test edge cases with symbolic links'
      ],
      relatedPatterns: ['Path Validation', 'File System Security', 'Input Sanitization']
    }];
  }

  /**
   * Generate path validation code
   */
  private generatePathValidationCode(language: string): string {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return 'const safePath = path.resolve(basePath, path.normalize(userPath));\nif (!safePath.startsWith(basePath)) throw new Error("Invalid path");';
      case 'python':
        return 'safe_path = os.path.realpath(os.path.join(base_path, user_path))\nif not safe_path.startswith(base_path): raise ValueError("Invalid path")';
      case 'java':
        return 'Path safePath = Paths.get(basePath).resolve(userPath).normalize();\nif (!safePath.startsWith(basePath)) throw new SecurityException("Invalid path");';
      default:
        return '// Validate file paths to prevent directory traversal';
    }
  }

  /**
   * Generate insecure randomness fix suggestions
   */
  private generateInsecureRandomnessFixes(issue: SecurityIssue, codeContext: string, language: string): Omit<FixSuggestion, 'id' | 'issueId'>[] {
    return [{
      title: 'Use Cryptographically Secure Random Generator',
      description: 'Replace weak random number generation with cryptographically secure methods',
      confidence: 98,
      effort: 'Low',
      priority: 5,
      codeChanges: [{
        type: 'replace',
        filename: issue.filename,
        startLine: issue.line,
        endLine: issue.line,
        originalCode: codeContext.split('\n')[0].trim(),
        suggestedCode: this.generateSecureRandomCode(language),
        reasoning: 'Use cryptographically secure random number generation'
      }],
      explanation: 'Cryptographically secure random generators provide unpredictable values for security purposes.',
      securityBenefit: 'Prevents prediction of random values used in security contexts.',
      riskAssessment: 'Very low risk - direct replacement with secure alternative.',
      testingRecommendations: [
        'Verify random values are unpredictable',
        'Test performance impact if generating many values',
        'Ensure proper seeding in production'
      ],
      relatedPatterns: ['Secure Random', 'Cryptographic Security', 'Random Number Generation']
    }];
  }

  /**
   * Generate secure random code
   */
  private generateSecureRandomCode(language: string): string {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return 'const randomBytes = crypto.getRandomValues(new Uint8Array(32));';
      case 'python':
        return 'import secrets\nrandom_value = secrets.randbelow(100)  # or secrets.token_hex(16)';
      case 'java':
        return 'SecureRandom secureRandom = new SecureRandom();\nint randomValue = secureRandom.nextInt();';
      case 'csharp':
        return 'using var rng = RandomNumberGenerator.Create();\nbyte[] randomBytes = new byte[32];\nrng.GetBytes(randomBytes);';
      default:
        return '// Use cryptographically secure random number generator';
    }
  }

  /**
   * Generate hardcoded credentials fix suggestions
   */
  private generateHardcodedCredentialsFixes(issue: SecurityIssue, codeContext: string, language: string): Omit<FixSuggestion, 'id' | 'issueId'>[] {
    return [{
      title: 'Move Credentials to Secure Configuration',
      description: 'Replace hardcoded credentials with secure configuration management',
      confidence: 95,
      effort: 'Low',
      priority: 5,
      codeChanges: [{
        type: 'replace',
        filename: issue.filename,
        startLine: issue.line,
        endLine: issue.line,
        originalCode: codeContext.split('\n')[0].trim(),
        suggestedCode: this.generateEnvironmentVariableCode(codeContext.split('\n')[0], language),
        reasoning: 'Move credentials to environment variables or secure configuration'
      }],
      explanation: 'Secure configuration keeps credentials out of source code and enables proper secret management.',
      securityBenefit: 'Prevents credential exposure and enables secure credential rotation.',
      riskAssessment: 'Low risk - requires configuration setup but improves security significantly.',
      testingRecommendations: [
        'Verify credentials are loaded correctly from configuration',
        'Test application behavior with missing credentials',
        'Test credential rotation scenarios'
      ],
      relatedPatterns: ['Configuration Management', 'Secret Management', 'Environment Variables']
    }];
  }

  /**
   * Apply automated refactoring for simple fixes
   */
  public async applyAutomatedRefactor(
    suggestion: FixSuggestion,
    fileContents: Map<string, string>
  ): Promise<AutoRefactorResult> {
    const result: AutoRefactorResult = {
      success: false,
      appliedChanges: [],
      warnings: [],
      errors: [],
      testSuggestions: []
    };

    try {
      for (const change of suggestion.codeChanges) {
        const fileContent = fileContents.get(change.filename);

        if (!fileContent) {
          result.errors.push(`File not found: ${change.filename}`);
          continue;
        }

        const lines = fileContent.split('\n');

        // Validate line numbers
        if (change.startLine < 1 || change.startLine > lines.length) {
          result.errors.push(`Invalid line number ${change.startLine} in ${change.filename}`);
          continue;
        }

        // Apply the change based on type
        switch (change.type) {
          case 'replace':
            this.applyReplaceChange(lines, change, result);
            break;
          case 'insert':
            this.applyInsertChange(lines, change, result);
            break;
          case 'delete':
            this.applyDeleteChange(lines, change, result);
            break;
          case 'refactor':
            this.applyRefactorChange(lines, change, result);
            break;
        }

        // Update file content
        fileContents.set(change.filename, lines.join('\n'));
        result.appliedChanges.push(change);
      }

      result.success = result.errors.length === 0;
      result.testSuggestions = suggestion.testingRecommendations;

      if (result.success) {
        result.warnings.push('Please review all changes before committing');
        result.warnings.push('Run comprehensive tests to ensure functionality');
      }

    } catch (error) {
      result.errors.push(`Refactoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * Apply replace-type code change
   */
  private applyReplaceChange(lines: string[], change: CodeChange, result: AutoRefactorResult): void {
    const startIdx = change.startLine - 1;
    const endIdx = change.endLine - 1;

    // Verify original code matches (basic check)
    const originalLines = lines.slice(startIdx, endIdx + 1);
    const originalCode = originalLines.join('\n').trim();

    if (change.originalCode && !originalCode.includes(change.originalCode.trim())) {
      result.warnings.push(`Original code mismatch in ${change.filename}:${change.startLine}`);
    }

    // Replace the lines
    const newLines = change.suggestedCode.split('\n');
    lines.splice(startIdx, endIdx - startIdx + 1, ...newLines);
  }

  /**
   * Apply insert-type code change
   */
  private applyInsertChange(lines: string[], change: CodeChange, result: AutoRefactorResult): void {
    const insertIdx = change.startLine - 1;
    const newLines = change.suggestedCode.split('\n');
    lines.splice(insertIdx, 0, ...newLines);
  }

  /**
   * Apply delete-type code change
   */
  private applyDeleteChange(lines: string[], change: CodeChange, result: AutoRefactorResult): void {
    const startIdx = change.startLine - 1;
    const endIdx = change.endLine - 1;
    lines.splice(startIdx, endIdx - startIdx + 1);
  }

  /**
   * Apply refactor-type code change (more complex transformation)
   */
  private applyRefactorChange(lines: string[], change: CodeChange, result: AutoRefactorResult): void {
    // For refactor changes, we'll treat them as replace for now
    // In a more advanced implementation, this could involve AST manipulation
    this.applyReplaceChange(lines, change, result);
    result.warnings.push(`Refactor change applied as replacement in ${change.filename}`);
  }

  /**
   * Generate fix suggestions for multiple issues at once
   */
  public async generateBatchFixSuggestions(
    requests: FixSuggestionRequest[]
  ): Promise<Map<string, FixSuggestion[]>> {
    const results = new Map<string, FixSuggestion[]>();

    // Process requests in parallel with rate limiting
    const batchSize = 3; // Limit concurrent AI requests

    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);

      const batchPromises = batch.map(async (request) => {
        try {
          const suggestions = await this.generateFixSuggestions(request);
          return { issueId: request.issue.id, suggestions };
        } catch (error) {
          console.error(`Failed to generate suggestions for issue ${request.issue.id}:`, error);
          return { issueId: request.issue.id, suggestions: [] };
        }
      });

      const batchResults = await Promise.all(batchPromises);

      batchResults.forEach(({ issueId, suggestions }) => {
        results.set(issueId, suggestions);
      });

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < requests.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Get fix suggestions statistics
   */
  public getFixStatistics(suggestions: FixSuggestion[]): {
    totalSuggestions: number;
    averageConfidence: number;
    effortDistribution: Record<string, number>;
    priorityDistribution: Record<number, number>;
    mostCommonPatterns: string[];
  } {
    if (suggestions.length === 0) {
      return {
        totalSuggestions: 0,
        averageConfidence: 0,
        effortDistribution: {},
        priorityDistribution: {},
        mostCommonPatterns: []
      };
    }

    const totalConfidence = suggestions.reduce((sum, s) => sum + s.confidence, 0);
    const averageConfidence = totalConfidence / suggestions.length;

    const effortDistribution: Record<string, number> = {};
    const priorityDistribution: Record<number, number> = {};
    const patternCounts: Record<string, number> = {};

    suggestions.forEach(suggestion => {
      // Effort distribution
      effortDistribution[suggestion.effort] = (effortDistribution[suggestion.effort] || 0) + 1;

      // Priority distribution
      priorityDistribution[suggestion.priority] = (priorityDistribution[suggestion.priority] || 0) + 1;

      // Pattern frequency
      suggestion.relatedPatterns.forEach(pattern => {
        patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
      });
    });

    const mostCommonPatterns = Object.entries(patternCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([pattern]) => pattern);

    return {
      totalSuggestions: suggestions.length,
      averageConfidence: Math.round(averageConfidence),
      effortDistribution,
      priorityDistribution,
      mostCommonPatterns
    };
  }
}
