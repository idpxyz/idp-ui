/**
 * JsonSchemaEditor — JSON Schema visual editor + optional JSON slot (Monaco).
 *
 * Layout: Visual | JSON | Split · Fullscreen · resizable height · persisted prefs (storageKey).
 */

import { useState, useCallback, useRef, useEffect, type ReactNode, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  Code2,
  LayoutList,
  Settings2,
  AlertCircle,
  Maximize2,
  Minimize2,
  Columns2,
  GripHorizontal,
} from 'lucide-react';
import { cn } from '@idpxyz/ui-utils';

import { NumberInput } from './number-input';

const SCHEMA_TYPES = ['string', 'number', 'integer', 'boolean', 'array', 'object'] as const;
export type JsonSchemaFieldType = (typeof SCHEMA_TYPES)[number];

export interface SchemaField {
  id: string;
  name: string;
  type: JsonSchemaFieldType;
  required: boolean;
  description: string;
  format?: string;
  enumValues?: string;
  defaultValue?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  children?: SchemaField[];
}

let _seq = 0;
function newId() {
  return `sf-${++_seq}-${Math.random().toString(36).slice(2, 6)}`;
}

export function fieldsToJsonSchema(fields: SchemaField[]): Record<string, unknown> {
  if (fields.length === 0) return {};
  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  for (const f of fields) {
    if (!f.name.trim()) continue;
    const prop: Record<string, unknown> = { type: f.type };
    if (f.description.trim()) prop.description = f.description.trim();
    if (f.format?.trim()) prop.format = f.format.trim();
    if (f.pattern?.trim()) prop.pattern = f.pattern.trim();
    if (f.defaultValue?.trim()) {
      try {
        prop.default = JSON.parse(f.defaultValue);
      } catch {
        prop.default = f.defaultValue;
      }
    }
    if (f.enumValues?.trim()) prop.enum = f.enumValues.split(',').map((v) => v.trim()).filter(Boolean);
    if (f.type === 'string') {
      if (f.minLength != null && f.minLength > 0) prop.minLength = f.minLength;
      if (f.maxLength != null && f.maxLength > 0) prop.maxLength = f.maxLength;
    }
    if (f.type === 'number' || f.type === 'integer') {
      if (f.minimum != null) prop.minimum = f.minimum;
      if (f.maximum != null) prop.maximum = f.maximum;
    }
    if (f.type === 'object' && f.children?.length) {
      const nested = fieldsToJsonSchema(f.children);
      if (nested.properties) prop.properties = nested.properties;
      if (nested.required) prop.required = nested.required;
    }
    if (f.type === 'array') {
      if (f.children?.length) {
        const itemSchema = fieldsToJsonSchema(f.children);
        prop.items = { type: 'object', ...itemSchema };
      } else {
        prop.items = { type: 'string' };
      }
    }
    properties[f.name.trim()] = prop;
    if (f.required) required.push(f.name.trim());
  }
  return { type: 'object', properties, ...(required.length > 0 ? { required } : {}) };
}

export function jsonSchemaToFields(schema: Record<string, unknown>): SchemaField[] {
  const props = (schema?.properties ?? {}) as Record<string, Record<string, unknown>>;
  const req = new Set((schema?.required ?? []) as string[]);
  return Object.entries(props).map(([name, def]) => {
    const field: SchemaField = {
      id: newId(),
      name,
      type: (def.type as JsonSchemaFieldType) || 'string',
      required: req.has(name),
      description: (def.description as string) || '',
      format: (def.format as string) || '',
      enumValues: Array.isArray(def.enum) ? (def.enum as string[]).join(', ') : '',
      pattern: (def.pattern as string) || '',
      defaultValue:
        def.default != null
          ? typeof def.default === 'string'
            ? def.default
            : JSON.stringify(def.default)
          : '',
      minLength: (def.minLength as number) ?? undefined,
      maxLength: (def.maxLength as number) ?? undefined,
      minimum: (def.minimum as number) ?? undefined,
      maximum: (def.maximum as number) ?? undefined,
    };
    if (def.type === 'object' && def.properties) field.children = jsonSchemaToFields(def as Record<string, unknown>);
    if (def.type === 'array' && def.items && (def.items as Record<string, unknown>).properties) {
      field.children = jsonSchemaToFields(def.items as Record<string, unknown>);
    }
    return field;
  });
}

