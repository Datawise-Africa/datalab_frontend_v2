import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { toastUtils } from '~/lib/utils/toast';

export function meta() {
  return [
    { title: 'Toast Notifications Demo - Datawise' },
    { name: 'description', content: 'Demo of custom toast notifications' },
  ];
}

export default function ToastDemo() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Toast Notifications Demo</h1>
        <p className="text-gray-600 mb-8">
          Click the buttons below to see different toast notification styles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Success Toast */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Success Toast</CardTitle>
              <CardDescription>
                Show a success message to the user
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() =>
                  toastUtils.success(
                    'Congratulations!',
                    'Your operation has been completed successfully.'
                  )
                }
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Show Success Toast
              </Button>
              <Button
                onClick={() =>
                  toastUtils.success(
                    'Product Created!',
                    'Your new product has been added to the catalog.'
                  )
                }
                variant="outline"
                className="w-full"
              >
                Another Example
              </Button>
            </CardContent>
          </Card>

          {/* Error Toast */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error Toast</CardTitle>
              <CardDescription>
                Show an error message to the user
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() =>
                  toastUtils.error(
                    'Something went wrong!',
                    'The program has turned off unexpectedly. Please try again.'
                  )
                }
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Show Error Toast
              </Button>
              <Button
                onClick={() =>
                  toastUtils.error(
                    'Validation Failed',
                    'Please check your inputs and try again.'
                  )
                }
                variant="outline"
                className="w-full"
              >
                Another Example
              </Button>
            </CardContent>
          </Card>

          {/* Info Toast */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Info Toast</CardTitle>
              <CardDescription>Show an informational message</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() =>
                  toastUtils.info(
                    'Did you know?',
                    'You can switch between artboards using Ctrl + T.'
                  )
                }
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Show Info Toast
              </Button>
              <Button
                onClick={() =>
                  toastUtils.info(
                    'New Feature Available',
                    'Check out our latest updates in the settings panel.'
                  )
                }
                variant="outline"
                className="w-full"
              >
                Another Example
              </Button>
            </CardContent>
          </Card>

          {/* Warning Toast */}
          <Card>
            <CardHeader>
              <CardTitle className="text-yellow-600">Warning Toast</CardTitle>
              <CardDescription>
                Show a warning message to the user
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() =>
                  toastUtils.warning(
                    'Warning!',
                    'Your password strength is too low. Consider using a stronger password.'
                  )
                }
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                Show Warning Toast
              </Button>
              <Button
                onClick={() =>
                  toastUtils.warning(
                    'Storage Almost Full',
                    'You have used 90% of your available storage.'
                  )
                }
                variant="outline"
                className="w-full"
              >
                Another Example
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Code Example */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Usage Example</CardTitle>
            <CardDescription>
              How to use the toast utilities in your code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{`import { toastUtils } from '~/lib/utils/toast';

// Success toast
toastUtils.success('Success!', 'Operation completed successfully.');

// Error toast
toastUtils.error('Error!', 'Something went wrong.');

// Info toast
toastUtils.info('Did you know?', 'Helpful information here.');

// Warning toast
toastUtils.warning('Warning!', 'Please be careful.');`}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
