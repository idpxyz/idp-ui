import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  IconDashboard, IconSearch, IconSettings, IconMenu, IconMaximize, IconMinimize,
  IconClose, IconPlus, IconEdit, IconTrash, IconCopy, IconSave, IconRefresh,
  IconFilter, IconSortAsc, IconArrowRight, IconArrowLeft,
  IconChevronRight, IconChevronDown, IconCheck,
  IconEye, IconBell, IconUser, IconLock, IconStar, IconTag,
  IconClock, IconHistory, IconDatabase, IconFolder, IconBookmark,
  IconUndo, IconRedo, IconZoomIn, IconZoomOut, IconFullscreen,
  IconShare, IconPrint, IconNotification,
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
  IconPackageOpen, IconPackageDamaged, IconReceiveGoods, IconDispatchGoods,
  IconPutaway, IconPickup, IconReplenishment, IconCycleCount,
  IconStockAdjustment, IconRacking, IconBinLocation,
  IconConsolidation, IconStockLookup, IconLabelPrint,
  IconCrossDock, IconStaging, IconDamagedGoods,
  IconInventory, IconBox, IconScan, IconBarcode, IconPackageCheck,
  IconLedger, IconWallet, IconBank, IconSettlement, IconReconciliation,
  IconCharge, IconPayout, IconDiscount, IconCoins, IconFinancialReport,
  IconAuditCheck, IconIncentive, IconVariance, IconDebitCredit, IconPaymentVerified,
  IconWavePlanning, IconZoneManagement, IconDockManagement,
  IconLaborManagement, IconTaskAssignment, IconKitting, IconVAS,
  IconQualityInspection, IconHoldStatus, IconReverseLogistics,
  IconSerialNumber, IconLotTracking, IconExpiryManagement,
  IconHazmat, IconColdChain, IconMultiChannel, IconDropShip,
  IconBackorder, IconInventoryCount, IconWarehouseKPI, IconWarehouseLayout,
} from './domain';
import {
  IconSuccess, IconError, IconWarning, IconInfo, IconPending, IconLoading,
  IconBlocked, IconCritical, IconActive, IconPaused,
  IconDraft, IconSubmitted, IconApproved, IconRejected, IconPublished,
  IconArchived, IconRetrying, IconExpired, IconCompleted, IconCancelled,
  IconOnHold, IconInProgress, IconEscalated, IconVerified,
  IconConnected, IconOffline,
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
        <IconCell Icon={IconUndo} name="Undo" />
        <IconCell Icon={IconRedo} name="Redo" />
        <IconCell Icon={IconZoomIn} name="ZoomIn" />
        <IconCell Icon={IconZoomOut} name="ZoomOut" />
        <IconCell Icon={IconFullscreen} name="Fullscreen" />
        <IconCell Icon={IconShare} name="Share" />
        <IconCell Icon={IconPrint} name="Print" />
        <IconCell Icon={IconNotification} name="Notification" />
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
      <h4 style={{ fontSize: 12, color: '#858585', marginBottom: 8 }}>Inventory Management</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, color: '#ccc', marginBottom: 16 }}>
        <IconCell Icon={IconInventory} name="Inventory" />
        <IconCell Icon={IconBox} name="Box" />
        <IconCell Icon={IconScan} name="Scan" />
        <IconCell Icon={IconBarcode} name="Barcode" />
        <IconCell Icon={IconPackageCheck} name="PkgCheck" />
        <IconCell Icon={IconCycleCount} name="CycleCount" />
        <IconCell Icon={IconStockAdjustment} name="StockAdj" />
        <IconCell Icon={IconStockLookup} name="Lookup" />
        <IconCell Icon={IconLotTracking} name="Lot" />
        <IconCell Icon={IconSerialNumber} name="Serial#" />
        <IconCell Icon={IconExpiryManagement} name="Expiry" />
        <IconCell Icon={IconInventoryCount} name="InvCount" />
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
      <h4 style={{ fontSize: 12, color: '#858585', marginBottom: 8 }}>Warehouse Operations</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, color: '#ccc', marginBottom: 16 }}>
        <IconCell Icon={IconReceiveGoods} name="Receive" />
        <IconCell Icon={IconDispatchGoods} name="Dispatch" />
        <IconCell Icon={IconPutaway} name="Putaway" />
        <IconCell Icon={IconPickup} name="Pickup" />
        <IconCell Icon={IconReplenishment} name="Replenish" />
        <IconCell Icon={IconCycleCount} name="CycleCount" />
        <IconCell Icon={IconStockAdjustment} name="StockAdj" />
        <IconCell Icon={IconRacking} name="Racking" />
        <IconCell Icon={IconBinLocation} name="BinLoc" />
        <IconCell Icon={IconConsolidation} name="Consolidate" />
        <IconCell Icon={IconStockLookup} name="StockSearch" />
        <IconCell Icon={IconLabelPrint} name="LabelPrint" />
        <IconCell Icon={IconCrossDock} name="CrossDock" />
        <IconCell Icon={IconStaging} name="Staging" />
        <IconCell Icon={IconPackageOpen} name="Open" />
        <IconCell Icon={IconPackageDamaged} name="Damaged" />
        <IconCell Icon={IconDamagedGoods} name="DmgGoods" />
      </div>
      <h4 style={{ fontSize: 12, color: '#858585', marginBottom: 8 }}>WMS Advanced</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, color: '#ccc', marginBottom: 16 }}>
        <IconCell Icon={IconWavePlanning} name="Wave" />
        <IconCell Icon={IconZoneManagement} name="Zone" />
        <IconCell Icon={IconDockManagement} name="Dock" />
        <IconCell Icon={IconLaborManagement} name="Labor" />
        <IconCell Icon={IconTaskAssignment} name="Task" />
        <IconCell Icon={IconKitting} name="Kitting" />
        <IconCell Icon={IconVAS} name="VAS" />
        <IconCell Icon={IconQualityInspection} name="QCInspect" />
        <IconCell Icon={IconHoldStatus} name="Hold" />
        <IconCell Icon={IconReverseLogistics} name="Reverse" />
        <IconCell Icon={IconSerialNumber} name="Serial#" />
        <IconCell Icon={IconLotTracking} name="Lot" />
        <IconCell Icon={IconExpiryManagement} name="Expiry" />
        <IconCell Icon={IconHazmat} name="Hazmat" />
        <IconCell Icon={IconColdChain} name="ColdChain" />
        <IconCell Icon={IconMultiChannel} name="MultiCH" />
        <IconCell Icon={IconDropShip} name="DropShip" />
        <IconCell Icon={IconBackorder} name="Backorder" />
        <IconCell Icon={IconInventoryCount} name="InvCount" />
        <IconCell Icon={IconWarehouseKPI} name="WMS KPI" />
        <IconCell Icon={IconWarehouseLayout} name="Layout" />
      </div>
      <h4 style={{ fontSize: 12, color: '#858585', marginBottom: 8 }}>Ledger & Settlement</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, color: '#ccc', marginBottom: 16 }}>
        <IconCell Icon={IconLedger} name="Ledger" />
        <IconCell Icon={IconWallet} name="Wallet" />
        <IconCell Icon={IconBank} name="Bank" />
        <IconCell Icon={IconSettlement} name="Settlement" />
        <IconCell Icon={IconReconciliation} name="Reconcile" />
        <IconCell Icon={IconCharge} name="Charge" />
        <IconCell Icon={IconPayout} name="Payout" />
        <IconCell Icon={IconDiscount} name="Discount" />
        <IconCell Icon={IconCoins} name="Coins" />
        <IconCell Icon={IconFinancialReport} name="FinReport" />
        <IconCell Icon={IconAuditCheck} name="AuditCheck" />
        <IconCell Icon={IconIncentive} name="Incentive" />
        <IconCell Icon={IconVariance} name="Variance" />
        <IconCell Icon={IconDebitCredit} name="Debit/Credit" />
        <IconCell Icon={IconPaymentVerified} name="PayVerified" />
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
    <div>
      <h4 style={{ fontSize: 12, color: '#858585', marginBottom: 8 }}>System Status</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, color: '#ccc', marginBottom: 16 }}>
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
        <IconCell Icon={IconConnected} name="Connected" />
        <IconCell Icon={IconOffline} name="Offline" />
      </div>
      <h4 style={{ fontSize: 12, color: '#858585', marginBottom: 8 }}>Business Lifecycle</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, color: '#ccc' }}>
        <IconCell Icon={IconDraft} name="Draft" />
        <IconCell Icon={IconSubmitted} name="Submitted" />
        <IconCell Icon={IconApproved} name="Approved" />
        <IconCell Icon={IconRejected} name="Rejected" />
        <IconCell Icon={IconInProgress} name="InProgress" />
        <IconCell Icon={IconOnHold} name="OnHold" />
        <IconCell Icon={IconCompleted} name="Completed" />
        <IconCell Icon={IconPublished} name="Published" />
        <IconCell Icon={IconArchived} name="Archived" />
        <IconCell Icon={IconCancelled} name="Cancelled" />
        <IconCell Icon={IconExpired} name="Expired" />
        <IconCell Icon={IconRetrying} name="Retrying" />
        <IconCell Icon={IconEscalated} name="Escalated" />
        <IconCell Icon={IconVerified} name="Verified" />
      </div>
    </div>
  ),
};
