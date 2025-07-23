# 🚀 DocMagic API Documentation

<div align="center">

![API](https://img.shields.io/badge/API-Documentation-FF6B6B?style=for-the-badge)
![REST](https://img.shields.io/badge/REST-API-4ECDC4?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-Routes-000000?style=for-the-badge&logo=next.js)

</div>

## 📋 Overview

DocMagic's API is built using Next.js API Routes, providing a robust and scalable backend for AI-powered document generation. All endpoints are RESTful and return JSON responses with comprehensive error handling.

### Base URL
```
https://your-domain.com/api
```

### Authentication
Most endpoints require authentication via Supabase Auth. Include the authorization header:
```
Authorization: Bearer <supabase_jwt_token>
```

## 🤖 AI Document Generation

### Generate Resume

**Endpoint:** `POST /api/generate/resume`

Generate a professional resume from a simple text prompt.

#### Request Body
```json
{
  "prompt": "Software engineer with 5 years experience in React and Node.js",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "location": "San Francisco, CA"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "personalInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "location": "San Francisco, CA",
      "summary": "Experienced software engineer with 5+ years..."
    },
    "workExperience": [
      {
        "company": "Tech Corp",
        "position": "Senior Software Engineer",
        "duration": "2020 - Present",
        "description": "Led development of React applications..."
      }
    ],
    "skills": ["React", "Node.js", "TypeScript", "AWS"],
    "education": [
      {
        "institution": "University of Technology",
        "degree": "Bachelor of Computer Science",
        "year": "2018"
      }
    ]
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Invalid prompt provided",
  "code": "INVALID_INPUT"
}
```

### Generate Guided Resume

**Endpoint:** `POST /api/generate/guided-resume`

Generate a resume with structured input data.

#### Request Body
```json
{
  "personalInfo": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1987654321",
    "location": "New York, NY"
  },
  "workExperience": [
    {
      "company": "StartupXYZ",
      "position": "Frontend Developer",
      "startDate": "2021-01",
      "endDate": "2023-12",
      "responsibilities": ["Developed React components", "Optimized performance"]
    }
  ],
  "skills": ["JavaScript", "React", "CSS"],
  "education": [
    {
      "institution": "Design College",
      "degree": "Bachelor of Arts",
      "graduationYear": "2020"
    }
  ],
  "targetRole": "Senior Frontend Developer"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "optimizedResume": {
      "personalInfo": { /* Enhanced personal info */ },
      "professionalSummary": "Results-driven frontend developer...",
      "workExperience": [ /* Optimized experience descriptions */ ],
      "skills": [ /* Categorized and prioritized skills */ ],
      "education": [ /* Formatted education */ ]
    },
    "atsScore": 85,
    "suggestions": [
      "Add more quantifiable achievements",
      "Include relevant keywords for the target role"
    ]
  }
}
```

### Generate Presentation

**Endpoint:** `POST /api/generate/presentation`

Create a presentation from a topic description.

#### Request Body
```json
{
  "prompt": "Quarterly sales review for Q4 2024",
  "pageCount": 10,
  "template": "professional",
  "includeCharts": true,
  "includeImages": true
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "slides": [
      {
        "id": 1,
        "title": "Q4 2024 Sales Review",
        "content": "Overview of quarterly performance",
        "layout": "title-slide",
        "backgroundImage": "https://images.pexels.com/..."
      },
      {
        "id": 2,
        "title": "Sales Performance",
        "content": "Key metrics and achievements",
        "layout": "content-chart",
        "chart": {
          "type": "bar",
          "data": [
            { "month": "Oct", "sales": 150000 },
            { "month": "Nov", "sales": 180000 },
            { "month": "Dec", "sales": 220000 }
          ]
        }
      }
    ],
    "metadata": {
      "totalSlides": 10,
      "estimatedDuration": "15 minutes",
      "template": "professional"
    }
  }
}
```

### Generate Presentation Outline

**Endpoint:** `POST /api/generate/presentation-outline`

Generate a structured outline for a presentation.

#### Request Body
```json
{
  "prompt": "Introduction to Machine Learning for beginners",
  "pageCount": 15,
  "audience": "beginners",
  "duration": "30 minutes"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "outline": [
      {
        "slideNumber": 1,
        "title": "What is Machine Learning?",
        "keyPoints": [
          "Definition and basic concepts",
          "Real-world examples",
          "Why it matters today"
        ],
        "suggestedLayout": "title-content"
      },
      {
        "slideNumber": 2,
        "title": "Types of Machine Learning",
        "keyPoints": [
          "Supervised Learning",
          "Unsupervised Learning",
          "Reinforcement Learning"
        ],
        "suggestedLayout": "three-column"
      }
    ],
    "metadata": {
      "totalSlides": 15,
      "estimatedDuration": "30 minutes",
      "difficulty": "beginner"
    }
  }
}
```

### Generate Full Presentation

**Endpoint:** `POST /api/generate/presentation-full`

Generate a complete presentation from an outline.

#### Request Body
```json
{
  "outlines": [
    {
      "title": "Introduction to AI",
      "keyPoints": ["Definition", "Applications", "Future trends"]
    }
  ],
  "template": "modern",
  "prompt": "AI presentation for business executives"
}
```

### Generate Letter

**Endpoint:** `POST /api/generate/letter`

Create professional letters and correspondence.

#### Request Body
```json
{
  "prompt": "Cover letter for software engineer position at Google",
  "fromName": "Alice Johnson",
  "fromEmail": "alice@example.com",
  "toName": "Hiring Manager",
  "toCompany": "Google",
  "letterType": "cover_letter",
  "tone": "professional",
  "jobDescription": "Senior Software Engineer role focusing on backend systems"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "letter": {
      "header": {
        "fromName": "Alice Johnson",
        "fromEmail": "alice@example.com",
        "date": "2024-01-15",
        "toName": "Hiring Manager",
        "toCompany": "Google"
      },
      "subject": "Application for Senior Software Engineer Position",
      "body": "Dear Hiring Manager,\n\nI am writing to express my strong interest...",
      "closing": "Sincerely,\nAlice Johnson"
    },
    "metadata": {
      "wordCount": 250,
      "tone": "professional",
      "type": "cover_letter"
    }
  }
}
```

### Generate Resume Guidance

**Endpoint:** `POST /api/generate/resume-guidance`

Get AI-powered guidance for resume improvement.

#### Request Body
```json
{
  "step": "work_experience",
  "targetRole": "Product Manager",
  "existingData": {
    "currentRole": "Business Analyst",
    "experience": "3 years",
    "industry": "fintech"
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "guidance": {
      "suggestions": [
        "Highlight cross-functional collaboration experience",
        "Quantify business impact with specific metrics",
        "Emphasize user research and data analysis skills"
      ],
      "examples": [
        "Led cross-functional team of 8 to deliver product features, resulting in 25% increase in user engagement",
        "Analyzed user behavior data to identify pain points, leading to 15% reduction in churn rate"
      ],
      "keywords": [
        "product strategy",
        "user experience",
        "data-driven decisions",
        "stakeholder management"
      ]
    },
    "nextStep": "skills",
    "completionPercentage": 60
  }
}
```

## 📊 Analysis Endpoints

### Analyze Resume

**Endpoint:** `POST /api/analyze/resume`

Analyze a resume for ATS compatibility and optimization suggestions.

#### Request (Multipart Form Data)
```
file: [PDF/DOCX file]
jobDescription: "Software Engineer position requiring React, Node.js..."
```

#### Response
```json
{
  "success": true,
  "data": {
    "atsScore": 78,
    "analysis": {
      "strengths": [
        "Strong technical skills section",
        "Quantified achievements",
        "Relevant work experience"
      ],
      "weaknesses": [
        "Missing keywords: 'agile', 'scrum'",
        "No education section",
        "Inconsistent date formatting"
      ],
      "suggestions": [
        "Add 'Agile' and 'Scrum' to skills section",
        "Include education background",
        "Use consistent MM/YYYY date format"
      ]
    },
    "keywordMatch": {
      "matched": ["React", "Node.js", "JavaScript"],
      "missing": ["Agile", "Scrum", "AWS"],
      "score": 65
    },
    "formatting": {
      "score": 85,
      "issues": [
        "Inconsistent bullet point styles",
        "Non-standard section headers"
      ]
    }
  }
}
```

## 📧 Communication

### Send Email

**Endpoint:** `POST /api/send-email`

Send generated documents via email.

#### Request Body
```json
{
  "to": "recipient@example.com",
  "subject": "Your Generated Resume",
  "content": "Please find your generated resume attached.",
  "letterContent": "Generated letter content...",
  "attachments": [
    {
      "filename": "resume.pdf",
      "content": "base64_encoded_content",
      "contentType": "application/pdf"
    }
  ]
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "messageId": "msg_123456789",
    "status": "sent",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## 🔐 Authentication

### Register User

**Endpoint:** `POST /api/auth/register`

Register a new user account.

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "john@example.com",
      "name": "John Doe",
      "created_at": "2024-01-15T10:00:00Z"
    },
    "session": {
      "access_token": "jwt_token_here",
      "refresh_token": "refresh_token_here",
      "expires_at": "2024-01-15T11:00:00Z"
    }
  }
}
```

## 💳 Payments & Subscriptions

### Check Subscription Status

**Endpoint:** `GET /api/stripe/check-subscription`

Check the current user's subscription status.

#### Headers
```
Authorization: Bearer <supabase_jwt_token>
```

#### Response
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub_123456789",
      "status": "active",
      "plan": "pro",
      "currentPeriodEnd": "2024-02-15T00:00:00Z",
      "cancelAtPeriodEnd": false
    },
    "usage": {
      "documentsGenerated": 15,
      "monthlyLimit": 100,
      "resetDate": "2024-02-01T00:00:00Z"
    }
  }
}
```

### Create Checkout Session

**Endpoint:** `POST /api/stripe/create-checkout`

Create a Stripe checkout session for subscription.

#### Request Body
```json
{
  "priceId": "price_123456789",
  "successUrl": "https://yourapp.com/success",
  "cancelUrl": "https://yourapp.com/cancel"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/pay/cs_123456789",
    "sessionId": "cs_123456789"
  }
}
```

### Create Customer Portal

**Endpoint:** `POST /api/stripe/create-portal`

Create a Stripe customer portal session.

#### Response
```json
{
  "success": true,
  "data": {
    "portalUrl": "https://billing.stripe.com/session/123456789"
  }
}
```

### Stripe Webhook

**Endpoint:** `POST /api/stripe/webhook`

Handle Stripe webhook events (internal use).

## 👤 User Management

### Get User Data

**Endpoint:** `GET /api/user`

Retrieve current user data and subscription information.

#### Headers
```
Authorization: Bearer <supabase_jwt_token>
```

#### Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "john@example.com",
      "name": "John Doe",
      "avatar_url": "https://example.com/avatar.jpg",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "subscription": {
      "plan": "pro",
      "status": "active",
      "documentsRemaining": 85
    },
    "preferences": {
      "theme": "dark",
      "defaultTemplate": "modern",
      "emailNotifications": true
    }
  }
}
```

