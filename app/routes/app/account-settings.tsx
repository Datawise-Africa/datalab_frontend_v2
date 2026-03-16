import { useState } from 'react';
import type { Route } from './+types/account-settings';
import { generateSEOTags } from '~/lib/utils/seo';
import { ProfileSettingsTab } from '~/components/user-profile/profile-settings-tab';
import { ProfileSecurityTab } from '~/components/user-profile/profile-security-tab';
import { useUpdateProfile, useChangePassword } from '~/features/auth';
import { cn } from '~/lib/utils';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Account Settings',
    description: 'Manage your profile and account settings',
  });
}

const tabs = [
  { key: 'profile', label: 'Profile' },
  { key: 'security', label: 'Security' },
] as const;

type TabKey = (typeof tabs)[number]['key'];

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Account Settings</h1>
      <p className="mb-8 text-muted-foreground">
        Manage your profile and security settings
      </p>

      <div className="mb-8 flex gap-1 rounded-lg border p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <ProfileSettingsTab
          onSubmit={(data) => updateProfile.mutate(data)}
          isPending={updateProfile.isPending}
        />
      )}

      {activeTab === 'security' && (
        <ProfileSecurityTab
          onSubmit={(data) => changePassword.mutate(data)}
          isPending={changePassword.isPending}
        />
      )}
    </div>
  );
}
