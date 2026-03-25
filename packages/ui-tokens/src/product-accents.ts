export const productAccent = {
  loms: {
    accent: '#007acc',
    subtle: 'rgba(0,122,204,0.20)',
    fg: '#ffffff',
  },
  prism: {
    accent: '#0891b2',
    subtle: 'rgba(8,145,178,0.18)',
    fg: '#ecfeff',
  },
  gatekeeper: {
    accent: '#6366f1',
    subtle: 'rgba(99,102,241,0.18)',
    fg: '#eef2ff',
  },
  rulemesh: {
    accent: '#7c3aed',
    subtle: 'rgba(124,58,237,0.18)',
    fg: '#f5f3ff',
  },
  ledgermesh: {
    accent: '#2563eb',
    subtle: 'rgba(37,99,235,0.18)',
    fg: '#eff6ff',
  },
  phi: {
    accent: '#ea580c',
    subtle: 'rgba(234,88,12,0.18)',
    fg: '#fff7ed',
  },
  sagapai: {
    accent: '#0369a1',
    subtle: 'rgba(3,105,161,0.18)',
    fg: '#f0f9ff',
  },
  oms: {
    accent: '#059669',
    subtle: 'rgba(5,150,105,0.18)',
    fg: '#ecfdf5',
  },
} as const;

export type ProductKey = keyof typeof productAccent;
