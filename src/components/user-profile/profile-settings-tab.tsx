import { useState, useCallback, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Loader2,
  Save,
  Link2Icon,
} from 'lucide-react'; // Import Loader2 for spinner
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
// import Cropper from 'react-easy-crop';
import { IconInput } from '../ui/icon-input';
import { useUserProfile } from '@/api/profile/profile';
import { cn } from '@/lib/utils';
import { FancyToast } from '@/lib/utils/toaster';
import { extractCorrectErrorMessage } from '@/lib/error';
import {
  updateProfileSchema,
  type UpdateUserProfileDataType,
} from '@/lib/schema/user-profile';
// import Cropper from 'react-easy-crop';
const userTitles = [
  { value: 'Dr.', label: 'Dr.' },
  { value: 'Mr.', label: 'Mr.' },
  { value: 'Ms.', label: 'Ms.' },
  { value: 'Mrs.', label: 'Mrs.' },
  { value: 'Rev.', label: 'Rev.' },
  { value: 'Mx.', label: 'Mx.' },
  { value: 'Prof.', label: 'Prof.' },
  { value: 'Eng.', label: 'Eng.' },
  { value: 'Hon.', label: 'Hon.' },
  { value: 'Sir', label: 'Sir' },
];

// Helper function to get a cropped image from a canvas
// const createImage = (url: string) =>
//   new Promise((resolve, reject) => {
//     const image = new Image();
//     image.addEventListener('load', () => resolve(image));
//     image.addEventListener('error', (error) => reject(error));
//     image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues
//     image.src = url;
//   });

// async function getCroppedImg(
//   imageSrc: string,
//   pixelCrop: { x: number; y: number; width: number; height: number },
// ) {
//   const image = (await createImage(imageSrc)) as HTMLImageElement;
//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('2d');

//   if (!ctx) {
//     return null;
//   }

//   const scaleX = image.naturalWidth / image.width;
//   const scaleY = image.naturalHeight / image.height;

//   canvas.width = pixelCrop.width;
//   canvas.height = pixelCrop.height;

//   ctx.drawImage(
//     image,
//     pixelCrop.x * scaleX,
//     pixelCrop.y * scaleY,
//     pixelCrop.width * scaleX,
//     pixelCrop.height * scaleY,
//     0,
//     0,
//     pixelCrop.width,
//     pixelCrop.height,
//   );

//   // toDataURL returns the data URL directly, not through a callback
//   const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
//   return dataUrl;
// }

