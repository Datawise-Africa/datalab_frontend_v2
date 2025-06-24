'use client';

import type React from 'react';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Briefcase,
  MapPin,
  Upload,
  Loader2,
  Save,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import Cropper from 'react-easy-crop';
import { useAuth } from '@/context/AuthProvider';
import { IconInput } from '../ui/icon-input';
import { z } from 'zod';

const updateProfileSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  organization: z.string().optional(),
  jobTitle: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof updateProfileSchema>;

// Helper function to get a cropped image from a canvas
const createImage = (url: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
) {
  const image = (await createImage(imageSrc)) as HTMLImageElement;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  // toDataURL returns the data URL directly, not through a callback
  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
  return dataUrl;
}

export default function ProfileSettings() {
  const {
    state: {
      firstName: authFirstName,
      lastName: authLastName,
      email: authEmail,
    },
  } = useAuth();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Loading state for avatar upload
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission

  // Initialize the form with React Hook Form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      title: 'Dr.',
      firstName: authFirstName || '',
      lastName: authLastName || '',
      email: authEmail || '',
      phone: '',
      organization: 'Datawise Africa',
      jobTitle: '',
      location: 'Nairobi, KE',
      bio: '',
    },
  });

  // Handle form submission
  const onSubmit = (data: ProfileFormValues) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Profile updated:', data);
      // Here you would typically make an API call to update the profile
      // api.updateProfile(data).then(...).catch(...)

      setIsSubmitting(false);
    }, 1000);
  };

  const onCropComplete = useCallback(
    (_croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const imageDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.addEventListener(
            'load',
            () => resolve(reader.result as string),
            false,
          );
          reader.readAsDataURL(file);
        });
        setImageSrc(imageDataUrl);
      }
    },
    [],
  );

  const showCroppedImage = useCallback(async () => {
    setIsSaving(true); // Start loading
    try {
      if (imageSrc && croppedAreaPixels) {
        const croppedImageResult = await getCroppedImg(
          imageSrc,
          croppedAreaPixels,
        );
        // Simulate an upload delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setCroppedImage(croppedImageResult);
        setIsDialogOpen(false); // Close dialog after cropping
        setImageSrc(null); // Clear image source from cropper
      }
    } catch (e) {
      console.error(e);
      // Optionally show an error message to the user
    } finally {
      setIsSaving(false); // End loading
    }
  }, [imageSrc, croppedAreaPixels]);

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
              src={croppedImage || '/placeholder.svg?height=80&width=80'}
              alt="Avatar"
            />
            <AvatarFallback>
              {form.getValues().firstName?.[0]}
              {form.getValues().lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-2">
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
                          accept="image/*"
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
            >
              Remove
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
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
                      <SelectContent>
                        <SelectItem value="Dr.">Dr.</SelectItem>
                        <SelectItem value="Mr.">Mr.</SelectItem>
                        <SelectItem value="Ms.">Ms.</SelectItem>
                        <SelectItem value="Mx.">Mx.</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organization"
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                className="flex items-center gap-2 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
