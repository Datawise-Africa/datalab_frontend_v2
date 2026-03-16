import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Download, Star, TrendingUp } from 'lucide-react';

interface DatasetStatsProps {
  viewsCount: number;
  downloadCount: number;
  reviewCount: number;
  averageRating: number;
}

export function SingleDatasetStats({
  viewsCount,
  downloadCount,
  reviewCount,
  averageRating,
}: DatasetStatsProps) {
  const stats = [
    {
      label: 'Views',
      value: viewsCount ?? 0,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Downloads',
      value: downloadCount ?? 0,
      icon: Download,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Reviews',
      value: reviewCount ?? 0,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Avg Rating',
      value: averageRating ?? 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <CardTitle>Dataset Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-3 text-center">
              <div className={`inline-flex rounded-full p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
