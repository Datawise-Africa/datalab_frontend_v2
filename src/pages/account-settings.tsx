import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfilePageLoader from '@/components/user-profile/profile-page-loader';
import { cn } from '@/lib/utils';
import React, { lazy } from 'react';
const ProfileSettings = lazy(
  () => import('@/components/user-profile/profile-settings-tab'),
);
const ProfileNotificationSettingsTab = lazy(
  () => import('@/components/user-profile/profile-notifications-settings-tab'),
);
const ProfileBillingSettingsTab = lazy(
  () => import('@/components/user-profile/profile-billing-settings-tab'),
);
const ProfileSecuritySettingsTab = lazy(
  () => import('@/components/user-profile/profile-security-settings-tab'),
);
const tabOptions = [
  { value: 'profile', label: 'Profile' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'billing', label: 'Billing Options' },
  { value: 'security', label: 'Security' },
] as const;
export default function AccountSettings() {
  const [tab, setTab] = React.useState('profile');
  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-4 text-2xl font-bold">Account Settings</h1>
        <p className="mb-6 text-gray-600">
          Manage your account settings, security, and preferences.
        </p>
      </div>
      <Tabs defaultValue={tab} className="mx-auto w-full max-w-4xl">
        <TabsList className="grid w-full grid-cols-4 bg-gray-200">
          {tabOptions.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              className={cn('text-gray-800', {
                'bg-gray-50': tab === option.value,
              })}
              onClick={() => setTab(option.value)}
            >
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <React.Suspense fallback={<ProfilePageLoader />}>
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="notifications">
            <ProfileNotificationSettingsTab />
          </TabsContent>
          <TabsContent value="billing">
            <ProfileBillingSettingsTab />
          </TabsContent>
          <TabsContent value="security">
            <ProfileSecuritySettingsTab />
          </TabsContent>
        </React.Suspense>
      </Tabs>
    </div>
  );
}
