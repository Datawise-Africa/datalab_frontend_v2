import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
export const updateProfileSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  // id: z.string(),
  profile: z.object({
    // id: z.number().optional(),
    title: z.string().optional(),
    avatar: z.string().optional(),
    bio: z.string().optional(),
    phone_number: z.string().optional(),
    organization: z.string().optional(),
    location: z.string().optional(),
    linkedin_url: z.string().url('Invalid LinkedIn URL').optional(),
  }),
});

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(68, 'Password must be at most 68 characters'),
    // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    // .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    // .regex(/[0-9]/, 'Password must contain at least one number')
    // .regex(
    //   /[^A-Za-z0-9]/,
    //   'Password must contain at least one special character'
    // )
    confirm_new_password: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: 'Passwords do not match',
    path: ['confirm_new_password'], // This shows the error on confirm field
  })
  .refine((data) => data.new_password !== data.current_password, {
    message: 'New password must be different from current password',
    path: ['new_password'],
  });

// resolvers
export const userprofileUpdateResolver = zodResolver(updateProfileSchema);
export const changePasswordResolver = zodResolver(changePasswordSchema);
export type ChangePasswordDataType = z.infer<typeof changePasswordSchema>;
export type UpdateUserProfileDataType = z.infer<typeof updateProfileSchema>;