export default function ProfileSettings() {
  const { profile, updateProfile, isUpdating } = useUserProfile();
  // const [imageSrc, setImageSrc] = useState<string | null>(null);
  // const [crop, setCrop] = useState({ x: 0, y: 0 });
  // const [zoom, setZoom] = useState(1);
  // const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
  //   x: number;
  //   y: number;
  //   width: number;
  //   height: number;
  // } | null>(null);
  const [croppedImage] = useState<string | null>(null);
  const [_isDialogOpen] = useState(false);
  const [_isSaving] = useState(false); // Loading state for avatar upload
  // const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission

  // Initialize the form with React Hook Form
  const form = useForm<UpdateUserProfileDataType>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      // id: '',
      first_name: '',
      last_name: '',
      email: '',
      profile: {
        // id: undefined,
        title: '',
        avatar: '',
        bio: '',
        phone_number: '',
        organization: '',
        location: '',
        linkedin_url: '',
      },
    },
  });

  // Handle form submission
  const onSubmit = form.handleSubmit(async (data) => {
    await updateProfile(data, {
      onSuccess: () => {
        // console.log('Profile updated successfully');
        FancyToast.success('Profile updated successfully', {
          autoClose: true,
        });
        // Optionally, you can show a success message or reset the form
      },
      onError: (error) => {
        console.error('Error updating profile:', error);
        FancyToast.error(
          extractCorrectErrorMessage(
            error,
            'Failed to update profile. Please try again.',
          ),
          {
            autoClose: true,
          },
        );
        // Optionally, you can show an error message to the user
      },
    });
  });

  // const _onCropComplete = useCallback(
  //   (_croppedArea: any, croppedAreaPixels: any) => {
  //     setCroppedAreaPixels(croppedAreaPixels);
  //   },
  //   [],
  // );

  // const _onFileChange = useCallback(
  //   async (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (e.target.files && e.target.files.length > 0) {
  //       const file = e.target.files[0];
  //       const imageDataUrl = await new Promise<string>((resolve) => {
  //         const reader = new FileReader();
  //         reader.addEventListener(
  //           'load',
  //           () => resolve(reader.result as string),
  //           false,
  //         );
  //         reader.readAsDataURL(file);
  //       });
  //       setImageSrc(imageDataUrl);
  //     }
  //   },
  //   [],
  // );

  // const _showCroppedImage = useCallback(async () => {
  //   setIsSaving(true); // Start loading
  //   try {
  //     if (imageSrc && croppedAreaPixels) {
  //       const croppedImageResult = await getCroppedImg(
  //         imageSrc,
  //         croppedAreaPixels,
  //       );
  //       // Simulate an upload delay
  //       await new Promise((resolve) => setTimeout(resolve, 1500));
  //       setCroppedImage(croppedImageResult);

  //       // Update the form with the base64 image
  //       if (croppedImageResult) {
  //         form.setValue('profile.avatar', croppedImageResult);
  //         console.log('Updated form with new avatar');
  //       }

  //       setIsDialogOpen(false); // Close dialog after cropping
  //       setImageSrc(null); // Clear image source from cropper
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     // Optionally show an error message to the user
  //   } finally {
  //     setIsSaving(false); // End loading
  //   }
  // }, [imageSrc, croppedAreaPixels, form]);

  const watchProfileChanges = useCallback(
    function () {
      // console.log('Watching profile changes:', profile);

      if (
        profile &&
        typeof profile === 'object' &&
        !Array.isArray(profile) &&
        profile !== null &&
        profile !== undefined &&
        Object.keys(profile).length > 0
      ) {
        form.reset({
          // id: profile.id || '',
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: profile.email || '',
          profile: {
            // id: profile.profile?.id,
            title: profile.profile?.title || '',
            avatar: profile.profile?.avatar || '',
            bio: profile.profile?.bio || '',
            phone_number: profile.profile?.phone_number || '',
            organization: profile.profile?.organization || '',
            location: profile.profile?.location || '',
            linkedin_url: profile.profile?.linkedin_url || '',
          },
        });
        console.log('Form reset wit/h profile data:', form.getValues());
      }
    },
    [profile],
  );

  // Watch for changes in the profile data and reset the form
  useEffect(() => {
    watchProfileChanges();
  }, [profile, watchProfileChanges]);

  const imageUrl = useMemo(() => {
    if (croppedImage) {
      return croppedImage;
    }
    if (form.getValues().profile.avatar) {
      return form.getValues().profile.avatar;
    }
    return profile?.profile?.avatar || null;
  }, [croppedImage, form]);
  // console.log({ imageUrl, profile });

  return (
    <Card className="border-primary/30 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 border-none">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-gray-300">
            <AvatarImage
              src={form.watch('profile.avatar')! || imageUrl!}
              alt="Avatar"
            />
            <AvatarFallback>
              {form.getValues().first_name?.[0]}
              {form.getValues().last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          {/* <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Change Avatar</Button>
              </DialogTrigger>
              <DialogContent className="border-primary/30 border bg-white sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Crop your avatar</DialogTitle>
                  <DialogDescription>
                    Upload an image and crop it to fit your profile.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {!imageSrc && (
                    <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                      <Label
                        htmlFor="avatar-upload"
                        className="flex cursor-pointer flex-col items-center gap-2"
                      >
                        <Upload className="h-8 w-8 text-gray-500" />
                        <span className="text-gray-600">
                          Click to upload or drag and drop
                        </span>
                        <Input
                          id="avatar-upload"
                          type="file"
                          accept=".png, .jpeg, .jpg, image/png, image/jpeg"
                          onChange={onFileChange}
                          className="sr-only"
                        />
                      </Label>
                    </div>
                  )}
                  {imageSrc && (
                    <div className="relative h-[300px] w-full overflow-hidden rounded-md bg-gray-100">
                      <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1 / 1} // 400x400 is a square aspect ratio
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        showGrid={false}
                      />
                    </div>
                  )}
                  {imageSrc && (
                    <div className="grid gap-2">
                      <Label htmlFor="zoom-slider">Zoom</Label>
                      <Input
                        id="zoom-slider"
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) =>
                          setZoom(Number.parseFloat(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setImageSrc(null);
                    }}
                    disabled={isSaving} // Disable cancel button while saving
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={showCroppedImage}
                    disabled={!imageSrc || isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="destructive"
              className="border border-red-300 text-red-500"
              onClick={() => {
                setCroppedImage(null);
                form.setValue('profile.avatar', '');
                console.log('Avatar removed');
              }}
            >
              Remove
            </Button>
          </div> */}
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="profile.title"
                render={({ field }) => (
                  <FormItem className="grid w-full gap-2">
                    <FormLabel>Title</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full border-gray-300">
                          <SelectValue placeholder="Select title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-primary/30 w-full border bg-white">
                        {userTitles.map((title) => (
                          <SelectItem
                            key={title.value}
                            value={title.value}
                            className={cn('hover:bg-primary/30', {
                              'bg-primary/10': field.value === title.value,
                            })}
                          >
                            {title.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <IconInput
                        {...field}
                        className="pl-9"
                        leftIcon={<Mail className="h-4 w-4 text-gray-500" />}
                        type="email"
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.phone_number"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <IconInput
                        {...field}
                        className="pl-9"
                        leftIcon={<Phone className="h-4 w-4 text-gray-500" />}
                        type="tel"
                        placeholder="Enter your phone number"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.organization"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <IconInput
                        {...field}
                        className="pl-9"
                        leftIcon={
                          <Building className="h-4 w-4 text-gray-500" />
                        }
                        placeholder="Enter your organization"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <IconInput
                        {...field}
                        className="pl-9"
                        leftIcon={
                          <Briefcase className="h-4 w-4 text-gray-500" />
                        }
                        placeholder="Enter your job title"
                      />
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="profile.location"
                render={({ field }) => (
                  <FormItem className="grid gap-2 sm:col-span-2">
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <IconInput
                        {...field}
                        className="pl-9"
                        leftIcon={<MapPin className="h-4 w-4 text-gray-500" />}
                        placeholder="Enter your location"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profile.linkedin_url"
                render={({ field }) => (
                  <FormItem className="grid gap-2 sm:col-span-2">
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <IconInput
                        {...field}
                        className="pl-9"
                        leftIcon={
                          <Link2Icon className="h-4 w-4 text-gray-500" />
                        }
                        placeholder="Enter your LinkedIn URL"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.bio"
                render={({ field }) => (
                  <FormItem className="grid gap-2 sm:col-span-2">
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder="Enter your bio"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                className="flex items-center gap-2 text-white"
                disabled={form.formState.isSubmitting || isUpdating}
              >
                {form.formState.isSubmitting || isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating Profile...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
