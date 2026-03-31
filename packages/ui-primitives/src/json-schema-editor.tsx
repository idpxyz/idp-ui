/**
 * JsonSchemaEditor — Professional JSON Schema visual editor with recursive tree.
 *
 * Features:
 * - Nested object/array with collapsible tree
 * - Field validation (duplicate names, empty names)
 * - Advanced schema properties (minLength, maxLength, minimum, maximum, pattern, default)
 * - ReadOnly mode for viewing
 * - Dual mode: Visual tree + JSON editor slot
 * - Type-specific constraint inputs
 */

import { useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { Plus, Trash2, ChevronRight, ChevronDown, Code2, LayoutList, Settings2, AlertCircle } from 'lucide-react';

import { NumberInput } from './number-input';

const SCHEMA_TYPES = ['string', 'number', 'integer', 'boolean', 'array', 'object'] as const;
export type JsonSchemaFieldType = typeof SCHEMA_TYPES[number];

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
function newId() { return `sf-${++_seq}-${Math.random().toString(36).slice(2, 6)}`; }

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
      try { prop.default = JSON.parse(f.defaultValue); } catch { prop.default = f.defaultValue; }
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
      id: newId(), name,
      type: (def.type as JsonSchemaFieldType) || 'string', required: req.has(name),
      description: (def.description as string) || '', format: (def.format as string) || '',
      enumValues: Array.isArray(def.enum) ? (def.enum as string[]).join(', ') : '',
      pattern: (def.pattern as string) || '',
      defaultValue: def.default != null ? (typeof def.default === 'string' ? def.default : JSON.stringify(def.default)) : '',
      minLength: (def.minLength as number) ?? undefined,
      maxLength: (def.maxLength as number) ?? undefined,
      minimum: (def.minimum as number) ?? undefined,
      maximum: (def.maximum as number) ?? undefined,
    };
    if (def.type === 'object' && def.properties) field.children = jsonSchemaToFields(def as Record<string, unknown>);
    if (def.type === 'array' && def.items && (def.items as Record<string, unknown>).properties) field.children = jsonSchemaToFields(def.items as Record<string, unknown>);
    return field;
  });
}

function getSiblingNames(fields: SchemaField[], excludeId: string): Set<string> {
  return new Set(fields.filter((f) => f.id !== excludeId && f.name.trim()).map((f) => f.name.trim()));
}

