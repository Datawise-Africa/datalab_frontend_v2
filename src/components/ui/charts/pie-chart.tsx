import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@/lib/utils';

interface PieChartProps {
  data: { label: string; value: number; color?: string }[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  className?: string;
  donut?: boolean;
  donutThickness?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  animate?: boolean;
  emptyMessage?: string;
}

export function PieChart({
  data,
  width = 400,
  height = 400,
  margin = { top: 20, right: 20, bottom: 20, left: 20 },
  className,
  donut = false,
  donutThickness = 50,
  showLabels = false,
  showLegend = true,
  legendPosition = 'right',
  animate = true,
  emptyMessage = 'No data to display',
}: PieChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    label: string;
    value: number;
    percentage: number;
  }>({
    show: false,
    x: 0,
    y: 0,
    label: '',
    value: 0,
    percentage: 0,
  });

  useEffect(() => {
    if (!svgRef.current) return;
    if (!data || data.length === 0) return;

    // Calculate the total value for percentage calculations
    const totalValue = data.reduce((sum, d) => sum + d.value, 0);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear SVG for re-render

    // Calculate available space
    const availableWidth = width - margin.left - margin.right;
    const availableHeight = height - margin.top - margin.bottom;
    const chartWidth =
      showLegend && (legendPosition === 'left' || legendPosition === 'right')
        ? availableWidth * 0.7
        : availableWidth;
    const chartHeight =
      showLegend && (legendPosition === 'top' || legendPosition === 'bottom')
        ? availableHeight * 0.7
        : availableHeight;

    const radius = Math.min(chartWidth, chartHeight) / 2;

    // Create chart group
    const g = svg
      .append('g')
      .attr(
        'transform',
        `translate(${margin.left + chartWidth / 2},${margin.top + chartHeight / 2})`,
      );

    // Use custom colors if provided, otherwise use D3's color scheme
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3
      .pie<{ label: string; value: number; color?: string }>()
      .value((d) => d.value)
      .sort(null); // Don't sort, preserve input order

    const arcGenerator = d3
      .arc<d3.PieArcDatum<{ label: string; value: number; color?: string }>>()
      .innerRadius(donut ? radius - donutThickness : 0)
      .outerRadius(radius)
      .cornerRadius(4)
      .padAngle(0.02);

    // For hover effects, slightly larger arc
    const hoverArcGenerator = d3
      .arc<d3.PieArcDatum<{ label: string; value: number; color?: string }>>()
      .innerRadius(donut ? radius - donutThickness - 5 : 0)
      .outerRadius(radius + 10)
      .cornerRadius(4)
      .padAngle(0.02);

    const pieData = pie(data);

    // Create arcs
    const arcs = g
      .selectAll('.arc')
      .data(pieData)
      .enter()
      .append('g')
      .attr('class', 'arc')
      .attr('role', 'graphics-symbol')
      .attr(
        'aria-label',
        (d) =>
          `${d.data.label}: ${d.data.value} (${Math.round((d.data.value / totalValue) * 100)}%)`,
      )
      .attr('tabindex', 0)
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .select('path')
          .transition()
          .duration(200)
          .attr('d', (datum) => hoverArcGenerator(datum as any));

        setTooltip({
          show: true,
          x: event.clientX,
          y: event.clientY,
          label: d.data.label,
          value: d.data.value,
          percentage: Math.round((d.data.value / totalValue) * 100),
        });
      })
      .on('mousemove', function (event) {
        setTooltip((prev) => ({
          ...prev,
          show: true,
          x: event.clientX,
          y: event.clientY,
        }));
      })
      .on('mouseleave', function () {
        d3.select(this)
          .select('path')
          .transition()
          .duration(200)
          .attr('d', (datum) => arcGenerator(datum as any));

        setTooltip((prev) => ({
          ...prev,
          show: false,
        }));
      });

