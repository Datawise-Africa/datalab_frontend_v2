import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button />);

    const button = screen.getByRole('button', { name: 'Button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-gradient-to-b');
  });

  it('renders with custom text', () => {
    render(<Button>Click Me</Button>);

    const button = screen.getByRole('button', { name: 'Click Me' });
    expect(button).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);

    const button = screen.getByRole('button', { name: 'Custom Button' });
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('bg-gradient-to-b');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole('button', { name: 'Click Me' });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
