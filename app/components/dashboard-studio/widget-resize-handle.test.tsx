import { snapLayout } from './widget-resize-handle';

describe('snapLayout', () => {
  const start = { width: 6, height: 360 } as const;

  it('snaps width to allowed column spans and height to presets', () => {
    // 100px per column at 100% zoom: +2 columns → 8, +90px → 440.
    expect(snapLayout(start, { x: 200, y: 90 }, 100, 1)).toEqual({
      width: 8,
      height: 440,
    });
    // +1 column lands between 6 and 8; −1000px clamps to the smallest height.
    expect(snapLayout(start, { x: 90, y: -1000 }, 100, 1).height).toBe(220);
  });

  it('accounts for canvas zoom', () => {
    // At 50% zoom, 80 screen px is 160 layout px: 360 + 160 → 520.
    expect(snapLayout(start, { x: 0, y: 80 }, 50, 0.5)).toEqual({
      width: 6,
      height: 520,
    });
  });
});
