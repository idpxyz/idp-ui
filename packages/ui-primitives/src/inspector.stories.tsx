import type { Meta, StoryObj } from '@storybook/react';
import { MapPin, Box, Ruler, Navigation } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';
import {
  InspectorShell,
  InspectorHeader,
  InspectorBody,
  InspectorSection,
  InspectorRow,
  InspectorActions,
  InspectorIdentity,
} from './inspector';

const meta: Meta = { title: 'Primitives/Inspector' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ width: 280, height: 500, border: '1px solid var(--idpxyz-border)' }}>
      <InspectorShell>
        <InspectorHeader
          icon={<MapPin size={12} className="text-idpxyz-accent" />}
          title="Location Properties"
          onClose={() => {}}
        />
        <InspectorBody>
          <InspectorIdentity
            title="LOC-A01-B02-L03"
            badges={
              <>
                <Badge variant="info" className="text-[8px]">RACK</Badge>
                <Badge variant="success" className="text-[8px]">ACTIVE</Badge>
              </>
            }
          />

          <InspectorSection title="Basic Info" icon={<Box size={10} />}>
            <InspectorRow label="Type" value="RACK" />
            <InspectorRow label="Status" value={<Badge variant="outline" className="text-[8px]">ACTIVE</Badge>} />
            <InspectorRow label="ABC" value={<Badge variant="outline" className="text-[8px]">A</Badge>} />
          </InspectorSection>

          <InspectorSection title="Topology" icon={<Navigation size={10} />}>
            <InspectorRow label="Facility" value="DC-SH" mono accent />
            <InspectorRow label="Zone" value="ZONE-A" mono accent />
            <InspectorRow label="Aisle" value="A01" mono accent />
            <InspectorRow label="Bay" value="B02" mono accent />
            <InspectorRow label="Level" value="L03" mono accent />
          </InspectorSection>

          <InspectorSection title="Profiles" icon={<Ruler size={10} />}>
            <InspectorRow label="Capacity" value="CAP-STD" mono accent />
            <InspectorRow label="Constraint" value="CON-STD" mono accent />
          </InspectorSection>

          <InspectorSection title="System" defaultOpen={false}>
            <InspectorRow label="Version" value="v3" mono />
            <InspectorRow label="Created" value="2025-01-15 10:30" />
            <InspectorRow label="Updated" value="2025-03-22 14:15" />
          </InspectorSection>

          <InspectorActions>
            <Button variant="outline" size="sm" className="flex-1 h-6 text-[10px]">Quick Edit</Button>
            <Button variant="outline" size="sm" className="flex-1 h-6 text-[10px]">Full Edit</Button>
          </InspectorActions>
        </InspectorBody>
      </InspectorShell>
    </div>
  ),
};

export const WithSubtitle: StoryObj = {
  render: () => (
    <div style={{ width: 280, height: 300, border: '1px solid var(--idpxyz-border)' }}>
      <InspectorShell>
        <InspectorHeader title="Facility Properties" onClose={() => {}} />
        <InspectorBody>
          <InspectorIdentity
            title="Shanghai Distribution Center"
            subtitle="DC-SH"
            badges={<Badge variant="success" className="text-[8px]">ACTIVE</Badge>}
          />

          <InspectorSection title="Details">
            <InspectorRow label="Type" value="DC" />
            <InspectorRow label="Timezone" value="Asia/Shanghai" />
            <InspectorRow label="Zones" value="5" mono />
          </InspectorSection>
        </InspectorBody>
      </InspectorShell>
    </div>
  ),
};
