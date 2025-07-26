import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Eye,
  EyeOff,
  Copy,
  Shield,
  AlertTriangle,
  Key,
  Database,
  Cloud,
  Github,
  Lock,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Star,
  Zap,
  Brain,
  Loader2,
  Info,
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';
import { SecurityIssue } from '@/hooks/useAnalysis';
import { toast } from 'sonner';
import { showErrorToast } from '../../utils/errorUtils';
import { hasConfiguredApiKeys } from '@/utils/aiUtils';
import { AIFixSuggestionsService } from '@/services/aiFixSuggestionsService';

interface SecretDetectionCardProps {
  secretIssues: SecurityIssue[];
}

export const SecretDetectionCard: React.FC<SecretDetectionCardProps> = ({ secretIssues }) => {
  const [expandedSecrets, setExpandedSecrets] = useState<Set<string>>(new Set());
  const [aiGeneratedSecrets, setAiGeneratedSecrets] = useState<Set<string>>(new Set());
  const [generatingSecrets, setGeneratingSecrets] = useState<Set<string>>(new Set());
  const [aiGeneratedCode, setAiGeneratedCode] = useState<Map<string, string[]>>(new Map());
  const [currentCodeIndex, setCurrentCodeIndex] = useState<Map<string, number>>(new Map());
  const [isApiConnected, setIsApiConnected] = useState(() => hasConfiguredApiKeys());
  const [aiService] = useState(() => new AIFixSuggestionsService());

  if (secretIssues.length === 0) {
    return null; // Don't show anything if no secrets found
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded text-xs font-medium';
      case 'high':
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-1 rounded text-xs font-medium';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-1 rounded text-xs font-medium';
      case 'low':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded text-xs font-medium';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20 px-2 py-1 rounded text-xs font-medium';
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    return 'bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded text-xs font-medium';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  // Listen for API key changes
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'aiApiKeys') {
        setIsApiConnected(hasConfiguredApiKeys());
      }
    };

    const handleCustomStorageChange = () => {
      setIsApiConnected(hasConfiguredApiKeys());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('aiApiKeysChanged', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('aiApiKeysChanged', handleCustomStorageChange);
    };
  }, []);

  const toggleSecretExpansion = (secretId: string) => {
    const newExpanded = new Set(expandedSecrets);
    if (newExpanded.has(secretId)) {
      newExpanded.delete(secretId);
    } else {
      newExpanded.add(secretId);
    }
    setExpandedSecrets(newExpanded);
  };

  const handleGenerateSecureCode = async (secretId: string) => {
    if (!isApiConnected) {
      toast.error('AI API is not configured. Please set up your API keys in Settings.');
      return;
    }

    const secret = secretIssues.find(s => s.id === secretId);
    if (!secret) {
      toast.error('Secret not found');
      return;
    }

    // Add to generating state
    const newGenerating = new Set(generatingSecrets);
    newGenerating.add(secretId);
    setGeneratingSecrets(newGenerating);

    try {
      toast.info('AI is analyzing the vulnerability and generating secure code...');

      // Prepare the request for AI service
      const language = detectLanguageFromFilename(secret.filename);
      const framework = detectFrameworkFromContext(secret.filename, secret.codeSnippet || '');
      const codeContext = getEnhancedCodeContext(secret);

      const fixSuggestionRequest = {
        issue: secret,
        codeContext,
        language,
        framework
      };

      // Call AI service to generate fix suggestions
      const suggestions = await aiService.generateFixSuggestions(fixSuggestionRequest);

      if (suggestions && suggestions.length > 0) {
        // Get the best suggestion (highest confidence)
        const bestSuggestion = suggestions.reduce((best, current) =>
          current.confidence > best.confidence ? current : best
        );

        // Extract code from all suggestions to provide alternatives
        const generatedCodes: string[] = [];

        // Add AI-generated suggestions with enhanced formatting
        suggestions.forEach((suggestion, index) => {
          if (suggestion.codeChanges && suggestion.codeChanges.length > 0) {
            const code = suggestion.codeChanges
              .map(change => change.suggestedCode)
              .join('\n\n');
            if (code.trim()) {
              const header = `// 🤖 AI-Generated Solution ${index + 1}
// Confidence: ${suggestion.confidence}% | Effort: ${suggestion.effort} | Priority: ${suggestion.priority}/5
// ${suggestion.title}
//
// Security Benefit: ${suggestion.securityBenefit}
// Risk Assessment: ${suggestion.riskAssessment}
//
// Generated for: ${language}${framework ? ` + ${framework}` : ''} | Vulnerability: ${secret.type}

`;
              generatedCodes.push(header + code);
            }
          }
        });

        // Add fallback implementations only if AI didn't generate enough alternatives
        if (generatedCodes.length < 2) {
          const fallbackCode = generateSecureCodeForSecret(secret, language);
          generatedCodes.push(`// 📋 Standard Secure Implementation
// Environment Variable Pattern
//
// This is a fallback implementation following security best practices

${fallbackCode}`);

          // If we have framework-specific code, add that too
          if (framework) {
            const frameworkCode = generateFrameworkSpecificCode(secret, language, framework);
            if (frameworkCode) {
              generatedCodes.push(`// 🔧 ${framework} Framework Implementation
// Framework-Optimized Solution
//
// Leverages ${framework}-specific security features and patterns

${frameworkCode}`);
            }
          }
        }

        // Store the generated codes
        const newAiGeneratedCode = new Map(aiGeneratedCode);
        newAiGeneratedCode.set(secretId, generatedCodes);
        setAiGeneratedCode(newAiGeneratedCode);

        // Initialize current index to 0
        const newCurrentIndex = new Map(currentCodeIndex);
        newCurrentIndex.set(secretId, 0);
        setCurrentCodeIndex(newCurrentIndex);

        // Add to AI generated secrets to show the AI section
        const newAiGenerated = new Set(aiGeneratedSecrets);
        newAiGenerated.add(secretId);
        setAiGeneratedSecrets(newAiGenerated);

        toast.success('AI has generated secure code implementation!');
      } else {
        throw new Error('No fix suggestions generated');
      }
    } catch (error) {
      console.error('Error generating secure code:', error);

      // Show user-friendly error toast
      showErrorToast(error instanceof Error ? error : 'Failed to generate secure code', {
        title: 'Secure Code Generation Failed'
      });

      // Remove from AI generated on error
      const newAiGenerated = new Set(aiGeneratedSecrets);
      newAiGenerated.delete(secretId);
      setAiGeneratedSecrets(newAiGenerated);
    } finally {
      // Remove from generating state
      const newGenerating = new Set(generatingSecrets);
      newGenerating.delete(secretId);
      setGeneratingSecrets(newGenerating);
    }
  };

  const handleBackToStatic = (secretId: string) => {
    const newAiGenerated = new Set(aiGeneratedSecrets);
    newAiGenerated.delete(secretId);
    setAiGeneratedSecrets(newAiGenerated);

    // Also remove the generated code and index
    const newAiGeneratedCode = new Map(aiGeneratedCode);
    newAiGeneratedCode.delete(secretId);
    setAiGeneratedCode(newAiGeneratedCode);

    const newCurrentIndex = new Map(currentCodeIndex);
    newCurrentIndex.delete(secretId);
    setCurrentCodeIndex(newCurrentIndex);

    toast.info('Switched back to static secure implementation');
  };

  const handleNextAlternative = (secretId: string) => {
    const codes = aiGeneratedCode.get(secretId) || [];
    const currentIndex = currentCodeIndex.get(secretId) || 0;
    const nextIndex = (currentIndex + 1) % codes.length;

    const newCurrentIndex = new Map(currentCodeIndex);
    newCurrentIndex.set(secretId, nextIndex);
    setCurrentCodeIndex(newCurrentIndex);
  };

  const handlePrevAlternative = (secretId: string) => {
    const codes = aiGeneratedCode.get(secretId) || [];
    const currentIndex = currentCodeIndex.get(secretId) || 0;
    const prevIndex = currentIndex === 0 ? codes.length - 1 : currentIndex - 1;

    const newCurrentIndex = new Map(currentCodeIndex);
    newCurrentIndex.set(secretId, prevIndex);
    setCurrentCodeIndex(newCurrentIndex);
  };

  const generateSecureCodeForSecret = (secret: SecurityIssue, language: string): string => {
    const secretType = secret.type.toLowerCase();

    if (secretType.includes('jwt') || secretType.includes('token')) {
      switch (language) {
        case 'javascript':
        case 'typescript':
          return `// Secure JWT implementation
const JWT_SECRET = process.env.JWT_SECRET || '';
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h',
    algorithm: 'HS256'
  });
}

// Set environment variable:
// export JWT_SECRET="your-secure-jwt-secret-here"`;
        case 'python':
          return `# Secure JWT implementation
import os
import jwt

JWT_SECRET = os.getenv('JWT_SECRET')
if not JWT_SECRET:
    raise ValueError('JWT_SECRET environment variable is required')

def generate_token(payload):
    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm='HS256'
    )

# Set environment variable:
# export JWT_SECRET="your-secure-jwt-secret-here"`;
        case 'java':
          return `// Secure JWT implementation
public class AuthService {
    private static final String JWT_SECRET = System.getenv("JWT_SECRET");

    static {
        if (JWT_SECRET == null || JWT_SECRET.isEmpty()) {
            throw new IllegalStateException("JWT_SECRET environment variable is required");
        }
    }

    public String generateToken(Map<String, Object> claims) {
        return Jwts.builder()
            .setClaims(claims)
            .signWith(SignatureAlgorithm.HS256, JWT_SECRET)
            .setExpiration(new Date(System.currentTimeMillis() + 3600000))
            .compact();
    }
}

// Set environment variable:
// export JWT_SECRET="your-secure-jwt-secret-here"`;
      }
    } else if (secretType.includes('api') || secretType.includes('key')) {
      switch (language) {
        case 'javascript':
        case 'typescript':
          return `// Secure API key implementation
const API_KEY = process.env.API_KEY || '';
if (!API_KEY) {
  throw new Error('API_KEY environment variable is required');
}

const client = new APIClient({
  apiKey: API_KEY,
  baseURL: 'https://api.example.com'
});

// Set environment variable:
// export API_KEY="your-secure-api-key-here"`;
        case 'python':
          return `# Secure API key implementation
import os

API_KEY = os.getenv('API_KEY')
if not API_KEY:
    raise ValueError('API_KEY environment variable is required')

client = APIClient(
    api_key=API_KEY,
    base_url='https://api.example.com'
)

# Set environment variable:
# export API_KEY="your-secure-api-key-here"`;
        case 'java':
          return `// Secure API key implementation
public class APIConfig {
    private static final String API_KEY = System.getenv("API_KEY");

    static {
        if (API_KEY == null || API_KEY.isEmpty()) {
            throw new IllegalStateException("API_KEY environment variable is required");
        }
    }

    public APIClient createClient() {
        return new APIClient.Builder()
            .apiKey(API_KEY)
            .baseUrl("https://api.example.com")
            .build();
    }
}

// Set environment variable:
// export API_KEY="your-secure-api-key-here"`;
      }
    } else if (secretType.includes('password') || secretType.includes('credential')) {
      switch (language) {
        case 'javascript':
        case 'typescript':
          return `// Secure database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'myapp'
};

if (!dbConfig.password) {
  throw new Error('DB_PASSWORD environment variable is required');
}

const connection = mysql.createConnection(dbConfig);

// Set environment variables:
// export DB_PASSWORD="your-secure-password-here"
// export DB_HOST="your-db-host"
// export DB_USER="your-db-user"
// export DB_NAME="your-database-name"`;
        case 'python':
          return `# Secure database configuration
import os
import psycopg2

DB_PASSWORD = os.getenv('DB_PASSWORD')
if not DB_PASSWORD:
    raise ValueError('DB_PASSWORD environment variable is required')

connection = psycopg2.connect(
    host=os.getenv('DB_HOST', 'localhost'),
    user=os.getenv('DB_USER', 'admin'),
    password=DB_PASSWORD,
    database=os.getenv('DB_NAME', 'myapp')
)

# Set environment variables:
# export DB_PASSWORD="your-secure-password-here"
# export DB_HOST="your-db-host"
# export DB_USER="your-db-user"
# export DB_NAME="your-database-name"`;
        case 'java':
          return `// Secure database configuration
public class DatabaseConfig {
    private static final String DB_PASSWORD = System.getenv("DB_PASSWORD");
    private static final String DB_HOST = System.getenv("DB_HOST");
    private static final String DB_USER = System.getenv("DB_USER");
    private static final String DB_NAME = System.getenv("DB_NAME");

    static {
        if (DB_PASSWORD == null || DB_PASSWORD.isEmpty()) {
            throw new IllegalStateException("DB_PASSWORD environment variable is required");
        }
    }

    public Connection getConnection() throws SQLException {
        String url = String.format("jdbc:postgresql://%s/%s",
            DB_HOST != null ? DB_HOST : "localhost",
            DB_NAME != null ? DB_NAME : "myapp");

        return DriverManager.getConnection(
            url,
            DB_USER != null ? DB_USER : "admin",
            DB_PASSWORD
        );
    }
}

// Set environment variables:
// export DB_PASSWORD="your-secure-password-here"
// export DB_HOST="your-db-host"
// export DB_USER="your-db-user"
// export DB_NAME="your-database-name"`;
      }
    }

    // Generic secret fallback
    switch (language) {
      case 'javascript':
      case 'typescript':
        return `// Secure secret management
const SECRET = process.env.SECRET_VALUE || '';
if (!SECRET) {
  throw new Error('SECRET_VALUE environment variable is required');
}

// Use the secret securely
console.log('Application configured with secure secret');

// Set environment variable:
// export SECRET_VALUE="your-secure-secret-here"`;
      case 'python':
        return `# Secure secret management
import os

SECRET = os.getenv('SECRET_VALUE')
if not SECRET:
    raise ValueError('SECRET_VALUE environment variable is required')

# Use the secret securely
print('Application configured with secure secret')

# Set environment variable:
# export SECRET_VALUE="your-secure-secret-here"`;
      case 'java':
        return `// Secure secret management
public class SecretConfig {
    private static final String SECRET = System.getenv("SECRET_VALUE");

    static {
        if (SECRET == null || SECRET.isEmpty()) {
            throw new IllegalStateException("SECRET_VALUE environment variable is required");
        }
    }

    public String getSecret() {
        return SECRET;
    }
}

// Set environment variable:
// export SECRET_VALUE="your-secure-secret-here"`;
      default:
        return `// Secure secret management
const SECRET = process.env.SECRET_VALUE || '';
if (!SECRET) {
  throw new Error('SECRET_VALUE environment variable is required');
}

// Set environment variable:
// export SECRET_VALUE="your-secure-secret-here"`;
    }
  };

  const generateFrameworkSpecificCode = (secret: SecurityIssue, language: string, framework: string): string | null => {
    const secretType = secret.type.toLowerCase();

    if (framework === 'react' && (language === 'javascript' || language === 'typescript')) {
      if (secretType.includes('api') || secretType.includes('key')) {
        return `// React + Environment Variables
import { useEffect, useState } from 'react';

const API_CONFIG = {
  apiKey: process.env.REACT_APP_API_KEY,
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.example.com'
};

if (!API_CONFIG.apiKey) {
  throw new Error('REACT_APP_API_KEY environment variable is required');
}

export const useApiClient = () => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const apiClient = new APIClient(API_CONFIG);
    setClient(apiClient);
  }, []);

  return client;
};

// Add to .env file:
// REACT_APP_API_KEY=your-secure-api-key-here
// REACT_APP_API_BASE_URL=https://api.example.com`;
      }
    } else if (framework === 'django' && language === 'python') {
      if (secretType.includes('api') || secretType.includes('key')) {
        return `# Django Settings Configuration
# settings.py
import os
from django.core.exceptions import ImproperlyConfigured

def get_env_variable(var_name):
    try:
        return os.environ[var_name]
    except KeyError:
        error_msg = f"Set the {var_name} environment variable"
        raise ImproperlyConfigured(error_msg)

API_KEY = get_env_variable('API_KEY')
API_BASE_URL = os.environ.get('API_BASE_URL', 'https://api.example.com')

# views.py
from django.conf import settings
import requests

class APIService:
    def __init__(self):
        self.api_key = settings.API_KEY
        self.base_url = settings.API_BASE_URL

    def make_request(self, endpoint):
        headers = {'Authorization': f'Bearer {self.api_key}'}
        response = requests.get(f'{self.base_url}/{endpoint}', headers=headers)
        return response.json()

# Set environment variables:
# export API_KEY="your-secure-api-key-here"
# export API_BASE_URL="https://api.example.com"`;
      }
    } else if (framework === 'spring' && language === 'java') {
      if (secretType.includes('api') || secretType.includes('key')) {
        return `// Spring Boot Configuration
// application.yml
/*
api:
  key: \${API_KEY:}
  base-url: \${API_BASE_URL:https://api.example.com}
*/

// ApiConfig.java
@Configuration
@ConfigurationProperties(prefix = "api")
@Validated
public class ApiConfig {
    @NotBlank(message = "API key is required")
    private String key;

    private String baseUrl = "https://api.example.com";

    // getters and setters
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
}

// ApiService.java
@Service
public class ApiService {
    private final ApiConfig apiConfig;
    private final RestTemplate restTemplate;

    public ApiService(ApiConfig apiConfig, RestTemplate restTemplate) {
        this.apiConfig = apiConfig;
        this.restTemplate = restTemplate;
    }

    public ResponseEntity<String> makeRequest(String endpoint) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiConfig.getKey());
        HttpEntity<String> entity = new HttpEntity<>(headers);

        return restTemplate.exchange(
            apiConfig.getBaseUrl() + "/" + endpoint,
            HttpMethod.GET,
            entity,
            String.class
        );
    }
}

// Set environment variables:
// export API_KEY="your-secure-api-key-here"
// export API_BASE_URL="https://api.example.com"`;
      }
    } else if (framework === 'nodejs' && (language === 'javascript' || language === 'typescript')) {
      if (secretType.includes('api') || secretType.includes('key')) {
        return `// Node.js + Express Configuration
require('dotenv').config();

const express = require('express');
const axios = require('axios');

// Validate required environment variables
const requiredEnvVars = ['API_KEY'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(\`\${envVar} environment variable is required\`);
  }
});

const apiConfig = {
  apiKey: process.env.API_KEY,
  baseURL: process.env.API_BASE_URL || 'https://api.example.com'
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    'Authorization': \`Bearer \${apiConfig.apiKey}\`,
    'Content-Type': 'application/json'
  }
});

const app = express();

app.get('/api/data', async (req, res) => {
  try {
    const response = await apiClient.get('/endpoint');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'API request failed' });
  }
});

// Create .env file:
// API_KEY=your-secure-api-key-here
// API_BASE_URL=https://api.example.com`;
      }
    }

    return null;
  };

  const detectLanguageFromFilename = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    const basename = filename.toLowerCase();

    // Check for specific file patterns first
    if (basename.includes('package.json') || basename.includes('yarn.lock')) return 'javascript';
    if (basename.includes('requirements.txt') || basename.includes('setup.py')) return 'python';
    if (basename.includes('pom.xml') || basename.includes('build.gradle')) return 'java';
    if (basename.includes('composer.json')) return 'php';
    if (basename.includes('gemfile')) return 'ruby';
    if (basename.includes('go.mod')) return 'golang';
    if (basename.includes('.csproj') || basename.includes('.sln')) return 'csharp';

    // Check by extension
    switch (extension) {
      case 'js':
      case 'jsx':
      case 'mjs':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'py':
      case 'pyw':
      case 'pyc':
        return 'python';
      case 'java':
      case 'class':
        return 'java';
      case 'php':
      case 'phtml':
      case 'php3':
      case 'php4':
      case 'php5':
        return 'php';
      case 'rb':
      case 'rbw':
        return 'ruby';
      case 'go':
        return 'golang';
      case 'cs':
        return 'csharp';
      case 'cpp':
      case 'cc':
      case 'cxx':
      case 'c++':
        return 'cpp';
      case 'c':
      case 'h':
        return 'c';
      case 'rs':
        return 'rust';
      case 'kt':
        return 'kotlin';
      case 'swift':
        return 'swift';
      case 'scala':
        return 'scala';
      default:
        return 'javascript'; // Default fallback
    }
  };

  const detectFrameworkFromContext = (filename: string, codeSnippet: string): string | undefined => {
    const content = codeSnippet.toLowerCase();
    const file = filename.toLowerCase();

    // React patterns
    if (content.includes('react') || content.includes('jsx') || content.includes('usestate') || content.includes('useeffect')) {
      return 'react';
    }

    // Vue patterns
    if (content.includes('vue') || file.includes('vue')) {
      return 'vue';
    }

    // Angular patterns
    if (content.includes('@angular') || content.includes('@component') || content.includes('@injectable')) {
      return 'angular';
    }

    // Node.js patterns
    if (content.includes('express') || content.includes('require(') || content.includes('module.exports')) {
      return 'nodejs';
    }

    // Django patterns
    if (content.includes('django') || content.includes('from django') || file.includes('models.py') || file.includes('views.py')) {
      return 'django';
    }

    // Flask patterns
    if (content.includes('flask') || content.includes('from flask')) {
      return 'flask';
    }

    // Spring patterns
    if (content.includes('@springboot') || content.includes('@restcontroller') || content.includes('springframework')) {
      return 'spring';
    }

    // Laravel patterns
    if (content.includes('laravel') || content.includes('artisan') || file.includes('app.php')) {
      return 'laravel';
    }

    return undefined;
  };

  const getEnhancedCodeContext = (secret: SecurityIssue): string => {
    // If we have a code snippet, use it
    if (secret.codeSnippet && secret.codeSnippet.trim()) {
      return secret.codeSnippet;
    }

    // Otherwise, create a meaningful context based on the secret type and filename
    const language = detectLanguageFromFilename(secret.filename);
    const secretType = secret.type.toLowerCase();

    // Generate realistic code context based on the vulnerability
    if (secretType.includes('jwt') || secretType.includes('token')) {
      switch (language) {
        case 'javascript':
        case 'typescript':
          return `// ${secret.filename}\nconst JWT_SECRET = "${secret.message.includes('eyJ') ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' : 'hardcoded-jwt-secret'}";\n\nfunction generateToken(payload) {\n  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });\n}`;
        case 'python':
          return `# ${secret.filename}\nJWT_SECRET = "${secret.message.includes('eyJ') ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' : 'hardcoded-jwt-secret'}"\n\ndef generate_token(payload):\n    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')`;
        case 'java':
          return `// ${secret.filename}\npublic class AuthService {\n    private static final String JWT_SECRET = "${secret.message.includes('eyJ') ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' : 'hardcoded-jwt-secret'}";\n    \n    public String generateToken(Map<String, Object> claims) {\n        return Jwts.builder().setClaims(claims).signWith(SignatureAlgorithm.HS256, JWT_SECRET).compact();\n    }\n}`;
      }
    } else if (secretType.includes('api') || secretType.includes('key')) {
      switch (language) {
        case 'javascript':
        case 'typescript':
          return `// ${secret.filename}\nconst API_KEY = "sk-1234567890abcdef1234567890abcdef";\n\nconst client = new APIClient({\n  apiKey: API_KEY,\n  baseURL: 'https://api.example.com'\n});`;
        case 'python':
          return `# ${secret.filename}\nAPI_KEY = "sk-1234567890abcdef1234567890abcdef"\n\nclient = APIClient(\n    api_key=API_KEY,\n    base_url='https://api.example.com'\n)`;
        case 'java':
          return `// ${secret.filename}\npublic class APIConfig {\n    private static final String API_KEY = "sk-1234567890abcdef1234567890abcdef";\n    \n    public APIClient createClient() {\n        return new APIClient.Builder()\n            .apiKey(API_KEY)\n            .baseUrl("https://api.example.com")\n            .build();\n    }\n}`;
      }
    } else if (secretType.includes('password') || secretType.includes('credential')) {
      switch (language) {
        case 'javascript':
        case 'typescript':
          return `// ${secret.filename}\nconst dbConfig = {\n  host: 'localhost',\n  user: 'admin',\n  password: 'hardcoded-password-123',\n  database: 'myapp'\n};\n\nconst connection = mysql.createConnection(dbConfig);`;
        case 'python':
          return `# ${secret.filename}\nDB_PASSWORD = "hardcoded-password-123"\n\nconnection = psycopg2.connect(\n    host="localhost",\n    user="admin",\n    password=DB_PASSWORD,\n    database="myapp"\n)`;
        case 'java':
          return `// ${secret.filename}\npublic class DatabaseConfig {\n    private static final String DB_PASSWORD = "hardcoded-password-123";\n    \n    public Connection getConnection() {\n        return DriverManager.getConnection(\n            "jdbc:postgresql://localhost/myapp",\n            "admin",\n            DB_PASSWORD\n        );\n    }\n}`;
      }
    }

    // Fallback to a generic secret pattern
    const genericSecret = secret.message.includes('secret') ? 'hardcoded-secret-value' : 'sensitive-data-123';
    switch (language) {
      case 'javascript':
      case 'typescript':
        return `// ${secret.filename}\nconst SECRET = "${genericSecret}";\n\n// This secret is used in the application\nconsole.log('Using secret:', SECRET);`;
      case 'python':
        return `# ${secret.filename}\nSECRET = "${genericSecret}"\n\n# This secret is used in the application\nprint(f"Using secret: {SECRET}")`;
      case 'java':
        return `// ${secret.filename}\npublic class Config {\n    private static final String SECRET = "${genericSecret}";\n    \n    public String getSecret() {\n        return SECRET;\n    }\n}`;
      default:
        return `const SECRET = "${genericSecret}";`;
    }
  };

  const getSecretTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'api_key':
        return <Key className="h-4 w-4" />;
      case 'jwt_token':
        return <Shield className="h-4 w-4" />;
      case 'database_credential':
        return <Database className="h-4 w-4" />;
      case 'aws_access_key':
        return <Cloud className="h-4 w-4" />;
      case 'github_token':
        return <Github className="h-4 w-4" />;
      case 'private_key':
        return <Lock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSecretFixExample = (issue: SecurityIssue) => {
    const secretType = issue.type.toLowerCase();

    switch (secretType) {
      case 'jwt_token':
        return {
          vulnerable: `const JWT_SECRET = "${issue.codeSnippet?.includes('eyJ') ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' : 'hardcoded-jwt-token'}";`,
          secure: `const JWT_SECRET = process.env.JWT_SECRET || '';
// Set JWT_SECRET in environment variables
// export JWT_SECRET="your-secure-jwt-secret"`
        };
      case 'api_key':
        return {
          vulnerable: `const API_KEY = "${issue.codeSnippet?.match(/[A-Za-z0-9]{20,}/)?.[0]?.substring(0, 10) || 'hardcoded-api'}...";`,
          secure: `const API_KEY = process.env.API_KEY || '';
// Set API_KEY in environment variables
// export API_KEY="your-secure-api-key"`
        };
      case 'aws_access_key':
        return {
          vulnerable: `const AWS_ACCESS_KEY = "AKIA...";`,
          secure: `// Use AWS SDK with IAM roles or environment variables
const AWS = require('aws-sdk');
AWS.config.update({
  region: process.env.AWS_REGION
});
// AWS SDK automatically uses IAM roles or env vars`
        };
      case 'database_credential':
        return {
          vulnerable: `const dbPassword = "mySecretPassword123!";`,
          secure: `const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};`
        };
      default:
        return {
          vulnerable: `const secret = "hardcoded-secret-value";`,
          secure: `const secret = process.env.SECRET_VALUE || '';
// Store secrets in environment variables or secret management service`
        };
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-white">
                Secret Detection ({secretIssues.length})
              </h2>
              {isApiConnected && (
                <Badge variant="outline" className="text-purple-400 border-purple-400 bg-purple-900/20">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Enhanced
                </Badge>
              )}
            </div>
            <p className="text-slate-400 text-sm">
              Comprehensive security analysis with pattern matching and ML classifiers
              {isApiConnected && ' • AI-powered secure code generation available'}
            </p>
          </div>
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </div>
      </div>

      {/* Secret List */}
      <div className="p-6 space-y-4">
        {secretIssues.map((secret) => {
          const isExpanded = expandedSecrets.has(secret.id);

          return (
            <div key={secret.id} className="bg-slate-800/50 border border-slate-700/50 rounded-lg">
              {/* Secret Header */}
              <div
                className="p-4 cursor-pointer hover:bg-slate-800/70 transition-colors"
                onClick={() => toggleSecretExpansion(secret.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className={getSeverityBadge(secret.severity)}>
                        {secret.severity}
                      </span>
                      <span className={getConfidenceBadge(secret.confidence)}>
                        {secret.confidence}% confidence
                      </span>
                      <span className="text-blue-400 text-sm">Secret Detection</span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </div>

                <h3 className="text-white font-medium mt-2 mb-1">
                  {secret.message}
                </h3>
                <p className="text-slate-400 text-sm">
                  {secret.filename}:{secret.line} • {secret.type.replace('_', ' ')}
                </p>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-slate-700/50 p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Issue Details */}
                    <div>
                      <h4 className="text-white font-medium mb-3">Issue Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">CWE:</span>
                          <span className="text-white">{secret.cweId || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Risk:</span>
                          <span className="text-white">{secret.severity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Impact:</span>
                          <span className="text-white">{secret.impact || 'Unknown'}</span>
                        </div>
                        {secret.cvssScore && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">CVSS Score:</span>
                            <span className="text-white">{secret.cvssScore.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Remediation */}
                    <div>
                      <h4 className="text-white font-medium mb-3">Remediation</h4>
                      <p className="text-slate-400 text-sm mb-3">
                        {secret.recommendation || secret.remediation?.description || 'No remediation information available'}
                      </p>
                      {secret.remediation && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-sm">Effort:</span>
                          <span className="text-yellow-400 text-sm">{secret.remediation.effort}</span>
                          <span className="text-slate-400 text-sm">Priority:</span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < (secret.remediation?.priority || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-slate-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vulnerable Code */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-red-400 font-medium">Vulnerable Code</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(getSecretFixExample(secret).vulnerable)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded p-3">
                      <code className="text-red-400 text-sm font-mono whitespace-pre-wrap">
                        {getSecretFixExample(secret).vulnerable}
                      </code>
                    </div>
                    <div className="mt-3 p-3 bg-red-900/20 border border-red-700/30 rounded">
                      <p className="text-red-400 text-sm">
                        <strong>Security Risk:</strong> Hardcoded secrets in source code can be discovered by attackers through code repositories, logs, or reverse engineering.
                      </p>
                    </div>
                  </div>

                  {/* AI-Generated Secure Code or Generate Button */}
                  <div className="mt-4">
                    {isApiConnected && aiGeneratedSecrets.has(secret.id) ? (
                      // Show AI-generated secure code directly
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="text-purple-400 font-medium">AI-Generated Secure Code</h4>
                            <div className="flex items-center gap-2">
                              <Brain className="h-4 w-4 text-purple-400" />
                              <span className="text-xs text-purple-400">Powered by AI</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Navigation for multiple alternatives */}
                            {(aiGeneratedCode.get(secret.id)?.length || 0) > 1 && (
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePrevAlternative(secret.id)}
                                  className="text-slate-400 hover:text-white p-1"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-xs text-slate-400 px-2">
                                  {(currentCodeIndex.get(secret.id) || 0) + 1} of {aiGeneratedCode.get(secret.id)?.length || 1}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleNextAlternative(secret.id)}
                                  className="text-slate-400 hover:text-white p-1"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const codes = aiGeneratedCode.get(secret.id) || [];
                                const currentIndex = currentCodeIndex.get(secret.id) || 0;
                                copyToClipboard(codes[currentIndex] || '');
                              }}
                              className="text-slate-400 hover:text-white"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleBackToStatic(secret.id)}
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-white text-xs"
                            >
                              <ArrowLeft className="h-3 w-3 mr-1" />
                              Back to Static
                            </Button>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 border border-purple-500/30 rounded p-4">
                          <code className="text-purple-300 text-sm font-mono whitespace-pre-wrap">
                            {(() => {
                              const codes = aiGeneratedCode.get(secret.id) || [];
                              const currentIndex = currentCodeIndex.get(secret.id) || 0;
                              return codes[currentIndex] || 'Generating secure code...';
                            })()}
                          </code>
                        </div>
                        <div className="mt-3 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-700/30 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center gap-2 mt-0.5">
                              <Brain className="h-5 w-5 text-purple-400" />
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            </div>
                            <div className="text-purple-400 text-sm flex-1">
                              <p className="mb-3 font-medium">
                                <strong>🤖 AI-Generated Production Code:</strong> Real, working implementation generated specifically for your vulnerability
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    <span>Production-ready with error handling</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                    <span>Language-specific best practices</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                                    <span>Framework-optimized patterns</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                    <span>Secure environment variable handling</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                    <span>Input validation & sanitization</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                    <span>Deployment configuration included</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 p-2 bg-green-900/30 rounded border border-green-700/30">
                                <p className="text-green-300 text-xs">
                                  <strong>✅ Generated for:</strong> {detectLanguageFromFilename(secret.filename)}
                                  {detectFrameworkFromContext(secret.filename, secret.codeSnippet || '') &&
                                    ` + ${detectFrameworkFromContext(secret.filename, secret.codeSnippet || '')}`
                                  } • {secret.type} vulnerability • {getEnhancedCodeContext(secret).split('\n').length} lines analyzed
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : isApiConnected ? (
                      // Show Generate Secure Code button
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-green-400 font-medium">Secure Implementation</h4>
                          <Button
                            onClick={() => handleGenerateSecureCode(secret.id)}
                            disabled={generatingSecrets.has(secret.id)}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 disabled:opacity-50"
                            size="sm"
                          >
                            {generatingSecrets.has(secret.id) ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Brain className="h-4 w-4 mr-2" />
                                Generate Secure Code
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-700/50 rounded p-3">
                          <code className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                            {getSecretFixExample(secret).secure}
                          </code>
                        </div>
                        <div className="mt-3 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center gap-2 mt-0.5">
                              <Brain className="h-5 w-5 text-purple-400" />
                              <Zap className="h-4 w-4 text-blue-400" />
                            </div>
                            <div className="text-blue-400 text-sm flex-1">
                              <p className="mb-3 font-medium">
                                <strong>🤖 AI Analysis Preview:</strong> Click "Generate Secure Code" to get production-ready, contextual fixes
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    <span>Language: <strong>{detectLanguageFromFilename(secret.filename)}</strong></span>
                                  </div>
                                  {detectFrameworkFromContext(secret.filename, secret.codeSnippet || '') && (
                                    <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                      <span>Framework: <strong>{detectFrameworkFromContext(secret.filename, secret.codeSnippet || '')}</strong></span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                    <span>Vulnerability: <strong>{secret.type}</strong></span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                    <span>File: <strong>{secret.filename.split('/').pop()}</strong></span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                                    <span>Context: <strong>{getEnhancedCodeContext(secret).split('\n').length} lines</strong></span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                    <span>Severity: <strong>{secret.severity}</strong></span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 p-2 bg-purple-900/30 rounded border border-purple-700/30">
                                <p className="text-purple-300 text-xs">
                                  <strong>AI will generate:</strong> Multiple production-ready solutions with validation, error handling,
                                  framework-specific patterns, and enterprise-grade security implementations.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-green-900/20 border border-green-700/30 rounded">
                          <p className="text-green-400 text-sm">
                            <strong>Security Benefit:</strong> Moving secrets to environment variables prevents exposure in source code and enables secure secret management across different environments.
                          </p>
                        </div>
                      </div>
                    ) : (
                      // Show static secure implementation when no API is connected
                      <div>
                        <h4 className="text-green-400 font-medium mb-3">Secure Implementation</h4>
                        <div className="bg-slate-900/50 border border-slate-700/50 rounded p-3">
                          <code className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                            {getSecretFixExample(secret).secure}
                          </code>
                        </div>
                        <div className="mt-3 p-3 bg-green-900/20 border border-green-700/30 rounded">
                          <p className="text-green-400 text-sm">
                            <strong>Security Benefit:</strong> Moving secrets to environment variables prevents exposure in source code and enables secure secret management across different environments.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* References */}
                  {secret.references && secret.references.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-white font-medium mb-3">References</h4>
                      <div className="space-y-2">
                        {secret.references.map((ref, index) => (
                          <a
                            key={index}
                            href={ref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2"
                          >
                            {ref}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
