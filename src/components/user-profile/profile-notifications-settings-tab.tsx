import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';

export default function ProfileNotificationSettingsTab() {
  return (
    <Card className="my-8 border border-gray-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 pb-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="grid gap-1">
            <Label htmlFor="email-updates" className="text-base">
              Email Updates
            </Label>
            <p className="text-sm text-gray-500">
              Receive notifications about account activity
            </p>
          </div>
          <Switch id="email-updates" defaultChecked />
        </div>
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="grid gap-1">
            <Label htmlFor="dataset-alerts" className="text-base">
              Dataset Alerts
            </Label>
            <p className="text-sm text-gray-500">
              Get notified when your datasets are accessed
            </p>
          </div>
          <Switch id="dataset-alerts" defaultChecked />
        </div>
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="grid gap-1">
            <Label htmlFor="weekly-reports" className="text-base">
              Weekly Reports
            </Label>
            <p className="text-sm text-gray-500">
              Weekly summary of your dataset analytics
            </p>
          </div>
          <Switch id="weekly-reports" />
        </div>
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="grid gap-1">
            <Label htmlFor="security-alerts" className="text-base">
              Security Alerts
            </Label>
            <p className="text-sm text-gray-500">
              Important security and login alerts
            </p>
          </div>
          <Switch id="security-alerts" defaultChecked />
        </div>
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="grid gap-1">
            <Label htmlFor="marketing-emails" className="text-base">
              Marketing Emails
            </Label>
            <p className="text-sm text-gray-500">
              Product updates and promotional content
            </p>
          </div>
          <Switch id="marketing-emails" defaultChecked />
        </div>
      </CardContent>
    </Card>
  );
}
