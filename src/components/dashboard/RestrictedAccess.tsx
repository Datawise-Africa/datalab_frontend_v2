import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface RestrictedAccessProps {
  title?: string;
  message?: string;
  contactEmail?: string;
  showBackButton?: boolean;
  backUrl?: string;
}

export function RestrictedAccess({
  title = 'Page Unavailable',
  message = "The page you're looking for either doesn't exist or you don't have permission to view it.",
  // contactEmail = 'support@example.com',
  showBackButton = true,
  backUrl = '/',
}: RestrictedAccessProps) {
  // const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-[70vh] p-4">
      <Card className="max-w-2xl w-full p-6 border-none shadow-none">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-gray-100 p-3 mb-4">
            <ShieldAlert className="h-10 w-10 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-2 text-red-400">
            {title}
          </h2>

          <p className="text-muted-foreground mb-6">{message}</p>

          <div className="grid gap-3 w-full place-items-center">
            {showBackButton && (
              <Button variant="outline" className="w-fit " asChild>
                <Link to={backUrl} className="flex items-center text-primary">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Link>
              </Button>
            )}

            {/* <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
              <HelpCircle className="h-4 w-4 mr-1" />
              <span>
                Need help? Contact{' '}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-primary hover:underline"
                >
                  {contactEmail}
                </a>
              </span>
            </div> */}
          </div>
        </div>
      </Card>
    </div>
  );
}
