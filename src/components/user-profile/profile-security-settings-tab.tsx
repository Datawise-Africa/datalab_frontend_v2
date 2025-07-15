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
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import {
  changePasswordResolver,
  type ChangePasswordDataType,
} from '@/lib/schema/user-profile';
import { useUserProfile } from '@/api/profile/profile';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { extractCorrectErrorMessage } from '@/lib/error';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/store/auth-store';

export default function ProfileSecuritySettingsTab() {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const auth = useAuth();
  const form = useForm<ChangePasswordDataType>({
    resolver: changePasswordResolver,
    defaultValues: {
      confirm_new_password: '',
      current_password: '',
      new_password: '',
    },
  });
  const { changePassword, isChangingPassword } = useUserProfile();
  const submit = form.handleSubmit((data) => {
    changePassword(data, {
      onError: (error) => {
        console.error('Error changing password:', error);
        toast.error(
          extractCorrectErrorMessage(
            error,
            'Password update failed.Try again later!',
          ),
        );
      },
      onSuccess: () => {
        console.log('Password changed successfully');
        toast.success('Password updated successfully!', {
          // duration: 3000,
        });
        form.reset();
        setChangePasswordOpen(false);
        auth.logout(); // Logout user after password change
      },
    });
  });
  console.log(form.formState.errors);

  return (
    <Card className="mx-auto my-8 border border-gray-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* <div className="flex items-center justify-between">
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
        </div> */}
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <p className="font-semibold">Change Password</p>
            <p className="text-sm text-gray-500">
              Update your password regularly for better security
            </p>
          </div>
          <Sheet open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
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
              <Form {...form}>
                <form className="grid gap-4 py-4" onSubmit={submit}>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="current_password"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Enter your current password"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="new_password"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              autoComplete="new-password"
                              placeholder="Enter the new password"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="confirm_new_password"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              autoComplete="new-password"
                              placeholder="Confirm your new password"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isChangingPassword || form.formState.isSubmitting}
                    className="text-white disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    Update Password
                  </Button>
                </form>
              </Form>
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
