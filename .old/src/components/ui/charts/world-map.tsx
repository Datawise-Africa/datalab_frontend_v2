import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { cn } from '@/lib/utils';
import type { Feature } from 'geojson';

interface DataPoint {
  lat: number;
  lon: number;
  value: number;
  label: string;
}

interface WorldMapProps {
  width?: number;
  height?: number;
  dataPoints?: DataPoint[];
  className?: string;
  onPointClick?: (dataPoint: DataPoint) => void;
}

interface GeoData {
  type: string;
  features: Feature[];
}

export function WorldMap({
  width = 800,
  height = 400,
  dataPoints = [],
  className,
  onPointClick,
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [worldData, setWorldData] = useState<GeoData | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    // Fetch the TopoJSON data for world countries
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then((topology) => {
        try {
          // Convert TopoJSON to GeoJSON
          if (topology && 'countries' in (topology as any).objects) {
            const geoData = topojson.feature(
              topology as any,
              (topology as any).objects.countries,
            );
            setWorldData(geoData as unknown as GeoData);
          } else {
            throw new Error('Invalid topology data structure');
          }
        } catch (parseError) {
          console.error('Error parsing the world map data:', parseError);
          setIsError(true);
        }
      })
      .catch((error) => {
        console.error('Error loading the world map data:', error);
        setIsError(true);
      });
  }, []);

  useEffect(() => {
    if (!svgRef.current || !worldData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear SVG for re-render

    try {
      // Define a projection (e.g., geoMercator or geoNaturalEarth1)
      const projection = d3
        .geoNaturalEarth1()
        .fitSize(
          [width, height],
          worldData as unknown as d3.ExtendedFeatureCollection<d3.ExtendedFeature>,
        )
        .precision(0.1);

      const pathGenerator = d3.geoPath().projection(projection);

      // Create a container for the map to apply zoom behavior
      const g = svg.append('g');

      // Render the world map countries
      g.append('g')
        .selectAll('path')
        .data(worldData.features)
        .enter()
        .append('path')
        .attr('d', pathGenerator as any)
        .attr('fill', '#e0e0e0')
        .attr('stroke', '#a0a0a0')
        .attr('stroke-width', 0.5)
        .attr('class', 'country');

      // Add data points
      const points = g
        .selectAll('circle')
        .data(dataPoints)
        .enter()
        .append('circle')
        .attr('cx', (d) => {
          const coords = projection([d.lon, d.lat]);
          return coords ? coords[0] : 0;
        })
        .attr('cy', (d) => {
          const coords = projection([d.lon, d.lat]);
          return coords ? coords[1] : 0;
        })
        .attr('r', (d) => Math.sqrt(d.value) * 2 + 2) // Radius based on value
        .attr('fill', 'rgba(255, 0, 0, 0.6)')
        .attr('stroke', 'red')
        .attr('stroke-width', 1)
        .attr('class', 'data-point')
        .style('cursor', 'pointer');

      // Add tooltips
      points.append('title').text((d) => `${d.label}: ${d.value}`);

      // Add click event if handler provided
      if (onPointClick) {
        points.on('click', (_event, d) => {
          onPointClick(d);
        });
      }

      // Add zoom behavior
      const zoom = d3
        .zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

      svg.call(zoom as any);
    } catch (error) {
      console.error('Error rendering map:', error);
      setIsError(true);
    }
  }, [width, height, dataPoints, worldData, onPointClick]);

  return (
    <div
      className={cn('relative w-full', className)}
      style={{ height: `${height}px` }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
      ></svg>

      {/* Loading state */}
      {!worldData && !isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 text-sm text-gray-500">
          <div className="flex flex-col items-center gap-2">
            <svg
              className="text-primary h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading world map data...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-sm text-red-500">
          <div className="flex flex-col items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Failed to load map data. Please try again later.</span>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/80 mt-2 rounded-md px-4 py-2 text-xs text-white transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Help text */}
      {worldData && (
        <div className="absolute right-2 bottom-2 rounded bg-white/80 px-2 py-1 text-xs text-gray-500">
          Tip: Scroll to zoom, drag to pan
        </div>
      )}
    </div>
  );
}
