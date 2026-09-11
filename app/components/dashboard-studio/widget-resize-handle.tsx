import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { widgetHeights, widgetWidths } from '~/lib/constants/dashboard-studio';
import type { DashboardWidget } from '~/lib/types/dashboard';

export type WidgetLayout = NonNullable<DashboardWidget['layout']>;

const nearest = <T extends number>(values: readonly T[], target: number) =>
  values.reduce((best, value) =>
    Math.abs(value - target) < Math.abs(best - target) ? value : best
  );

const step = <T extends number>(values: readonly T[], current: T, by: number) =>
  values[
    Math.min(
      values.length - 1,
      Math.max(0, values.indexOf(nearest(values, current)) + by)
    )
  ];

/**
 * Snap a dragged size to the grid: width to the allowed column spans, height
 * to the preset heights. `columnPx`/`scale` are measured on screen, so this
 * works at any canvas zoom.
 */
export function snapLayout(
  start: WidgetLayout,
  delta: { x: number; y: number },
  columnPx: number,
  scale: number
): WidgetLayout {
  return {
    width: nearest(widgetWidths, start.width + delta.x / columnPx),
    height: nearest(widgetHeights, start.height + delta.y / scale),
  };
}

/**
 * Bottom-right handle on the selected visual. Drag to resize (snaps to the
 * 12-column grid and preset heights); arrow keys step width (←/→) and height
 * (↑/↓). `onPreview` fires while dragging, `onCommit` once on release.
 */
export function WidgetResizeHandle({
  title,
  layout,
  onPreview,
  onCommit,
}: Readonly<{
  title: string;
  layout: WidgetLayout;
  onPreview: (layout: WidgetLayout | null) => void;
  onCommit: (layout: WidgetLayout) => void;
}>) {
  const drag = useRef<{
    x: number;
    y: number;
    columnPx: number;
    scale: number;
    last: WidgetLayout;
  } | null>(null);

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    const grid = event.currentTarget.closest('section')?.parentElement;
    if (!grid || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = grid.getBoundingClientRect();
    // Screen px per layout px (CSS zoom) and per grid column (incl. gap).
    const scale = rect.width / grid.offsetWidth || 1;
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      columnPx: (rect.width + gap * scale) / 12,
      scale,
      last: layout,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const state = drag.current;
    if (!state) return;
    const next = snapLayout(
      layout,
      { x: event.clientX - state.x, y: event.clientY - state.y },
      state.columnPx,
      state.scale
    );
    if (next.width !== state.last.width || next.height !== state.last.height) {
      state.last = next;
      onPreview(next);
    }
  };

  const onPointerUp = () => {
    const state = drag.current;
    if (!state) return;
    drag.current = null;
    onPreview(null);
    if (
      state.last.width !== layout.width ||
      state.last.height !== layout.height
    )
      onCommit(state.last);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, Partial<WidgetLayout>> = {
      ArrowLeft: { width: step(widgetWidths, layout.width, -1) },
      ArrowRight: { width: step(widgetWidths, layout.width, 1) },
      ArrowUp: { height: step(widgetHeights, layout.height, -1) },
      ArrowDown: { height: step(widgetHeights, layout.height, 1) },
    };
    const move = moves[event.key];
    if (!move || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    event.stopPropagation();
    onCommit({ ...layout, ...move });
  };

  return (
    <button
      type="button"
      aria-label={`Resize ${title}: ${layout.width} of 12 columns, ${layout.height}px tall. Use arrow keys to resize.`}
      title="Drag to resize"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      className="absolute -right-1.5 -bottom-1.5 z-20 flex h-4 w-4 cursor-nwse-resize touch-none items-center justify-center rounded-sm border-2 border-primary bg-background shadow-sm hover:bg-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    />
  );
}
