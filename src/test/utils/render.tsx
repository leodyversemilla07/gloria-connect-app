import { ReactElement, ReactNode } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { MockConvexProvider } from './convex-test-provider';

/**
 * Custom render function that wraps components with common providers
 * 
 * @example
 * ```tsx
 * import { render, screen } from '@/test/utils';
 * 
 * test('renders component', () => {
 *   render(<MyComponent />);
 *   expect(screen.getByText('Hello')).toBeInTheDocument();
 * });
 * ```
 */

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Include MockConvexProvider (default: true) */
  withConvex?: boolean;
  /** Custom wrapper component */
  wrapper?: React.ComponentType<{ children: ReactNode }>;
}

function AllProviders({ children, withConvex = true }: { children: ReactNode; withConvex?: boolean }) {
  if (withConvex) {
    return <MockConvexProvider>{children}</MockConvexProvider>;
  }
  return <>{children}</>;
}

export function render(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { withConvex = true, wrapper, ...renderOptions } = options;

  const Wrapper = wrapper || (({ children }: { children: ReactNode }) => (
    <AllProviders withConvex={withConvex}>{children}</AllProviders>
  ));

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
