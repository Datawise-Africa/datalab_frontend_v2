import { useMemo, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Download, Loader2, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import { FormTextField } from '~/components/form-fields/form-text-field';
import { FormTextareaField } from '~/components/form-fields/form-textarea-field';
import { FormPickerField } from '~/components/form-fields/form-picker-field';
import {
  infographicSchema,
  type InfographicFormValues,
} from '~/lib/schema/dashboard-studio-schema';
import type { DashboardWidget } from '~/lib/types/dashboard';
import { infographicSizes } from '~/lib/constants/dashboard-studio';
import { useCreateInfographic } from '~/features/dashboard-studio';

export function InfographicBuilder({
  open,
  onOpenChange,
  dashboardId,
  workspaceId,
  widget,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboardId: string;
  workspaceId?: string;
  widget?: DashboardWidget;
}>) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const create = useCreateInfographic(dashboardId, workspaceId);
  const form = useForm<InfographicFormValues>({
    resolver: zodResolver(infographicSchema),
    values: {
      title: widget?.title ?? 'Datalab insight',
      subtitle: widget?.config?.description ?? '',
      narrative:
        widget?.text ?? 'Add the decision-relevant meaning of this finding.',
      sourceNote: 'Source: Datalab · Generated with Datalab Studio',
      format: 'portrait',
      accent: '#166534',
    },
  });
  const values = form.watch();
  const size = infographicSizes[values.format];
  const chart = useMemo(() => {
    const rows = widget?.data?.rows ?? [];
    const columns = widget?.data?.columns.map((column) => column.name) ?? [];
    const label = widget?.config?.x ?? columns[0];
    const metric =
      widget?.config?.y ?? columns.find((column) => column !== label);
    const points = rows.slice(0, 8).map((row) => ({
      label: String(row[label] ?? ''),
      value: Number(row[metric ?? '']) || 0,
    }));
    const maximum = Math.max(
      ...points.map((point) => Math.abs(point.value)),
      1
    );
    return { points, maximum, metric };
  }, [widget]);
  const downloadSvg = () => {
    if (!svgRef.current) return;
    const content = new XMLSerializer().serializeToString(svgRef.current);
    downloadBlob(
      new Blob([content], { type: 'image/svg+xml' }),
      `${slug(values.title)}.svg`
    );
  };
  const downloadPng = () => {
    if (!svgRef.current) return;
    const content = new XMLSerializer().serializeToString(svgRef.current);
    const url = URL.createObjectURL(
      new Blob([content], { type: 'image/svg+xml' })
    );
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size.width;
      canvas.height = size.height;
      canvas.getContext('2d')?.drawImage(image, 0, 0);
      canvas.toBlob(
        (blob) => blob && downloadBlob(blob, `${slug(values.title)}.png`),
        'image/png'
      );
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };
  const save = form.handleSubmit(async (formValues) => {
    await create.mutateAsync({
      title: formValues.title,
      definition: {
        version: 1,
        widget,
        design: formValues,
        size: infographicSizes[formValues.format],
      },
      is_public: false,
    });
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Infographic studio</DialogTitle>
        </DialogHeader>
        <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <Form {...form}>
            <form onSubmit={save} className="space-y-3">
              <FormTextField
                control={form.control}
                name="title"
                label="Headline"
                required
              />
              <FormTextField
                control={form.control}
                name="subtitle"
                label="Supporting line"
              />
              <FormTextareaField
                control={form.control}
                name="narrative"
                label="Key message"
              />
              <FormTextField
                control={form.control}
                name="sourceNote"
                label="Source and methodology note"
              />
              <FormPickerField
                control={form.control}
                name="format"
                label="Output format"
                options={[
                  { value: 'portrait', label: 'Portrait · 1080×1350' },
                  { value: 'square', label: 'Square · 1080×1080' },
                  { value: 'landscape', label: 'Landscape · 1350×1080' },
                ]}
              />
              <FormTextField
                control={form.control}
                name="accent"
                label="Brand accent (hex)"
              />
              <div className="grid grid-cols-2 gap-2">
                <Button type="submit" disabled={create.isPending}>
                  {create.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save
                </Button>
                <Button type="button" variant="outline" onClick={downloadSvg}>
                  <Download className="mr-2 h-4 w-4" />
                  SVG
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="col-span-2"
                  onClick={downloadPng}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download high-resolution PNG
                </Button>
              </div>
            </form>
          </Form>
          <div className="overflow-auto rounded-xl bg-muted p-4">
            <svg
              ref={svgRef}
              xmlns="http://www.w3.org/2000/svg"
              viewBox={`0 0 ${size.width} ${size.height}`}
              className="mx-auto max-h-[72vh] w-auto rounded-lg shadow-2xl"
              role="img"
              aria-label={values.title}
            >
              <rect width="100%" height="100%" fill="#f8fafc" />
              <rect width="100%" height="18" fill={values.accent} />
              <text
                x="80"
                y="120"
                fontFamily="Arial, sans-serif"
                fontSize="24"
                fontWeight="700"
                fill={values.accent}
                letterSpacing="3"
              >
                DATALAB INSIGHT
              </text>
              <text
                x="80"
                y="210"
                fontFamily="Arial, sans-serif"
                fontSize="58"
                fontWeight="800"
                fill="#0f172a"
              >
                {truncate(values.title, 34)}
              </text>
              <text
                x="80"
                y="265"
                fontFamily="Arial, sans-serif"
                fontSize="27"
                fill="#475569"
              >
                {truncate(values.subtitle, 70)}
              </text>
              {widget?.type === 'kpi' ? (
                <>
                  <text
                    x="80"
                    y="510"
                    fontFamily="Arial, sans-serif"
                    fontSize="150"
                    fontWeight="800"
                    fill={values.accent}
                  >
                    {String(chart.points[0]?.value ?? '—')}
                  </text>
                  <text
                    x="80"
                    y="560"
                    fontFamily="Arial, sans-serif"
                    fontSize="28"
                    fill="#64748b"
                  >
                    {chart.metric}
                  </text>
                </>
              ) : (
                chart.points.map((point, index) => {
                  const y = 350 + index * 82;
                  const width =
                    (Math.abs(point.value) / chart.maximum) *
                    (size.width - 470);
                  return (
                    <g key={`${point.label}-${index}`}>
                      <text
                        x="80"
                        y={y + 28}
                        fontFamily="Arial, sans-serif"
                        fontSize="22"
                        fill="#334155"
                      >
                        {truncate(point.label, 22)}
                      </text>
                      <rect
                        x="330"
                        y={y}
                        width={Math.max(4, width)}
                        height="42"
                        rx="8"
                        fill={values.accent}
                        opacity={0.9 - index * 0.06}
                      />
                      <text
                        x={350 + width}
                        y={y + 28}
                        fontFamily="Arial, sans-serif"
                        fontSize="21"
                        fontWeight="700"
                        fill="#0f172a"
                      >
                        {point.value.toLocaleString()}
                      </text>
                    </g>
                  );
                })
              )}
              <rect
                x="70"
                y={size.height - 300}
                width={size.width - 140}
                height="155"
                rx="22"
                fill={values.accent}
                opacity="0.09"
              />
              <text
                x="100"
                y={size.height - 245}
                fontFamily="Arial, sans-serif"
                fontSize="22"
                fontWeight="700"
                fill={values.accent}
              >
                WHAT THIS MEANS
              </text>
              <text
                x="100"
                y={size.height - 195}
                fontFamily="Arial, sans-serif"
                fontSize="26"
                fill="#1e293b"
              >
                {truncate(values.narrative, 76)}
              </text>
              <text
                x="80"
                y={size.height - 65}
                fontFamily="Arial, sans-serif"
                fontSize="18"
                fill="#64748b"
              >
                {truncate(values.sourceNote, 100)}
              </text>
              <text
                x={size.width - 80}
                y={size.height - 65}
                textAnchor="end"
                fontFamily="Arial, sans-serif"
                fontSize="21"
                fontWeight="700"
                fill={values.accent}
              >
                Datalab
              </text>
            </svg>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function truncate(value: string, length: number) {
  return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}
function slug(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'datalab-infographic'
  );
}
function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}
