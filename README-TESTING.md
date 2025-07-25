# Testing Guide for Code Guardian

## Overview
This document provides comprehensive information about the testing setup and practices for the Code Guardian application.

## Testing Stack
- **Test Runner**: Vitest
- **Testing Library**: @testing-library/react
- **Coverage**: @vitest/coverage-v8
- **Environment**: jsdom

## Available Scripts

```bash
# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Test Structure

```
src/
├── test/
│   ├── setup.ts          # Test setup and global mocks
│   └── test-utils.tsx    # Custom render utilities
├── components/
│   └── __tests__/        # Component tests
├── hooks/
│   └── __tests__/        # Hook tests
├── services/
│   └── __tests__/        # Service tests
└── utils/
    └── __tests__/        # Utility tests
```

## Writing Tests

### Component Tests
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Hook Tests
```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from '../useMyHook';

describe('useMyHook', () => {
  it('returns expected values', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe('expected');
  });
});
```

### Service Tests
```typescript
import { describe, it, expect, vi } from 'vitest';
import { MyService } from '../MyService';

describe('MyService', () => {
  it('processes data correctly', async () => {
    const service = new MyService();
    const result = await service.processData('input');
    expect(result).toBeDefined();
  });
});
```

## Coverage Requirements

The project maintains the following coverage thresholds:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Mocking Guidelines

### Global Mocks
Global mocks are configured in `src/test/setup.ts`:
- `window.matchMedia`
- `ResizeObserver`
- `IntersectionObserver`
- `localStorage`
- `sessionStorage`
- `File` and `FileReader`

### Component-Specific Mocks
```typescript
// Mock external dependencies
vi.mock('@/services/myService', () => ({
  MyService: vi.fn().mockImplementation(() => ({
    method: vi.fn().mockResolvedValue('mocked result')
  }))
}));
```

## Performance Testing

### Performance Hooks Testing
```typescript
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

describe('Performance Optimization', () => {
  it('measures component performance', () => {
    const { result } = renderHook(() => 
      usePerformanceOptimization('TestComponent')
    );
    
    expect(result.current.renderCount).toBeGreaterThan(0);
  });
});
```

## Best Practices

### 1. Test Naming
- Use descriptive test names
- Follow the pattern: "should [expected behavior] when [condition]"

### 2. Test Organization
- Group related tests using `describe` blocks
- Use `beforeEach` and `afterEach` for setup/cleanup

### 3. Assertions
- Use specific assertions
- Test both positive and negative cases
- Verify error handling

### 4. Async Testing
```typescript
it('handles async operations', async () => {
  render(<AsyncComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

### 5. User Interaction Testing
```typescript
import { userEvent } from '@testing-library/user-event';

it('handles user interactions', async () => {
  const user = userEvent.setup();
  render(<InteractiveComponent />);
  
  await user.click(screen.getByRole('button'));
  expect(screen.getByText('Clicked')).toBeInTheDocument();
});
```

## CI/CD Integration

Tests run automatically on:
- Push to main/develop branches
- Pull requests to main branch
- Multiple Node.js versions (18.x, 20.x)

## Debugging Tests

### Running Specific Tests
```bash
# Run tests matching pattern
npm run test -- --grep "MyComponent"

# Run tests in specific file
npm run test -- src/components/__tests__/MyComponent.test.tsx
```

### Debug Mode
```bash
# Run with debug output
npm run test -- --reporter=verbose

# Run with UI for interactive debugging
npm run test:ui
```

## Common Issues and Solutions

### 1. Mock Not Working
- Ensure mocks are defined before imports
- Use `vi.hoisted()` for complex mocks

### 2. Async Test Failures
- Use `waitFor` for async operations
- Increase timeout if needed: `{ timeout: 5000 }`

### 3. Component Not Rendering
- Check if all required props are provided
- Verify providers are wrapped correctly

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure coverage thresholds are met
3. Update this documentation if needed
4. Run full test suite before submitting PR

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)