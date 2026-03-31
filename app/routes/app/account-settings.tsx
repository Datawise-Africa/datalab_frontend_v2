import type { Route } from './+types/account-settings';
import { generateSEOTags } from '~/lib/utils/seo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Card, CardContent } from '~/components/ui/card';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Switch } from '~/components/ui/switch';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { Sun, Moon, Monitor } from 'lucide-react';
import { ProfileSettingsTab } from '~/components/user-profile/profile-settings-tab';
import { ProfileSecurityTab } from '~/components/user-profile/profile-security-tab';
import { useUpdateProfile, useChangePassword } from '~/features/auth';
import { useAppSelector, useAppDispatch } from '~/store';
import { setDarkMode } from '~/store/slices/theme-slice';
import { cn } from '~/lib/utils';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Account Settings',
    description: 'Manage your profile and account settings',
  });
}

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

export default function AccountSettings() {
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const user = useAppSelector((s) => s.auth.user);
  const darkMode = useAppSelector((s) => s.theme.darkMode);
  const dispatch = useAppDispatch();

  const initials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase()
    : '?';

  const roleBadge =
    user?.user_role === 'admin'
      ? 'Admin'
      : user?.user_role === 'dataset_creator'
        ? 'Creator'
        : 'Member';

  const currentTheme = darkMode ? 'dark' : 'light';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile, security, and preferences.
        </p>
      </div>

      {/* Profile header card */}
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <Badge variant="secondary" className="mt-1">
              {roleBadge}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Profile tab */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold mb-4">
                Personal Information
              </h3>
              <ProfileSettingsTab
                onSubmit={(data) => updateProfile.mutate(data)}
                isPending={updateProfile.isPending}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security tab */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold mb-4">Change Password</h3>
              <ProfileSecurityTab
                onSubmit={(data) => changePassword.mutate(data)}
                isPending={changePassword.isPending}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance tab */}
        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold mb-4">Theme</h3>
              <div className="flex gap-3">
                {themeOptions.map((opt) => {
                  const active =
                    opt.value === 'system' ? false : opt.value === currentTheme;
                  return (
                    <Button
                      key={opt.value}
                      variant={active ? 'default' : 'outline'}
                      className={cn(
                        'flex-1 gap-2',
                        !active && 'text-muted-foreground'
                      )}
                      onClick={() => {
                        if (opt.value === 'light') dispatch(setDarkMode(false));
                        else if (opt.value === 'dark')
                          dispatch(setDarkMode(true));
                        // system: could add prefers-color-scheme listener
                      }}
                    >
                      <opt.icon className="h-4 w-4" />
                      {opt.label}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications tab */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardContent className="p-6 space-y-5">
              <h3 className="text-sm font-semibold">Email Notifications</h3>
              <NotificationToggle
                label="New datasets in bookmarked categories"
                description="Get notified when new datasets are added to categories you follow."
              />
              <Separator />
              <NotificationToggle
                label="Download receipts"
                description="Receive email confirmation after downloading a dataset."
              />
              <Separator />
              <NotificationToggle
                label="Reviews on your datasets"
                description="Get notified when someone reviews your published datasets."
                defaultChecked
              />
              <Separator />
              <NotificationToggle
                label="Platform announcements"
                description="Important updates about new features and changes."
                defaultChecked
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotificationToggle({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
