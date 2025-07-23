# 🔧 DocMagic Troubleshooting Guide

<div align="center">

![Troubleshooting](https://img.shields.io/badge/Troubleshooting-Guide-FF6B6B?style=for-the-badge)
![Support](https://img.shields.io/badge/Support-Help-4ECDC4?style=for-the-badge)
![Solutions](https://img.shields.io/badge/Solutions-Ready-45B7D1?style=for-the-badge)

</div>

## 📋 Overview

This guide helps you diagnose and resolve common issues with DocMagic. Whether you're experiencing setup problems, runtime errors, or deployment issues, you'll find solutions here.

## 🚨 Common Issues & Solutions

### 1. Installation & Setup Issues

#### Node.js Version Compatibility
**Problem**: Build fails with Node.js version errors
```bash
Error: The engine "node" is incompatible with this module
```

**Solution**:
```bash
# Check your Node.js version
node --version

# Install Node.js 18 or higher
nvm install 18
nvm use 18

# Or using Node Version Manager
n 18
```

#### Package Installation Failures
**Problem**: `npm install` fails with dependency conflicts
```bash
npm ERR! peer dep missing
```

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# If issues persist, use legacy peer deps
npm install --legacy-peer-deps
```

### 2. Development Server Issues

#### Port Already in Use
**Problem**: Development server won't start
```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use a different port
npm run dev -- -p 3001
```

#### Environment Variables Not Loading
**Problem**: Environment variables are undefined
```bash
Error: NEXT_PUBLIC_SUPABASE_URL is not defined
```

**Solution**:
1. Check `.env.local` file exists in root directory
2. Verify variable names start with `NEXT_PUBLIC_` for client-side access
3. Restart development server after adding new variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Authentication Issues

#### Supabase Connection Errors
**Problem**: Authentication not working
```bash
Error: Invalid API key
```

**Solution**:
1. Verify Supabase credentials in `.env.local`
2. Check Supabase project status
3. Ensure RLS policies are configured correctly

```typescript
// Test Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Test connection
const testConnection = async () => {
  const { data, error } = await supabase.from('profiles').select('*').limit(1)
  console.log('Connection test:', { data, error })
}
```

#### Session Persistence Issues
**Problem**: User gets logged out on page refresh
```bash
Error: No session found
```

**Solution**:
1. Check cookie settings in Supabase
2. Verify domain configuration
3. Ensure proper session handling

```typescript
// components/auth-provider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### 4. AI Generation Issues

#### Gemini AI API Errors
**Problem**: Document generation fails
```bash
Error: Gemini API request failed
```

**Solution**:
1. Verify Gemini API key
2. Check API quota and billing
3. Implement proper error handling

```typescript
// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const generateWithRetry = async (prompt: string, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
      const result = await model.generateContent(prompt)
      return result.response.text()
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error)
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

#### Rate Limiting Issues
**Problem**: Too many API requests
```bash
Error: Rate limit exceeded
```

**Solution**:
1. Implement request queuing
2. Add exponential backoff
3. Cache responses when possible

```typescript
// lib/rate-limiter.ts
class RateLimiter {
  private requests: number[] = []
  private maxRequests: number
  private timeWindow: number

  constructor(maxRequests: number, timeWindowMs: number) {
    this.maxRequests = maxRequests
    this.timeWindow = timeWindowMs
  }

  async waitForSlot(): Promise<void> {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.timeWindow)

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests)
      const waitTime = this.timeWindow - (now - oldestRequest)
      await new Promise(resolve => setTimeout(resolve, waitTime))
      return this.waitForSlot()
    }

    this.requests.push(now)
  }
}

const rateLimiter = new RateLimiter(10, 60000) // 10 requests per minute
```

### 5. Database Issues

#### Migration Errors
**Problem**: Database migrations fail
```bash
Error: relation "profiles" does not exist
```

**Solution**:
1. Run migrations manually
2. Check migration order
3. Verify database permissions

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Create missing tables
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);
```

#### RLS Policy Issues
**Problem**: Database queries fail with permission errors
```bash
Error: new row violates row-level security policy
```

**Solution**:
1. Review RLS policies
2. Test policies with different user roles
3. Ensure proper policy conditions

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 6. Stripe Integration Issues

