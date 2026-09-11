import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';

export function Field({
  label,
  children,
}: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <div className="mb-3 space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
export function Toggle({
  label,
  checked,
  onChange,
}: Readonly<{
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}>) {
  return (
    <div className="flex items-center justify-between py-2">
      <Label className="text-xs font-normal">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
