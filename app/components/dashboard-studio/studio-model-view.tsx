/**
 * Data model view (lazy-loaded): data sources as cards, relationships as
 * lines between fields. Drag from a field on one source to a field on another
 * to relate them; select a line to edit or delete it.
 */
import '@xyflow/react/dist/style.css';
import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import {
  ArrowLeft,
  Database,
  KeyRound,
  Loader2,
  Plug,
  Trash2,
} from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Picker } from '~/components/ui/picker';
import { Switch } from '~/components/ui/switch';
import { useSaveSemanticModel } from '~/features/dashboard-studio';
import {
  cardinalityOptions,
  joinTypeOptions,
  joinTypeShortLabels,
  modelTableColors,
} from '~/lib/constants/dashboard-studio';
import { cn } from '~/lib/utils';
import { useAppSelector } from '~/store';
import type {
  DashboardDataSource,
  DashboardRelationship,
} from '~/lib/types/dashboard';
import { useStudio } from './studio-context';
import { useStudioUi } from './studio-ui-context';

type SourceNodeData = {
  source: DashboardDataSource;
  color: string;
  /** Fields used as join keys, marked with a key icon. */
  keys: string[];
};
type SourceNode = Node<SourceNodeData, 'source'>;

const COLUMN_WIDTH = 340;
const handleId = (field: string, side: 'in' | 'out') => `${field}::${side}`;
const fieldOf = (handle?: string | null) => handle?.split('::')[0] ?? '';
// Field dots sit on the card edges (so the card must not clip them); they
// turn primary when the table is hovered.
const handleClass =
  '!h-2 !w-2 !min-w-0 !border !border-card !bg-muted-foreground/50 transition-colors group-hover:!bg-primary';

