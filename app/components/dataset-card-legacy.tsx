import { Link } from 'react-router';
import {
  Lock,
  Globe,
  MoreVertical,
  Star,
  User,
  Clock,
  HardDrive,
  Users,
  Eye,
  Download,
  CheckCircle2,
  Building2,
  GraduationCap,
  Landmark,
  BookOpen,
} from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '~/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import type { Dataset, AudienceType } from '~/data/datasets';
import { cn } from '~/lib/utils';

const audienceIcons: Record<
  AudienceType,
  React.ComponentType<{ className?: string }>
> = {
  'Non-Profit': Landmark,
  Company: Building2,
  Student: GraduationCap,
  Public: Globe,
  Government: Landmark,
  Academic: BookOpen,
};

function formatPrice(price: number | null): string {
  if (price === null || price === 0) return 'Free';
  return `$${price}`;
}

export function DatasetCard({ dataset }: { dataset: Dataset }) {
  const isFree = dataset.price === null || dataset.price === 0;
  const isPrivate = dataset.accessType === 'Private';

  return (
    <Card className="group relative flex h-full flex-col gap-0 overflow-hidden py-0 transition-all duration-200 hover:shadow-lg hover:border-primary/40">
      {/* Top row: price, access type, menu */}
      <CardHeader className="flex-row items-center justify-between gap-2 px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              'rounded-md px-2 py-0.5 text-xs font-semibold',
              isFree
                ? 'border-primary/20 bg-primary/5 text-primary'
                : 'border-amber-200 bg-amber-50 text-amber-700'
            )}
          >
            {formatPrice(dataset.price)}
          </Badge>
          <Badge
            className={cn(
              'rounded-md px-2 py-0.5 text-xs font-medium',
              isPrivate
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-sky-200 bg-sky-50 text-sky-600'
            )}
          >
            {isPrivate ? (
              <Lock className="mr-1 h-3 w-3" />
            ) : (
              <Globe className="mr-1 h-3 w-3" />
            )}
            {dataset.accessType}
          </Badge>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/datasets/${dataset.slug}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 px-5 pb-4">
        {/* Title */}
        <h3 className="text-base font-semibold leading-snug text-foreground line-clamp-2">
          {dataset.name}
        </h3>

        {/* Author + Rating row */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 truncate">
            <User className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{dataset.author}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0 ml-2">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">
              {dataset.rating}
            </span>
            <span className="text-xs">({dataset.reviews} reviews)</span>
          </span>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {dataset.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {dataset.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-md text-xs font-normal capitalize"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Available to */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            Available to:
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {dataset.availableTo.map((audience) => {
              const Icon = audienceIcons[audience];
              return (
                <span
                  key={audience}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {audience}
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                </span>
              );
            })}
          </div>
        </div>

        {/* Meta info: updated, formats+size, downloads */}
        <div className="mt-auto space-y-1.5 border-t pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Updated: {dataset.lastUpdated}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HardDrive className="h-3.5 w-3.5" />
            <span>
              {dataset.formats.join(', ')} ({dataset.size})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{dataset.downloads.toLocaleString()} downloads</span>
          </div>
        </div>
      </CardContent>

      {/* Footer: View Details + Download buttons */}
      <CardFooter className="gap-3 border-t px-5 py-3">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link to={`/datasets/${dataset.slug}`}>
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            View Details
          </Link>
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-primary text-white hover:bg-primary/90"
        >
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
