export const profileKeys = {
  all: ['profile'] as const,
  details: () => [...profileKeys.all, 'details'] as const,
  notifications: () => [...profileKeys.all, 'notifications'] as const,
  billing: () => [...profileKeys.all, 'billing'] as const,
  security: () => [...profileKeys.all, 'security'] as const,
  update: () => [...profileKeys.all, 'update'] as const,
  delete: () => [...profileKeys.all, 'delete'] as const,
  changePassword: () => [...profileKeys.all, 'changePassword'] as const,
  updateProfilePicture: () =>
    [...profileKeys.all, 'updateProfilePicture'] as const,
  updateNotificationSettings: () =>
    [...profileKeys.all, 'updateNotificationSettings'] as const,
  updateBillingSettings: () =>
    [...profileKeys.all, 'updateBillingSettings'] as const,
  updateSecuritySettings: () =>
    [...profileKeys.all, 'updateSecuritySettings'] as const,
  getProfilePicture: () => [...profileKeys.all, 'getProfilePicture'] as const,
  getNotificationSettings: () =>
    [...profileKeys.all, 'getNotificationSettings'] as const,
  getBillingSettings: () => [...profileKeys.all, 'getBillingSettings'] as const,
};
