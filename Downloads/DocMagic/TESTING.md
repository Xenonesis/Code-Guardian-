# 🧪 DocMagic Testing Guide

<div align="center">

![Testing](https://img.shields.io/badge/Testing-Guide-FF6B6B?style=for-the-badge)
![Jest](https://img.shields.io/badge/Jest-Testing-C21325?style=for-the-badge&logo=jest)
![Cypress](https://img.shields.io/badge/Cypress-E2E-17202C?style=for-the-badge&logo=cypress)

</div>

## 📋 Overview

This guide covers testing strategies, setup, and best practices for DocMagic. We use a comprehensive testing approach including unit tests, integration tests, and end-to-end testing.

## 🚀 Testing Stack

### Unit & Integration Testing
- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **MSW (Mock Service Worker)**: API mocking for tests

### End-to-End Testing
- **Cypress**: E2E testing framework
- **Playwright**: Alternative E2E testing (optional)

## 🔧 Setup & Installation

### Install Testing Dependencies

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
npm install --save-dev cypress @cypress/react @cypress/webpack-dev-server
npm install --save-dev msw
```

### Jest Configuration

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    // Handle module aliases (this will be automatically configured for you based on your tsconfig.json paths)
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

### Jest Setup File

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock Supabase
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    auth: {
      getUser: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
    },
  }),
}))
```

## 📝 Writing Tests

### Component Testing

```typescript
// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant styles correctly', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')
  })
})
```

### API Route Testing

```typescript
// app/api/__tests__/generate/resume.test.ts
import { POST } from '@/app/api/generate/resume/route'
import { NextRequest } from 'next/server'

// Mock Gemini AI
jest.mock('@/lib/gemini', () => ({
  generateResume: jest.fn(),
}))

describe('/api/generate/resume', () => {
  it('generates resume successfully', async () => {
    const mockResume = {
      personalInfo: { name: 'John Doe' },
      workExperience: [],
      skills: [],
      education: []
    }

    require('@/lib/gemini').generateResume.mockResolvedValue(mockResume)

    const request = new NextRequest('http://localhost:3000/api/generate/resume', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'Software engineer with React experience',
        name: 'John Doe',
        email: 'john@example.com'
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toEqual(mockResume)
  })

  it('handles missing required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate/resume', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
  })
})
```

### Hook Testing

```typescript
// hooks/__tests__/use-subscription.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useSubscription } from '@/hooks/use-subscription'

// Mock Supabase
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
      })),
    })),
  })),
}

jest.mock('@/lib/supabase/client', () => mockSupabase)

describe('useSubscription', () => {
  it('fetches subscription data', async () => {
    const mockSubscription = {
      id: '1',
      status: 'active',
      plan: 'pro'
    }

    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: mockSubscription,
      error: null
    })

    const { result } = renderHook(() => useSubscription())

    await waitFor(() => {
      expect(result.current.subscription).toEqual(mockSubscription)
      expect(result.current.loading).toBe(false)
    })
  })
})
```

## 🌐 End-to-End Testing

### Cypress Configuration

Create `cypress.config.ts`:

```typescript
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
```

### E2E Test Examples

```typescript
// cypress/e2e/resume-generation.cy.ts
describe('Resume Generation', () => {
  beforeEach(() => {
    cy.visit('/resume')
  })

  it('generates a resume from prompt', () => {
    // Fill in the form
    cy.get('[data-testid="prompt-input"]').type('Software engineer with 5 years React experience')
    cy.get('[data-testid="name-input"]').type('John Doe')
    cy.get('[data-testid="email-input"]').type('john@example.com')
    
    // Submit form
    cy.get('[data-testid="generate-button"]').click()
    
    // Check loading state
    cy.get('[data-testid="loading-spinner"]').should('be.visible')
    
    // Check results
    cy.get('[data-testid="resume-preview"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-testid="download-button"]').should('be.enabled')
  })

  it('handles authentication flow', () => {
    cy.get('[data-testid="generate-button"]').click()
    
    // Should redirect to sign in if not authenticated
    cy.url().should('include', '/auth/signin')
  })
})
```

## 📊 Test Coverage

### Coverage Configuration

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open"
  },
  "jest": {
    "collectCoverageFrom": [
      "components/**/*.{js,jsx,ts,tsx}",
      "lib/**/*.{js,jsx,ts,tsx}",
      "hooks/**/*.{js,jsx,ts,tsx}",
      "app/**/*.{js,jsx,ts,tsx}",
      "!**/*.d.ts",
      "!**/node_modules/**"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## 🔄 Continuous Integration

### GitHub Actions Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
    
    - name: Run E2E tests
      uses: cypress-io/github-action@v5
      with:
        build: npm run build
        start: npm start
        wait-on: 'http://localhost:3000'
```

## 🎯 Testing Best Practices

### 1. Test Structure
- **Arrange**: Set up test data and conditions
- **Act**: Execute the code being tested
- **Assert**: Verify the expected outcome

### 2. Test Naming
```typescript
// Good
it('should generate resume when valid prompt is provided')

// Bad
it('test resume generation')
```

### 3. Mock External Dependencies
- Mock API calls
- Mock third-party libraries
- Mock environment variables

### 4. Test Data Management
```typescript
// Use factories for test data
const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  ...overrides
})
```

### 5. Accessibility Testing
```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## 🐛 Debugging Tests

### Debug Jest Tests
```bash
# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Run specific test file
npm test -- --testNamePattern="Button Component"
```

### Debug Cypress Tests
```bash
# Open Cypress Test Runner
npm run test:e2e:open

# Run Cypress in headed mode
npx cypress run --headed --browser chrome
```

## 📈 Performance Testing

### Load Testing with Artillery
```yaml
# artillery.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "Resume Generation"
    requests:
      - post:
          url: "/api/generate/resume"
          json:
            prompt: "Software engineer"
            name: "Test User"
```

## 🔧 Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout values
   - Check for unresolved promises
   - Mock slow operations

2. **Module resolution errors**
   - Check Jest moduleNameMapping
   - Verify tsconfig.json paths

3. **Cypress flaky tests**
   - Use proper wait conditions
   - Avoid hard-coded delays
   - Use data-testid attributes

### Useful Commands

```bash
# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test Button.test.tsx

# Update snapshots
npm test -- --updateSnapshot
```

<div align="center">

---

**Happy Testing! 🧪✨**

*Ensuring DocMagic works perfectly for every user*

</div>