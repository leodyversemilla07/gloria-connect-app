# Test Infrastructure

This directory contains reusable test utilities, fixtures, and mocks for the Gloria Connect App.

## Directory Structure

```
src/test/
├── fixtures/          # Mock data factories
│   ├── user.ts       # User test data
│   ├── business.ts   # Business test data
│   └── index.ts      # Central exports
├── mocks/            # External service mocks
│   └── resend.ts     # Email service mock
├── utils/            # Test utilities
│   ├── convex-test-provider.tsx  # Convex mocks
│   ├── render.tsx               # Custom render function
│   └── index.ts                 # Central exports
└── setup.ts          # Global test setup
```

## Quick Start

### Basic Component Test

```tsx
import { render, screen } from '@/test/utils';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Using Mock Data

```tsx
import { createMockUser, createMockBusiness } from '@/test/fixtures';

describe('BusinessCard', () => {
  it('displays business information', () => {
    const business = createMockBusiness({
      name: 'Test Restaurant',
      category: { primary: 'restaurants' }
    });
    
    render(<BusinessCard business={business} />);
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
  });
});
```

## Available Fixtures

### User Fixtures

```tsx
import { 
  createMockUser,        // Standard user
  createMockAdmin,       // Admin user
  createMockUsers,       // Multiple users
  createUnverifiedUser   // Unverified user
} from '@/test/fixtures';

const user = createMockUser({ name: 'John Doe' });
const admin = createMockAdmin();
const users = createMockUsers(5);
```

### Business Fixtures

```tsx
import { 
  createMockBusiness,          // Standard business
  createBilingualBusiness,     // With EN/TL names
  createPendingBusiness,       // Unverified
  createInactiveBusiness,      // Inactive
  createMockBusinesses,        // Multiple businesses
  createBusinessesByCategory,  // By category
  BUSINESS_CATEGORIES          // Category constants
} from '@/test/fixtures';

const business = createMockBusiness({
  name: 'My Restaurant',
  category: { primary: BUSINESS_CATEGORIES.RESTAURANTS }
});
```

## Mocking Convex

### Mock Convex Provider

The custom `render` function automatically wraps components with `MockConvexProvider`:

```tsx
import { render } from '@/test/utils';

// Automatically includes MockConvexProvider
render(<MyComponent />);

// Disable Convex provider if needed
render(<MyComponent />, { withConvex: false });
```

### Mock useQuery

```tsx
import { vi } from 'vitest';
import { createMockUser } from '@/test/fixtures';

vi.mock('convex/react', () => ({
  useQuery: vi.fn(() => createMockUser())
}));
```

### Mock useMutation

```tsx
import { vi } from 'vitest';

const mockMutation = vi.fn().mockResolvedValue({ success: true });

vi.mock('convex/react', () => ({
  useMutation: () => mockMutation
}));

// In your test
await mockMutation({ name: 'Test' });
expect(mockMutation).toHaveBeenCalledWith({ name: 'Test' });
```

## Mocking External Services

### Resend (Email)

```tsx
import { mockResend, mockEmailSendSuccess } from '@/test/mocks/resend';

describe('Email sending', () => {
  beforeEach(() => {
    mockResend.emails.send.mockClear();
  });

  it('sends verification email', async () => {
    mockEmailSendSuccess('email_123');
    
    // Your test code
    
    expect(mockResend.emails.send).toHaveBeenCalledWith({
      to: 'user@example.com',
      subject: 'Verify Email',
      // ...
    });
  });
});
```

## Testing Patterns

### Component with Props

```tsx
describe('BusinessCard', () => {
  it('displays business name', () => {
    const business = createMockBusiness({ name: 'Test Shop' });
    render(<BusinessCard business={business} />);
    expect(screen.getByText('Test Shop')).toBeInTheDocument();
  });
});
```

### Component with User Interaction

```tsx
import { render, screen, fireEvent } from '@/test/utils';

describe('LoginForm', () => {
  it('submits form data', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    
    expect(onSubmit).toHaveBeenCalled();
  });
});
```

### Component with Convex Data

```tsx
import { vi } from 'vitest';
import { createMockBusiness } from '@/test/fixtures';

vi.mock('convex/react', () => ({
  useQuery: vi.fn(() => [createMockBusiness()])
}));

describe('BusinessList', () => {
  it('renders business list from Convex', () => {
    render(<BusinessList />);
    expect(screen.getByText('Test Business')).toBeInTheDocument();
  });
});
```

### Async Operations

```tsx
import { render, screen, waitFor } from '@/test/utils';

describe('AsyncComponent', () => {
  it('loads data asynchronously', async () => {
    render(<AsyncComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('Loaded Data')).toBeInTheDocument();
    });
  });
});
```

## Best Practices

1. **Use Descriptive Test Names** - Test names should clearly describe what is being tested
   ```tsx
   // ✅ Good
   it('displays error message when email is invalid')
   
   // ❌ Bad
   it('test 1')
   ```

2. **Arrange-Act-Assert Pattern**
   ```tsx
   it('updates user profile', async () => {
     // Arrange
     const user = createMockUser();
     const mockUpdate = vi.fn();
     
     // Act
     render(<ProfileForm user={user} onUpdate={mockUpdate} />);
     fireEvent.click(screen.getByRole('button', { name: 'Save' }));
     
     // Assert
     expect(mockUpdate).toHaveBeenCalled();
   });
   ```

3. **Test Behavior, Not Implementation**
   ```tsx
   // ✅ Good - tests what user sees
   expect(screen.getByText('Welcome')).toBeInTheDocument();
   
   // ❌ Bad - tests internal state
   expect(component.state.isLoaded).toBe(true);
   ```

4. **Clean Up Between Tests**
   ```tsx
   describe('MyComponent', () => {
     afterEach(() => {
       vi.clearAllMocks();
     });
   });
   ```

5. **Use Mock Factories** - Always use fixture factories instead of creating inline data
   ```tsx
   // ✅ Good
   const user = createMockUser({ name: 'John' });
   
   // ❌ Bad
   const user = { _id: '123', name: 'John', email: 'john@test.com', ... };
   ```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run specific test file
npm test -- user.test.ts
```

## TypeScript Support

All test utilities and fixtures are fully typed. Import types as needed:

```tsx
import type { MockUser, MockBusiness } from '@/test/fixtures';
import type { Id } from '@/../../convex/_generated/dataModel';
```

## Troubleshooting

### "Cannot find module '@/test/utils'"

Make sure your `tsconfig.json` includes the test path:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Convex Provider Errors

If you see errors about Convex context, ensure you're using the custom `render` function:

```tsx
// ✅ Use this
import { render } from '@/test/utils';

// ❌ Not this
import { render } from '@testing-library/react';
```

### Mock Not Resetting

Always clear mocks in `afterEach`:

```tsx
afterEach(() => {
  vi.clearAllMocks();
});
```
