import { Download, FileText } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { formatBytes, truncateMiddle } from '~/lib/utils/format';

/**
 * Shape of a single presigned file entry. Datasets and reports return the
 * identical entry shape from their respective `request-download/` endpoints,
 * which is why this rendering is shared.
 */
export interface DownloadReadyFile {
  file_id: string;
  file_name: string;
  file_size: number;
  download_url: string;
  expires_in: number;
}

interface DownloadReadyFilesProps {
  files: readonly DownloadReadyFile[];
}

export function formatExpiry(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hr${hours > 1 ? 's' : ''}`;
}

/**
 * Ready-state presentation for a completed download request: a success banner
 * plus one row per presigned file. Purely presentational — the owning modal
 * keeps its own close/done affordances.
 */
export function DownloadReadyFiles({
  files,
}: Readonly<DownloadReadyFilesProps>) {
  return (
    <div className="space-y-6">
      <div className="rounded-md border border-success/30 bg-success/5 p-4 text-sm">
        <p className="font-medium text-success">Download ready</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Your files are available below. Links expire after their listed window
          — re-request if they lapse.
        </p>
      </div>

      <ul className="space-y-3">
        {files.map((file) => (
          <li
            key={file.file_id}
            className="flex items-center gap-3 rounded-md border p-4"
          >
            <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium" title={file.file_name}>
                {truncateMiddle(file.file_name, 36)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatBytes(file.file_size)} · expires in{' '}
                {formatExpiry(file.expires_in)}
              </p>
            </div>
            <Button asChild size="sm">
              <a
                href={file.download_url}
                download={file.file_name}
                rel="noreferrer"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Download
              </a>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
