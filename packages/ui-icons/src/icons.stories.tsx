import type { Meta, StoryObj } from '@storybook/react';
import {
  IconDashboard, IconSearch, IconSettings, IconMenu, IconMaximize, IconMinimize,
  IconClose, IconPlus, IconEdit, IconDelete, IconCopy, IconSave, IconRefresh,
  IconFilter, IconSort, IconArrowUp, IconArrowDown, IconArrowRight, IconArrowLeft,
  IconChevronRight, IconChevronDown, IconCheck, IconX, IconInfo, IconWarning,
  IconActivity, IconEye, IconBell, IconUser, IconLock, IconUnlock,
} from './system';
import {
  IconShipment, IconPackage, IconReturn, IconLayers, IconBilling,
  IconAutomation, IconMessage, IconFileText, IconCatalog, IconShield,
} from './domain';
import {
  IconSuccess, IconError, IconClock, IconPlay, IconPause,
} from './status';

const meta: Meta = { title: 'Icons/Gallery' };
export default meta;

const IconCell = ({ Icon, name }: { Icon: React.ComponentType<{ size?: number }>; name: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 12, borderRadius: 8, background: '#2d2d2d', minWidth: 80 }}>
    <Icon size={20} />
    <span style={{ fontSize: 10, color: '#858585', textAlign: 'center' }}>{name}</span>
  </div>
);

export const SystemIcons: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, color: '#ccc' }}>
      <IconCell Icon={IconDashboard} name="Dashboard" />
      <IconCell Icon={IconSearch} name="Search" />
      <IconCell Icon={IconSettings} name="Settings" />
      <IconCell Icon={IconMenu} name="Menu" />
      <IconCell Icon={IconMaximize} name="Maximize" />
      <IconCell Icon={IconMinimize} name="Minimize" />
      <IconCell Icon={IconClose} name="Close" />
      <IconCell Icon={IconPlus} name="Plus" />
      <IconCell Icon={IconEdit} name="Edit" />
      <IconCell Icon={IconDelete} name="Delete" />
      <IconCell Icon={IconCopy} name="Copy" />
      <IconCell Icon={IconSave} name="Save" />
      <IconCell Icon={IconRefresh} name="Refresh" />
      <IconCell Icon={IconFilter} name="Filter" />
      <IconCell Icon={IconSort} name="Sort" />
      <IconCell Icon={IconArrowUp} name="ArrowUp" />
      <IconCell Icon={IconArrowDown} name="ArrowDown" />
      <IconCell Icon={IconArrowRight} name="ArrowRight" />
      <IconCell Icon={IconArrowLeft} name="ArrowLeft" />
      <IconCell Icon={IconChevronRight} name="ChevronRight" />
      <IconCell Icon={IconChevronDown} name="ChevronDown" />
      <IconCell Icon={IconCheck} name="Check" />
      <IconCell Icon={IconX} name="X" />
      <IconCell Icon={IconInfo} name="Info" />
      <IconCell Icon={IconWarning} name="Warning" />
      <IconCell Icon={IconActivity} name="Activity" />
      <IconCell Icon={IconEye} name="Eye" />
      <IconCell Icon={IconBell} name="Bell" />
      <IconCell Icon={IconUser} name="User" />
      <IconCell Icon={IconLock} name="Lock" />
      <IconCell Icon={IconUnlock} name="Unlock" />
    </div>
  ),
};

export const DomainIcons: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, color: '#ccc' }}>
      <IconCell Icon={IconShipment} name="Shipment" />
      <IconCell Icon={IconPackage} name="Package" />
      <IconCell Icon={IconReturn} name="Return" />
      <IconCell Icon={IconLayers} name="Layers" />
      <IconCell Icon={IconBilling} name="Billing" />
      <IconCell Icon={IconAutomation} name="Automation" />
      <IconCell Icon={IconMessage} name="Message" />
      <IconCell Icon={IconFileText} name="FileText" />
      <IconCell Icon={IconCatalog} name="Catalog" />
      <IconCell Icon={IconShield} name="Shield" />
    </div>
  ),
};

export const StatusIcons: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, color: '#ccc' }}>
      <IconCell Icon={IconSuccess} name="Success" />
      <IconCell Icon={IconError} name="Error" />
      <IconCell Icon={IconClock} name="Clock" />
      <IconCell Icon={IconPlay} name="Play" />
      <IconCell Icon={IconPause} name="Pause" />
    </div>
  ),
};
