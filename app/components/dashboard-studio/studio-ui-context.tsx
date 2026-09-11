import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useMediaQuery } from '~/hooks/use-media-query';

export type StudioDialog =
  | 'settings'
  | 'insert'
  | 'share'
  | 'history'
  | 'model'
  | 'refresh'
  | 'alerts'
  | 'comments'
  | 'infographic';

export type StudioSettingsTab = 'general' | 'integrations';

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
};

const INSPECTOR_WIDTH_KEY = 'datalab-studio-inspector-width';

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
  // Matches the `xl` breakpoint where the editor shows its side columns.
  const isWide = useMediaQuery('(min-width: 1280px)');
  const [rightOpen, setRightOpen] = useState(true);
  const [inspectorWidth, setInspectorWidth] = useState(420);

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
  };

  return (
    <StudioUiContext.Provider value={value}>
      {children}
    </StudioUiContext.Provider>
  );
}
