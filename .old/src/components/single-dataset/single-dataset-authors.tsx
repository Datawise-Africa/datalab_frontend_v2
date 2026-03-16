import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Building, Mail } from 'lucide-react';
import type { IDatasetAuthor } from '@/lib/types/data-set';

interface SingleDatasetAuthorsProps {
  authors: IDatasetAuthor[];
}

export function SingleDatasetAuthors({ authors }: SingleDatasetAuthorsProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Author Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {authors.map((author) => (
            <div
              key={author.id}
              className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300"
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 font-semibold text-blue-700">
                  {getInitials(author.first_name, author.last_name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {author.title && `${author.title} `}
                    {author.first_name} {author.last_name}
                  </h4>
                </div>

                {author.affiliation && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="h-4 w-4" />
                    <span>{author.affiliation}</span>
                  </div>
                )}

                {author.email && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 bg-transparent text-xs"
                      asChild
                    >
                      <a href={`mailto:${author.email}`}>
                        <Mail className="mr-1 h-3 w-3" />
                        Contact
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
