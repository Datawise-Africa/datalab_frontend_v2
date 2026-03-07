import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { StarRating } from '@/components/ui/star-rating';
import {
  submitReviewResolver,
  type SubmitReviewSchemaType,
} from '@/lib/schema/upload-dataset-schema';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { extractCorrectErrorMessage } from '@/lib/error';

// Review Modal Component
export function DatasetReviewModal({
  datasetId,
  datasetName,
  onSubmitReview,
}: {
  datasetId: string;
  datasetName: string;
  onSubmitReview: (review: SubmitReviewSchemaType) => Promise<any>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SubmitReviewSchemaType>({
    resolver: submitReviewResolver,
    defaultValues: {
      dataset: datasetId.toString(),
      rating: 0,
      comment: '',
    },
  });

  const onSubmit = async (data: SubmitReviewSchemaType) => {
    setIsSubmitting(true);
    try {
      await onSubmitReview(data);
      setIsOpen(false);
      form.reset();
    } catch (error) {
      toast.error(
        extractCorrectErrorMessage(
          error,
          'Error submitting review. Please try again.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchRating = form.watch('rating');
  const watchComment = form.watch('comment');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="mr-2 h-4 w-4" />
          Write Review
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Dataset</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-medium">{datasetName}</h4>
            </div>

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <StarRating
                        rating={field.value}
                        onRatingChange={field.onChange}
                        size="md"
                      />
                      <span className="text-sm text-gray-500">
                        {field.value > 0
                          ? `${field.value} star${field.value > 1 ? 's' : ''}`
                          : 'Select rating'}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience with this dataset..."
                      rows={4}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500">
                    {watchComment?.length || 0}/500 characters
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  watchRating === 0 ||
                  (watchComment?.trim() || '').length === 0 ||
                  isSubmitting
                }
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
