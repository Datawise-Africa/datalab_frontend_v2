import { Database, FileText } from 'lucide-react';
import type {
  DatasetSchema,
  DatasetSchemaFile,
} from '~/features/my-datasets/types';

interface DatasetSchemaTabProps {
  schema: DatasetSchema | null | undefined;
  /** Hint shown when no schema is available. Defaults to creator-friendly copy. */
  emptyHint?: string;
}

export function DatasetSchemaTab({
  schema,
  emptyHint = 'Schema is auto-derived from uploaded files. Upload a structured file (CSV, Parquet, JSON) to populate it.',
}: Readonly<DatasetSchemaTabProps>) {
  // schema_json may be missing, null, or non-array in older records — only
  // render when it's actually a populated array.
  const files = Array.isArray(schema?.schema_json) ? schema.schema_json : [];
  if (files.length === 0) {
    return (
      <div className="rounded-md border border-dashed py-12 text-center text-muted-foreground">
        <Database className="mx-auto mb-3 h-8 w-8" />
        <p className="text-sm font-medium">No schema yet</p>
        <p className="mt-1 text-xs">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <SchemaFileTable key={file.file} file={file} />
      ))}
    </div>
  );
}

function SchemaFileTable({ file }: Readonly<{ file: DatasetSchemaFile }>) {
  const columns = Array.isArray(file.columns) ? file.columns : [];
  return (
    <div className="overflow-hidden rounded-md border">
      <div className="flex items-center gap-2 border-b bg-muted/40 px-3 py-2 text-xs font-medium">
        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="truncate">{file.file}</span>
        <span className="ml-auto text-muted-foreground">
          {columns.length} {columns.length === 1 ? 'column' : 'columns'}
        </span>
      </div>
      {columns.length === 0 ? (
        <p className="px-3 py-3 text-xs text-muted-foreground">
          No columns detected for this file.
        </p>
      ) : (
        <table className="w-full text-xs">
          <thead className="bg-muted/20 text-muted-foreground">
            <tr>
              <th className="px-3 py-1.5 text-left font-medium">Column</th>
              <th className="px-3 py-1.5 text-left font-medium">Type</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((col) => (
              <tr key={col.name} className="border-t">
                <td className="px-3 py-1.5 font-mono">{col.name}</td>
                <td className="px-3 py-1.5 text-muted-foreground">
                  {col.dtype}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
