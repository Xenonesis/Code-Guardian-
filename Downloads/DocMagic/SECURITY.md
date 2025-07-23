# 🔒 DocMagic Security Policy

<div align="center">

![Security](https://img.shields.io/badge/Security-Policy-FF6B6B?style=for-the-badge)
![Vulnerability](https://img.shields.io/badge/Report-Vulnerabilities-4ECDC4?style=for-the-badge)
![OWASP](https://img.shields.io/badge/OWASP-Compliant-45B7D1?style=for-the-badge)

</div>

## 🛡️ Security Overview

DocMagic takes security seriously. This document outlines our security practices, vulnerability reporting process, and guidelines for maintaining a secure application environment.

## 🚨 Reporting Security Vulnerabilities

### Responsible Disclosure

If you discover a security vulnerability in DocMagic, please report it responsibly:

1. **DO NOT** create a public GitHub issue
2. **DO NOT** disclose the vulnerability publicly until it has been addressed
3. **DO** email us at: `security@docmagic.com`

### What to Include in Your Report

Please provide the following information:

- **Description**: Clear description of the vulnerability
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Impact**: Potential impact and severity assessment
- **Proof of Concept**: Screenshots, videos, or code snippets (if applicable)
- **Suggested Fix**: If you have ideas for remediation
- **Your Contact Information**: For follow-up questions

### Response Timeline

- **Initial Response**: Within 24 hours
- **Triage**: Within 72 hours
- **Status Updates**: Weekly until resolution
- **Resolution**: Target 30 days for critical issues, 90 days for others

### Recognition

We maintain a security hall of fame for researchers who responsibly disclose vulnerabilities:

- Public acknowledgment (with permission)
- Swag and rewards for significant findings
- Priority access to new features

## 🔐 Security Architecture

### Authentication & Authorization

#### Supabase Auth Integration
```typescript
// Secure authentication flow
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    // Log security events
    logSecurityEvent('failed_login', { email, error: error.message });
    throw error;
  }
  
  return data;
};
```

#### Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- User can only access their own data
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Document access policies
CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### JWT Token Security
- Tokens expire after 1 hour
- Refresh tokens rotate on use
- Secure httpOnly cookies for token storage
- CSRF protection enabled

### Data Protection

#### Encryption at Rest
- Database encryption using AES-256
- File uploads encrypted in Supabase Storage
- Environment variables encrypted in deployment platforms

#### Encryption in Transit
- TLS 1.3 for all communications
- HSTS headers enforced
- Certificate pinning for API calls

#### Data Sanitization
```typescript
// Input sanitization
import DOMPurify from 'dompurify';
import { z } from 'zod';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [] 
  });
};

// Schema validation
const resumeSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  prompt: z.string().min(10).max(5000),
});

export const validateResumeInput = (data: unknown) => {
  const result = resumeSchema.safeParse(data);
  if (!result.success) {
    throw new Error('Invalid input data');
  }
  return result.data;
};
```

### API Security

#### Rate Limiting
```typescript
// Rate limiting implementation
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
});

export const withRateLimit = async (req: Request, identifier: string) => {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
  
  if (!success) {
    throw new Error('Rate limit exceeded');
  }
  
  return { limit, reset, remaining };
};
```

#### Input Validation
```typescript
// Comprehensive input validation
export const validateApiInput = (schema: z.ZodSchema, data: unknown) => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logSecurityEvent('validation_error', {
        errors: error.errors,
        input: JSON.stringify(data),
      });
    }
    throw new Error('Invalid input');
  }
};
```

#### CORS Configuration
```typescript
// Strict CORS policy
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.NEXT_PUBLIC_APP_URL]
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

### Content Security Policy

```typescript
// Comprehensive CSP headers
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' 
    *.stripe.com 
    *.google.com 
    *.googletagmanager.com;
  style-src 'self' 'unsafe-inline' 
    fonts.googleapis.com 
    *.stripe.com;
  img-src 'self' data: blob: 
    *.pexels.com 
    *.supabase.co 
    *.stripe.com
    *.google-analytics.com;
  font-src 'self' fonts.gstatic.com;
  connect-src 'self' 
    *.supabase.co 
    *.stripe.com 
    *.google.com
    *.google-analytics.com
    *.googletagmanager.com;
  frame-src 'self' *.stripe.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;
```

## 🔍 Security Monitoring

### Logging & Alerting

```typescript
// Security event logging
interface SecurityEvent {
  type: 'failed_login' | 'suspicious_activity' | 'data_breach' | 'unauthorized_access';
  userId?: string;
  ip: string;
  userAgent: string;
  timestamp: Date;
  details: Record<string, any>;
}

export const logSecurityEvent = async (
  type: SecurityEvent['type'],
  details: Record<string, any>,
  req?: Request
) => {
  const event: SecurityEvent = {
    type,
    ip: getClientIP(req),
    userAgent: req?.headers.get('user-agent') || 'unknown',
    timestamp: new Date(),
    details,
  };

  // Log to security monitoring service
  await supabase.from('security_logs').insert(event);

  // Alert on critical events
  if (['data_breach', 'unauthorized_access'].includes(type)) {
    await sendSecurityAlert(event);
  }
};
```

### Anomaly Detection

```typescript
// Detect suspicious patterns
export const detectAnomalies = async (userId: string) => {
  const recentActivity = await supabase
    .from('user_activity')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000));

  // Check for unusual patterns
  const suspiciousPatterns = [
    // Multiple failed login attempts
    recentActivity.filter(a => a.type === 'failed_login').length > 5,
    
    // Rapid document generation
    recentActivity.filter(a => a.type === 'document_generated').length > 50,
    
    // Access from multiple IPs
    new Set(recentActivity.map(a => a.ip_address)).size > 3,
  ];

  if (suspiciousPatterns.some(Boolean)) {
    await logSecurityEvent('suspicious_activity', {
      userId,
      patterns: suspiciousPatterns,
    });
  }
};
```

## 🛡️ Secure Development Practices

### Code Security

#### Dependency Management
```bash
# Regular security audits
npm audit
npm audit fix

# Check for known vulnerabilities
npx audit-ci --config audit-ci.json

# Dependency scanning
npm install -g retire
retire
```

#### Static Code Analysis
```bash
# ESLint security rules
npm install eslint-plugin-security --save-dev

# SonarQube integration
sonar-scanner \
  -Dsonar.projectKey=docmagic \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000
```

#### Secret Management
```typescript
// Environment variable validation
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'GEMINI_API_KEY',
  'STRIPE_SECRET_KEY',
] as const;

