import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useEdukenData } from '~/features/dashboards/queries';
import { useIsClient } from '~/hooks/use-is-client';
import { generateSEOTags } from '~/lib/utils/seo';
import type { Route } from './+types/eduken';

const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
const INSTITUTION_COLORS = ['#8884d8', '#82ca9d'];

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'EduKen Education Dashboard',
    description:
      'Interactive education dashboard showcasing qualifications, institutions, and categories per county across Kenya.',
  });
}

function EdukenMap({
  selectedCounty,
  onSelectCounty,
  searchTerm,
}: {
  selectedCounty: string | null;
  onSelectCounty: (county: string | null) => void;
  searchTerm: string;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geojsonRef = useRef<L.GeoJSON | null>(null);
  const [L, setL] = useState<typeof import('leaflet') | null>(null);

  // Dynamically import leaflet (client-only)
  useEffect(() => {
    import('leaflet').then((mod) => {
      import('leaflet/dist/leaflet.css');
      setL(mod.default);
    });
  }, []);

  // Init map
  useEffect(() => {
    if (!L || !mapContainer.current || mapRef.current) return;

    mapRef.current = L.map(mapContainer.current).setView([0.0236, 37.9062], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        geojsonRef.current = null;
      }
    };
  }, [L]);

  // Load GeoJSON
  useEffect(() => {
    if (!L || !mapRef.current || geojsonRef.current) return;

    fetch('/kenya.geojson')
      .then((res) => res.json())
      .then((geojson) => {
        if (!mapRef.current || !L) return;
        geojsonRef.current = L.geoJSON(geojson, {
          style: (feature) => ({
            fillColor:
              selectedCounty === feature?.properties.COUNTY_NAM
                ? 'hsl(var(--primary))'
                : 'lightgray',
            fillOpacity:
              selectedCounty === feature?.properties.COUNTY_NAM ? 0.7 : 0.3,
            weight: 2,
            color: '#333',
          }),
          onEachFeature: (feature, layer) => {
            const countyName = feature.properties.COUNTY_NAM;
            layer.bindTooltip(countyName);
            layer.on('click', () => {
              onSelectCounty(countyName === selectedCounty ? null : countyName);
              if (countyName !== selectedCounty && mapRef.current) {
                mapRef.current.fitBounds((layer as L.Polygon).getBounds());
              }
            });
          },
        }).addTo(mapRef.current);
      })
      .catch(() => {
        // GeoJSON not available
      });
  }, [L, selectedCounty, onSelectCounty]);

  // Update styles when selection changes
  useEffect(() => {
    if (!geojsonRef.current) return;
    geojsonRef.current.eachLayer((layer: L.Layer) => {
      const geoLayer = layer as L.GeoJSON & {
        feature?: GeoJSON.Feature;
        getBounds?: () => L.LatLngBounds;
      };
      if (!geoLayer.feature) return;
      const name = geoLayer.feature.properties?.COUNTY_NAM;
      const isSelected = name === selectedCounty;
      (layer as L.Path).setStyle({
        fillColor: isSelected ? 'hsl(142, 71%, 45%)' : 'lightgray',
        fillOpacity: isSelected ? 0.7 : 0.3,
      });
    });
  }, [selectedCounty]);

  // Search zoom
  useEffect(() => {
    if (!searchTerm || !geojsonRef.current || !mapRef.current) return;
    geojsonRef.current.eachLayer((layer: L.Layer) => {
      const geoLayer = layer as L.GeoJSON & {
        feature?: GeoJSON.Feature;
        getBounds?: () => L.LatLngBounds;
      };
      if (!geoLayer.feature) return;
      const name = geoLayer.feature.properties?.COUNTY_NAM;
      if (
        name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        geoLayer.getBounds
      ) {
        mapRef.current!.fitBounds(geoLayer.getBounds());
      }
    });
  }, [searchTerm]);

  return (
    <div
      ref={mapContainer}
      className="h-[500px] w-full rounded-lg"
      style={{ minHeight: '500px' }}
    />
  );
}

export default function EdukenDashboard() {
  const isClient = useIsClient();
  const { data: countyData, isLoading, isError } = useEdukenData();
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectCounty = useCallback((county: string | null) => {
    setSelectedCounty(county);
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!countyData) return;
    const allCounties = Object.keys(countyData.qualifications_per_county);
    const match = allCounties.find((c) =>
      c.toLowerCase().includes(value.toLowerCase())
    );
    if (match) setSelectedCounty(match);
  };

  const getQualificationsData = (county: string) => {
    if (!countyData?.qualifications_per_county?.[county]) return [];
    const q = countyData.qualifications_per_county[county];
    return [
      { name: 'CRAFT', value: q.CRAFT },
      { name: 'DEGREE', value: q.DEGREE },
      { name: 'DIPLOMA', value: q.DIPLOMA },
    ];
  };

  const getInstitutionsData = (county: string) => {
    if (!countyData?.institutions_per_county?.[county]) return [];
    const i = countyData.institutions_per_county[county];
    return [
      { name: 'Private', value: i.Private },
      { name: 'Public', value: i.Public },
    ];
  };

  const getCategoriesData = (county: string) => {
    if (!countyData?.categories_per_county?.[county]) return [];
    const c = countyData.categories_per_county[county];
    return [
      { name: 'College', value: c.College },
      { name: 'University', value: c.University },
    ];
  };

  const noCountyMessage = (label: string) => (
    <p className="py-8 text-center text-sm text-muted-foreground">
      Select a county to view {label}
    </p>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboards">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Dashboards
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">EduKen Data Dashboard</h1>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  Live
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Education data across Kenyan counties
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">
              Loading education data...
            </span>
          </div>
        )}

        {isError && (
          <div className="py-12 text-center">
            <p className="text-destructive">Failed to load education data.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Left sidebar — Institutions & Categories charts */}
            <div className="space-y-6 lg:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Institutions per County
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCounty ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={getInstitutionsData(selectedCounty)}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          dataKey="value"
                          label
                        >
                          {getInstitutionsData(selectedCounty).map(
                            (_, index) => (
                              <Cell
                                key={`inst-${index}`}
                                fill={
                                  INSTITUTION_COLORS[
                                    index % INSTITUTION_COLORS.length
                                  ]
                                }
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    noCountyMessage('institutions data')
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Categories per County
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCounty ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={getCategoriesData(selectedCounty)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" radius={4} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    noCountyMessage('categories data')
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Center — Kenya Map */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Kenya Counties Map
                  </CardTitle>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search for a county..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {isClient ? (
                    <EdukenMap
                      selectedCounty={selectedCounty}
                      onSelectCounty={handleSelectCounty}
                      searchTerm={searchTerm}
                    />
                  ) : (
                    <div className="flex h-[500px] items-center justify-center rounded-lg bg-muted">
                      <p className="text-muted-foreground">Loading map...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right sidebar — Qualifications chart */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    {selectedCounty
                      ? `${selectedCounty} — Qualifications`
                      : 'Select a county'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCounty ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={getQualificationsData(selectedCounty)}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          dataKey="value"
                          label
                        >
                          {getQualificationsData(selectedCounty).map(
                            (_, index) => (
                              <Cell
                                key={`qual-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    noCountyMessage('qualifications')
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
