import { useEffect, useRef } from 'react';
import { useIsClient } from '~/hooks/use-is-client';

export function StudioGeoMap({
  rows,
  latitude,
  longitude,
  label,
  value,
}: Readonly<{
  rows: Record<string, unknown>[];
  latitude?: string;
  longitude?: string;
  label?: string;
  value?: string;
}>) {
  const isClient = useIsClient();
  const element = useRef<HTMLDivElement>(null);
  const instance = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    if (!isClient || !element.current || !latitude || !longitude) return;
    let cancelled = false;
    Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]).then(
      ([L]) => {
        if (cancelled || !element.current) return;
        instance.current?.remove();
        const points = rows
          .map((row) => ({
            row,
            lat: Number(row[latitude]),
            lng: Number(row[longitude]),
          }))
          .filter(
            (point) => Number.isFinite(point.lat) && Number.isFinite(point.lng)
          );
        const map = L.map(element.current, {
          center: points.length ? [points[0].lat, points[0].lng] : [0, 20],
          zoom: points.length ? 5 : 2,
          scrollWheelZoom: false,
        });
        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          {
            maxZoom: 18,
            attribution: '&copy; OpenStreetMap &copy; CARTO',
          }
        ).addTo(map);
        const maximum = Math.max(
          ...points.map((point) => Number(point.row[value ?? '']) || 1),
          1
        );
        for (const point of points) {
          const metric = Number(point.row[value ?? '']) || 1;
          L.circleMarker([point.lat, point.lng], {
            radius: Math.max(5, Math.sqrt(metric / maximum) * 24),
            fillColor: '#16a34a',
            color: '#166534',
            weight: 1,
            fillOpacity: 0.55,
          })
            .bindTooltip(
              `${String(point.row[label ?? ''] ?? 'Location')}: ${metric.toLocaleString()}`
            )
            .addTo(map);
        }
        if (points.length > 1)
          map.fitBounds(
            points.map((point) => [point.lat, point.lng] as [number, number]),
            { padding: [20, 20] }
          );
        instance.current = map;
      }
    );
    return () => {
      cancelled = true;
      instance.current?.remove();
      instance.current = null;
    };
  }, [isClient, rows, latitude, longitude, label, value]);

  return (
    <div
      ref={element}
      className="h-full min-h-64 overflow-hidden rounded-lg border bg-muted/30"
    />
  );
}