export const validateEnvironment = () => {
  const missing = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Secret rotation
export const rotateApiKeys = async () => {
  // Implement key rotation logic
  // This should be done regularly and automatically
};
```

### Secure File Handling

```typescript
// File upload security
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateFileUpload = (file: File) => {
  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('Invalid file type');
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }

  // Scan for malware (in production)
  if (process.env.NODE_ENV === 'production') {
    return scanFileForMalware(file);
  }

  return true;
};

// Secure file processing
export const processUploadedFile = async (file: File) => {
  // Validate file
  await validateFileUpload(file);

  // Generate secure filename
  const secureFilename = `${crypto.randomUUID()}.${getFileExtension(file.name)}`;

  // Upload to secure storage
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(secureFilename, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error('File upload failed');
  }

  return data;
};
```

## 🔐 Privacy & Compliance

### Data Privacy

#### GDPR Compliance
```typescript
// Data export functionality
export const exportUserData = async (userId: string) => {
  const userData = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  const userDocuments = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId);

  return {
    profile: userData.data,
    documents: userDocuments.data,
    exportedAt: new Date().toISOString(),
  };
};

// Data deletion
export const deleteUserData = async (userId: string) => {
  // Delete in correct order due to foreign key constraints
  await supabase.from('documents').delete().eq('user_id', userId);
  await supabase.from('subscriptions').delete().eq('user_id', userId);
  await supabase.from('profiles').delete().eq('id', userId);
  
  // Log deletion for audit trail
  await logSecurityEvent('data_deletion', { userId });
};
```

#### Data Retention
```typescript
// Automatic data cleanup
export const cleanupExpiredData = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Delete old temporary documents
  await supabase
    .from('documents')
    .delete()
    .eq('is_temporary', true)
    .lt('created_at', thirtyDaysAgo.toISOString());

  // Archive old security logs
  await supabase
    .from('security_logs')
    .update({ archived: true })
    .lt('created_at', thirtyDaysAgo.toISOString());
};
```

### Audit Trail

```typescript
// Comprehensive audit logging
interface AuditEvent {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ip: string;
  userAgent: string;
  timestamp: Date;
}

