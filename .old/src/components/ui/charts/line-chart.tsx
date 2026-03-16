import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '@/lib/utils';

interface DataPoint {
  date: string;
  value: number;
  value2?: number;
  label?: string;
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  lineColor?: string;
  lineColor2?: string;
  className?: string;
  showPoints?: boolean;
  showTooltip?: boolean;
  yAxisLabel?: string;
  xAxisLabel?: string;
  responsive?: boolean;
  formatValue?: (value: number) => string;
}

export function LineChart({
  data,
  width = 400,
  height = 200,
  margin = { top: 20, right: 30, bottom: 30, left: 40 },
  lineColor = '#10B981', // Green-600
  lineColor2 = '#6EE7B7', // Green-300
  className,
  showPoints = true,
  showTooltip = true,
  yAxisLabel,
  xAxisLabel,
  responsive = true,
  formatValue = (value: number) => value.toString(),
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width, height });
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    try {
      const actualWidth = responsive ? dimensions.width : width;
      const actualHeight = height;

      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove(); // Clear SVG for re-render

      const innerWidth = actualWidth - margin.left - margin.right;
      const innerHeight = actualHeight - margin.top - margin.bottom;

      const x = d3
        .scalePoint()
        .domain(data.map((d) => d.date))
        .range([0, innerWidth])
        .padding(0.5);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => Math.max(d.value, d.value2 || 0)) || 0])
        .nice()
        .range([innerHeight, 0]);

      const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Create a tooltip div if it doesn't exist
      const tooltip = d3
        .select('body')
        .selectAll('.d3-tooltip')
        .data([null])
        .join('div')
        .attr('class', 'd3-tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background-color', 'white')
        .style('border', '1px solid #ddd')
        .style('padding', '10px')
        .style('border-radius', '3px')
        .style('box-shadow', '0 0 10px rgba(0,0,0,0.1)')
        .style('pointer-events', 'none')
        .style('font-size', '12px');

      // Add X axis
      const xAxis = g
        .append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x));

      xAxis
        .selectAll('text')
        .style('text-anchor', 'middle')
        .attr('dy', '0.7em');

      // Add Y axis
      g.append('g').call(d3.axisLeft(y));

      // Add axis labels if provided
      if (xAxisLabel) {
        g.append('text')
          .attr('x', innerWidth / 2)
          .attr('y', innerHeight + margin.bottom - 5)
          .style('text-anchor', 'middle')
          .style('font-size', '12px')
          .text(xAxisLabel);
      }

      if (yAxisLabel) {
        g.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', -margin.left + 15)
          .attr('x', -innerHeight / 2)
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .style('font-size', '12px')
          .text(yAxisLabel);
      }

      // Add grid lines
      g.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(
          d3
            .axisBottom(x)
            .tickSize(-innerHeight)
            .tickFormat(() => ''),
        )
        .selectAll('line')
        .attr('stroke', '#e0e0e0')
        .attr('stroke-dasharray', '2,2');

      g.append('g')
        .attr('class', 'grid')
        .call(
          d3
            .axisLeft(y)
            .tickSize(-innerWidth)
            .tickFormat(() => ''),
        )
        .selectAll('line')
        .attr('stroke', '#e0e0e0')
        .attr('stroke-dasharray', '2,2');

      // Line 1
      const line = d3
        .line<DataPoint>()
        .x((d) => x(d.date) || 0)
        .y((d) => y(d.value))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', lineColor)
        .attr('stroke-width', 2)
        .attr('d', line as any);

      // Line 2 (optional)
      if (data.some((d) => d.value2 !== undefined)) {
        const line2 = d3
          .line<DataPoint>()
          .defined((d) => d.value2 !== undefined)
          .x((d) => x(d.date) || 0)
          .y((d) => (d.value2 !== undefined ? y(d.value2) : 0))
          .curve(d3.curveMonotoneX);

        g.append('path')
          .datum(data.filter((d) => d.value2 !== undefined))
          .attr('fill', 'none')
          .attr('stroke', lineColor2)
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '5,5') // Dotted line for the second line
          .attr('d', line2 as any);
      }

      // Add data points if enabled
      if (showPoints) {
        // Points for line 1
        g.selectAll('.dot-line1')
          .data(data)
          .enter()
          .append('circle')
          .attr('class', 'dot-line1')
          .attr('cx', (d) => x(d.date) || 0)
          .attr('cy', (d) => y(d.value))
          .attr('r', 4)
          .attr('fill', 'white')
          .attr('stroke', lineColor)
          .attr('stroke-width', 2);

        // Points for line 2 if it exists
        if (data.some((d) => d.value2 !== undefined)) {
          g.selectAll('.dot-line2')
            .data(data.filter((d) => d.value2 !== undefined))
            .enter()
            .append('circle')
            .attr('class', 'dot-line2')
            .attr('cx', (d) => x(d.date) || 0)
            .attr('cy', (d) => y(d.value2!))
            .attr('r', 4)
            .attr('fill', 'white')
            .attr('stroke', lineColor2)
            .attr('stroke-width', 2);
        }
      }

      // Add tooltip interactions if enabled
      if (showTooltip) {
        // Create overlay for better hover detection
        const focus = g
          .append('g')
          .attr('class', 'focus')
          .style('display', 'none');

        focus
          .append('line')
          .attr('class', 'x-hover-line')
          .attr('y1', 0)
          .attr('y2', innerHeight)
          .style('stroke', '#bbb')
          .style('stroke-width', 1)
          .style('stroke-dasharray', '3,3');

        focus
          .append('circle')
          .attr('r', 5)
          .style('fill', lineColor)
          .style('stroke', '#fff')
          .style('stroke-width', 2);

        if (data.some((d) => d.value2 !== undefined)) {
          focus
            .append('circle')
            .attr('r', 5)
            .style('fill', lineColor2)
            .style('stroke', '#fff')
            .style('stroke-width', 2);
        }

        // Transparent overlay to capture mouse events
        g.append('rect')
          .attr('width', innerWidth)
          .attr('height', innerHeight)
          .style('fill', 'none')
          .style('pointer-events', 'all')
          .on('mouseover', function () {
            focus.style('display', null);
            tooltip.style('visibility', 'visible');
          })
          .on('mouseout', function () {
            focus.style('display', 'none');
            tooltip.style('visibility', 'hidden');
          })
          .on('mousemove', mousemove);

        function mousemove(event: any) {
          const bisect = d3.bisector((d: DataPoint) => d.date).left;
          const xPos = d3.pointer(event)[0];
          const x0 =
            x.domain()[
              Math.min(
                Math.max(
                  0,
                  Math.round(xPos / (innerWidth / (x.domain().length - 1))),
                ),
                x.domain().length - 1,
              )
            ];
          const i = bisect(data, x0, 1);
          const d0 = data[Math.max(0, i - 1)];
          const d1 = data[Math.min(data.length - 1, i)];

          if (!d0 || !d1) return;

          // Find the closer data point
          const d =
            xPos - (x(d0.date) || 0) > (x(d1.date) || 0) - xPos ? d1 : d0;

          focus
            .select('line.x-hover-line')
            .attr('transform', `translate(${x(d.date)},0)`);

          // Update first circle position
          focus
            .select('circle:nth-child(2)')
            .attr('transform', `translate(${x(d.date)},${y(d.value)})`);

          // Update second circle if there is a value2
          if (d.value2 !== undefined) {
            focus
              .select('circle:nth-child(3)')
              .attr('transform', `translate(${x(d.date)},${y(d.value2)})`);
          }

          // Format tooltip content
          let htmlContent = `
            <div style="font-weight: bold; margin-bottom: 5px;">${d.label || d.date}</div>
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
              <div style="width: 10px; height: 10px; background-color: ${lineColor}; margin-right: 5px;"></div>
              <div>${formatValue(d.value)}</div>
            </div>
          `;

          if (d.value2 !== undefined) {
            htmlContent += `
              <div style="display: flex; align-items: center;">
                <div style="width: 10px; height: 10px; background-color: ${lineColor2}; margin-right: 5px;"></div>
                <div>${formatValue(d.value2)}</div>
              </div>
            `;
          }

          tooltip
            .html(htmlContent)
            .style('left', `${event.pageX + 15}px`)
            .style('top', `${event.pageY - 28}px`);
        }
      }

      // Add animations
      g.selectAll('path')
        .style('opacity', 0)
        .transition()
        .duration(750)
        .style('opacity', 1);

      g.selectAll('circle')
        .style('opacity', 0)
        .transition()
        .duration(750)
        .style('opacity', 1);
    } catch (error) {
      console.error('Error rendering line chart:', error);
      setIsError(true);
    }
  }, [
    data,
    dimensions.width,
    height,
    margin,
    lineColor,
    lineColor2,
    showPoints,
    showTooltip,
    formatValue,
    responsive,
    xAxisLabel,
    yAxisLabel,
  ]);

  // Add resizing logic
  useEffect(() => {
    if (!responsive || !svgRef.current) return;

    const handleResize = () => {
      if (svgRef.current) {
        const containerWidth =
          svgRef.current.parentElement?.clientWidth || width;
        setDimensions({
          width: containerWidth,
          height,
        });
      }
    };

    // Initialize dimensions
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [responsive, width, height]);

  return (
    <div
      className={cn('relative w-full', className)}
      style={{ height: `${height}px` }}
    >
      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
          No data available
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-red-500">
          Error loading chart data
        </div>
      )}

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className={cn(
          data.length === 0 || isError ? 'opacity-25' : 'opacity-100',
          'transition-opacity duration-300',
        )}
      ></svg>

      {/* Tooltip container for screen readers */}
      <div ref={tooltipRef} className="sr-only" aria-live="polite"></div>
    </div>
  );
}
