import type { Meta, StoryObj } from '@storybook/react';
import * as SystemIcons from './system';
import * as DomainIcons from './domain';
import * as StatusIcons from './status';

const meta: Meta = { title: 'Icons/Gallery' };
export default meta;

function IconGrid({ icons, title }: { icons: Record<string, React.ComponentType<{ size?: number; className?: string }>>; title: string }) {
  const entries = Object.entries(icons).filter(([, v]) => typeof v === 'function' && v.name !== 'resolveStatusIcon');
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 12 }}>{title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 80px)', gap: 8 }}>
        {entries.map(([name, Icon]) => (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: 8, borderRadius: 6, background: '#2d2d2d', cursor: 'default' }}>
            <Icon size={20} className="text-vscode-textMuted" />
            <span style={{ fontSize: 9, color: '#858585', textAlign: 'center', wordBreak: 'break-all' }}>{name.replace('Icon', '')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const AllIcons: StoryObj = {
  render: () => (
    <div>
      <IconGrid icons={SystemIcons as any} title="System Icons" />
      <IconGrid icons={DomainIcons as any} title="Domain Icons" />
      <IconGrid icons={StatusIcons as any} title="Status Icons" />
    </div>
  ),
};