export const logAuditEvent = async (event: Omit<AuditEvent, 'timestamp'>) => {
  await supabase.from('audit_logs').insert({
    ...event,
    timestamp: new Date(),
  });
};

// Usage example
await logAuditEvent({
  userId: user.id,
  action: 'UPDATE',
  resource: 'profile',
  resourceId: user.id,
  oldValues: { name: 'Old Name' },
  newValues: { name: 'New Name' },
  ip: getClientIP(req),
  userAgent: req.headers.get('user-agent'),
});
```

## 🚨 Incident Response

### Security Incident Playbook

#### 1. Detection & Analysis
- Monitor security alerts and logs
- Assess severity and impact
- Document initial findings

#### 2. Containment
```bash
# Emergency response commands
# Disable compromised user account
supabase auth admin delete-user <user-id>

# Revoke API access
# Update environment variables to rotate keys

# Block suspicious IP addresses
# Update firewall rules or CDN settings
```

#### 3. Eradication
- Remove malicious code or unauthorized access
- Patch vulnerabilities
- Update security configurations

#### 4. Recovery
- Restore services from clean backups
- Monitor for continued threats
- Implement additional security measures

#### 5. Lessons Learned
- Document incident details
- Update security procedures
- Conduct team training

### Emergency Contacts

- **Security Team**: security@docmagic.com
- **DevOps Team**: devops@docmagic.com
- **Legal Team**: legal@docmagic.com

## 📋 Security Checklist

### Development
- [ ] Input validation on all user inputs
- [ ] Output encoding for XSS prevention
- [ ] SQL injection prevention (using ORM/prepared statements)
- [ ] Authentication and authorization checks
- [ ] Secure session management
- [ ] CSRF protection
- [ ] Rate limiting implementation
- [ ] Security headers configuration
- [ ] Dependency vulnerability scanning
- [ ] Code security review

### Deployment
- [ ] Environment variables secured
- [ ] TLS/SSL certificates configured
- [ ] Database access restricted
- [ ] API endpoints protected
- [ ] File upload restrictions
- [ ] Monitoring and alerting setup
- [ ] Backup and recovery tested
- [ ] Security scanning completed
- [ ] Penetration testing performed
- [ ] Incident response plan ready

### Ongoing
- [ ] Regular security updates
- [ ] Dependency audits
- [ ] Access reviews
- [ ] Log monitoring
- [ ] Vulnerability assessments
- [ ] Security training
- [ ] Compliance audits
- [ ] Backup testing
- [ ] Incident response drills
- [ ] Security metrics tracking

## 📚 Security Resources

### Training Materials
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [SANS Security Training](https://www.sans.org/)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase Security Guide](https://supabase.com/docs/guides/platform/security)

### Tools & Services
- **Static Analysis**: SonarQube, CodeQL
- **Dependency Scanning**: Snyk, npm audit
- **Runtime Protection**: Cloudflare, AWS WAF
- **Monitoring**: Sentry, LogRocket
- **Penetration Testing**: OWASP ZAP, Burp Suite

---

<div align="center">
  <p><strong>DocMagic Security Policy v1.0</strong></p>
  <p>Security is everyone's responsibility 🔒</p>
</div>