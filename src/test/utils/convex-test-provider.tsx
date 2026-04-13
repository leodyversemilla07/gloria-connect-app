import { ConvexProvider, type ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import { vi } from "vitest";

/**
 * Mock Convex client for testing
 * Provides a fake Convex client that can be used in tests without real backend connection
 */
export function createMockConvexClient() {
  const mockClient = {
    query: vi.fn(),
    mutation: vi.fn(),
    action: vi.fn(),
    close: vi.fn(),
    setAuth: vi.fn(),
    clearAuth: vi.fn(),
    connectionState: vi.fn(() => ({ hasInflightRequests: false, isWebSocketConnected: true })),
  } as unknown as ConvexReactClient;

  return mockClient;
}

/**
 * Mock ConvexProvider for testing components that use Convex hooks
 *
 * @example
 * ```tsx
 * render(
 *   <MockConvexProvider>
 *     <YourComponent />
 *   </MockConvexProvider>
 * );
 * ```
 */
export function MockConvexProvider({ children }: { children: ReactNode }) {
  const mockClient = createMockConvexClient();

  return <ConvexProvider client={mockClient}>{children}</ConvexProvider>;
}

/**
 * Mock useQuery hook for testing
 * Returns undefined by default (loading state)
 *
 * @example
 * ```ts
 * vi.mock('convex/react', () => ({
 *   useQuery: mockUseQuery({ users: [mockUser] }),
 *   useMutation: vi.fn(),
 * }));
 * ```
 */
export function mockUseQuery<T>(returnValue?: T) {
  return vi.fn(() => returnValue);
}

/**
 * Mock useMutation hook for testing
 * Returns a spy function that can be called and asserted
 *
 * @example
 * ```ts
 * const mockMutate = vi.fn().mockResolvedValue({ id: '123' });
 * vi.mock('convex/react', () => ({
 *   useMutation: () => mockMutate,
 * }));
 * ```
 */
export function mockUseMutation<T = unknown>() {
  return vi.fn<(args: unknown) => Promise<T>>();
}

/**
 * Mock useConvex hook for testing
 * Returns a mock client that can be used to call queries/mutations directly
 */
export function mockUseConvex() {
  return createMockConvexClient();
}

/**
 * Helper to mock Convex Auth hooks
 *
 * @example
 * ```ts
 * mockConvexAuth({ isLoading: false, isAuthenticated: true });
 * ```
 */
export function mockConvexAuth(
  overrides: { isLoading?: boolean; isAuthenticated?: boolean; userId?: string } = {},
) {
  const defaults = {
    isLoading: false,
    isAuthenticated: false,
    userId: undefined,
  };

  return { ...defaults, ...overrides };
}
