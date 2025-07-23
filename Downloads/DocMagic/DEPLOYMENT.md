# 🚀 DocMagic Deployment Guide

<div align="center">

![Deployment](https://img.shields.io/badge/Deployment-Guide-FF6B6B?style=for-the-badge)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel)

</div>

## 📋 Overview

This guide covers deploying DocMagic to various platforms including Netlify, Vercel, and self-hosted solutions. DocMagic is built with Next.js 15 and requires specific configurations for optimal performance.

## 🌐 Platform-Specific Deployments

### 🟢 Netlify Deployment (Recommended)

DocMagic is optimized for Netlify deployment with the included `netlify.toml` configuration.

#### Prerequisites
- GitHub/GitLab repository
- Netlify account
- Environment variables configured

#### Automatic Deployment

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Deploy to Netlify"
   git push origin main
   ```

2. **Netlify Configuration**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Netlify will auto-detect Next.js settings

3. **Build Settings** (Auto-configured via `netlify.toml`)
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   
   [build.environment]
     NODE_VERSION = "18"
   ```

#### Manual Netlify CLI Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

### ⚡ Vercel Deployment

Vercel provides excellent Next.js support with zero configuration.

#### Automatic Deployment

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configuration**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "framework": "nextjs",
     "nodeVersion": "18.x"
   }
   ```

#### Vercel CLI Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 🐳 Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG GEMINI_API_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  docmagic:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - docmagic
    restart: unless-stopped
```

### ☁️ AWS Deployment

#### AWS Amplify

1. **Connect Repository**
   ```bash
   # Install Amplify CLI
   npm install -g @aws-amplify/cli

   # Configure Amplify
   amplify configure

   # Initialize project
   amplify init

   # Add hosting
   amplify add hosting

   # Deploy
   amplify publish
   ```

2. **Build Settings** (`amplify.yml`)
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

#### AWS EC2 with PM2

```bash
# Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone and setup project
git clone https://github.com/yourusername/docmagic.git
cd docmagic
npm install
npm run build

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'docmagic',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔧 Environment Configuration

### Required Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_or_test_key
STRIPE_WEBHOOK_SECRET=whsec_webhook_secret
STRIPE_PRICE_ID=price_subscription_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.com

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=your_hotjar_id
```

### Platform-Specific Environment Setup

#### Netlify Environment Variables
```bash
# Via Netlify CLI
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set GEMINI_API_KEY "your_api_key"

# Or via Netlify Dashboard
# Site settings > Environment variables
```

#### Vercel Environment Variables
```bash
# Via Vercel CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add GEMINI_API_KEY

# Or via Vercel Dashboard
# Project settings > Environment Variables
```

## 🗄️ Database Setup

### Supabase Database Migration

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Generate TypeScript types
supabase gen types typescript --project-id your-project-id > types/supabase.ts
```

### Database Schema Setup

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 🔒 Security Configuration

### Content Security Policy

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.stripe.com *.google.com;
      style-src 'self' 'unsafe-inline' fonts.googleapis.com;
      img-src 'self' data: blob: *.pexels.com *.supabase.co;
      font-src 'self' fonts.gstatic.com;
      connect-src 'self' *.supabase.co *.stripe.com *.google.com;
      frame-src 'self' *.stripe.com;
    `.replace(/\s{2,}/g, ' ').trim()
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

### CORS Configuration

```javascript
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  return NextResponse.next();
}
```

## 📊 Monitoring & Analytics

### Performance Monitoring

```javascript
// lib/analytics.ts
export const trackEvent = (eventName: string, properties?: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};
```

### Error Tracking with Sentry

```bash
# Install Sentry
npm install @sentry/nextjs

# Configure Sentry
npx @sentry/wizard -i nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

## 🚀 Performance Optimization

### Build Optimization

```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },
  images: {
    domains: ['images.pexels.com', 'your-supabase-url.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};
```

### CDN Configuration

```javascript
// For static assets
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.yourdomain.com' 
    : '',
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: '.next'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates configured
- [ ] Domain DNS configured
- [ ] Stripe webhooks configured
- [ ] Error tracking setup
- [ ] Performance monitoring enabled
- [ ] Backup strategy implemented

## 🛠️ Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check for TypeScript errors
npm run type-check

# Analyze bundle size
npm run analyze
```

#### Environment Variable Issues

```bash
# Verify environment variables
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"

# Check build-time vs runtime variables
# Build-time: NEXT_PUBLIC_*
# Runtime: All others
```

#### Database Connection Issues

```javascript
// Test Supabase connection
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Test connection
const testConnection = async () => {
  const { data, error } = await supabase.from('profiles').select('count');
  console.log('Connection test:', { data, error });
};
```

### Performance Issues

```bash
# Analyze bundle
npm run build && npm run analyze

# Check for large dependencies
npx bundlephobia <package-name>

# Lighthouse audit
npx lighthouse https://your-domain.com --view
```

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Netlify Next.js Plugin](https://github.com/netlify/netlify-plugin-nextjs)
- [Vercel Next.js Guide](https://vercel.com/docs/frameworks/nextjs)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)

---

<div align="center">
  <p><strong>DocMagic Deployment Guide v1.0</strong></p>
  <p>Deploy with confidence 🚀</p>
</div>