## 🚨 Error Handling

### Error Response Format

All API endpoints return errors in a consistent format:

```json
{
  "success": false,
  "error": "Detailed error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "specific field that caused the error",
    "value": "invalid value"
  }
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `INVALID_INPUT` | Request validation failed | 400 |
| `UNAUTHORIZED` | Authentication required | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `RATE_LIMITED` | Too many requests | 429 |
| `AI_SERVICE_ERROR` | AI service unavailable | 503 |
| `SUBSCRIPTION_REQUIRED` | Premium feature requires subscription | 402 |
| `QUOTA_EXCEEDED` | Monthly usage limit reached | 429 |

### Rate Limiting

API endpoints are rate-limited to ensure fair usage:

- **Free users**: 10 requests per minute
- **Pro users**: 60 requests per minute
- **Enterprise users**: 300 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1642694400
```

## 📝 Request/Response Examples

### Complete Resume Generation Flow

```bash
# 1. Generate resume
curl -X POST https://yourapp.com/api/generate/resume \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "prompt": "Senior React developer with 7 years experience",
    "name": "Sarah Chen",
    "email": "sarah@example.com"
  }'

# 2. Analyze generated resume
curl -X POST https://yourapp.com/api/analyze/resume \
  -H "Authorization: Bearer your_jwt_token" \
  -F "file=@resume.pdf" \
  -F "jobDescription=Senior Frontend Developer at tech startup"

# 3. Send resume via email
curl -X POST https://yourapp.com/api/send-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "to": "hr@company.com",
    "subject": "Application for Senior Frontend Developer",
    "content": "Please find my resume attached.",
    "attachments": [...]
  }'
```

## 🔧 SDK and Integration

### JavaScript/TypeScript SDK

```typescript
import { DocMagicAPI } from '@docmagic/sdk';

const api = new DocMagicAPI({
  apiKey: 'your_api_key',
  baseUrl: 'https://yourapp.com/api'
});

// Generate resume
const resume = await api.generateResume({
  prompt: 'Software engineer with React experience',
  name: 'John Doe',
  email: 'john@example.com'
});

// Analyze resume
const analysis = await api.analyzeResume({
  file: resumeFile,
  jobDescription: 'Frontend developer position'
});
```

### Python SDK

```python
from docmagic import DocMagicAPI

api = DocMagicAPI(api_key='your_api_key')

# Generate presentation
presentation = api.generate_presentation(
    prompt='Quarterly business review',
    page_count=10,
    template='professional'
)

# Get user data
user = api.get_user()
```

## 📚 Additional Resources

- [Authentication Guide](./AUTH.md)
- [Webhook Documentation](./WEBHOOKS.md)
- [SDK Documentation](./SDK.md)
- [Rate Limiting Guide](./RATE_LIMITS.md)

---

<div align="center">
  <p><strong>DocMagic API v1.0</strong></p>
  <p>Built for developers, powered by AI ✨</p>
</div>