function getSiblingNames(fields: SchemaField[], excludeId: string): Set<string> {
  return new Set(fields.filter((f) => f.id !== excludeId && f.name.trim()).map((f) => f.name.trim()));
}

export type JsonSchemaLayoutMode = 'visual' | 'json' | 'split';

const LS = {
  layout: (k: string) => `${k}.layout`,
  panelHeight: (k: string) => `${k}.panelHeight`,
  splitRatio: (k: string) => `${k}.splitRatio`,
  fill: (k: string) => `${k}.fill`,
};

function loadLayout(storageKey: string | undefined, fallback: JsonSchemaLayoutMode): JsonSchemaLayoutMode {
  if (!storageKey || typeof window === 'undefined') return fallback;
  try {
    const v = localStorage.getItem(LS.layout(storageKey));
    if (v === 'visual' || v === 'json' || v === 'split') return v;
  } catch {
    /* ignore */
  }
  return fallback;
}

function loadNumber(storageKey: string | undefined, key: string, fallback: number): number {
  if (!storageKey || typeof window === 'undefined') return fallback;
  try {
    const v = localStorage.getItem(key);
    if (v == null) return fallback;
    const n = Number.parseInt(v, 10);
    if (Number.isFinite(n)) return Math.min(1200, Math.max(200, n));
  } catch {
    /* ignore */
  }
  return fallback;
}

function loadSplitRatio(storageKey: string | undefined, fallback: number): number {
  if (!storageKey || typeof window === 'undefined') return fallback;
  try {
    const v = localStorage.getItem(LS.splitRatio(storageKey));
    if (v == null) return fallback;
    const n = Number.parseInt(v, 10);
    if (Number.isFinite(n)) return Math.min(85, Math.max(15, n));
  } catch {
    /* ignore */
  }
  return fallback;
}

function loadFill(storageKey: string | undefined, fallback: boolean): boolean {
  if (!storageKey || typeof window === 'undefined') return fallback;
  try {
    return localStorage.getItem(LS.fill(storageKey)) === '1';
  } catch {
    return fallback;
  }
}

