# PetJanu Testing Guide

## Overview
This document provides comprehensive testing setup for the PetJanu platform, including unit tests, integration tests, and end-to-end (E2E) tests.

## Testing Stack

### Unit & Integration Tests
- **Vitest**: Fast Vite-native test runner
- **Testing Library**: React component testing utilities
- **JSDOM**: Browser-like environment for testing

### E2E Tests
- **Playwright**: Cross-browser E2E testing framework
- Supports Chromium, Firefox, WebKit, Mobile browsers

## Setup

### Installation
All dependencies are already installed:
```bash
npm install
npx playwright install chromium
```

### Environment Configuration
Create `.env.local` with required variables:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Running Tests

### Unit & Integration Tests
```bash
# Run all tests once
npm run test

# Watch mode for development
npm run test:watch

# With coverage report
npm run test:coverage
```

### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run specific browser
npx playwright test --project=chromium

# Run with UI
npx playwright test --ui

# Debug mode
npx playwright test --debug
```

### Full Validation
```bash
# Run all checks: env, types, tests, build
npm run check-all
```

## Test Structure

### Unit Tests
Located in `src/lib/__tests__/`:
- `pet-safety.test.ts` - AI safety utilities testing
- `app.test.tsx` - Main app component testing

### E2E Tests
Located in `tests/e2e/`:
- `homepage.spec.ts` - Homepage and navigation tests

### Test Setup
- `src/test/setup.ts` - Global test configuration and mocks

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../my-module';

describe('My Module', () => {
  it('should return expected value', () => {
    expect(myFunction('input')).toBe('expected');
  });
});
```

### Component Test Example
```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

## Coverage Reports

After running `npm run test:coverage`, open the HTML report:
```bash
open coverage/index.html
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Mock External Services**: Use mocks for API calls
3. **Descriptive Names**: Clear test and suite descriptions
4. **AAA Pattern**: Arrange, Act, Assert structure
5. **Coverage Goals**: Aim for >80% code coverage

## Troubleshooting

### Common Issues

**Firebase Permission Errors in Tests**
- Expected behavior when Firebase credentials aren't configured
- Tests use fallback mode automatically

**Playwright Browser Issues**
```bash
npx playwright install --with-deps
```

**TypeScript Errors**
```bash
npm run type-check
```

## Performance Metrics

Current test performance:
- Unit tests: ~12ms (12 tests)
- Component tests: ~789ms (1 test)
- Total: <1s for full suite

## Next Steps

1. Add more component tests for key features
2. Implement E2E tests for critical user flows:
   - Pet registration
   - Lost pet SOS
   - AI chat consultation
   - Product purchase
3. Add visual regression tests
4. Integrate with CI/CD pipeline
5. Set up automated performance testing

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
