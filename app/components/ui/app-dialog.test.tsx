import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppDialog } from './app-dialog';

describe('AppDialog', () => {
  it('closes on Escape in auto mode', async () => {
    const onOpenChange = vi.fn();
    render(
      <AppDialog open onOpenChange={onOpenChange} title="Auto">
        body
      </AppDialog>
    );
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('ignores Escape in explicit mode but keeps the close button', async () => {
    const onOpenChange = vi.fn();
    render(
      <AppDialog
        open
        onOpenChange={onOpenChange}
        title="Explicit"
        closeMode="explicit"
      >
        body
      </AppDialog>
    );
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('has no close button in none mode', () => {
    render(
      <AppDialog
        open
        title="Critical"
        closeMode="none"
        footer={<button>Ok</button>}
      >
        body
      </AppDialog>
    );
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Ok' })).toBeInTheDocument();
  });
});
