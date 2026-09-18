import type { ComponentType } from 'react';
import {
  LayoutGrid,
  Maximize,
  Minus,
  Monitor,
  Plus,
  Scan,
  Smartphone,
  Tablet,
} from 'lucide-react';
import {
  canvasFrames,
  canvasZoom,
  type CanvasFrame,
} from '~/lib/constants/dashboard-studio';
import { cn } from '~/lib/utils';
import { useStudioUi } from './studio-ui-context';

const frameIcons: Record<CanvasFrame, ComponentType<{ className?: string }>> = {
  fill: Maximize,
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
};

function BarButton({
  label,
  pressed,
  onClick,
  children,
  className,
}: Readonly<{
  label: string;
  pressed?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      onClick={onClick}
      className={cn(
        'flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground',
        pressed && 'bg-primary/10 text-primary',
        className
      )}
    >
      {children}
    </button>
  );
}

/** Floating canvas controls: zoom, fit, device frame and grid guides. */
export function StudioZoomBar({ onFit }: Readonly<{ onFit: () => void }>) {
  const { zoom, setZoom, frame, setFrame, showGrid, setShowGrid } =
    useStudioUi();

  return (
    <div
      role="toolbar"
      aria-label="Canvas view"
      className="absolute right-3 bottom-3 z-20 hidden items-center gap-0.5 rounded-lg border bg-background/95 p-1 shadow-md backdrop-blur xl:flex"
    >
      {canvasFrames.map((item) => {
        const Icon = frameIcons[item.value];
        return (
          <BarButton
            key={item.value}
            label={
              item.width ? `${item.label} (${item.width}px)` : 'Fill canvas'
            }
            pressed={frame === item.value}
            onClick={() => setFrame(item.value)}
          >
            <Icon className="h-3.5 w-3.5" />
          </BarButton>
        );
      })}
      <span className="mx-1 h-4 w-px bg-border" />
      <BarButton
        label="Grid guides"
        pressed={showGrid}
        onClick={() => setShowGrid(!showGrid)}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
      </BarButton>
      <span className="mx-1 h-4 w-px bg-border" />
      <BarButton
        label="Zoom out (Ctrl/⌘ −)"
        onClick={() => setZoom(zoom - canvasZoom.step)}
      >
        <Minus className="h-3.5 w-3.5" />
      </BarButton>
      <BarButton
        label="Reset to 100% (Ctrl/⌘ 0)"
        onClick={() => setZoom(1)}
        className="w-12 text-xs tabular-nums"
      >
        {Math.round(zoom * 100)}%
      </BarButton>
      <BarButton
        label="Zoom in (Ctrl/⌘ +)"
        onClick={() => setZoom(zoom + canvasZoom.step)}
      >
        <Plus className="h-3.5 w-3.5" />
      </BarButton>
      <BarButton label="Fit to width" onClick={onFit}>
        <Scan className="h-3.5 w-3.5" />
      </BarButton>
    </div>
  );
}
