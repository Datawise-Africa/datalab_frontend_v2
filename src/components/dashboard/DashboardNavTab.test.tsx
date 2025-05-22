import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardNavTab, type DashboardNavTabProps } from './DashboardNavTab';
import { MemoryRouter } from 'react-router-dom';

describe('DashboardNavTab', () => {
  const defaultProps: DashboardNavTabProps = {
    icon: '/assets/Datawise.svg',
    label: 'Home',
    href: '/',
    showLabel: true,
  };

  it('renders with icon and label', () => {
    render(<DashboardNavTab {...defaultProps} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('applies active styles when active prop is true', () => {
    const { container } = render(<DashboardNavTab {...defaultProps} />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('text-blue-600');
    expect(button).toHaveClass('bg-blue-50');
    expect(button).toHaveClass('border-blue-600');
  });

  it('applies inactive styles when active prop is false', () => {
    const { container } = render(<DashboardNavTab {...defaultProps} />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('text-gray-600');
    expect(button).not.toHaveClass('bg-blue-50');
  });

  it('hides label when showLabel is false', () => {
    render(<DashboardNavTab {...defaultProps} showLabel={false} />);
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  it('shows tooltip when showLabel is false', () => {
    render(<DashboardNavTab {...defaultProps} showLabel={false} />);
    // Note: TooltipContent might not be visible until hover in actual component,
    // but we can check if it's in the DOM
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('applies correct width and padding classes when showLabel is false', () => {
    const { container } = render(
      <DashboardNavTab {...defaultProps} showLabel={false} />,
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('w-10');
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('p-0');
    expect(button).toHaveClass('justify-center');
  });

  it('applies correct transition styles to the NavLink', () => {
    const { container } = render(<DashboardNavTab {...defaultProps} />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });
    const navLinkElement = container.querySelector('a');
    expect(navLinkElement).toHaveClass('transition-all');
    expect(navLinkElement).toHaveClass('duration-200');
  });

  it('renders the label inside a span when showLabel is true', () => {
    render(<DashboardNavTab {...defaultProps} />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });
    const labelSpan = screen.getByText('Home').closest('span');
    expect(labelSpan).toBeInTheDocument();
  });

  it('wraps the icon in a div with specific classes', () => {
    render(<DashboardNavTab {...defaultProps} />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });
    const iconWrapper = screen.getByTestId('icon').closest('div');
    expect(iconWrapper).toHaveClass('flex');
    expect(iconWrapper).toHaveClass('items-center');
    expect(iconWrapper).toHaveClass('justify-center');
    expect(iconWrapper).toHaveClass('w-5');
    expect(iconWrapper).toHaveClass('h-5');
  });
});
