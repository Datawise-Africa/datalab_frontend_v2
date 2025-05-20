import { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../storage/AuthProvider';
import { PositionProvider } from '../storage/PositionProvider';

// Define the types for our custom render
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {}

/**
 * Custom render function that wraps the component with all providers
 * @param ui - The React component to render
 * @param options - Additional render options
 */
function customRender(ui: ReactElement, options?: CustomRenderOptions) {
  return render(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>
        <AuthProvider>
          <PositionProvider>{children}</PositionProvider>
        </AuthProvider>
      </BrowserRouter>
    ),
    ...options,
  });
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };
