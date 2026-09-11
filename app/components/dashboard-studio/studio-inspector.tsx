import { useRef } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Copy,
  ImageDown,
  Loader2,
  Plus,
  Settings2,
  Trash2,
  X,
  Download,
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Picker, type PickerItem } from '~/components/ui/picker';
import { exportDashboardAnalysis } from '~/features/dashboard-studio';
import type {
  DashboardDataSource,
  DashboardQuery,
  DashboardWidget,
  DashboardWidgetType,
} from '~/lib/types/dashboard';
import {
  calculatedFieldOperators,
  dateGrains,
  decimalPlaces,
  filterOperators,
  inspectorWidthPresets,
  measureOperations,
  numberFormatOptions,
  tableCalculationOptions,
  visualTypes,
  widgetHeights,
  widgetWidths,
  FIXED_NUMBER,
  ROWS_MEASURE,
  sortDirectionOptions,
} from '~/lib/constants/dashboard-studio';
import { Field, Toggle } from './studio-fields';
import { useStudio } from './studio-context';
import { useStudioUi } from './studio-ui-context';

type FilterOperator = NonNullable<
  DashboardQuery['filters']
>[number]['operator'];
type WidgetWidth = NonNullable<DashboardWidget['layout']>['width'];
type NumberFormat = NonNullable<DashboardWidget['config']>['numberFormat'];

type DateGrain = NonNullable<
  NonNullable<DashboardQuery['dimension_specs']>[number]['date_grain']
>;
type MeasureOperation = DashboardQuery['measures'][number]['operation'];
type TableCalculation = NonNullable<
  DashboardQuery['table_calculations']
>[number]['operation'];

const fieldItems = (
  fields: ReadonlyArray<{ name: string }>,
  group?: string
): PickerItem[] =>
  fields.map((field) => ({ value: field.name, label: field.name, group }));

/**
 * Properties of the selected visual. `panel` = the resizable `xl` column;
 * `sheet` = content of the bottom sheet used on narrower screens.
 */