function FieldNode({
  field,
  depth,
  siblings,
  readOnly,
  onUpdate,
  onRemove,
  onAddChild,
}: {
  field: SchemaField;
  depth: number;
  siblings: SchemaField[];
  readOnly?: boolean;
  onUpdate: (id: string, patch: Partial<SchemaField>) => void;
  onRemove: (id: string) => void;
  onAddChild: (parentId: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(depth > 1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fieldRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showAdvanced) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = fieldRootRef.current;
      if (!el || el.contains(e.target as Node)) return;
      setShowAdvanced(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAdvanced(false);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [showAdvanced]);

  const hasChildren = (field.type === 'object' || field.type === 'array') && field.children && field.children.length > 0;
  const canHaveChildren = field.type === 'object' || field.type === 'array';
  const siblingNames = getSiblingNames(siblings, field.id);
  const isDuplicate = field.name.trim() !== '' && siblingNames.has(field.name.trim());
  const isEmpty = field.name.trim() === '';

  return (
    <div>
      <div ref={fieldRootRef}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 py-1 min-w-0" style={{ paddingLeft: depth * 16 }}>
          <span className="w-5 shrink-0 flex items-center justify-center">
            {canHaveChildren ? (
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="text-idpxyz-textMuted hover:text-idpxyz-text p-0 border-0 bg-transparent cursor-pointer"
              >
                {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </button>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-idpxyz-border inline-block" />
            )}
          </span>
          <div className="flex flex-1 min-w-[min(100%,12rem)] items-center gap-1.5 basis-[min(100%,14rem)] sm:basis-auto sm:min-w-[10rem]">
            <input
              className={`h-7 px-2 text-[11px] font-mono bg-idpxyz-inputBg border rounded text-idpxyz-text outline-none focus:border-idpxyz-accent w-full min-w-0 ${
                isDuplicate ? 'border-red-400' : isEmpty ? 'border-yellow-400/50' : 'border-idpxyz-border'
              }`}
              placeholder="field"
              value={field.name}
              readOnly={readOnly}
              onChange={(e) => onUpdate(field.id, { name: e.target.value.replace(/\s/g, '_') })}
            />
            {isDuplicate ? (
              <span title="Duplicate field name">
                <AlertCircle size={12} className="text-red-400 shrink-0" />
              </span>
            ) : null}
          </div>
          <select
            className="h-7 shrink-0 w-[7.25rem] min-w-[7.25rem] px-2 text-[11px] bg-idpxyz-inputBg border border-idpxyz-border rounded text-idpxyz-text outline-none cursor-pointer"
            value={Array.isArray(field.type) ? field.type[0] : field.type}
            disabled={readOnly}
            onChange={(e) => onUpdate(field.id, { type: e.target.value as JsonSchemaFieldType })}
          >
            {SCHEMA_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap">
            <input
              type="checkbox"
              checked={field.required}
              disabled={readOnly}
              onChange={(e) => onUpdate(field.id, { required: e.target.checked })}
              className="w-3.5 h-3.5 rounded border-idpxyz-border accent-[var(--idpxyz-accent)]"
            />
            <span className="text-[10px] text-idpxyz-textMuted">req</span>
          </label>
          {!readOnly && (
            <span className="inline-flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`p-1 rounded border-0 bg-transparent cursor-pointer ${
                  showAdvanced ? 'text-idpxyz-accent' : 'text-idpxyz-textMuted hover:text-idpxyz-text hover:bg-idpxyz-hover/50'
                }`}
                title="Advanced properties"
              >
                <Settings2 size={12} />
              </button>
              {canHaveChildren ? (
                <button
                  type="button"
                  onClick={() => onAddChild(field.id)}
                  className="p-1 text-idpxyz-textMuted hover:text-idpxyz-accent border-0 bg-transparent cursor-pointer rounded hover:bg-idpxyz-hover/50"
                  title="Add child"
                >
                  <Plus size={12} />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => onRemove(field.id)}
                className="p-1 text-red-400/60 hover:text-red-400 border-0 bg-transparent cursor-pointer rounded hover:bg-red-500/10"
                title="Remove field"
              >
                <Trash2 size={12} />
              </button>
            </span>
          )}
        </div>
        {field.description && !showAdvanced ? (
          <div
            className="text-[10px] text-idpxyz-textMuted/90 pl-1 pb-0.5 truncate"
            style={{ paddingLeft: depth * 16 + 24 }}
            title={field.description}
          >
            {field.description}
          </div>
        ) : null}

        {showAdvanced && !readOnly ? (
          <div
            className="ml-5 mb-1 space-y-1.5 rounded-md border border-[color:var(--idpxyz-panelBorder,var(--idpxyz-border))] bg-idpxyz-inputBg/25 p-2"
            style={{ marginLeft: depth * 16 + 20 }}
          >
            <input
              className="w-full h-6 px-1.5 text-[10px] bg-idpxyz-inputBg border border-idpxyz-border rounded text-idpxyz-text outline-none focus:border-idpxyz-accent"
              placeholder="Description"
              value={field.description}
              onChange={(e) => onUpdate(field.id, { description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-1.5">
              {field.type === 'string' ? (
                <>
                  <input
                    className="h-5 px-1.5 text-[9px] font-mono bg-idpxyz-inputBg border border-idpxyz-border rounded text-idpxyz-text outline-none"
                    placeholder="format: date-time, email..."
                    value={field.format || ''}
                    onChange={(e) => onUpdate(field.id, { format: e.target.value })}
                  />
                  <input
                    className="h-5 px-1.5 text-[9px] font-mono bg-idpxyz-inputBg border border-idpxyz-border rounded text-idpxyz-text outline-none"
                    placeholder="pattern (regex)"
                    value={field.pattern || ''}
                    onChange={(e) => onUpdate(field.id, { pattern: e.target.value })}
                  />
                  <NumberInput
                    mode="int"
                    className="h-5 min-h-[1.25rem] px-1.5 py-0 text-[9px]"
                    placeholder="minLength"
                    value={field.minLength ?? null}
                    onValueChange={(v) => onUpdate(field.id, { minLength: v === null ? undefined : v })}
                  />
                  <NumberInput
                    mode="int"
                    className="h-5 min-h-[1.25rem] px-1.5 py-0 text-[9px]"
                    placeholder="maxLength"
                    value={field.maxLength ?? null}
                    onValueChange={(v) => onUpdate(field.id, { maxLength: v === null ? undefined : v })}
                  />
                </>
              ) : null}
              {field.type === 'number' || field.type === 'integer' ? (
                <>
                  <NumberInput
                    mode={field.type === 'integer' ? 'int' : 'decimal'}
                    className="h-5 min-h-[1.25rem] px-1.5 py-0 text-[9px]"
                    placeholder="minimum"
                    value={field.minimum ?? null}
                    onValueChange={(v) => onUpdate(field.id, { minimum: v === null ? undefined : v })}
                  />
                  <NumberInput
                    mode={field.type === 'integer' ? 'int' : 'decimal'}
                    className="h-5 min-h-[1.25rem] px-1.5 py-0 text-[9px]"
                    placeholder="maximum"
                    value={field.maximum ?? null}
                    onValueChange={(v) => onUpdate(field.id, { maximum: v === null ? undefined : v })}
                  />
                </>
              ) : null}
              <input
                className="h-5 px-1.5 text-[9px] font-mono bg-idpxyz-inputBg border border-idpxyz-border rounded text-idpxyz-text outline-none col-span-2"
                placeholder="enum: val1, val2, val3"
                value={field.enumValues || ''}
                onChange={(e) => onUpdate(field.id, { enumValues: e.target.value })}
              />
              <input
                className="h-5 px-1.5 text-[9px] font-mono bg-idpxyz-inputBg border border-idpxyz-border rounded text-idpxyz-text outline-none col-span-2"
                placeholder="default value"
                value={field.defaultValue || ''}
                onChange={(e) => onUpdate(field.id, { defaultValue: e.target.value })}
              />
            </div>
          </div>
        ) : null}
      </div>

      {hasChildren && !collapsed
        ? field.children!.map((child) => (
            <FieldNode
              key={child.id}
              field={child}
              depth={depth + 1}
              siblings={field.children!}
              readOnly={readOnly}
              onUpdate={onUpdate}
              onRemove={onRemove}
              onAddChild={onAddChild}
            />
          ))
        : null}
    </div>
  );
}

function HorizontalResizeHandle({ onResizeStart }: { onResizeStart: (e: React.PointerEvent) => void }) {
  return (
    <button
      type="button"
      aria-label="Resize editor height"
      className="group relative flex h-3 w-full cursor-row-resize touch-none items-center justify-center border-0 bg-transparent p-0"
      onPointerDown={onResizeStart}
    >
      <span className="h-1 w-12 rounded-full bg-idpxyz-border transition-colors group-hover:bg-idpxyz-accent/70" />
      <GripHorizontal className="pointer-events-none absolute h-4 w-4 text-idpxyz-textMuted opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}

export interface JsonSchemaEditorProps {
  schema: Record<string, unknown>;
  onChange?: (schema: Record<string, unknown>) => void;
  /** Default max height for visual tree when no storage (px). */
  maxHeight?: number;
  readOnly?: boolean;
  jsonEditor?: ReactNode;
  label?: string;
  /** Root wrapper classes (merged). */
  className?: string;
  /** @alias className — merged with className */
  rootClassName?: string;
  /** Flex column + min-h-0 to fill parent layout. */
  fill?: boolean;
  /** Persist layout mode, panel height, split ratio, fill preference. */
  storageKey?: string;
  /** Controlled fill (e.g. parent layout). If omitted with storageKey, initial value loads from storage. */
  fillPreference?: boolean;
  /** When user toggles “fill panel” in toolbar (only if onFillPreferenceChange provided). */
  onFillPreferenceChange?: (value: boolean) => void;
}

export function JsonSchemaEditor({
  schema,
  onChange,
  maxHeight = 320,
  readOnly = false,
  jsonEditor,
  label = 'Schema Definition',
  className,
  rootClassName,
  fill = false,
  storageKey,
  fillPreference,
  onFillPreferenceChange,
}: JsonSchemaEditorProps) {
  const defaultHeight = Math.max(200, Math.min(1200, maxHeight));
  const [layoutMode, setLayoutMode] = useState<JsonSchemaLayoutMode>(() => loadLayout(storageKey, 'visual'));
  const [panelHeight, setPanelHeight] = useState(() =>
    loadNumber(storageKey, storageKey ? LS.panelHeight(storageKey) : '', defaultHeight),
  );
  const [splitRatio, setSplitRatio] = useState(() => loadSplitRatio(storageKey, 50));
  const [fullscreen, setFullscreen] = useState(false);
  const [fields, setFields] = useState<SchemaField[]>(() => jsonSchemaToFields(schema));
  const dragRef = useRef<{ startY: number; startH: number } | null>(null);
  const splitDragRef = useRef<{ startX: number; startRatio: number; width: number } | null>(null);

  const effectiveFill = fillPreference ?? (storageKey ? loadFill(storageKey, fill) : fill);
  /** 与 flex 父级一起占满剩余高度（避免仍使用固定 panelHeight 导致底部留白） */
  const flexPanel = Boolean(fill && effectiveFill);

  useEffect(() => {
    setFields(jsonSchemaToFields(schema));
  }, [schema]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(LS.layout(storageKey), layoutMode);
    } catch {
      /* ignore */
    }
  }, [storageKey, layoutMode]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(LS.panelHeight(storageKey), String(panelHeight));
    } catch {
      /* ignore */
    }
  }, [storageKey, panelHeight]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(LS.splitRatio(storageKey), String(splitRatio));
    } catch {
      /* ignore */
    }
  }, [storageKey, splitRatio]);

  useEffect(() => {
    if (!storageKey || onFillPreferenceChange) return;
    try {
      localStorage.setItem(LS.fill(storageKey), effectiveFill ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [storageKey, effectiveFill, onFillPreferenceChange]);

  const syncFromFields = useCallback(
    (updated: SchemaField[]) => {
      setFields(updated);
      onChange?.(fieldsToJsonSchema(updated));
    },
    [onChange],
  );

  const updateRecursive = (list: SchemaField[], id: string, patch: Partial<SchemaField>): SchemaField[] =>
    list.map((f) => (f.id === id ? { ...f, ...patch } : f.children ? { ...f, children: updateRecursive(f.children, id, patch) } : f));

  const removeRecursive = (list: SchemaField[], id: string): SchemaField[] =>
    list.filter((f) => f.id !== id).map((f) => (f.children ? { ...f, children: removeRecursive(f.children, id) } : f));

  const addChildTo = (list: SchemaField[], parentId: string): SchemaField[] =>
    list.map((f) => {
      if (f.id === parentId)
        return {
          ...f,
          children: [...(f.children || []), { id: newId(), name: '', type: 'string' as JsonSchemaFieldType, required: false, description: '' }],
        };
      if (f.children) return { ...f, children: addChildTo(f.children, parentId) };
      return f;
    });

  const fieldCount = (list: SchemaField[]): number =>
    list.reduce((n, f) => n + 1 + (f.children ? fieldCount(f.children) : 0), 0);

  const setMode = (m: JsonSchemaLayoutMode) => {
    if ((m === 'visual' || m === 'split') && layoutMode === 'json') {
      setFields(jsonSchemaToFields(schema));
    }
    setLayoutMode(m);
  };

  const onPointerDownResize = (e: React.PointerEvent) => {
    e.preventDefault();
    dragRef.current = { startY: e.clientY, startH: panelHeight };
    const onMove = (ev: PointerEvent) => {
      if (!dragRef.current) return;
      const dy = ev.clientY - dragRef.current.startY;
      const next = Math.min(1200, Math.max(200, dragRef.current.startH + dy));
      setPanelHeight(next);
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const onPointerDownSplit = (e: React.PointerEvent) => {
    const row = (e.currentTarget as HTMLElement).closest('[data-split-row]') as HTMLElement | null;
    if (!row) return;
    const w = row.getBoundingClientRect().width;
    splitDragRef.current = { startX: e.clientX, startRatio: splitRatio, width: w };
    const onMove = (ev: PointerEvent) => {
      if (!splitDragRef.current) return;
      const dx = ev.clientX - splitDragRef.current.startX;
      const deltaPct = (dx / splitDragRef.current.width) * 100;
      const next = Math.min(85, Math.max(15, splitDragRef.current.startRatio + deltaPct));
      setSplitRatio(next);
    };
    const onUp = () => {
      splitDragRef.current = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen]);

  const visualScrollStyle: CSSProperties = flexPanel
    ? { flex: 1, minHeight: 0, overflow: 'auto' as const }
    : {
        maxHeight: panelHeight,
        height: effectiveFill ? panelHeight : undefined,
      };

  const jsonWrapClass = 'min-h-0 flex flex-1 flex-col overflow-hidden rounded border border-idpxyz-border';

  const renderVisual = (inSplit: boolean) => (
    <div
      className={cn(
        (inSplit || flexPanel) && 'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden',
      )}
    >
      {fields.length === 0 ? (
        <p className="border border-dashed border-idpxyz-border py-3 text-center text-[11px] text-idpxyz-textMuted">
          {readOnly ? 'No schema fields defined.' : 'No fields defined. Click "Add Field".'}
        </p>
      ) : (
        <div
          className={cn(
            'overflow-auto rounded border border-idpxyz-border bg-idpxyz-sidebar/30 p-1.5',
            inSplit && 'min-h-0 flex-1',
          )}
          style={visualScrollStyle}
        >
          {fields.map((f) => (
            <FieldNode
              key={f.id}
              field={f}
              depth={0}
              siblings={fields}
              readOnly={readOnly}
              onUpdate={(id, patch) => syncFromFields(updateRecursive(fields, id, patch))}
              onRemove={(id) => syncFromFields(removeRecursive(fields, id))}
              onAddChild={(pid) => syncFromFields(addChildTo(fields, pid))}
            />
          ))}
        </div>
      )}
      {!readOnly ? (
        <button
          type="button"
          onClick={() => syncFromFields([...fields, { id: newId(), name: '', type: 'string', required: false, description: '' }])}
          className="mt-1 flex w-full items-center justify-center gap-1 rounded border border-dashed border-idpxyz-border py-1 text-[10px] text-idpxyz-textMuted hover:text-idpxyz-text bg-transparent cursor-pointer"
        >
          <Plus size={10} /> Add Field
        </button>
      ) : null}
    </div>
  );

  const renderEditorBody = (opts: { fullscreenInner?: boolean }) => {
    const fh = opts.fullscreenInner;
    const fixedPanelStyle: CSSProperties = { height: panelHeight, minHeight: 200 };
    const flexPanelStyle: CSSProperties = {
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
    };
    const boxStyle: CSSProperties = fh ? { minHeight: 0, flex: 1 } : flexPanel && !fh ? flexPanelStyle : fixedPanelStyle;

    if (!jsonEditor) {
      return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden" style={fh ? { flex: 1, minHeight: 0 } : undefined}>
          {renderVisual(false)}
        </div>
      );
    }

    if (layoutMode === 'json') {
      return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden" style={boxStyle}>
          <div
            className={jsonWrapClass}
            style={
              fh
                ? { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }
                : flexPanel
                  ? { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }
                  : { height: '100%', minHeight: panelHeight }
            }
          >
            {jsonEditor}
          </div>
        </div>
      );
    }

    if (layoutMode === 'split') {
      return (
        <div
          data-split-row
          className="flex min-h-0 min-w-0 flex-1 gap-0 overflow-hidden"
          style={fh ? { flex: 1, minHeight: 0 } : flexPanel ? flexPanelStyle : fixedPanelStyle}
        >
          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden" style={{ width: `${splitRatio}%` }}>
            <div
              className="min-h-0 flex-1 overflow-auto rounded border border-idpxyz-border bg-idpxyz-sidebar/30 p-1.5"
              style={fh ? { maxHeight: '100%' } : flexPanel ? { flex: 1, minHeight: 0, overflow: 'auto' } : visualScrollStyle}
            >
              {fields.length === 0 ? (
                <p className="py-2 text-center text-[10px] text-idpxyz-textMuted">No fields</p>
              ) : (
                fields.map((f) => (
                  <FieldNode
                    key={f.id}
                    field={f}
                    depth={0}
                    siblings={fields}
                    readOnly={readOnly}
                    onUpdate={(id, patch) => syncFromFields(updateRecursive(fields, id, patch))}
                    onRemove={(id) => syncFromFields(removeRecursive(fields, id))}
                    onAddChild={(pid) => syncFromFields(addChildTo(fields, pid))}
                  />
                ))
              )}
            </div>
            {!readOnly ? (
              <button
                type="button"
                onClick={() => syncFromFields([...fields, { id: newId(), name: '', type: 'string', required: false, description: '' }])}
                className="mt-1 flex shrink-0 items-center justify-center gap-1 rounded border border-dashed border-idpxyz-border py-0.5 text-[10px] text-idpxyz-textMuted"
              >
                <Plus size={10} /> Add
              </button>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Resize split"
            className="w-2 shrink-0 cursor-col-resize touch-none border-0 bg-idpxyz-border/40 hover:bg-idpxyz-accent/50"
            onPointerDown={onPointerDownSplit}
          />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden" style={{ width: `${100 - splitRatio}%` }}>
            <div className={cn(jsonWrapClass, 'h-full min-h-0')} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              {jsonEditor}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={cn('flex min-h-0 flex-col overflow-hidden', fh && 'min-h-0 flex-1', flexPanel && !fh && 'min-h-0 flex-1')}
        style={fh ? { flex: 1, minHeight: 0 } : boxStyle}
      >
        {renderVisual(false)}
      </div>
    );
  };

  const toolbar = (opts: { showFullscreen: boolean }) => (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-[11px] font-medium text-idpxyz-textMuted">
        {label}
        {fields.length > 0 ? (
          <span className="ml-1 text-[9px] text-idpxyz-textMuted/60">({fieldCount(fields)} fields)</span>
        ) : null}
      </span>
      <div className="flex flex-wrap items-center gap-1">
        {!readOnly && jsonEditor ? (
          <>
            <button
              type="button"
              onClick={() => setMode('visual')}
              className={cn(
                'flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] cursor-pointer',
                layoutMode === 'visual'
                  ? 'border-idpxyz-accent bg-idpxyz-accent/10 text-idpxyz-accent'
                  : 'border-idpxyz-border text-idpxyz-textMuted hover:text-idpxyz-text',
              )}
            >
              <LayoutList size={10} /> Visual
            </button>
            <button
              type="button"
              onClick={() => setMode('json')}
              className={cn(
                'flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] cursor-pointer',
                layoutMode === 'json'
                  ? 'border-idpxyz-accent bg-idpxyz-accent/10 text-idpxyz-accent'
                  : 'border-idpxyz-border text-idpxyz-textMuted hover:text-idpxyz-text',
              )}
            >
              <Code2 size={10} /> JSON
            </button>
            <button
              type="button"
              onClick={() => setMode('split')}
              className={cn(
                'flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] cursor-pointer',
                layoutMode === 'split'
                  ? 'border-idpxyz-accent bg-idpxyz-accent/10 text-idpxyz-accent'
                  : 'border-idpxyz-border text-idpxyz-textMuted hover:text-idpxyz-text',
              )}
            >
              <Columns2 size={10} /> Split
            </button>
          </>
        ) : null}
        {opts.showFullscreen && jsonEditor ? (
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            className="flex items-center gap-1 rounded border border-idpxyz-border px-2 py-0.5 text-[10px] text-idpxyz-textMuted hover:text-idpxyz-text cursor-pointer"
            title="Fullscreen editor"
          >
            <Maximize2 size={10} /> Fullscreen
          </button>
        ) : null}
        {storageKey && onFillPreferenceChange ? (
          <label className="flex cursor-pointer items-center gap-1 text-[10px] text-idpxyz-textMuted">
            <input
              type="checkbox"
              checked={effectiveFill}
              onChange={(e) => {
                const v = e.target.checked;
                onFillPreferenceChange(v);
                try {
                  localStorage.setItem(LS.fill(storageKey), v ? '1' : '0');
                } catch {
                  /* ignore */
                }
              }}
              className="rounded border-idpxyz-border"
            />
            Fill panel
          </label>
        ) : null}
      </div>
    </div>
  );

  const rootCls = cn(
    'space-y-2',
    fill && 'flex min-h-0 flex-1 flex-col overflow-hidden',
    rootClassName,
    className,
  );

  const mainContent = (
    <div className={cn(fill && 'flex min-h-0 flex-1 flex-col overflow-hidden')}>
      {toolbar({ showFullscreen: true })}
        <div className={cn('flex min-h-0 flex-1 flex-col gap-1', fill && 'min-h-0 flex-1')}>
        <div className={cn(fill && 'flex min-h-0 flex-1 flex-col overflow-hidden')}>{renderEditorBody({ fullscreenInner: false })}</div>
        {!flexPanel ? <HorizontalResizeHandle onResizeStart={onPointerDownResize} /> : null}
      </div>
    </div>
  );

  const fullscreenPortal =
    fullscreen && jsonEditor && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="fixed inset-0 z-[400] flex flex-col bg-black/70 p-3 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-idpxyz-border bg-idpxyz-sidebar shadow-xl">
              <div className="flex shrink-0 items-center justify-between gap-2 border-b border-idpxyz-border px-3 py-2">
                <span className="text-[12px] font-semibold text-idpxyz-textBright">{label}</span>
                <button
                  type="button"
                  onClick={() => setFullscreen(false)}
                  className="flex items-center gap-1 rounded border border-idpxyz-border px-2 py-1 text-[11px] text-idpxyz-textMuted hover:text-idpxyz-text"
                >
                  <Minimize2 size={12} /> Exit
                </button>
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-3">
                {toolbar({ showFullscreen: false })}
                <div className="min-h-0 flex-1 overflow-hidden">{renderEditorBody({ fullscreenInner: true })}</div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className={rootCls}>
      {mainContent}
      {fullscreenPortal}
    </div>
  );
}
