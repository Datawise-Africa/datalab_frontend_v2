import { z } from 'zod';

export const updateProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.email('Please enter a valid email address'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    new_password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
