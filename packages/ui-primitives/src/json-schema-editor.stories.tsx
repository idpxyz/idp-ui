import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JsonSchemaEditor } from './json-schema-editor';

const meta: Meta = {
  title: 'Primitives/JsonSchemaEditor',
  parameters: {
    docs: {
      description: {
        component: `
Professional JSON Schema visual editor with recursive tree.

**Features:**
- Nested object/array with collapsible tree
- Field validation (duplicate names highlighted in red, empty names in yellow)
- Advanced schema properties (⚙️ gear icon): format, pattern, minLength, maxLength, minimum, maximum, enum, default
- ReadOnly mode for viewing
- Dual mode: Visual tree + JSON editor slot (\`jsonEditor\` prop)
- Field count with nested total

**Usage:**
\`\`\`tsx
<JsonSchemaEditor
  schema={schemaObject}
  onChange={handleChange}
  jsonEditor={<MonacoEditor ... />}
/>
\`\`\`
`,
      },
    },
  },
};
export default meta;

const orderSchema = {
  type: 'object',
  properties: {
    order_id: { type: 'string', description: 'Order reference number', minLength: 1 },
    order_date: { type: 'string', format: 'date-time', description: 'Order creation timestamp' },
    status: { type: 'string', enum: ['new', 'confirmed', 'shipped', 'delivered'] },
    priority: { type: 'integer', minimum: 1, maximum: 5, default: 3 },
    customer: {
      type: 'object',
      properties: {
        customer_id: { type: 'string' },
        name: { type: 'string', maxLength: 200 },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string', pattern: '^\\+?[0-9\\-]+$' },
      },
    },
    shipping_address: {
      type: 'object',
      properties: {
        line1: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        postal_code: { type: 'string' },
        country: { type: 'string', minLength: 2, maxLength: 2 },
      },
    },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          sku: { type: 'string' },
          description: { type: 'string' },
          quantity: { type: 'integer', minimum: 1 },
          unit_price: { type: 'number', minimum: 0 },
        },
      },
    },
    total_amount: { type: 'number', minimum: 0, description: 'Order total' },
    currency: { type: 'string', minLength: 3, maxLength: 3, default: 'USD' },
  },
  required: ['order_id', 'order_date', 'status', 'customer', 'items', 'total_amount', 'currency'],
};

export const Default: StoryObj = {
  name: 'Editable (Full Schema)',
  render: function Demo() {
    const [schema, setSchema] = useState<Record<string, unknown>>(orderSchema);
    return (
      <div className="max-w-2xl p-4 space-y-4">
        <JsonSchemaEditor schema={schema} onChange={setSchema} />
        <details>
          <summary className="text-[11px] text-idpxyz-textMuted cursor-pointer">Show JSON output</summary>
          <pre className="mt-2 p-3 bg-idpxyz-sidebar rounded text-[10px] font-mono text-idpxyz-textMuted overflow-auto max-h-[200px]">
            {JSON.stringify(schema, null, 2)}
          </pre>
        </details>
      </div>
    );
  },
};

export const ReadOnly: StoryObj = {
  name: 'ReadOnly Mode',
  render: function Demo() {
    return (
      <div className="max-w-2xl p-4">
        <JsonSchemaEditor schema={orderSchema} readOnly label="Contract Schema (read-only)" />
      </div>
    );
  },
};

export const WithJsonEditor: StoryObj = {
  name: 'With JSON Editor',
  render: function Demo() {
    const [schema, setSchema] = useState<Record<string, unknown>>(orderSchema);
    const [jsonText, setJsonText] = useState(JSON.stringify(orderSchema, null, 2));
    const [jsonError, setJsonError] = useState<string | null>(null);

    return (
      <div className="max-w-2xl p-4">
        <JsonSchemaEditor
          schema={schema}
          onChange={(s) => { setSchema(s); setJsonText(JSON.stringify(s, null, 2)); }}
          jsonEditor={
            <div>
              <textarea
                className="w-full px-3 py-2 text-[11px] font-mono bg-idpxyz-sidebar border border-idpxyz-border rounded text-idpxyz-text resize-none outline-none focus:border-idpxyz-accent"
                rows={14} value={jsonText} spellCheck={false}
                onChange={(e) => {
                  setJsonText(e.target.value); setJsonError(null);
                  try { setSchema(JSON.parse(e.target.value)); } catch (err) { setJsonError((err as Error).message); }
                }}
              />
              {jsonError ? <p className="text-[10px] text-red-400 mt-1">{jsonError}</p> : null}
            </div>
          }
        />
      </div>
    );
  },
};

export const Empty: StoryObj = {
  name: 'Empty Schema',
  render: function Demo() {
    const [schema, setSchema] = useState<Record<string, unknown>>({});
    return (
      <div className="max-w-xl p-4">
        <JsonSchemaEditor schema={schema} onChange={setSchema} />
      </div>
    );
  },
};

export const FlatSchema: StoryObj = {
  name: 'Flat Schema (No Nesting)',
  render: function Demo() {
    const flat = {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        age: { type: 'integer', minimum: 0, maximum: 150 },
        email: { type: 'string', format: 'email' },
        active: { type: 'boolean', default: true },
        role: { type: 'string', enum: ['admin', 'editor', 'viewer'] },
      },
      required: ['name', 'email'],
    };
    const [schema, setSchema] = useState<Record<string, unknown>>(flat);
    return (
      <div className="max-w-xl p-4">
        <JsonSchemaEditor schema={schema} onChange={setSchema} />
      </div>
    );
  },
};

export const ValidationDemo: StoryObj = {
  name: 'Validation (Duplicate Names)',
  render: function Demo() {
    const duplicateSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
      },
      required: ['name'],
    };
    const [schema, setSchema] = useState<Record<string, unknown>>(duplicateSchema);
    return (
      <div className="max-w-xl p-4">
        <p className="text-[11px] text-idpxyz-textMuted mb-2">Try adding a field with the same name as an existing one to see validation.</p>
        <JsonSchemaEditor schema={schema} onChange={setSchema} />
      </div>
    );
  },
};
