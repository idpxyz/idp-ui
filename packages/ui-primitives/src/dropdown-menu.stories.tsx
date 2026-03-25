import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu, MenuItem, MenuSeparator, MenuLabel } from './dropdown-menu';
import { Button } from './button';
import { Settings, User, LogOut, Plus } from 'lucide-react';

const meta: Meta = { title: 'Primitives/DropdownMenu' };
export default meta;

export const Basic: StoryObj = {
  render: () => (
    <DropdownMenu trigger={<Button>Actions</Button>}>
      <MenuLabel>Account</MenuLabel>
      <MenuItem><User size={14} /> Profile</MenuItem>
      <MenuItem><Settings size={14} /> Settings</MenuItem>
      <MenuSeparator />
      <MenuItem><Plus size={14} /> New Integration</MenuItem>
      <MenuSeparator />
      <MenuItem destructive><LogOut size={14} /> Sign Out</MenuItem>
    </DropdownMenu>
  ),
};