/** DrawSQL-style table: coloured header band, compact typed rows. */
function SourceCard({ data }: Readonly<NodeProps<SourceNode>>) {
  const { source, color, keys } = data;
  return (
    <div
      className="group w-60 rounded-md border bg-card text-[11px] shadow-sm"
      style={{ borderTop: `3px solid ${color}` }}
    >
      <div
        className="flex items-center gap-1.5 rounded-t-[3px] px-2.5 py-1.5"
        style={{
          background: `color-mix(in oklab, ${color} 14%, var(--card))`,
        }}
      >
        <Database className="h-3 w-3 shrink-0" style={{ color }} />
        <span className="truncate text-xs font-semibold">{source.name}</span>
        <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
          {source.row_count.toLocaleString()} rows
        </span>
      </div>
      <ul className="py-0.5">
        {source.schema.map((field) => (
          <li
            key={field.name}
            className="relative flex h-6 items-center gap-1.5 px-2.5 hover:bg-muted/60"
          >
            <Handle
              type="target"
              id={handleId(field.name, 'in')}
              position={Position.Left}
              className={handleClass}
            />
            <span className="flex w-3 shrink-0 justify-center">
              {keys.includes(field.name) && (
                <KeyRound
                  className="h-3 w-3 text-amber-500"
                  aria-label="Join key"
                />
              )}
            </span>
            <span className="min-w-0 flex-1 truncate">{field.name}</span>
            <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
              {field.type}
            </span>
            <Handle
              type="source"
              id={handleId(field.name, 'out')}
              position={Position.Right}
              className={handleClass}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

const nodeTypes = { source: SourceCard };

function layout(
  sources: DashboardDataSource[],
  relationships: DashboardRelationship[]
): SourceNode[] {
  return sources.map((source, index) => ({
    id: source.id,
    type: 'source',
    position: { x: (index % 3) * COLUMN_WIDTH, y: Math.floor(index / 3) * 320 },
    data: {
      source,
      color: modelTableColors[index % modelTableColors.length],
      keys: relationships.flatMap((item) => [
        ...(item.left_source === source.id ? [item.left_key] : []),
        ...(item.right_source === source.id ? [item.right_key] : []),
      ]),
    },
  }));
}

/** Crow's-foot ends: "many" fans out at the table, "one" is a bar. */
const endMarker = (cardinality: string | undefined, end: 'left' | 'right') => {
  const [left, , right] = (cardinality ?? 'many_to_one').split('_');
  return (end === 'left' ? left : right) === 'many' ? 'erd-many' : 'erd-one';
};

function ErdMarkers() {
  const stroke = {
    stroke: 'var(--muted-foreground)',
    strokeWidth: 1.25,
    fill: 'none',
  };
  return (
    <svg aria-hidden className="absolute h-0 w-0">
      <defs>
        {/* auto-start-reverse: the same glyph faces the table at either end. */}
        <marker
          id="erd-many"
          viewBox="0 0 14 14"
          refX="14"
          refY="7"
          markerWidth="14"
          markerHeight="14"
          markerUnits="userSpaceOnUse"
          orient="auto-start-reverse"
        >
          <path
            d="M2,7 L14,1 M2,7 L14,7 M2,7 L14,13 M2,2 L2,12"
            style={stroke}
          />
        </marker>
        <marker
          id="erd-one"
          viewBox="0 0 14 14"
          refX="14"
          refY="7"
          markerWidth="14"
          markerHeight="14"
          markerUnits="userSpaceOnUse"
          orient="auto-start-reverse"
        >
          <path d="M0,7 L14,7 M6,2 L6,12 M10,2 L10,12" style={stroke} />
        </marker>
      </defs>
    </svg>
  );
}

export default function StudioModelView() {
  const {
    dashboard,
    sources,
    dashboardId,
    workspaceId,
    modelRelationships: relationships,
    setModelRelationships: setRelationships,
    modelDirty: dirty,
    discardModel,
  } = useStudio();
  const { setView, openSettings } = useStudioUi();
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const save = useSaveSemanticModel(dashboardId, workspaceId);
  const readySources = sources.filter((source) => source.status === 'ready');

  const [selectedId, setSelectedId] = useState<string>();
  const [nodes, setNodes, onNodesChange] = useNodesState<SourceNode>([]);
  // Re-sync cards when sources load or change, keeping positions users dragged.
  const sourceKey = readySources.map((source) => source.id).join();
  const syncNodes = useEffectEvent(() =>
    setNodes((current) =>
      layout(readySources, relationships).map((node) => ({
        ...node,
        position:
          current.find((item) => item.id === node.id)?.position ??
          node.position,
      }))
    )
  );
  // Key icons follow the relationships, so re-sync when they change too.
  const keysKey = relationships
    .map(
      (item) =>
        `${item.left_source}.${item.left_key}>${item.right_source}.${item.right_key}`
    )
    .join();
  useEffect(() => {
    syncNodes();
    // syncNodes is a useEffectEvent — intentionally excluded per React docs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey, keysKey]);
  const selected = relationships.find((item) => item.id === selectedId);
  const nameOf = (id: string) =>
    sources.find((source) => source.id === id)?.name ?? 'Unknown source';

  const edges: Edge[] = useMemo(
    () =>
      relationships.map((relationship) => ({
        id: relationship.id,
        source: relationship.left_source,
        sourceHandle: handleId(relationship.left_key, 'out'),
        target: relationship.right_source,
        targetHandle: handleId(relationship.right_key, 'in'),
        selected: relationship.id === selectedId,
        type: 'smoothstep',
        pathOptions: { borderRadius: 6 },
        label: joinTypeShortLabels[relationship.join_type],
        labelStyle: { fontSize: 10 },
        labelBgPadding: [4, 2] as [number, number],
        labelBgBorderRadius: 4,
        markerStart: endMarker(relationship.cardinality, 'left'),
        markerEnd: endMarker(relationship.cardinality, 'right'),
        style: relationship.enabled === false ? { opacity: 0.4 } : undefined,
      })),
    [relationships, selectedId]
  );

  const update = (patch: Partial<DashboardRelationship>) =>
    setRelationships((items) =>
      items.map((item) =>
        item.id === selectedId ? { ...item, ...patch } : item
      )
    );
  const remove = (ids: string[]) => {
    setRelationships((items) => items.filter((item) => !ids.includes(item.id)));
    setSelectedId(undefined);
  };
  const connect = (connection: Connection) => {
    const relationship: DashboardRelationship = {
      id: crypto.randomUUID(),
      left_source: connection.source,
      left_key: fieldOf(connection.sourceHandle),
      right_source: connection.target,
      right_key: fieldOf(connection.targetHandle),
      join_type: 'left',
      cardinality: 'many_to_one',
      enabled: true,
    };
    setRelationships((items) => [...items, relationship]);
    setSelectedId(relationship.id);
  };
  const persist = async () => {
    const model = dashboard.semantic_model;
    await save.mutateAsync({
      version: 1,
      relationships,
      unions: model?.unions ?? [],
      dimensions: model?.dimensions ?? [],
      measures: model?.measures ?? [],
    });
    // The saved model is patched into the dashboard cache; drop the draft.
    discardModel();
  };

  if (readySources.length < 2)
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-10 text-center xl:col-span-2">
        <Database className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="font-medium">Connect at least two data sources</p>
          <p className="text-sm text-muted-foreground">
            Relationships let visuals analyse fields from several sources
            together.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setView('canvas')}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to canvas
          </Button>
          <Button onClick={() => openSettings('integrations')}>
            <Plug className="mr-1.5 h-4 w-4" />
            Connect data
          </Button>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-[70dvh] flex-col xl:col-span-2 xl:min-h-0 xl:flex-row">
      <div className="relative min-h-[60dvh] flex-1 xl:min-h-0">
        <ErdMarkers />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onConnect={connect}
          isValidConnection={(connection) =>
            connection.source !== connection.target
          }
          onEdgeClick={(_, edge) => setSelectedId(edge.id)}
          onPaneClick={() => setSelectedId(undefined)}
          onEdgesDelete={(deleted) => remove(deleted.map((edge) => edge.id))}
          colorMode={darkMode ? 'dark' : 'light'}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} />
          <Controls showInteractive={false} />
        </ReactFlow>
        <Button
          size="sm"
          variant="outline"
          className="absolute top-3 left-3 z-10 bg-background"
          onClick={() => setView('canvas')}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Canvas
        </Button>
      </div>

      <aside className="flex min-h-0 w-full shrink-0 flex-col border-t bg-background xl:w-80 xl:border-t-0 xl:border-l">
        <div className="flex items-center justify-between gap-2 border-b p-4">
          <div>
            <h2 className="text-sm font-semibold">Data model</h2>
            <p className="text-[11px] text-muted-foreground">
              {relationships.length} relationship
              {relationships.length === 1 ? '' : 's'}
              {dirty && ' · unsaved'}
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              disabled={!dirty}
              onClick={() => {
                discardModel();
                setSelectedId(undefined);
              }}
            >
              Discard
            </Button>
            <Button
              size="sm"
              disabled={!dirty || save.isPending}
              onClick={() => void persist()}
            >
              {save.isPending && (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </div>
        </div>

        <div className="scrollbar-thin min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          {selected ? (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {nameOf(selected.left_source)}
                </span>
                .{selected.left_key} →{' '}
                <span className="font-medium text-foreground">
                  {nameOf(selected.right_source)}
                </span>
                .{selected.right_key}
              </p>
              <div className="space-y-1.5">
                <Label>Keep rows</Label>
                <Picker
                  clearable={false}
                  searchable={false}
                  items={joinTypeOptions}
                  value={selected.join_type}
                  onChange={(join_type) =>
                    join_type &&
                    update({
                      join_type:
                        join_type as DashboardRelationship['join_type'],
                    })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Cardinality</Label>
                <Picker
                  clearable={false}
                  searchable={false}
                  items={cardinalityOptions}
                  value={selected.cardinality ?? 'many_to_one'}
                  onChange={(cardinality) =>
                    cardinality &&
                    update({
                      cardinality:
                        cardinality as DashboardRelationship['cardinality'],
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="relationship-enabled">Enabled</Label>
                <Switch
                  id="relationship-enabled"
                  checked={selected.enabled !== false}
                  onCheckedChange={(enabled) => update({ enabled })}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-destructive"
                onClick={() => remove([selected.id])}
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Delete relationship
              </Button>
            </div>
          ) : (
            <p className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
              Drag from a field&apos;s right dot to a field on another source to
              relate them. Select a line to edit it.
            </p>
          )}
          <ul className="space-y-1.5">
            {relationships.map((relationship) => (
              <li key={relationship.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(relationship.id)}
                  className={cn(
                    'w-full rounded-md border px-2.5 py-2 text-left text-xs transition hover:border-primary',
                    relationship.id === selectedId &&
                      'border-primary bg-primary/5'
                  )}
                >
                  <span className="block truncate">
                    {nameOf(relationship.left_source)}.{relationship.left_key}
                  </span>
                  <span className="block truncate text-muted-foreground">
                    → {nameOf(relationship.right_source)}.
                    {relationship.right_key}
                  </span>
                  {relationship.enabled === false && (
                    <Badge variant="secondary" className="mt-1">
                      Disabled
                    </Badge>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
