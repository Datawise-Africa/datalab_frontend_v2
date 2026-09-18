import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useMediaQuery } from '~/hooks/use-media-query';
import { canvasZoom, type CanvasFrame } from '~/lib/constants/dashboard-studio';

export type StudioDialog =
  | 'settings'
  | 'insert'
  | 'history'
  | 'refresh'
  | 'alerts'
  | 'comments'
  | 'infographic';

export type StudioSettingsTab = 'general' | 'integrations';
export type StudioView = 'canvas' | 'model';

/** Panels that can take over the right column (or a sheet on narrow screens). */
export type StudioActivityPanel = 'history' | 'comments' | 'alerts';
export type StudioAsidePanel = 'properties' | StudioActivityPanel;

type StudioUiContextValue = {
  dialog: StudioDialog | null;
  openDialog: (dialog: StudioDialog | null) => void;
  dialogProps: (dialog: StudioDialog) => {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };
  settingsTab: StudioSettingsTab;
  setSettingsTab: (tab: StudioSettingsTab) => void;
  openSettings: (tab?: StudioSettingsTab) => void;
  profileSourceId?: string;
  setProfileSourceId: (id?: string) => void;
  prepareSourceId?: string;
  setPrepareSourceId: (id?: string) => void;
  /** Main area: the dashboard canvas or the data model diagram. */
  view: StudioView;
  setView: (view: StudioView) => void;
  aside: StudioAsidePanel;
  /** Toggle an activity panel: right column on wide screens, sheet otherwise. */
  toggleActivity: (panel: StudioActivityPanel) => void;
  /** Like `toggleActivity`, but never closes an already open panel. */
  openActivity: (panel: StudioActivityPanel) => void;
  showProperties: () => void;
  /** Show the visual palette: left panel on wide screens, a sheet otherwise. */
  openInsert: () => void;
  /** `xl` and up — the editor shows its rail and side columns. */
  isWide: boolean;
  leftOpen: boolean;
  setLeftOpen: (open: boolean) => void;
  preview: boolean;
  setPreview: (preview: boolean) => void;
  rightOpen: boolean;
  setRightOpen: (open: boolean) => void;
  inspectorWidth: number;
  setInspectorWidth: (width: number) => void;
  /** Canvas zoom (1 = 100%), clamped to `canvasZoom`. */
  zoom: number;
  setZoom: (zoom: number) => void;
  frame: CanvasFrame;
  setFrame: (frame: CanvasFrame) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
};

const INSPECTOR_WIDTH_KEY = 'datalab-studio-inspector-width';
const CANVAS_KEY = 'datalab-studio-canvas';
const clampZoom = (zoom: number) =>
  Math.round(Math.min(canvasZoom.max, Math.max(canvasZoom.min, zoom)) * 100) /
  100;

const StudioUiContext = createContext<StudioUiContextValue | null>(null);

export function useStudioUi() {
  const value = useContext(StudioUiContext);
  if (!value)
    throw new Error('useStudioUi must be used inside StudioUiProvider');
  return value;
}

export function StudioUiProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [dialog, setDialog] = useState<StudioDialog | null>(null);
  const [settingsTab, setSettingsTab] = useState<StudioSettingsTab>('general');
  const [profileSourceId, setProfileSourceId] = useState<string>();
  const [prepareSourceId, setPrepareSourceId] = useState<string>();
  const [preview, setPreview] = useState(false);
  const [leftOpen, setLeftOpen] = useState(true);
  const [aside, setAside] = useState<StudioAsidePanel>('properties');
  const [view, setView] = useState<StudioView>('canvas');
  // Matches the `xl` breakpoint where the editor shows its side columns.
  const isWide = useMediaQuery('(min-width: 1280px)');
  const [rightOpen, setRightOpen] = useState(true);
  const [inspectorWidth, setInspectorWidth] = useState(420);
  const [zoom, setZoomState] = useState(1);
  const [frame, setFrame] = useState<CanvasFrame>('fill');
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        globalThis.localStorage?.getItem(CANVAS_KEY) ?? '{}'
      );
      if (typeof saved.zoom === 'number') setZoomState(clampZoom(saved.zoom));
      if (typeof saved.frame === 'string') setFrame(saved.frame);
      if (typeof saved.showGrid === 'boolean') setShowGrid(saved.showGrid);
    } catch {
      // Canvas preferences are a convenience; defaults are fine without them.
    }
  }, []);

  useEffect(() => {
    try {
      globalThis.localStorage?.setItem(
        CANVAS_KEY,
        JSON.stringify({ zoom, frame, showGrid })
      );
    } catch {
      // Storage unavailable — keep in-memory preferences.
    }
  }, [zoom, frame, showGrid]);

  useEffect(() => {
    try {
      const savedWidth = Number(
        globalThis.localStorage?.getItem(INSPECTOR_WIDTH_KEY)
      );
      if (Number.isFinite(savedWidth) && savedWidth >= 320 && savedWidth <= 640)
        setInspectorWidth(savedWidth);
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
  }, []);

  useEffect(() => {
    try {
      globalThis.localStorage?.setItem(
        INSPECTOR_WIDTH_KEY,
        String(inspectorWidth)
      );
    } catch {
      // The in-memory width remains usable when persistence is unavailable.
    }
  }, [inspectorWidth]);

  const value: StudioUiContextValue = {
    dialog,
    openDialog: setDialog,
    dialogProps: (id) => ({
      open: dialog === id,
      onOpenChange: (open) =>
        setDialog((current) => (open ? id : current === id ? null : current)),
    }),
    settingsTab,
    setSettingsTab,
    openSettings: (tab) => {
      if (tab) setSettingsTab(tab);
      setDialog('settings');
    },
    profileSourceId,
    setProfileSourceId,
    prepareSourceId,
    setPrepareSourceId,
    view,
    setView,
    aside,
    toggleActivity: (panel) => {
      if (!isWide) return setDialog(panel);
      setRightOpen(true);
      setAside((current) => (current === panel ? 'properties' : panel));
    },
    openActivity: (panel) => {
      if (!isWide) return setDialog(panel);
      setRightOpen(true);
      setAside(panel);
    },
    showProperties: () => setAside('properties'),
    openInsert: () => (isWide ? setLeftOpen(true) : setDialog('insert')),
    isWide,
    leftOpen,
    setLeftOpen,
    preview,
    setPreview,
    rightOpen,
    setRightOpen,
    inspectorWidth,
    setInspectorWidth,
    zoom,
    setZoom: (next) => setZoomState(clampZoom(next)),
    frame,
    setFrame,
    showGrid,
    setShowGrid,
  };

  return (
    <StudioUiContext.Provider value={value}>
      {children}
    </StudioUiContext.Provider>
  );
}
