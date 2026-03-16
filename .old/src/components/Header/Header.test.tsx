import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import Header from './Header';

// Mock react-router-dom modules
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({ pathname: '/' }),
    useNavigate: () => vi.fn(),
  };
});

describe('Header Component', () => {
  it('renders the header with logo', () => {
    render(<Header />);

    // Check if the logo is rendered
    const logo = screen.getByAltText(/datawise/i) || screen.getByRole('img');
    expect(logo).toBeInTheDocument();
  });

  // it('displays navigation items', () => {
  //   render(<Header />);

  //   // This will depend on your actual navigation items
  //   // Adjust based on what navigation items you expect to see
  //   const navigationItems = screen.getAllByRole('link');
  //   expect(navigationItems.length).toBeGreaterThan(0);
  // });

  // it('toggles navigation menu on mobile', async () => {
  //   render(<Header />);

  //   // Find and click the hamburger menu button
  //   const menuButton =
  //     screen.getByRole('button', { name: /toggle navigation/i }) ||
  //     screen.getByLabelText(/toggle navigation/i) ||
  //     screen.getByTestId('menu-button');

  //   // Click to open the menu
  //   await menuButton.click();

  //   // Check if the navigation menu is visible
  //   const navMenu =
  //     screen.getByRole('navigation') || screen.getByTestId('navigation-menu');
  //   expect(navMenu).toHaveClass('open');
  // });
});
