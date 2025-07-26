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

    // Generate real fix suggestions based on vulnerability type
    const realFixSuggestions = this.generateRealFixSuggestions(request);

    // If we have real suggestions, return them; otherwise fall back to AI
    if (realFixSuggestions.length > 0) {
      return realFixSuggestions;
    }

    const systemPrompt = {
      role: 'system' as const,
      content: `You are an expert security engineer and code reviewer specializing in automated vulnerability remediation.

Your task is to analyze security vulnerabilities and provide multiple, practical fix suggestions with detailed implementation guidance.

For each fix suggestion, provide:
1. **Multiple Approaches**: Offer 2-3 different fix strategies (quick fix, comprehensive fix, architectural improvement)
2. **Confidence Assessment**: Rate your confidence in each fix (0-100)
3. **Effort Estimation**: Categorize implementation effort (Low/Medium/High)
4. **Priority Ranking**: Rate urgency and importance (1-5)
5. **Detailed Code Changes**: Specific line-by-line modifications
6. **Security Benefits**: Explain how the fix improves security
7. **Risk Assessment**: Identify potential side effects or breaking changes
8. **Testing Strategy**: Recommend specific tests to validate the fix
9. **Framework Integration**: Leverage framework-specific security features when applicable

Focus on:
- Practical, implementable solutions
- Security best practices for ${language}${framework ? ` and ${framework}` : ''}
- Minimal breaking changes
- Performance considerations
- Maintainability improvements

Return your response as a JSON array of fix suggestions.`
    };

    const userPrompt = {
      role: 'user' as const,
      content: `Analyze this security vulnerability and provide fix suggestions:

**Security Issue:**
- Type: ${issue.type}
- Severity: ${issue.severity}
- Category: ${issue.category}
- Message: ${issue.message}
- File: ${issue.filename}:${issue.line}
- CWE: ${issue.cweId || 'Not specified'}
- OWASP: ${issue.owaspCategory || 'Not specified'}
- CVSS Score: ${issue.cvssScore || 'Not specified'}

**Code Context:**
\`\`\`${language}
${codeContext}
\`\`\`

**Environment:**
- Language: ${language}
- Framework: ${framework || 'None specified'}
- Current Remediation: ${issue.remediation?.description || 'None provided'}

Please provide 2-3 different fix approaches with varying complexity and thoroughness. Include specific code changes, security explanations, and implementation guidance.

Format your response as a JSON array with this structure:
[
  {
    "title": "Fix approach title",
    "description": "Detailed description",
    "confidence": 85,
    "effort": "Medium",
    "priority": 4,
    "codeChanges": [
      {
        "type": "replace",
        "filename": "example.js",
        "startLine": 10,
        "endLine": 12,
        "originalCode": "vulnerable code",
        "suggestedCode": "secure code",
        "reasoning": "explanation"
      }
    ],
    "explanation": "Why this fix works",
    "securityBenefit": "Security improvements",
    "riskAssessment": "Potential risks",
    "testingRecommendations": ["test suggestions"],
    "relatedPatterns": ["related security patterns"]
  }
]`
    };

    try {
      const response = await this.aiService.generateResponse([systemPrompt, userPrompt]);
      const suggestions = this.parseAIResponse(response, request);
      
      return suggestions.map((suggestion, index) => ({
        ...suggestion,
        id: this.generateFixId(request.issue.id, index),
        issueId: request.issue.id
      }));
    } catch (error) {
      throw new Error(`AI fix generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse AI response and validate fix suggestions
   */
  private parseAIResponse(response: string, request: FixSuggestionRequest): Omit<FixSuggestion, 'id' | 'issueId'>[] {
    try {
      // Extract JSON from response if it's wrapped in markdown
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || response.match(/\[([\s\S]*)\]/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : response;
      
      const suggestions = JSON.parse(jsonString) as unknown[];
      
      if (!Array.isArray(suggestions)) {
        throw new Error('Response is not an array');
      }

      return suggestions.map((suggestion, index) => this.validateAndEnhanceSuggestion(suggestion, request, index));
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      // Fallback to basic suggestion
      return [this.createFallbackSuggestion(request)];
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

    // Extract the vulnerable line
    const lines = codeContext.split('\n');
    const vulnerableLine = lines.find(line => line.includes('eyJ') || line.includes('AKIA') || line.includes('ghp_')) || lines[0];

    // Suggestion 1: Environment Variables
    suggestions.push({
      title: 'Move Secret to Environment Variables',
      description: 'Replace hardcoded secret with environment variable reference',
      confidence: 95,
      effort: 'Low',
      priority: 5,
      codeChanges: [{
        type: 'replace',
        filename: issue.filename,
        startLine: issue.line,
        endLine: issue.line,
        originalCode: vulnerableLine.trim(),
        suggestedCode: this.generateEnvironmentVariableCode(vulnerableLine, language),
        reasoning: 'Replace hardcoded secret with secure environment variable access'
      }],
      explanation: 'Environment variables keep secrets out of source code and allow different values per environment.',
      securityBenefit: 'Prevents secret exposure in version control and enables secure secret management.',
      riskAssessment: 'Low risk - maintains functionality while improving security.',
      testingRecommendations: [
        'Verify environment variable is set in all deployment environments',
        'Test application startup with missing environment variable',
        'Confirm secret rotation works without code changes'
      ],
      relatedPatterns: ['Environment Variables', 'Secret Management', 'Configuration Management']
    });

    // Suggestion 2: Secret Management Service
    suggestions.push({
      title: 'Use Secret Management Service',
      description: 'Integrate with a dedicated secret management service like AWS Secrets Manager or HashiCorp Vault',
      confidence: 90,
      effort: 'Medium',
      priority: 4,
      codeChanges: [{
        type: 'replace',
        filename: issue.filename,
        startLine: issue.line,
        endLine: issue.line,
        originalCode: vulnerableLine.trim(),
        suggestedCode: this.generateSecretManagerCode(vulnerableLine, language),
        reasoning: 'Replace hardcoded secret with secure secret manager integration'
      }],
      explanation: 'Secret management services provide encryption, rotation, and audit trails for sensitive data.',
      securityBenefit: 'Enterprise-grade secret security with automatic rotation and access controls.',
      riskAssessment: 'Medium risk - requires infrastructure setup but provides superior security.',
      testingRecommendations: [
        'Test secret retrieval with proper authentication',
        'Verify fallback behavior when secret service is unavailable',
        'Test secret rotation scenarios'
      ],
      relatedPatterns: ['Secret Management', 'Cloud Security', 'Zero Trust Architecture']
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
    return {
      title: 'Basic Security Fix',
      description: `Address ${request.issue.type} vulnerability in ${request.issue.filename}`,
      confidence: 60,
      effort: 'Medium',
      priority: 3,
      codeChanges: [{
        type: 'replace',
        filename: request.issue.filename,
        startLine: request.issue.line,
        endLine: request.issue.line,
        originalCode: 'Vulnerable code pattern',
        suggestedCode: 'Secure implementation',
        reasoning: 'Apply security best practices'
      }],
      explanation: 'This fix addresses the identified security vulnerability using standard security practices.',
      securityBenefit: 'Reduces security risk and improves code safety.',
      riskAssessment: 'Review changes carefully before applying.',
      testingRecommendations: [
        'Test functionality after applying fix',
        'Run security scans to verify fix effectiveness',
        'Perform regression testing'
      ],
      relatedPatterns: []
    };
  }

  /**
   * Generate environment variable code based on language
   */
  private generateEnvironmentVariableCode(originalLine: string, language: string): string {
    const variableName = this.extractVariableName(originalLine) || 'SECRET_TOKEN';

    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return `const ${variableName.toLowerCase()} = process.env.${variableName.toUpperCase()} || '';`;
      case 'python':
        return `${variableName.toLowerCase()} = os.getenv('${variableName.toUpperCase()}', '')`;
      case 'java':
        return `String ${variableName.toLowerCase()} = System.getenv("${variableName.toUpperCase()}");`;
      case 'csharp':
        return `string ${variableName.toLowerCase()} = Environment.GetEnvironmentVariable("${variableName.toUpperCase()}") ?? "";`;
      case 'php':
        return `$${variableName.toLowerCase()} = $_ENV['${variableName.toUpperCase()}'] ?? '';`;
      case 'ruby':
        return `${variableName.toLowerCase()} = ENV['${variableName.toUpperCase()}'] || ''`;
      case 'golang':
      case 'go':
        return `${variableName.toLowerCase()} := os.Getenv("${variableName.toUpperCase()}")`;
      default:
        return `// Replace with environment variable access for ${variableName.toUpperCase()}`;
    }
  }

  /**
   * Generate secret manager integration code
   */
  private generateSecretManagerCode(originalLine: string, language: string): string {
    const secretName = this.extractVariableName(originalLine) || 'secret-token';

    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return `const ${secretName.toLowerCase()} = await secretManager.getSecret('${secretName}');`;
      case 'python':
        return `${secretName.toLowerCase()} = secret_manager.get_secret('${secretName}')`;
      case 'java':
        return `String ${secretName.toLowerCase()} = secretManager.getSecret("${secretName}");`;
      case 'csharp':
        return `string ${secretName.toLowerCase()} = await secretManager.GetSecretAsync("${secretName}");`;
      default:
        return `// Replace with secret manager integration for ${secretName}`;
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
