# 🔐 DocMagic Authentication Guide

<div align="center">

![Authentication](https://img.shields.io/badge/Authentication-Guide-FF6B6B?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase)
![JWT](https://img.shields.io/badge/JWT-Tokens-000000?style=for-the-badge)

</div>

## 📋 Overview

DocMagic uses Supabase Auth for secure user authentication and authorization. This guide covers authentication flows, token management, and security best practices.

## 🚀 Authentication Flow

### User Registration

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${location.origin}/auth/callback`
    }
  })
  
  if (error) throw error
  return data
}
```

### User Sign In

```typescript
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}
```

### OAuth Providers

DocMagic supports multiple OAuth providers:

```typescript
// Google OAuth
const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${location.origin}/auth/callback`
    }
  })
}

// GitHub OAuth
const signInWithGitHub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${location.origin}/auth/callback`
    }
  })
}
```

## 🔑 Token Management

### JWT Token Structure

```json
{
  "aud": "authenticated",
  "exp": 1640995200,
  "sub": "user-uuid",
  "email": "user@example.com",
  "app_metadata": {
    "provider": "email",
    "providers": ["email"]
  },
  "user_metadata": {
    "email": "user@example.com",
    "email_verified": false,
    "phone_verified": false,
    "sub": "user-uuid"
  },
  "role": "authenticated"
}
```

### Token Refresh

```typescript
const refreshToken = async () => {
  const { data, error } = await supabase.auth.refreshSession()
  
  if (error) throw error
  return data
}
```

### Session Management

```typescript
// Get current session
const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session)
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out')
  }
})
```

## 🛡️ Security Features

### Row Level Security (RLS)

DocMagic implements RLS policies to ensure data isolation:

```sql
-- Users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can only access their own documents
CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);
```

### API Route Protection

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect API routes
  if (req.nextUrl.pathname.startsWith('/api/protected')) {
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  return res
}
```

## 🔒 Password Security

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Password Reset

```typescript
const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${location.origin}/auth/reset-password`
  })
  
  if (error) throw error
  return data
}
```

## 📱 Multi-Factor Authentication

### Enable MFA

```typescript
const enableMFA = async () => {
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp'
  })
  
  if (error) throw error
  return data
}
```

### Verify MFA

```typescript
const verifyMFA = async (factorId: string, code: string) => {
  const { data, error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: 'challenge-id',
    code
  })
  
  if (error) throw error
  return data
}
```

## 🚨 Error Handling

### Common Auth Errors

```typescript
const handleAuthError = (error: any) => {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Invalid email or password'
    case 'Email not confirmed':
      return 'Please check your email and click the confirmation link'
    case 'User already registered':
      return 'An account with this email already exists'
    default:
      return 'An unexpected error occurred'
  }
}
```

## 🔧 Environment Variables

Required environment variables for authentication:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## 📚 Best Practices

1. **Always validate tokens server-side**
2. **Use HTTPS in production**
3. **Implement proper session timeout**
4. **Log authentication events**
5. **Use strong password policies**
6. **Enable MFA for sensitive operations**
7. **Regularly rotate secrets**

## 🔗 Related Documentation

- [API Documentation](./API.md)
- [Security Policy](./SECURITY.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

<div align="center">

**Need help?** Check our [troubleshooting guide](./TROUBLESHOOTING.md) or [contact support](mailto:support@docmagic.com).

</div>