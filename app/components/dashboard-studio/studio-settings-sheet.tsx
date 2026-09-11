import { Palette, Plug } from 'lucide-react';
import { Label } from '~/components/ui/label';
import { Picker } from '~/components/ui/picker';
import { Switch } from '~/components/ui/switch';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  cornerRadiusOptions,
  dashboardSettingOptions,
  themePresetOptions,
  themePresetStyles,
} from '~/lib/constants/dashboard-studio';
import { cn } from '~/lib/utils';
import type { DashboardDefinition } from '~/lib/types/dashboard';
import { StudioIntegrations } from './studio-integrations';
import { useStudio } from './studio-context';
import { useStudioUi, type StudioSettingsTab } from './studio-ui-context';

type ThemePreset = NonNullable<DashboardDefinition['theme']>['preset'];

export function StudioSettingsSheet() {
  const { definition, change } = useStudio();
  const { dialogProps, settingsTab, setSettingsTab } = useStudioUi();
  const updateTheme = (
    patch: Partial<NonNullable<DashboardDefinition['theme']>>
  ) =>
    change((draft) => {
      draft.theme = { ...draft.theme, ...patch };
    });

  return (
    <Sheet {...dialogProps('settings')}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-2xl">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Dashboard settings</SheetTitle>
          <SheetDescription>
            Appearance and the data sources this dashboard uses.
          </SheetDescription>
        </SheetHeader>
        <Tabs
          value={settingsTab}
          onValueChange={(tab) => setSettingsTab(tab as StudioSettingsTab)}
          className="min-h-0 flex-1 gap-0"
        >
          <TabsList
            variant="line"
            className="w-full justify-start border-b px-4"
          >
            <TabsTrigger value="general" className="flex-none">
              <Palette />
              General
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex-none">
              <Plug />
              Integrations
            </TabsTrigger>
          </TabsList>
          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <TabsContent value="general" className="space-y-6">
              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Theme</h3>
                <div
                  role="radiogroup"
                  aria-label="Dashboard theme"
                  className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                >
                  {themePresetOptions.map((option) => {
                    const active =
                      (definition.theme?.preset ?? 'datalab') === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() =>
                          updateTheme({ preset: option.value as ThemePreset })
                        }
                        className={cn(
                          'rounded-lg border p-2 text-left transition hover:border-primary',
                          active && 'border-primary ring-1 ring-primary'
                        )}
                      >
                        <span className="mb-2 flex gap-1">
                          {themePresetStyles[option.value].palette.map(
                            (color) => (
                              <span
                                key={color}
                                className="h-4 flex-1 rounded-sm"
                                style={{ background: color }}
                              />
                            )
                          )}
                        </span>
                        <span className="text-xs font-medium">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
              <section className="max-w-xs space-y-1.5">
                <Label>Corner radius</Label>
                <Picker
                  clearable={false}
                  searchable={false}
                  aria-label="Corner radius"
                  items={cornerRadiusOptions}
                  value={String(definition.theme?.radius ?? 12)}
                  onChange={(radius) =>
                    radius && updateTheme({ radius: Number(radius) })
                  }
                />
              </section>
              <section className="space-y-1">
                <h3 className="text-sm font-semibold">Layout</h3>
                {dashboardSettingOptions.map((option) => {
                  const checked =
                    option.key === 'compact'
                      ? definition.settings?.compact === true
                      : definition.settings?.[option.key] !== false;
                  return (
                    <div
                      key={option.key}
                      className="flex items-center justify-between gap-4 py-2"
                    >
                      <div>
                        <Label htmlFor={`setting-${option.key}`}>
                          {option.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                      <Switch
                        id={`setting-${option.key}`}
                        checked={checked}
                        onCheckedChange={(value) =>
                          change((draft) => {
                            draft.settings = {
                              ...draft.settings,
                              [option.key]: value,
                            };
                          })
                        }
                      />
                    </div>
                  );
                })}
              </section>
            </TabsContent>
            <TabsContent value="integrations">
              <StudioIntegrations />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
