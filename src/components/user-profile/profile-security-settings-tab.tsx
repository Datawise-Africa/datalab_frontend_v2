import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function ProfileSecuritySettingsTab() {
  return (
    <Card className="mx-auto my-8 border border-gray-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <p className="font-semibold">Two-Factor Authentication</p>
            <p className="text-sm text-gray-500">
              Add an extra layer of security to your account
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
              Not Enabled
            </span>
            <Button variant="link" className="h-auto p-0">
              Enable
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <p className="font-semibold">Change Password</p>
            <p className="text-sm text-gray-500">
              Update your password regularly for better security
            </p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Change Password</Button>
            </SheetTrigger>
            <SheetContent side="right" className="max-w-md bg-white p-4">
              <SheetHeader>
                <SheetTitle>Change Your Password</SheetTitle>
                <SheetDescription>
                  Enter your current password and a new password to update your
                  account security.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
                <Button type="submit">Update Password</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <Button
              variant="destructive"
              className="flex items-center gap-2 border border-red-500 text-red-500"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
