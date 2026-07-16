import { useEffect, useRef } from 'react';
import { useIsClient } from '~/hooks/use-is-client';

export interface CountryStats {
  country: string;
  code: string;
  lat: number;
  lng: number;
  views: number;
  downloads: number;
}

interface GeoMapProps {
  data: CountryStats[];
  title?: string;
  metric?: 'views' | 'downloads';
}

/**
 * Leaflet-based geographic bubble map.
 * Renders a world map with sized circles for each country based on the selected metric.
 * Uses dynamic import to avoid SSR issues with Leaflet.
 */
export function GeoMap({
  data,
  title = 'Geographic Breakdown',
  metric = 'views',
}: Readonly<GeoMapProps>) {
  const isClient = useIsClient();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!isClient || !mapRef.current || data.length === 0) return;

    // Dynamic import to avoid SSR
    Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]).then(
      ([L]) => {
        // Clean up previous instance
        if (mapInstanceRef.current) {
          (mapInstanceRef.current as L.Map).remove();
        }

        const map = L.map(mapRef.current!, {
          center: [5, 20],
          zoom: 2,
          scrollWheelZoom: false,
          attributionControl: false,
        });

        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          { maxZoom: 18 }
        ).addTo(map);

        const maxVal = Math.max(...data.map((d) => d[metric]), 1);

        data.forEach((point) => {
          const value = point[metric];
          const radius = Math.max(5, (value / maxVal) * 30);

          L.circleMarker([point.lat, point.lng], {
            radius,
            fillColor: 'hsl(149, 60%, 45%)',
            color: 'hsl(149, 60%, 35%)',
            weight: 1,
            fillOpacity: 0.5,
          })
            .bindTooltip(
              `<strong>${point.country}</strong><br/>Views: ${point.views.toLocaleString()}<br/>Downloads: ${point.downloads.toLocaleString()}`,
              { direction: 'top' }
            )
            .addTo(map);
        });

        mapInstanceRef.current = map;
      }
    );

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, data, metric]);

  if (!isClient) {
    return <div className="h-80 rounded-lg bg-muted animate-pulse" />;
  }

  return (
    <div>
      {title && <h3 className="text-sm font-semibold mb-3">{title}</h3>}
      <div
        ref={mapRef}
        className="h-80 rounded-lg border bg-muted/30 overflow-hidden"
      />
      {data.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {data.slice(0, 6).map((point) => (
            <div
              key={point.code}
              className="flex items-center justify-between rounded border px-3 py-2 text-xs"
            >
              <span className="font-medium truncate">{point.country}</span>
              <span className="text-muted-foreground ml-2 shrink-0">
                {point[metric].toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
