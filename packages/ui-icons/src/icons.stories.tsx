import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  IconDashboard, IconSearch, IconSettings, IconMenu, IconMaximize, IconMinimize,
  IconClose, IconPlus, IconEdit, IconTrash, IconCopy, IconSave, IconRefresh,
  IconFilter, IconSortAsc, IconArrowRight, IconArrowLeft,
  IconChevronRight, IconChevronDown, IconCheck,
  IconEye, IconBell, IconUser, IconLock, IconStar, IconTag,
  IconClock, IconHistory, IconDatabase, IconFolder, IconBookmark,
} from './system';
import {
  IconShipment, IconPackage, IconReturn, IconBilling,
  IconAutomation, IconCatalog, IconOrder, IconWarehouse,
  IconActivity, IconChart,
  IconContainer, IconVessel, IconAirFreight, IconPort, IconFactory,
  IconDistributionCenter, IconWeight, IconTemperature,
  IconBillOfLading, IconInvoice, IconPickingList, IconPackingList,
  IconVendor, IconSupplier, IconSupplyNetwork, IconEDI,
  IconWorkflow, IconProcurement, IconCompliance, IconQualityControl,
  IconMilestone, IconDemandForecast, IconLayers,
} from './domain';
import {
  IconSuccess, IconError, IconWarning, IconInfo, IconPending, IconLoading,
  IconBlocked, IconCritical, IconActive, IconPaused,
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
      <IconCell Icon={IconTrash} name="Trash" />
      <IconCell Icon={IconCopy} name="Copy" />
      <IconCell Icon={IconSave} name="Save" />
      <IconCell Icon={IconRefresh} name="Refresh" />
      <IconCell Icon={IconFilter} name="Filter" />
      <IconCell Icon={IconSortAsc} name="SortAsc" />
      <IconCell Icon={IconArrowRight} name="ArrowRight" />
      <IconCell Icon={IconArrowLeft} name="ArrowLeft" />
      <IconCell Icon={IconChevronRight} name="ChevronRight" />
      <IconCell Icon={IconChevronDown} name="ChevronDown" />
      <IconCell Icon={IconCheck} name="Check" />
      <IconCell Icon={IconEye} name="Eye" />
      <IconCell Icon={IconBell} name="Bell" />
      <IconCell Icon={IconUser} name="User" />
      <IconCell Icon={IconLock} name="Lock" />
      <IconCell Icon={IconStar} name="Star" />
      <IconCell Icon={IconTag} name="Tag" />
      <IconCell Icon={IconClock} name="Clock" />
      <IconCell Icon={IconHistory} name="History" />
      <IconCell Icon={IconDatabase} name="Database" />
      <IconCell Icon={IconFolder} name="Folder" />
      <IconCell Icon={IconBookmark} name="Bookmark" />
    </div>
  ),
};

export const DomainIcons: StoryObj = {
  render: () => (
    <div>
      <h4 style={{ fontSize: 12, color: '#858585', marginBottom: 8 }}>Commerce</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, color: '#ccc', marginBottom: 16 }}>
        <IconCell Icon={IconOrder} name="Order" />
        <IconCell Icon={IconPackage} name="Package" />
        <IconCell Icon={IconReturn} name="Return" />
        <IconCell Icon={IconBilling} name="Billing" />
        <IconCell Icon={IconCatalog} name="Catalog" />
        <IconCell Icon={IconInvoice} name="Invoice" />
      </div>
      <h4 style={{ fontSize: 12, color: '#858585', marginBottom: 8 }}>Logistics</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, color: '#ccc', marginBottom: 16 }}>
        <IconCell Icon={IconShipment} name="Shipment" />
        <IconCell Icon={IconContainer} name="Container" />
        <IconCell Icon={IconVessel} name="Vessel" />
        <IconCell Icon={IconAirFreight} name="AirFreight" />
        <IconCell Icon={IconPort} name="Port" />
        <IconCell Icon={IconWeight} name="Weight" />
        <IconCell Icon={IconTemperature} name="Temperature" />
        <IconCell Icon={IconMilestone} name="Milestone" />
      </div>
      <h4 style={{ fontSize: 12, color: '#858585', marginBottom: 8 }}>Supply Chain</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, color: '#ccc', marginBottom: 16 }}>
        <IconCell Icon={IconFactory} name="Factory" />
        <IconCell Icon={IconWarehouse} name="Warehouse" />
        <IconCell Icon={IconDistributionCenter} name="DistCenter" />
        <IconCell Icon={IconSupplier} name="Supplier" />
        <IconCell Icon={IconVendor} name="Vendor" />
        <IconCell Icon={IconSupplyNetwork} name="Network" />
        <IconCell Icon={IconProcurement} name="Procurement" />
        <IconCell Icon={IconDemandForecast} name="Forecast" />
        <IconCell Icon={IconLayers} name="Layers" />
      </div>
      <h4 style={{ fontSize: 12, color: '#858585', marginBottom: 8 }}>Documents & Compliance</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, color: '#ccc', marginBottom: 16 }}>
        <IconCell Icon={IconBillOfLading} name="BillOfLading" />
        <IconCell Icon={IconPickingList} name="PickingList" />
        <IconCell Icon={IconPackingList} name="PackingList" />
        <IconCell Icon={IconCompliance} name="Compliance" />
        <IconCell Icon={IconQualityControl} name="QC" />
        <IconCell Icon={IconEDI} name="EDI" />
      </div>
      <h4 style={{ fontSize: 12, color: '#858585', marginBottom: 8 }}>Operations</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, color: '#ccc' }}>
        <IconCell Icon={IconActivity} name="Activity" />
        <IconCell Icon={IconAutomation} name="Automation" />
        <IconCell Icon={IconWorkflow} name="Workflow" />
        <IconCell Icon={IconChart} name="Chart" />
      </div>
    </div>
  ),
};

export const StatusIcons: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, color: '#ccc' }}>
      <IconCell Icon={IconSuccess} name="Success" />
      <IconCell Icon={IconError} name="Error" />
      <IconCell Icon={IconWarning} name="Warning" />
      <IconCell Icon={IconInfo} name="Info" />
      <IconCell Icon={IconPending} name="Pending" />
      <IconCell Icon={IconLoading} name="Loading" />
      <IconCell Icon={IconBlocked} name="Blocked" />
      <IconCell Icon={IconCritical} name="Critical" />
      <IconCell Icon={IconActive} name="Active" />
      <IconCell Icon={IconPaused} name="Paused" />
    </div>
  ),
};