    // Add path elements
    arcs
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (d) => d.data.color || (color(d.data.label) as string))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('transition', 'all 0.3s ease')
      .style('opacity', 0)
      .transition()
      .duration(animate ? 750 : 0)
      .style('opacity', 1)
      .attrTween('d', function (d) {
        if (!animate) return () => arcGenerator(d) || '';

        const interpolate = d3.interpolate(
          { startAngle: d.startAngle, endAngle: d.startAngle },
          { startAngle: d.startAngle, endAngle: d.endAngle },
        );
        return function (t) {
          // Add the missing properties to make it compatible with PieArcDatum
          const interpolatedArc = interpolate(t);
          const arcObject = {
            ...interpolatedArc,
            data: d.data,
            value: d.value,
            index: d.index,
            padAngle: d.padAngle,
          };
          return arcGenerator(arcObject as any) || '';
        };
      });

    // Add labels inside the arcs if showLabels is true
    if (showLabels) {
      arcs
        .append('text')
        .attr('dy', '.35em')
        .attr('transform', (d) => {
          const [x, y] = arcGenerator.centroid(d);

          // For very small slices, position the label outside the arc
          if (d.endAngle - d.startAngle < 0.3) {
            const midAngle = (d.startAngle + d.endAngle) / 2;
            const x = Math.sin(midAngle) * (radius + 20);
            const y = -Math.cos(midAngle) * (radius + 20);
            return `translate(${x},${y})`;
          }

          return `translate(${x},${y})`;
        })
        .attr('text-anchor', 'middle')
        .text((d) => {
          // Show percentage on label if slice is big enough
          if (d.endAngle - d.startAngle < 0.3) return '';
          return `${Math.round((d.data.value / totalValue) * 100)}%`;
        })
        .attr('fill', 'white')
        .attr('font-size', () => {
          const fontSize = Math.min(12, Math.max(8, radius * 0.2));
          return `${fontSize}px`;
        })
        .style('font-weight', 'bold')
        .style('opacity', 0)
        .transition()
        .duration(animate ? 750 : 0)
        .delay(animate ? 500 : 0)
        .style('opacity', 1);
    }

    // Add legend if showLegend is true
    if (showLegend) {
      const legendGroup = svg.append('g');
      const legendItems = legendGroup
        .selectAll('.legend-item')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (_, i) => {
          const itemHeight = 20;
          const spacing = 5;

          let x = 0;
          let y = 0;

          if (legendPosition === 'right') {
            x = margin.left + chartWidth + 20;
            y = margin.top + i * (itemHeight + spacing);
          } else if (legendPosition === 'bottom') {
            const legendWidth = data.length * 100;
            x = margin.left + (chartWidth - legendWidth) / 2 + i * 100;
            y = margin.top + chartHeight + 20;
          } else if (legendPosition === 'left') {
            x = margin.left;
            y = margin.top + i * (itemHeight + spacing);
          } else {
            // top
            const legendWidth = data.length * 100;
            x = margin.left + (chartWidth - legendWidth) / 2 + i * 100;
            y = margin.top;
          }

          return `translate(${x}, ${y})`;
        });

      // Add colored rectangles
      legendItems
        .append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('rx', 2)
        .attr('fill', (d) => d.color || (color(d.label) as string));

      // Add legend labels
      legendItems
        .append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text(
          (d) => `${d.label} (${Math.round((d.value / totalValue) * 100)}%)`,
        )
        .attr('font-size', '12px');
    }
  }, [
    data,
    width,
    height,
    margin,
    donut,
    donutThickness,
    showLabels,
    showLegend,
    legendPosition,
    animate,
  ]);

  // If there's no data, show an empty message
  if (!data || data.length === 0) {
    return (
      <div
        className={cn('flex w-full items-center justify-center', className)}
        style={{ height: `${height}px` }}
      >
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

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
        aria-label="Pie chart"
        role="img"
      ></svg>

      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="pointer-events-none absolute z-10 rounded bg-black/80 p-2 text-white shadow-lg"
          style={{
            top: tooltip.y - 120,
            left: tooltip.x - 100,
            minWidth: '150px',
          }}
        >
          <div className="font-medium">{tooltip.label}</div>
          <div className="text-sm">Value: {tooltip.value}</div>
          <div className="text-sm">{tooltip.percentage}% of total</div>
        </div>
      )}
    </div>
  );
}
