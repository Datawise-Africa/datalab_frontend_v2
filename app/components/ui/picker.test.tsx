import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Picker } from './picker';

const trigger = () =>
  document.querySelector<HTMLElement>('[aria-haspopup="listbox"]')!;

const items = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta', group: 'Public' },
  { value: 'c', label: 'Gamma', group: 'Mine' },
];

describe('Picker', () => {
  it('renders group headings with ungrouped items first', async () => {
    render(<Picker items={items} value={null} onChange={() => {}} />);
    await userEvent.click(trigger());
    const text = document.body.textContent ?? '';
    expect(text.indexOf('Alpha')).toBeLessThan(text.indexOf('Public'));
    expect(text.indexOf('Public')).toBeLessThan(text.indexOf('Mine'));
  });

  it('does not clear a required selection when clearable is false', async () => {
    const onChange = vi.fn();
    render(
      <Picker
        items={items}
        value="a"
        onChange={onChange}
        clearable={false}
        searchable={false}
      />
    );
    expect(screen.queryByLabelText('Clear selection')).toBeNull();
    await userEvent.click(trigger());
    expect(screen.getByPlaceholderText('Search…')).toHaveClass('sr-only');
    await userEvent.click(screen.getAllByText('Alpha').at(-1)!);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('clears on re-pick by default', async () => {
    const onChange = vi.fn();
    render(<Picker items={items} value="a" onChange={onChange} />);
    await userEvent.click(trigger());
    await userEvent.click(screen.getAllByText('Alpha').at(-1)!);
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
