import { Bookmark, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { useBookmarkedDatasets, useRemoveBookmark } from '~/features/bookmarks';
import { Link } from 'react-router';
import { useAppSelector } from '~/store';

export default function BookmarksPage() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const { data: bookmarks, isLoading } = useBookmarkedDatasets(
    {},
    isAuthenticated
  );
  const removeBookmark = useRemoveBookmark();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bookmarks</h1>
        <p className="text-muted-foreground mt-1">
          Datasets and resources you&apos;ve saved for later.
        </p>
      </div>

      <Tabs defaultValue="datasets">
        <TabsList>
          <TabsTrigger value="datasets">
            Datasets{' '}
            {bookmarks?.data?.length ? (
              <Badge
                variant="secondary"
                className="ml-1.5 text-[10px] px-1.5 py-0"
              >
                {bookmarks.data.length}
              </Badge>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !bookmarks?.data?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bookmark className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">
                No bookmarked datasets yet.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link to="/datasets">Browse Datasets</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarks?.data?.map((bookmark) => (
                <Card key={bookmark.id}>
                  <CardContent className="p-5">
                    <h3 className="font-medium text-sm mb-1 line-clamp-1">
                      <Link
                        to={`/datasets/${bookmark.dataset.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {bookmark.dataset.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {bookmark.dataset.description}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive h-auto px-0"
                      onClick={() => removeBookmark.mutate(bookmark.id)}
                      disabled={removeBookmark.isPending}
                    >
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">
              Report bookmarks coming soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