export function StudioInspector({
  variant = 'panel',
}: Readonly<{ variant?: 'panel' | 'sheet' }>) {
  const inSheet = variant === 'sheet';
  const {
    dashboardId,
    workspaceId,
    selected,
    selectedSource: source,
    sources,
    updateWidget,
    updateQuery,
    run,
    analysing,
    removeWidget,
    duplicateWidget,
    moveWidget,
  } = useStudio();
  const { inspectorWidth, setInspectorWidth, openDialog } = useStudioUi();
  const infographic = () => {
    if (selected) openDialog('infographic');
  };
  const resizeStart = useRef<{ x: number; width: number } | null>(null);
  const resizeTo = (width: number) =>
    setInspectorWidth(Math.min(640, Math.max(320, width)));
  const resizeHandle = inSheet ? null : (
    <div
      role="separator"
      aria-label="Resize visual properties panel"
      aria-orientation="vertical"
      aria-valuemin={320}
      aria-valuemax={640}
      aria-valuenow={inspectorWidth}
      tabIndex={0}
      title="Drag to resize properties panel"
      className="absolute inset-y-0 -left-1.5 z-20 hidden w-3 cursor-col-resize touch-none items-center justify-center xl:flex"
      onPointerDown={(event) => {
        resizeStart.current = { x: event.clientX, width: inspectorWidth };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!resizeStart.current) return;
        resizeTo(
          resizeStart.current.width + resizeStart.current.x - event.clientX
        );
      }}
      onPointerUp={(event) => {
        resizeStart.current = null;
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => {
        resizeStart.current = null;
      }}
      onDoubleClick={() => resizeTo(420)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          resizeTo(inspectorWidth + 24);
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          resizeTo(inspectorWidth - 24);
        }
      }}
    >
      <span className="h-12 w-1 rounded-full bg-border transition-colors hover:bg-primary focus:bg-primary" />
    </div>
  );
  if (!selected)
    return (
      <aside className="relative border-l bg-background p-4">
        {resizeHandle}
        <h2 className="text-sm font-semibold">Properties</h2>
        <div className="mt-4 rounded-xl border border-dashed p-6 text-center">
          <Settings2 className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Select a visual to edit its data, analysis, layout and formatting.
          </p>
        </div>
      </aside>
    );
  const query = selected.query ?? {
    dimensions: [],
    measures: [],
    filters: [],
    limit: 250,
  };
  const calculatedMeasureFields = (query.calculated_fields ?? []).filter(
    (field) => field.name.trim().length > 0
  );
  const includedSourceIds = [
    selected.source_id,
    ...(query.source_ids ?? []),
  ].filter(Boolean) as string[];
  const analysisFields =
    includedSourceIds.length > 1
      ? sources
          .filter((item) => includedSourceIds.includes(item.id))
          .flatMap((item) =>
            item.schema.map((field) => ({
              ...field,
              name: `${item.id}::${field.name}`,
            }))
          )
      : (source?.schema ?? []);
  const analysisSource = source
    ? { ...source, schema: analysisFields }
    : undefined;
  const setMeasure = (
    index: number,
    patch: Partial<DashboardQuery['measures'][number]>
  ) =>
    updateQuery({
      measures: query.measures.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    });
  return (
    <aside
      className={cn(
        'relative flex min-w-0 flex-col bg-background',
        inSheet ? 'h-full min-h-0' : 'border-t xl:border-t-0 xl:border-l'
      )}
    >
      {resizeHandle}
      <div
        className={cn(
          'flex items-start justify-between gap-2 border-b p-4',
          inSheet && 'pr-12'
        )}
      >
        <div>
          <h2 className="text-sm font-semibold">Visual properties</h2>
          <p className="text-[11px] text-muted-foreground">
            {visualTypes.find((item) => item.value === selected.type)?.label}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {!inSheet && (
            <Picker
              size="sm"
              clearable={false}
              searchable={false}
              className="w-[118px]"
              aria-label="Properties panel width"
              items={inspectorWidthPresets.map((option) => ({
                value: String(option.value),
                label: option.label,
              }))}
              value={String(inspectorWidth)}
              onChange={(width) => width && resizeTo(Number(width))}
            />
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={removeWidget}
            title="Delete visual"
            aria-label="Delete visual"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <Field label="Title">
          <Input
            value={selected.title}
            onChange={(event) => updateWidget({ title: event.target.value })}
          />
        </Field>
        <Field label="Description">
          <Input
            value={selected.config?.description ?? ''}
            onChange={(event) =>
              updateWidget({
                config: { ...selected.config, description: event.target.value },
              })
            }
            placeholder="Optional context"
          />
        </Field>
        <Field label="Visual type">
          <Picker
            clearable={false}
            items={visualTypes}
            value={selected.type}
            onChange={(type) =>
              type && updateWidget({ type: type as DashboardWidgetType })
            }
          />
        </Field>
        {selected.type === 'text' ? (
          <Field label="Narrative">
            <Textarea
              rows={10}
              value={selected.text ?? ''}
              onChange={(event) => updateWidget({ text: event.target.value })}
            />
          </Field>
        ) : selected.type === 'image' ? (
          <>
            <Field label="Image URL">
              <Input
                type="url"
                value={selected.config?.imageUrl ?? ''}
                onChange={(event) =>
                  updateWidget({
                    config: {
                      ...selected.config,
                      imageUrl: event.target.value,
                    },
                  })
                }
                placeholder="https://example.org/image.png"
              />
            </Field>
            <Field label="Accessible description">
              <Input
                value={selected.config?.imageAlt ?? ''}
                onChange={(event) =>
                  updateWidget({
                    config: {
                      ...selected.config,
                      imageAlt: event.target.value,
                    },
                  })
                }
              />
            </Field>
          </>
        ) : selected.type === 'shape' ? (
          <p className="rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
            Shapes inherit the dashboard accent colour and can be used to group
            or emphasise content.
          </p>
        ) : (
          <>
            <div className="border-t pt-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Data & analysis
              </h3>
              <Field label="Source">
                <Picker
                  clearable={false}
                  placeholder="Choose source"
                  items={sources
                    .filter((item) => item.status === 'ready')
                    .map((item) => ({ value: item.id, label: item.name }))}
                  value={selected.source_id ?? null}
                  onChange={(source_id) =>
                    source_id && updateWidget({ source_id, data: undefined })
                  }
                />
              </Field>
              <Field label="Related sources">
                <Picker
                  multi
                  items={sources
                    .filter(
                      (item) =>
                        item.status === 'ready' &&
                        item.id !== selected.source_id
                    )
                    .map((item) => ({ value: item.id, label: item.name }))}
                  value={query.source_ids ?? []}
                  onChange={(source_ids) =>
                    updateQuery({ source_ids: [...source_ids] })
                  }
                  placeholder="Use the data model"
                  emptyMessage="No other ready sources"
                />
              </Field>
              <div className="mb-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Group by</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7"
                    onClick={() =>
                      updateQuery({
                        dimensions: [
                          ...query.dimensions,
                          analysisFields.find(
                            (field) => !query.dimensions.includes(field.name)
                          )?.name ?? '',
                        ],
                      })
                    }
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add
                  </Button>
                </div>
                {query.dimensions.map((dimension, index) => (
                  <div key={`${index}-${dimension}`} className="flex gap-2">
                    <Picker
                      clearable={false}
                      placeholder="Choose field"
                      items={fieldItems(analysisFields)}
                      value={dimension || null}
                      onChange={(value) =>
                        value &&
                        updateQuery({
                          dimensions: query.dimensions.map((item, itemIndex) =>
                            itemIndex === index ? value : item
                          ),
                        })
                      }
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        updateQuery({
                          dimensions: query.dimensions.filter(
                            (_, itemIndex) => itemIndex !== index
                          ),
                        })
                      }
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                {!query.dimensions.length && (
                  <p className="text-[11px] text-muted-foreground">
                    No grouping — results will be aggregated into one row.
                  </p>
                )}
              </div>
              {!!analysisFields.some((field) => field.type === 'date') && (
                <div className="mb-3 grid grid-cols-2 gap-2 rounded-lg border p-2">
                  <Field label="Date grouping">
                    <Picker
                      placeholder="None"
                      items={fieldItems(
                        analysisFields.filter((field) => field.type === 'date')
                      )}
                      value={query.dimension_specs?.[0]?.column ?? null}
                      onChange={(column) =>
                        updateQuery({
                          dimensions: column
                            ? query.dimensions.filter(
                                (dimension) => dimension !== column
                              )
                            : query.dimensions,
                          dimension_specs: column
                            ? [
                                {
                                  column,
                                  label: `${column} (${query.dimension_specs?.[0]?.date_grain ?? 'month'})`,
                                  date_grain:
                                    query.dimension_specs?.[0]?.date_grain ??
                                    'month',
                                },
                              ]
                            : [],
                        })
                      }
                    />
                  </Field>
                  <Field label="Period">
                    <Picker
                      clearable={false}
                      searchable={false}
                      items={dateGrains.map((grain) => ({
                        value: grain,
                        label: grain,
                      }))}
                      value={query.dimension_specs?.[0]?.date_grain ?? 'month'}
                      disabled={!query.dimension_specs?.length}
                      onChange={(date_grain) => {
                        const current = query.dimension_specs?.[0];
                        if (current && date_grain)
                          updateQuery({
                            dimension_specs: [
                              {
                                ...current,
                                date_grain: date_grain as DateGrain,
                                label: `${current.column} (${date_grain})`,
                              },
                            ],
                          });
                      }}
                    />
                  </Field>
                </div>
              )}
              <CalculatedFields
                comfortable={inspectorWidth >= 400}
                query={query}
                source={analysisSource}
                updateQuery={updateQuery}
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Measures</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7"
                    onClick={() =>
                      updateQuery({
                        measures: [
                          ...query.measures,
                          {
                            operation: 'count',
                            label: `Measure ${query.measures.length + 1}`,
                          },
                        ],
                      })
                    }
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add
                  </Button>
                </div>
                {query.measures.map((measure, index) => (
                  <div
                    key={`measure-${index}`}
                    className="space-y-2 rounded-lg border p-2"
                  >
                    <div className="flex gap-2">
                      <Picker
                        clearable={false}
                        className="min-w-0"
                        items={[
                          { value: ROWS_MEASURE, label: 'Rows' },
                          ...fieldItems(analysisFields, 'Dataset fields'),
                          ...calculatedMeasureFields.map((field) => ({
                            value: field.name.trim(),
                            label: `ƒ ${field.name.trim()}`,
                            group: 'Calculated fields',
                          })),
                        ]}
                        value={measure.column ?? ROWS_MEASURE}
                        onChange={(value) =>
                          value &&
                          setMeasure(index, {
                            column: value === ROWS_MEASURE ? undefined : value,
                            ...(value === ROWS_MEASURE
                              ? { operation: 'count' as const }
                              : {}),
                          })
                        }
                      />
                      <Picker
                        clearable={false}
                        className="w-28 shrink-0"
                        items={measureOperations.map((operation) => ({
                          value: operation,
                          label: operation.replace('_', ' '),
                        }))}
                        value={measure.operation}
                        onChange={(operation) =>
                          operation &&
                          setMeasure(index, {
                            operation: operation as MeasureOperation,
                          })
                        }
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          updateQuery({
                            measures: query.measures.filter(
                              (_, itemIndex) => itemIndex !== index
                            ),
                          })
                        }
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <Input
                      value={measure.label ?? ''}
                      onChange={(event) =>
                        setMeasure(index, { label: event.target.value })
                      }
                      placeholder="Display label"
                    />
                  </div>
                ))}
                {!!calculatedMeasureFields.length && (
                  <p className="text-[11px] text-muted-foreground">
                    Calculated fields are available in the field selector above
                    and are marked with ƒ.
                  </p>
                )}
              </div>
              {!!query.measures.length && (
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg border p-2">
                  <Field label="Table calculation">
                    <Picker
                      searchable={false}
                      placeholder="None"
                      items={tableCalculationOptions}
                      value={query.table_calculations?.[0]?.operation ?? null}
                      onChange={(operation) =>
                        updateQuery({
                          table_calculations: operation
                            ? [
                                {
                                  column:
                                    query.measures[0].label ||
                                    `${query.measures[0].operation}_${query.measures[0].column ?? 'rows'}`,
                                  operation: operation as TableCalculation,
                                  label: `${operation.replaceAll('_', ' ')} · ${query.measures[0].label ?? 'measure'}`,
                                  window: 3,
                                },
                              ]
                            : [],
                        })
                      }
                    />
                  </Field>
                  <Field label="Based on">
                    <Picker
                      clearable={false}
                      items={query.measures.map((measure) => {
                        const value =
                          measure.label ||
                          `${measure.operation}_${measure.column ?? 'rows'}`;
                        return { value, label: value };
                      })}
                      value={
                        query.table_calculations?.[0]?.column ??
                        query.measures[0].label ??
                        null
                      }
                      disabled={!query.table_calculations?.length}
                      onChange={(column) => {
                        const current = query.table_calculations?.[0];
                        if (current && column)
                          updateQuery({
                            table_calculations: [{ ...current, column }],
                          });
                      }}
                    />
                  </Field>
                </div>
              )}
              <Filters
                query={query}
                source={analysisSource}
                updateQuery={updateQuery}
              />
              <div className="grid grid-cols-2 gap-2">
                <Field label="Sort by">
                  <Input
                    value={query.sort?.column ?? ''}
                    onChange={(event) =>
                      updateQuery({
                        sort: event.target.value
                          ? {
                              column: event.target.value,
                              direction: query.sort?.direction ?? 'desc',
                            }
                          : undefined,
                      })
                    }
                    placeholder="Result column"
                  />
                </Field>
                <Field label="Direction">
                  <Picker
                    clearable={false}
                    searchable={false}
                    items={sortDirectionOptions}
                    value={query.sort?.direction ?? 'desc'}
                    onChange={(direction) =>
                      direction &&
                      updateQuery({
                        sort: query.sort
                          ? {
                              ...query.sort,
                              direction: direction as 'asc' | 'desc',
                            }
                          : undefined,
                      })
                    }
                  />
                </Field>
              </div>
              {selected.type === 'map' && (
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Latitude field">
                    <Picker
                      placeholder="Latitude"
                      items={fieldItems(
                        analysisFields.filter(
                          (field) => field.type === 'number'
                        )
                      )}
                      value={selected.config?.latitude ?? null}
                      onChange={(latitude) =>
                        updateWidget({
                          config: {
                            ...selected.config,
                            latitude: latitude ?? undefined,
                          },
                        })
                      }
                    />
                  </Field>
                  <Field label="Longitude field">
                    <Picker
                      placeholder="Longitude"
                      items={fieldItems(
                        analysisFields.filter(
                          (field) => field.type === 'number'
                        )
                      )}
                      value={selected.config?.longitude ?? null}
                      onChange={(longitude) =>
                        updateWidget({
                          config: {
                            ...selected.config,
                            longitude: longitude ?? undefined,
                          },
                        })
                      }
                    />
                  </Field>
                </div>
              )}
              {selected.type === 'gauge' && (
                <Field label="Target value">
                  <Input
                    type="number"
                    value={selected.config?.target ?? 100}
                    onChange={(event) =>
                      updateWidget({
                        config: {
                          ...selected.config,
                          target: Number(event.target.value),
                        },
                      })
                    }
                  />
                </Field>
              )}
              <Button
                className="mt-3 w-full"
                onClick={() => void run().catch(() => undefined)}
                disabled={!selected.source_id || analysing}
              >
                {analysing ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <BarChart3 className="mr-1.5 h-4 w-4" />
                )}
                Run analysis
              </Button>
              {selected.source_id && selected.query && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(['csv', 'xlsx'] as const).map((format) => (
                    <Button
                      key={format}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        void exportDashboardAnalysis(
                          dashboardId,
                          selected.source_id!,
                          selected.query!,
                          format,
                          workspaceId
                        )
                      }
                    >
                      <Download className="mr-1.5 h-4 w-4" />
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        <div className="border-t pt-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Layout & format
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Width">
              <Picker
                clearable={false}
                searchable={false}
                items={widgetWidths.map((value) => ({
                  value: String(value),
                  label: `${value}/12`,
                }))}
                value={String(selected.layout?.width ?? 6)}
                onChange={(width) =>
                  width &&
                  updateWidget({
                    layout: {
                      width: Number(width) as WidgetWidth,
                      height: selected.layout?.height ?? 360,
                    },
                  })
                }
              />
            </Field>
            <Field label="Height">
              <Picker
                clearable={false}
                searchable={false}
                items={widgetHeights.map((value) => ({
                  value: String(value),
                  label: `${value}px`,
                }))}
                value={String(selected.layout?.height ?? 360)}
                onChange={(height) =>
                  height &&
                  updateWidget({
                    layout: {
                      width: selected.layout?.width ?? 6,
                      height: Number(height),
                    },
                  })
                }
              />
            </Field>
          </div>
          <Toggle
            label="Show legend"
            checked={selected.config?.showLegend !== false}
            onChange={(showLegend) =>
              updateWidget({ config: { ...selected.config, showLegend } })
            }
          />
          <Toggle
            label="Show grid"
            checked={selected.config?.showGrid !== false}
            onChange={(showGrid) =>
              updateWidget({ config: { ...selected.config, showGrid } })
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Number">
              <Picker
                clearable={false}
                searchable={false}
                items={numberFormatOptions}
                value={selected.config?.numberFormat ?? 'standard'}
                onChange={(numberFormat) =>
                  numberFormat &&
                  updateWidget({
                    config: {
                      ...selected.config,
                      numberFormat: numberFormat as NumberFormat,
                    },
                  })
                }
              />
            </Field>
            <Field label="Decimals">
              <Picker
                clearable={false}
                searchable={false}
                items={decimalPlaces.map((value) => ({
                  value: String(value),
                  label: String(value),
                }))}
                value={String(selected.config?.decimals ?? 0)}
                onChange={(decimals) =>
                  decimals &&
                  updateWidget({
                    config: { ...selected.config, decimals: Number(decimals) },
                  })
                }
              />
            </Field>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-1 border-t pt-4">
          <Button
            size="icon"
            variant="outline"
            onClick={() => moveWidget(-1)}
            title="Move earlier"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => moveWidget(1)}
            title="Move later"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={duplicateWidget}
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={infographic}
            title="Create infographic"
          >
            <ImageDown className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={removeWidget}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}

function CalculatedFields({
  comfortable,
  query,
  source,
  updateQuery,
}: Readonly<{
  comfortable: boolean;
  query: DashboardQuery;
  source?: DashboardDataSource;
  updateQuery: (patch: Partial<DashboardQuery>) => void;
}>) {
  type CalculatedField = NonNullable<
    DashboardQuery['calculated_fields']
  >[number];
  const fields = query.calculated_fields ?? [];
  const numericFields = source?.schema.filter((item) => item.type === 'number');
  const update = (index: number, patch: Partial<CalculatedField>) => {
    const previousName = fields[index]?.name;
    const nextFields = fields.map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...patch } : item
    );
    updateQuery({
      calculated_fields: nextFields,
      ...(patch.name !== undefined && previousName !== patch.name
        ? {
            measures: query.measures.map((measure) =>
              measure.column === previousName
                ? { ...measure, column: patch.name }
                : measure
            ),
          }
        : {}),
    });
  };
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label>Calculated fields</Label>
          <p className="text-[10px] text-muted-foreground">
            Create a numeric result for this visual.
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-7"
          onClick={() =>
            updateQuery({
              calculated_fields: [
                ...fields,
                {
                  name: `Calculation ${fields.length + 1}`,
                  left: numericFields?.[0]?.name ?? '',
                  operator: 'add',
                  right_value: 0,
                },
              ],
            })
          }
        >
          <Plus className="mr-1 h-3 w-3" />
          Add
        </Button>
      </div>
      {fields.map((field, index) => (
        <div
          key={`calculated-field-${index}`}
          className="space-y-3 rounded-xl border bg-muted/20 p-3"
        >
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1 space-y-1.5">
              <Label className="text-[11px]">Calculated field name</Label>
              <Input
                value={field.name}
                onChange={(event) =>
                  update(index, { name: event.target.value })
                }
                placeholder="e.g. Budget utilization"
              />
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                updateQuery({
                  calculated_fields: fields.filter(
                    (_, itemIndex) => itemIndex !== index
                  ),
                })
              }
              title="Remove calculated field"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px]">
              Formula (optional advanced mode)
            </Label>
            <Input
              value={field.expression ?? ''}
              onChange={(event) =>
                update(index, { expression: event.target.value || undefined })
              }
              placeholder="e.g. ([spent] / [allocated]) * 100"
            />
            <p className="text-[10px] text-muted-foreground">
              Reference columns in square brackets. Leave blank to use the
              guided calculation below.
            </p>
          </div>
          <div
            className={`grid gap-2 ${
              comfortable
                ? 'grid-cols-[minmax(0,1fr)_110px_minmax(0,1fr)]'
                : 'grid-cols-1'
            }`}
          >
            <div className="min-w-0 space-y-1.5">
              <Label className="text-[11px]">First field</Label>
              <Picker
                clearable={false}
                placeholder="Choose field"
                items={fieldItems(numericFields ?? [])}
                value={field.left ?? null}
                onChange={(left) => left && update(index, { left })}
              />
            </div>
            <div className="min-w-0 space-y-1.5">
              <Label className="text-[11px]">Operation</Label>
              <Picker
                clearable={false}
                searchable={false}
                items={calculatedFieldOperators}
                value={field.operator ?? null}
                onChange={(operator) =>
                  operator &&
                  update(index, {
                    operator: operator as CalculatedField['operator'],
                  })
                }
              />
            </div>
            <div className="min-w-0 space-y-1.5">
              <Label className="text-[11px]">Second value</Label>
              <Picker
                clearable={false}
                items={[
                  { value: FIXED_NUMBER, label: 'Fixed number' },
                  ...fieldItems(numericFields ?? []),
                ]}
                value={field.right ?? FIXED_NUMBER}
                onChange={(right) =>
                  right &&
                  update(index, {
                    right: right === FIXED_NUMBER ? undefined : right,
                  })
                }
              />
            </div>
          </div>
          {!field.right && (
            <div className="space-y-1.5">
              <Label className="text-[11px]">Fixed number</Label>
              <Input
                type="number"
                value={field.right_value ?? 0}
                onChange={(event) =>
                  update(index, { right_value: Number(event.target.value) })
                }
                placeholder="Enter a number"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Filters({
  query,
  source,
  updateQuery,
}: Readonly<{
  query: DashboardQuery;
  source?: DashboardDataSource;
  updateQuery: (patch: Partial<DashboardQuery>) => void;
}>) {
  const filters = query.filters ?? [];
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <Label>Filters</Label>
        <Button
          size="sm"
          variant="ghost"
          className="h-7"
          onClick={() =>
            updateQuery({
              filters: [
                ...filters,
                {
                  column: source?.schema[0]?.name ?? '',
                  operator: 'equals',
                  value: '',
                },
              ],
            })
          }
        >
          <Plus className="mr-1 h-3 w-3" />
          Add
        </Button>
      </div>
      {filters.map((filter, index) => (
        <div
          key={`${index}-${filter.column}`}
          className="space-y-2 rounded-lg border p-2"
        >
          <div className="flex gap-2">
            <Picker
              clearable={false}
              className="min-w-0"
              placeholder="Field"
              items={fieldItems(source?.schema ?? [])}
              value={filter.column || null}
              onChange={(column) =>
                column &&
                updateQuery({
                  filters: filters.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, column } : item
                  ),
                })
              }
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                updateQuery({
                  filters: filters.filter(
                    (_, itemIndex) => itemIndex !== index
                  ),
                })
              }
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Picker
            clearable={false}
            items={filterOperators.map((operator) => ({
              value: operator,
              label: operator.replaceAll('_', ' '),
            }))}
            value={filter.operator}
            onChange={(operator) =>
              operator &&
              updateQuery({
                filters: filters.map((item, itemIndex) =>
                  itemIndex === index
                    ? {
                        ...item,
                        operator: operator as FilterOperator,
                      }
                    : item
                ),
              })
            }
          />
          {!['is_null', 'not_null'].includes(filter.operator) && (
            <Input
              value={
                Array.isArray(filter.value)
                  ? filter.value.join(',')
                  : String(filter.value)
              }
              onChange={(event) =>
                updateQuery({
                  filters: filters.map((item, itemIndex) =>
                    itemIndex === index
                      ? { ...item, value: event.target.value }
                      : item
                  ),
                })
              }
              placeholder={
                filter.operator === 'in' ? 'A, B, C' : 'Filter value'
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}
