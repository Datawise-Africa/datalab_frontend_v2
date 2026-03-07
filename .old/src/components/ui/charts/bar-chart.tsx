import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@/lib/utils';

interface BarData {
  label: string;
  value: number;
  color?: string;
  tooltip?: string;
}

interface BarChartProps {
  data: BarData[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  barColor?: string;
  className?: string;
  showTooltips?: boolean;
  formatValue?: (value: number) => string;
  valueUnit?: string;
}

export function BarChart({
  data,
  width = 400,
  height = 200,
  margin = { top: 20, right: 30, bottom: 30, left: 80 },
  barColor = '#2563EB', // Blue-600
  className,
  showTooltips = true,
  formatValue = (value: number) => value.toString(),
  valueUnit = 'downloads',
}: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredBar, setHoveredBar] = useState<BarData | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear SVG for re-render

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerHeight])
      .padding(0.2); // Increased padding for better appearance

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .nice()
      .range([0, innerWidth]);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create tooltip div if it doesn't exist
    const tooltip = d3
      .select('body')
      .selectAll('.d3-bar-tooltip')
      .data([null])
      .join('div')
      .attr('class', 'd3-bar-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'white')
      .style('border', '1px solid #ddd')
      .style('padding', '8px 12px')
      .style('border-radius', '4px')
      .style('box-shadow', '0 0 10px rgba(0,0,0,0.1)')
      .style('pointer-events', 'none')
      .style('font-size', '12px')
      .style('z-index', '100');

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll('text')
      .style('text-anchor', 'middle')
      .style('font-size', '10px');

    // Add Y axis
    g.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '11px');

    // Add bars with interactions
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', (d) => y(d.label) || 0)
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width', 0) // Start with width 0 for animation
      .attr('fill', (d) => d.color || barColor)
      .attr('rx', 2) // Rounded corners
      .style('cursor', 'pointer')
      // Add hover effects
      .on('mouseover', function (_event, d) {
        if (showTooltips) {
          d3.select(this).transition().duration(100).attr('opacity', 0.8);

          setHoveredBar(d);

          const formattedValue = formatValue(d.value);
          const tooltipContent =
            d.tooltip || `${d.label}: ${formattedValue} ${valueUnit}`;

          tooltip.style('visibility', 'visible').html(tooltipContent);
        }
      })
      .on('mousemove', function (event) {
        if (showTooltips) {
          tooltip
            .style('top', event.pageY - 10 + 'px')
            .style('left', event.pageX + 10 + 'px');
        }
      })
      .on('mouseout', function () {
        if (showTooltips) {
          d3.select(this).transition().duration(100).attr('opacity', 1);

          setHoveredBar(null);
          tooltip.style('visibility', 'hidden');
        }
      })
      .transition() // Add animation
      .duration(800)
      .delay((_, i) => i * 100)
      .attr('width', (d) => x(d.value));

    // Add value labels
    g.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d) => x(d.value) + 5) // Position text slightly to the right of the bar
      .attr('y', (d) => (y(d.label) || 0) + y.bandwidth() / 2 + 4) // Center text vertically
      .text((d) => `${formatValue(d.value)} ${valueUnit}`)
      .attr('font-size', '11px')
      .attr('fill', '#6B7280') // Gray-500
      .style('opacity', 0) // Start invisible for animation
      .transition()
      .duration(800)
      .delay((_, i) => i * 100 + 300)
      .style('opacity', 1); // Fade in
  }, [
    data,
    width,
    height,
    margin,
    barColor,
    showTooltips,
    formatValue,
    valueUnit,
  ]);

  return (
    <div
      className={cn('relative w-full', className)}
      style={{ height: `${height}px` }}
    >
      {/* Show a message when there's no data */}
      {(!data || data.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
          No data available
        </div>
      )}

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
        aria-label="Bar chart"
      ></svg>

      {/* Accessible description of hovered bar for screen readers */}
      <div className="sr-only" aria-live="polite">
        {hoveredBar
          ? `${hoveredBar.label}: ${formatValue(hoveredBar.value)} ${valueUnit}`
          : ''}
      </div>
    </div>
  );
}
