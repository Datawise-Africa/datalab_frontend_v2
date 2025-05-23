import { describe, it, expect } from 'vitest';
import { render } from '../../test/test-utils';
import { screen } from '@testing-library/react';
import Error404 from './Error404';

describe('Error404 Component', () => {
  it('renders 404 error page correctly', () => {
    render(<Error404 />);

    // Check if the main elements are rendered
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(
      screen.getByText(/Sorry, we couldn't find the page you're looking for./i),
    ).toBeInTheDocument();

    // Check if the home link is rendered
    const homeLink = screen.getByRole('link', { name: /go back home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
