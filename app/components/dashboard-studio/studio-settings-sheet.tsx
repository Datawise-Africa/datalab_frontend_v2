import { Palette, Plug } from 'lucide-react';
import { Label } from '~/components/ui/label';
import { Picker } from '~/components/ui/picker';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { themePresetOptions } from '~/lib/constants/dashboard-studio';
import type { DashboardDefinition } from '~/lib/types/dashboard';
import { StudioIntegrations } from './studio-integrations';
import { useStudio } from './studio-context';
import { useStudioUi, type StudioSettingsTab } from './studio-ui-context';

type ThemePreset = NonNullable<DashboardDefinition['theme']>['preset'];

export function StudioSettingsSheet() {
  const { definition, change } = useStudio();
  const { dialogProps, settingsTab, setSettingsTab } = useStudioUi();

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
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <TabsContent value="general" className="space-y-4">
              <div className="max-w-xs space-y-1.5">
                <Label>Theme</Label>
                <Picker
                  clearable={false}
                  searchable={false}
                  aria-label="Dashboard theme"
                  items={themePresetOptions}
                  value={definition.theme?.preset ?? 'datalab'}
                  onChange={(preset) =>
                    preset &&
                    change((draft) => {
                      draft.theme = {
                        ...draft.theme,
                        preset: preset as ThemePreset,
                      };
                    })
                  }
                />
              </div>
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
