import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from '~/lib/schema/user-profile-schema';
import { useAppSelector } from '~/store';

interface ProfileSettingsTabProps {
  onSubmit?: (data: UpdateProfileInput) => void;
  isPending?: boolean;
  /**
   * Render the form without a save path. Set while `PUT /api/auth/me/` is unrouted
   * on the backend — the fields still show the signed-in user's details, but there
   * is nowhere to submit them. See `features/auth/mutations.ts` for the detail.
   */
  readOnly?: boolean;
}

export function ProfileSettingsTab({
  onSubmit,
  isPending,
  readOnly = false,
}: Readonly<ProfileSettingsTabProps>) {
  const user = useAppSelector((state) => state.auth.user);

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      email: user?.email ?? '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit?.(data))}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} disabled={readOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {readOnly ? (
          <p className="text-sm text-muted-foreground">
            Editing your profile isn&apos;t available yet — the backend endpoint
            for saving these changes hasn&apos;t shipped. Your details are shown
            here for reference.
          </p>
        ) : (
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        )}
      </form>
    </Form>
  );
}