#### Webhook Verification Failures
**Problem**: Stripe webhooks not processing
```bash
Error: Webhook signature verification failed
```

**Solution**:
1. Verify webhook endpoint URL
2. Check webhook signing secret
3. Ensure raw body parsing

```typescript
// app/api/stripe/webhook/route.ts
import { headers } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    
    // Process event
    console.log('Webhook event:', event.type)
    
    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Webhook error', { status: 400 })
  }
}
```

### 7. Build & Deployment Issues

#### Next.js Build Failures
**Problem**: Build fails with TypeScript errors
```bash
Error: Type error: Property 'x' does not exist
```

**Solution**:
1. Fix TypeScript errors
2. Update type definitions
3. Check for missing dependencies

```bash
# Type check without building
npx tsc --noEmit

# Build with detailed error output
npm run build -- --debug
```

#### Netlify Deployment Issues
**Problem**: Deployment fails on Netlify
```bash
Error: Build failed due to a user error
```

**Solution**:
1. Check build logs in Netlify dashboard
2. Verify environment variables
3. Ensure build command is correct

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "8"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 8. Performance Issues

#### Slow Page Load Times
**Problem**: Pages load slowly
```bash
Warning: Large bundle size detected
```

**Solution**:
1. Analyze bundle size
2. Implement code splitting
3. Optimize images and assets

```bash
# Analyze bundle
npm run build
npx @next/bundle-analyzer

# Check for large dependencies
npm ls --depth=0 --long
```

#### Memory Leaks
**Problem**: Application uses excessive memory
```bash
Warning: Possible memory leak detected
```

**Solution**:
1. Clean up event listeners
2. Cancel pending requests
3. Optimize component re-renders

```typescript
// Cleanup pattern
useEffect(() => {
  const controller = new AbortController()
  
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data', {
        signal: controller.signal
      })
      // Handle response
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Fetch error:', error)
      }
    }
  }

  fetchData()

  return () => {
    controller.abort()
  }
}, [])
```

## 🔍 Debugging Tools

### 1. Browser Developer Tools
- **Console**: Check for JavaScript errors
- **Network**: Monitor API requests
- **Application**: Inspect local storage and cookies

### 2. Next.js Debug Mode
```bash
# Enable debug mode
DEBUG=* npm run dev

# Debug specific modules
DEBUG=next:* npm run dev
```

### 3. Supabase Logs
```typescript
// Enable Supabase debug mode
const supabase = createClient(url, key, {
  auth: {
    debug: true
  }
})
```

### 4. Stripe CLI
```bash
# Listen to webhooks locally
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Test webhook events
stripe trigger payment_intent.succeeded
```

## 📞 Getting Help

### 1. Check Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

### 2. Community Support
- GitHub Issues
- Discord Community
- Stack Overflow

### 3. Professional Support
- Email: support@docmagic.com
- Priority support for Pro users
- Custom integration assistance

## 🛠️ Diagnostic Commands

### System Information
```bash
# Node.js and npm versions
node --version
npm --version

# Check dependencies
npm list

# Audit for vulnerabilities
npm audit
```

### Application Health Check
```bash
# Test API endpoints
curl -X GET http://localhost:3000/api/health

# Check database connection
npm run db:test

# Verify environment variables
npm run env:check
```

### Performance Monitoring
```bash
# Bundle analysis
npm run analyze

# Lighthouse audit
npx lighthouse http://localhost:3000

# Memory usage
node --inspect npm run dev
```

## 📊 Error Codes Reference

| Code | Description | Solution |
|------|-------------|----------|
| AUTH_001 | Invalid credentials | Check API keys |
| DB_001 | Connection failed | Verify database URL |
| API_001 | Rate limit exceeded | Implement backoff |
| BUILD_001 | TypeScript error | Fix type issues |
| DEPLOY_001 | Environment missing | Add env variables |

<div align="center">

---

**Need More Help? 🤝**

*Contact our support team for personalized assistance*

[📧 Email Support](mailto:support@docmagic.com) • [💬 Discord](https://discord.gg/docmagic) • [📚 Documentation](https://docs.docmagic.com)

</div>