function FieldNode({ field, depth, siblings, readOnly, onUpdate, onRemove, onAddChild }: {
  field: SchemaField; depth: number; siblings: SchemaField[];
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
            <button type="button" onClick={() => setCollapsed(!collapsed)} className="text-idpxyz-textMuted hover:text-idpxyz-text p-0 border-0 bg-transparent cursor-pointer">
              {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
            </button>
          ) : <span className="w-1.5 h-1.5 rounded-full bg-idpxyz-border inline-block" />}
        </span>
        <div className="flex flex-1 min-w-[min(100%,12rem)] items-center gap-1.5 basis-[min(100%,14rem)] sm:basis-auto sm:min-w-[10rem]">
          <input className={`h-7 px-2 text-[11px] font-mono bg-idpxyz-inputBg border rounded text-idpxyz-text outline-none focus:border-idpxyz-accent w-full min-w-0 ${isDuplicate ? 'border-red-400' : isEmpty ? 'border-yellow-400/50' : 'border-idpxyz-border'}`}
            placeholder="field" value={field.name} readOnly={readOnly}
            onChange={(e) => onUpdate(field.id, { name: e.target.value.replace(/\s/g, '_') })} />
          {isDuplicate ? <span title="Duplicate field name"><AlertCircle size={12} className="text-red-400 shrink-0" /></span> : null}
        </div>
        <select className="h-7 shrink-0 w-[7.25rem] min-w-[7.25rem] px-2 text-[11px] bg-idpxyz-inputBg border border-idpxyz-border rounded text-idpxyz-text outline-none cursor-pointer"
          value={field.type} disabled={readOnly}
          onChange={(e) => onUpdate(field.id, { type: e.target.value as JsonSchemaFieldType })}>
          {SCHEMA_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <label className="flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap">
          <input type="checkbox" checked={field.required} disabled={readOnly}
            onChange={(e) => onUpdate(field.id, { required: e.target.checked })}
            className="w-3.5 h-3.5 rounded border-idpxyz-border accent-[var(--idpxyz-accent)]" />
          <span className="text-[10px] text-idpxyz-textMuted">req</span>
        </label>
        {!readOnly && (
          <span className="inline-flex items-center gap-1.5 shrink-0">
            <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className={`p-1 rounded border-0 bg-transparent cursor-pointer ${showAdvanced ? 'text-idpxyz-accent' : 'text-idpxyz-textMuted hover:text-idpxyz-text hover:bg-idpxyz-hover/50'}`} title="Advanced properties">
              <Settings2 size={12} />
            </button>
            {canHaveChildren ? (
              <button type="button" onClick={() => onAddChild(field.id)} className="p-1 text-idpxyz-textMuted hover:text-idpxyz-accent border-0 bg-transparent cursor-pointer rounded hover:bg-idpxyz-hover/50" title="Add child">
                <Plus size={12} />
              </button>
            ) : null}
            <button type="button" onClick={() => onRemove(field.id)} className="p-1 text-red-400/60 hover:text-red-400 border-0 bg-transparent cursor-pointer rounded hover:bg-red-500/10" title="Remove field">
              <Trash2 size={12} />
            </button>
          </span>
        )}
      </div>
      {field.description && !showAdvanced ? (
        <div className="text-[10px] text-idpxyz-textMuted/90 pl-1 pb-0.5 truncate" style={{ paddingLeft: depth * 16 + 24 }} title={field.description}>
          {field.description}
        </div>
      ) : null}

      {showAdvanced && !readOnly ? (
        <div
          className="ml-5 mb-1 space-y-1.5 rounded-md border border-[color:var(--idpxyz-panelBorder,var(--idpxyz-border))] bg-idpxyz-inputBg/25 p-2"
          style={{ marginLeft: depth * 16 + 20 }}
        >
          <input className="w-full h-6 px-1.5 text-[10px] bg-idpxyz-inputBg border border-idpxyz-border rounded text-idpxyz-text outline-none focus:border-idpxyz-accent"
            placeholder="Description" value={field.description} onChange={(e) => onUpdate(field.id, { description: e.target.value })} />
          <div className="grid grid-cols-2 gap-1.5">
            {field.type === 'string' ? (
              <>
                <input className="h-5 px-1.5 text-[9px] font-mono bg-idpxyz-inputBg border border-idpxyz-border rounded text-idpxyz-text outline-none"
                  placeholder="format: date-time, email..." value={field.format || ''} onChange={(e) => onUpdate(field.id, { format: e.target.value })} />
                <input className="h-5 px-1.5 text-[9px] font-mono bg-idpxyz-inputBg border border-idpxyz-border rounded text-idpxyz-text outline-none"
                  placeholder="pattern (regex)" value={field.pattern || ''} onChange={(e) => onUpdate(field.id, { pattern: e.target.value })} />
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
            {(field.type === 'number' || field.type === 'integer') ? (
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
            <input className="h-5 px-1.5 text-[9px] font-mono bg-idpxyz-inputBg border border-idpxyz-border rounded text-idpxyz-text outline-none col-span-2"
              placeholder="enum: val1, val2, val3" value={field.enumValues || ''} onChange={(e) => onUpdate(field.id, { enumValues: e.target.value })} />
            <input className="h-5 px-1.5 text-[9px] font-mono bg-idpxyz-inputBg border border-idpxyz-border rounded text-idpxyz-text outline-none col-span-2"
              placeholder="default value" value={field.defaultValue || ''} onChange={(e) => onUpdate(field.id, { defaultValue: e.target.value })} />
          </div>
        </div>
      ) : null}
      </div>

      {hasChildren && !collapsed ? (
        field.children!.map((child) => (
          <FieldNode key={child.id} field={child} depth={depth + 1} siblings={field.children!} readOnly={readOnly}
            onUpdate={onUpdate} onRemove={onRemove} onAddChild={onAddChild} />
        ))
      ) : null}
    </div>
  );
}

export interface JsonSchemaEditorProps {
  schema: Record<string, unknown>;
  onChange?: (schema: Record<string, unknown>) => void;
  maxHeight?: number;
  readOnly?: boolean;
  jsonEditor?: ReactNode;
  label?: string;
}

export function JsonSchemaEditor({ schema, onChange, maxHeight = 320, readOnly = false, jsonEditor, label = 'Schema Definition' }: JsonSchemaEditorProps) {
  const [mode, setMode] = useState<'visual' | 'json'>('visual');
  const [fields, setFields] = useState<SchemaField[]>(() => jsonSchemaToFields(schema));

  const syncFromFields = useCallback((updated: SchemaField[]) => {
    setFields(updated);
    onChange?.(fieldsToJsonSchema(updated));
  }, [onChange]);

  const updateRecursive = (list: SchemaField[], id: string, patch: Partial<SchemaField>): SchemaField[] =>
    list.map((f) => f.id === id ? { ...f, ...patch } : f.children ? { ...f, children: updateRecursive(f.children, id, patch) } : f);

  const removeRecursive = (list: SchemaField[], id: string): SchemaField[] =>
    list.filter((f) => f.id !== id).map((f) => f.children ? { ...f, children: removeRecursive(f.children, id) } : f);

  const addChildTo = (list: SchemaField[], parentId: string): SchemaField[] =>
    list.map((f) => {
      if (f.id === parentId) return { ...f, children: [...(f.children || []), { id: newId(), name: '', type: 'string' as JsonSchemaFieldType, required: false, description: '' }] };
      if (f.children) return { ...f, children: addChildTo(f.children, parentId) };
      return f;
    });

  const fieldCount = (list: SchemaField[]): number => list.reduce((n, f) => n + 1 + (f.children ? fieldCount(f.children) : 0), 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-idpxyz-textMuted">
          {label}
          {fields.length > 0 ? <span className="ml-1 text-[9px] text-idpxyz-textMuted/60">({fieldCount(fields)} fields)</span> : null}
        </span>
        {!readOnly && jsonEditor ? (
          <button type="button" onClick={() => {
            if (mode === 'visual') setMode('json');
            else { setFields(jsonSchemaToFields(schema)); setMode('visual'); }
          }} className="flex items-center gap-1 px-2 py-0.5 text-[10px] text-idpxyz-textMuted hover:text-idpxyz-text border border-idpxyz-border rounded bg-transparent cursor-pointer">
            {mode === 'visual' ? <><Code2 size={10} /> JSON</> : <><LayoutList size={10} /> Visual</>}
          </button>
        ) : null}
      </div>
      {mode === 'visual' ? (
        <div>
          {fields.length === 0 ? (
            <p className="text-[11px] text-idpxyz-textMuted py-3 text-center border border-dashed border-idpxyz-border rounded">
              {readOnly ? 'No schema fields defined.' : 'No fields defined. Click "Add Field".'}
            </p>
          ) : (
            <div style={{ maxHeight }} className="overflow-auto border border-idpxyz-border rounded p-1.5 bg-idpxyz-sidebar/30">
              {fields.map((f) => (
                <FieldNode key={f.id} field={f} depth={0} siblings={fields} readOnly={readOnly}
                  onUpdate={(id, patch) => syncFromFields(updateRecursive(fields, id, patch))}
                  onRemove={(id) => syncFromFields(removeRecursive(fields, id))}
                  onAddChild={(pid) => syncFromFields(addChildTo(fields, pid))}
                />
              ))}
            </div>
          )}
          {!readOnly ? (
            <button type="button" onClick={() => syncFromFields([...fields, { id: newId(), name: '', type: 'string', required: false, description: '' }])}
              className="w-full mt-1 flex items-center justify-center gap-1 py-1 text-[10px] text-idpxyz-textMuted hover:text-idpxyz-text border border-dashed border-idpxyz-border rounded bg-transparent cursor-pointer">
              <Plus size={10} /> Add Field
            </button>
          ) : null}
        </div>
      ) : jsonEditor ? (
        jsonEditor
      ) : (
        <p className="text-[11px] text-idpxyz-textMuted italic">Provide jsonEditor prop for JSON editing mode.</p>
      )}
    </div>
  );
}
