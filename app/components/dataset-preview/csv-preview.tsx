import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Loader2, Table, AlertTriangle } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';
import type { IDatasetDataFile } from '~/lib/types/dataset';

interface CsvPreviewProps {
  dataFiles: IDatasetDataFile[];
  /** Max rows to show in preview. Defaults to 20. */
  maxRows?: number;
  className?: string;
}

/**
 * Fetches the first CSV file from the dataset's S3 URLs,
 * parses it with papaparse, and renders a scrollable table preview.
 */
export function CsvPreview({
  dataFiles,
  maxRows = 20,
  className,
}: CsvPreviewProps) {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Find first CSV file
  const csvFile = dataFiles.find(
    (f) =>
      f.file_name.endsWith('.csv') ||
      f.content_type.includes('csv') ||
      f.content_type.includes('text/plain')
  );

  useEffect(() => {
    if (!csvFile?.s3_url) return;

    setIsLoading(true);
    setError(null);
    setFileName(csvFile.file_name);

    fetch(csvFile.s3_url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        const parsed = Papa.parse<Record<string, string>>(text, {
          header: true,
          skipEmptyLines: true,
          delimiter: ',',
          preview: maxRows,
          transform: (value) => value.trim(),
        });

        if (parsed.meta.fields) {
          setHeaders(parsed.meta.fields);
        }
        setRows(parsed.data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load preview');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [csvFile?.s3_url, csvFile?.file_name, maxRows]);

  if (!csvFile) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Table className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Data Preview</h2>
        </div>
        {fileName && (
          <Badge variant="outline" className="text-xs font-mono">
            {fileName}
          </Badge>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center rounded-lg border py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading preview...
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Could not load CSV preview: {error}
        </div>
      )}

      {!isLoading && !error && rows.length > 0 && (
        <>
          <div className="relative max-h-96 overflow-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-primary text-white">
                  <th className="px-3 py-2 text-left text-xs font-semibold whitespace-nowrap">
                    #
                  </th>
                  {headers.map((header) => (
                    <th
                      key={header}
                      className="px-3 py-2 text-left text-xs font-semibold whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={cn(
                      'border-b last:border-b-0 transition-colors hover:bg-muted/50',
                      idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    )}
                  >
                    <td className="px-3 py-2 text-xs text-muted-foreground tabular-nums">
                      {idx + 1}
                    </td>
                    {headers.map((header) => (
                      <td
                        key={header}
                        className="px-3 py-2 whitespace-nowrap max-w-60 truncate"
                      >
                        {row[header] ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Showing first {rows.length} of{' '}
            {rows.length >= maxRows ? `${maxRows}+` : rows.length} rows &middot;{' '}
            {headers.length} columns
          </p>
        </>
      )}

      {!isLoading && !error && rows.length === 0 && headers.length === 0 && (
        <div className="rounded-lg border py-8 text-center text-sm text-muted-foreground">
          No data available for preview
        </div>
      )}
    </div>
  );
}
