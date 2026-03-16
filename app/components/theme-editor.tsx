import { useState } from 'react';
import { Settings, X, RotateCcw, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { useAppDispatch, useAppSelector } from '~/store';
import {
  setPrimaryHue,
  setSecondaryHue,
  setTertiaryHue,
  toggleDarkMode,
  updateTheme,
  resetTheme,
} from '~/store/slices/theme-slice';

function HuePreview({ hue, label }: { hue: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-5 h-5 rounded-full border border-border shrink-0"
        style={{ background: `oklch(0.55 0.2 ${hue})` }}
      />
      <span className="text-xs text-muted-foreground">
        {label}: {hue}
      </span>
    </div>
  );
}

export function ThemeEditor() {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme);

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute bottom-14 right-0 w-80 rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
              <h3 className="text-sm font-semibold">Theme Editor</h3>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => dispatch(resetTheme())}
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setOpen(false)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {theme.darkMode ? (
                    <Moon className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Sun className="w-4 h-4 text-muted-foreground" />
                  )}
                  <Label className="text-sm">Dark Mode</Label>
                </div>
                <Switch
                  checked={theme.darkMode}
                  onCheckedChange={() => dispatch(toggleDarkMode())}
                />
              </div>

              {/* Primary Hue */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Primary Color</Label>
                  <HuePreview hue={theme.primaryHue} label="Hue" />
                </div>
                <Slider
                  value={[theme.primaryHue]}
                  onValueChange={([v]) => dispatch(setPrimaryHue(v))}
                  min={0}
                  max={360}
                  step={1}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                />
                <div
                  className="h-2 rounded-full"
                  style={{
                    background:
                      'linear-gradient(to right, oklch(0.55 0.2 0), oklch(0.55 0.2 60), oklch(0.55 0.2 120), oklch(0.55 0.2 180), oklch(0.55 0.2 240), oklch(0.55 0.2 300), oklch(0.55 0.2 360))',
                  }}
                />
              </div>

              {/* Secondary Hue */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Secondary Color</Label>
                  <HuePreview hue={theme.secondaryHue} label="Hue" />
                </div>
                <Slider
                  value={[theme.secondaryHue]}
                  onValueChange={([v]) => dispatch(setSecondaryHue(v))}
                  min={0}
                  max={360}
                  step={1}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                />
                <div
                  className="h-2 rounded-full"
                  style={{
                    background:
                      'linear-gradient(to right, oklch(0.55 0.2 0), oklch(0.55 0.2 60), oklch(0.55 0.2 120), oklch(0.55 0.2 180), oklch(0.55 0.2 240), oklch(0.55 0.2 300), oklch(0.55 0.2 360))',
                  }}
                />
              </div>

              {/* Tertiary Hue */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Accent Color</Label>
                  <HuePreview hue={theme.tertiaryHue} label="Hue" />
                </div>
                <Slider
                  value={[theme.tertiaryHue]}
                  onValueChange={([v]) => dispatch(setTertiaryHue(v))}
                  min={0}
                  max={360}
                  step={1}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                />
                <div
                  className="h-2 rounded-full"
                  style={{
                    background:
                      'linear-gradient(to right, oklch(0.55 0.2 0), oklch(0.55 0.2 60), oklch(0.55 0.2 120), oklch(0.55 0.2 180), oklch(0.55 0.2 240), oklch(0.55 0.2 300), oklch(0.55 0.2 360))',
                  }}
                />
              </div>

              {/* Border Radius */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Border Radius</Label>
                  <span className="text-xs text-muted-foreground">
                    {theme.borderRadius}rem
                  </span>
                </div>
                <Slider
                  value={[theme.borderRadius]}
                  onValueChange={([v]) =>
                    dispatch(updateTheme({ borderRadius: v }))
                  }
                  min={0}
                  max={2}
                  step={0.125}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Sharp</span>
                  <span>Rounded</span>
                </div>
              </div>

              {/* Preview Swatches */}
              <div className="space-y-2">
                <Label className="text-sm">Preview</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1 text-center">
                    <div
                      className="h-10 rounded-md"
                      style={{
                        background: `oklch(0.55 0.22 ${theme.primaryHue})`,
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      Primary
                    </span>
                  </div>
                  <div className="space-y-1 text-center">
                    <div
                      className="h-10 rounded-md"
                      style={{
                        background: `oklch(0.55 0.18 ${theme.secondaryHue})`,
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      Secondary
                    </span>
                  </div>
                  <div className="space-y-1 text-center">
                    <div
                      className="h-10 rounded-md"
                      style={{
                        background: `oklch(0.55 0.20 ${theme.tertiaryHue})`,
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      Accent
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Gear Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => setOpen(!open)}
          title="Theme Settings"
        >
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Settings className="w-5 h-5" />
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
}
