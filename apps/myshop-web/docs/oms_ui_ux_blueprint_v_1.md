# OMS UI/UX Blueprint v1

## 1. Document Positioning

This document defines the UI/UX blueprint for the **OMS domain** inside a broader **e-commerce administration system**. It is not limited to a single page or isolated screen. It establishes a unified, scalable, product-grade design blueprint for the OMS backend, aligned with the shared IDP workspace foundation.

This blueprint is intended to guide:

- Product planning
- UX and UI design
- Figma information architecture
- Frontend implementation
- Component decomposition
- Role-based workflow design
- Future alignment with other shared platform products

This document focuses on the **OMS portion of the e-commerce admin system**, but it is designed so that OMS can sit naturally inside a broader commerce operations backend.

---

## 2. Strategic Definition of OMS UI

OMS UI is not just an order list and not just a data entry backend.

Its core mission is:

> Present a single operational truth for every order, support decision-making before fulfillment, coordinate fulfillment readiness, expose risks and exceptions, and support customer-service and operations teams in resolving issues efficiently.

Therefore, OMS UI should be designed as a combination of:

- **Order Control Tower**
- **Order Operations Workspace**
- **Order Detail Workspace**
- **Exception Resolution Console**
- **Returns / Refunds Operations Area**

This means the OMS backend should be treated as a **workbench for operations**, not as a traditional CRUD-heavy admin panel.

---

## 3. OMS in the Full E-commerce Admin System

Although this blueprint focuses on OMS, the OMS module must be understood as one bounded area inside the larger e-commerce admin system.

A typical full e-commerce admin system may include:

- Dashboard / Control Tower
- OMS
- Product / Catalog Management
- Inventory / Stock Visibility
- Fulfillment / Warehouse Integration
- Channel / Store Management
- Pricing / Promotion
- Customer Service
- Returns / Refunds
- Finance / Reconciliation
- Notifications
- Rules / Policies
- Reporting / Audit
- Settings / Access Control

In this larger structure, OMS serves as the **order-centric orchestration and operations layer**.

---

## 4. Core Design Principles

The OMS UI/UX should follow these principles.

### 4.1 Order-centric, not table-centric
The center of gravity is the order lifecycle, not database entities.

### 4.2 High-density but readable
OMS users often process many records under time pressure. The interface must support dense information scanning without becoming visually chaotic.

### 4.3 Action-oriented
Each page should make it obvious what users can do next.

### 4.4 Exception-first operations
Normal orders flow automatically. UI value appears when there are issues, decisions, conflicts, or manual interventions.

### 4.5 Same foundation, different domain expression
OMS should inherit the shared workspace patterns, but domain-specific statuses, objects, and workflows must still feel native to order operations.

### 4.6 Role-aware experience
Different users look at the same order differently. The structure should remain stable, but default views, emphasis, and queues should adapt by role.

---

## 5. Users and Roles

The OMS backend should support multiple operational roles.

### 5.1 Customer Service Agent
Focus:
- Order status
- Payment state
- Shipment status
- Customer notes
- Returns and refunds
- Communication history

### 5.2 Order Operations Specialist
Focus:
- New orders
- Review queues
- Holds
- Allocation readiness
- SLA risk
- Bulk actions

### 5.3 Fulfillment Coordinator
Focus:
- Allocation
- Fulfillment readiness
- Warehouse handoff
- Shipment creation and progress
- Split fulfillment conditions

### 5.4 Finance / Risk Reviewer
Focus:
- Payment failures
- High-risk orders
- Refund approval
- Transaction anomalies
- Chargeback / dispute related cases

### 5.5 Operations Manager
Focus:
- Global flow health
- Exceptions
- Team queues
- Throughput
- SLA and backlog

The UI should not create a different product for each role. It should keep one coherent foundation, but allow default views and task emphasis to differ.

---

## 6. OMS Information Architecture

Recommended OMS module structure:

```text
OMS
├─ Dashboard / Control Tower
├─ Orders
│  ├─ All Orders
│  ├─ New Orders
│  ├─ Awaiting Review
│  ├─ Pending Payment
│  ├─ Awaiting Allocation
│  ├─ Awaiting Fulfillment
│  ├─ Partially Fulfilled
│  ├─ On Hold
│  ├─ Exceptions
│  ├─ Returns in Progress
│  └─ Closed / Archived
├─ Order Detail
├─ Fulfillment Center
├─ Exception Center
├─ Returns / Refunds Center
├─ Payment / Risk Queue
├─ Customers (lightweight linkage)
├─ Channels / Stores
├─ Rules / Policies
└─ Reports / Audit
```

The most critical OMS workspaces are:

1. Dashboard / Control Tower
2. Orders List Workspace
3. Order Detail Workspace
4. Exception Center

These four areas define the core operational value of OMS.

---

## 7. Page System and Layout Templates

OMS should adopt a small number of standardized workspace templates.

### 7.1 Template A: Dashboard Workspace
Used for:
- OMS Control Tower
- Management overview
- Team operational monitoring

Structure:
- Page Header
- Context Bar
- Summary metrics
- Charts and risk widgets
- Team queues / exception lists

### 7.2 Template B: List → Detail Preview → Inspector
Used for:
- Orders list
- Exception queue
- Returns queue
- Payment / risk queue

Structure:
- Dense list/table in main area
- Optional preview area or rich row drill-in
- Inspector at the right for quick actions and context

### 7.3 Template C: Header + Context Bar + Tabs + Inspector
Used for:
- Order detail
- Return detail
- Complex object workspaces

Structure:
- Object header
- Context bar
- Tabbed main workspace
- Right inspector

These templates should be directly aligned with the shared workspace framework so OMS remains visually and structurally consistent with the wider product family.

---

## 8. Global Navigation Positioning

In the broader e-commerce admin system, OMS should appear as a first-level product area.

Recommended left navigation groups:

### 8.1 Primary Navigation
- Dashboard
- Orders
- Fulfillment
- Exceptions
- Returns / Refunds
- Customers
- Channels / Stores
- Rules
- Reports
- Settings

### 8.2 Suggested OMS Navigation Behavior
- Keep the left nav stable
- Use page-level saved views and tabs for variations
- Avoid deep accordion trees in the primary nav
- Put operational subviews inside each workspace rather than in deeply nested menus

---

## 9. OMS Dashboard / Control Tower

### 9.1 Page Goal
The dashboard should answer:

- What is happening now?
- Where are orders getting stuck?
- Which queues are growing?
- Which channels or stores are risky?
- Where do teams need to act first?

It is not for deep editing. It is for fast situation awareness.

### 9.2 Page Header
Should include:
- Title: OMS Control Tower
- Time range selector
- Channel / store selector
- Warehouse / scope selector if relevant
- Refresh
- Export
- Saved view selector

### 9.3 Context Bar
Recommended summary items:
- Total Orders Today
- Paid Orders
- Awaiting Allocation
- On Hold
- Exception Orders
- SLA Risk Orders

### 9.4 Main Layout
Recommended three-zone structure:

#### Zone A: Core Overview
- Order volume trend
- Channel distribution
- Payment state distribution
- Fulfillment stage distribution

#### Zone B: Risks and Bottlenecks
- Exception queue snapshot
- Inventory shortage orders
- Payment failures
- Address validation failures
- High-risk orders

#### Zone C: Work and Collaboration
- My tasks
- Team pending queues
- Recently escalated exceptions
- Recent refunds / return events

### 9.5 UX Rules
- Dashboard highlights issues, not full workflows
- Widgets must be actionable
- Clicking a metric should open the relevant filtered queue
- Avoid decorative charts without operational next steps

---

## 10. Orders List Workspace

This is the highest-frequency OMS operational page.

### 10.1 Page Goal
Users should be able to:
- Search orders
- Scan statuses quickly
- Identify risks
- Apply bulk actions
- Open order detail
- Perform lightweight actions without leaving the queue

### 10.2 Page Header
Should include:
- Title: Orders
- Saved Views
- Create Order
- Export
- Bulk Actions entry

### 10.3 Filter Bar
Recommended filters:
- Order Number
- Customer
- Channel
- Store
- Order Status
- Payment Status
- Fulfillment Status
- Shipment Status
- Risk Level
- Time Range
- Warehouse / Node
- Country / Region
- Tags
- SLA State
- Assigned Owner

### 10.4 Dense Data Table
Recommended columns:
- Order No
- Channel / Store
- Customer
- Created At
- Order Status
- Payment Status
- Fulfillment Status
- Shipment Status
- Total Amount
- Item Count
- Risk Flag
- SLA
- Warehouse / Node
- Assigned To
- Last Updated

### 10.5 Interaction Rules
- Single click row: update preview or inspector
- Double click row: open Order Detail
- Multi-select rows: reveal Bulk Action Bar
- Hover: reveal row-level quick actions if needed
- Keep row height dense but readable

### 10.6 Saved Views
Recommended defaults:
- New Orders
- Awaiting Review
- Pending Payment
- Awaiting Allocation
- Awaiting Fulfillment
- Partially Fulfilled
- On Hold
- Exceptions
- Returns in Progress
- Closed

### 10.7 Bulk Actions
Recommended batch actions:
- Hold
- Release Hold
- Assign Owner
- Add Tag
- Export
- Mark Priority
- Re-run Allocation
- Notify / Send Message

### 10.8 Inspector Panel
Suggested sections:
- Summary
- Current Status
- Quick Actions
- Notes
- Related Objects
- Audit Meta

---

## 11. Order Detail Workspace

This is the core deep-processing page of OMS.

### 11.1 Page Goal
When a user opens an order, they must immediately understand:
- What order this is
- Where it is in the lifecycle
- Whether anything is wrong
- What needs to happen next
- How payment, fulfillment, shipping, and post-sales relate

### 11.2 Object Header
Suggested content:
- Order Number
- Channel / Store
- Order Created Time
- Main Lifecycle Status Badge
- Payment Status Badge
- Fulfillment Status Badge
- Shipment Status Badge
- Priority
- Tags
- Main Action Area on the right

### 11.3 Header Actions
Recommended:
- Edit
- Hold / Release
- Recalculate
- Re-run Allocation
- Cancel Order
- Refund
- More Actions

Rules:
- Only one strong primary action at a time
- Secondary actions grouped thoughtfully
- Avoid action overload in header

### 11.4 Context Bar
Recommended summary items:
- Order Health
- Payment
- Inventory Reserved
- Allocation Result
- Shipment Progress
- SLA / Promise Risk

This bar should let users judge the order health instantly.

---

## 12. Order Detail Tabs

The order detail workspace should use a standard tab system.

### 12.1 Overview
Default tab.

Suggested structure:

#### A. Order Snapshot
- Customer
- Billing / shipping address
- Order amount
- Discounts
- Taxes
- Source channel
- Tags
- Creation source

#### B. Fulfillment Summary
- Allocation result
- Warehouse / node
- Split fulfillment summary
- Picking / packing / shipping stage
- Current readiness

#### C. Risk / Exceptions
- Fraud / payment risk
- Address issue
- Inventory shortage
- Manual hold reason
- Rule-triggered warnings

#### D. Activity Summary
- Key recent lifecycle events
- Key operator actions
- System decision markers

### 12.2 Items
Suggested data:
- SKU
- Item Name
- Ordered Qty
- Allocated Qty
- Fulfilled Qty
- Returned Qty
- Unit Price
- Discount
- Tax
- Inventory Source
- Item-level issue

### 12.3 Payment
Suggested content:
- Payment method
- Authorization state
- Capture state
- Payment transaction history
- Refund records
- Risk review information
- Payment timeline

### 12.4 Fulfillment
Suggested content:
- Allocation attempts
- Fulfillment orders / sub-orders
- Warehouse assignment
- Split shipment logic
- Picking / packing references
- Downstream execution linkage
- Retry / failure records

### 12.5 Shipment
Suggested content:
- Shipment records
- Parcel records
- Carrier
- Service level
- Tracking number
- Shipping labels / docs
- Delivery events
- Delivery exceptions

### 12.6 Returns / Refunds
Suggested content:
- Return requests
- Refund status
- Reverse logistics
- Disposition
- Exchange / replacement information

### 12.7 Timeline
Full order event timeline.

Should include:
- System events
- Human actions
- External platform updates
- Payment and shipment events
- Notes and escalations if appropriate

### 12.8 Notes / Collaboration
Should include:
- Customer service notes
- Operations notes
- Internal mentions
- Attachments
- Decision comments

---

## 13. Order Detail Inspector

The right inspector should support quick orientation and short actions without disturbing the main workspace.

Suggested sections:
- Summary
- Status cluster
- Quick actions
- Related objects
- Assigned owner
- Audit metadata

### 13.1 Quick Actions Suggestions
- Add Note
- Assign Owner
- Hold / Release
- Retry Payment Sync
- Retry Allocation
- Create Shipment
- Trigger Notification
- Open Related Return

### 13.2 UX Constraints
- Inspector should not become a second page
- Long forms should not live here
- Keep widths stable
- Use accordion sections if necessary

---

## 14. OMS Status Model for UI

A successful OMS UI depends on clear status modeling.

The UI should not collapse everything into one badge.

### 14.1 Order Lifecycle Status
Recommended examples:
- Draft
- Submitted
- Confirmed
- On Hold
- In Fulfillment
- Partially Fulfilled
- Fulfilled
- Completed
- Cancelled
- Closed

### 14.2 Payment Status
Recommended examples:
- Pending
- Authorized
- Captured
- Partially Refunded
- Refunded
- Failed
- Review Required

### 14.3 Fulfillment Status
Recommended examples:
- Unallocated
- Partially Allocated
- Allocated
- Picking
- Packing
- Partially Shipped
- Shipped
- Delivered
- Failed

### 14.4 Shipment Status
Recommended examples:
- Not Created
- Label Created
- Handed Over
- In Transit
- Out for Delivery
- Delivered
- Delivery Exception

### 14.5 Exception Status
Recommended examples:
- Healthy
- Warning
- Blocked
- Escalated
- Manual Review

### 14.6 UI Expression Rule
For one order, the page should show:
- One main lifecycle state
- Several secondary state badges
- Clear exception indication when needed

This reduces ambiguity and avoids misleading simplification.

---

## 15. Exception Center

This is one of the most important operational areas of OMS.

### 15.1 Why It Must Be Independent
Normal orders flow automatically. Operational value appears when something fails, conflicts, or needs human judgment.

Therefore, exception handling must not be buried as just another filter on the orders list.

### 15.2 Page Goal
Enable teams to process:
- Payment failures
- Risk orders
- Address validation errors
- Inventory shortage
- Fulfillment failures
- Shipment exceptions
- Customer-request changes
- Pricing / tax anomalies

### 15.3 Page Structure

#### Header
- Title: Exceptions
- Exception Type Filter
- Severity Filter
- SLA Filter
- Assign / Export

#### Left Saved Views
- Payment Failed
- Address Validation Failed
- Inventory Shortage
- Manual Review
- Shipment Exception
- Returns Escalation

#### Main Queue Table
Suggested columns:
- Order No
- Exception Type
- Severity
- Channel
- Customer
- Amount
- SLA Remaining
- Assigned To
- Created At
- Last Action

#### Right Quick Resolve Panel
Actions should adapt by exception type.

Examples:

##### Payment Exception
- Retry authorization
- Change payment method
- Mark manual verification

##### Inventory Exception
- Reallocate
- Split shipment
- Backorder
- Substitute SKU

##### Address Exception
- Validate address
- Contact customer
- Override hold

### 15.4 UX Principle
Exception Center should feel like a queue workbench, not a passive report.

---

## 16. Fulfillment Center

OMS often needs a dedicated workspace for pre-warehouse and pre-shipment orchestration.

### 16.1 Page Goal
Help teams coordinate:
- Allocation readiness
- Warehouse assignment
- Split fulfillment
- Shipment creation readiness
- Fulfillment blockers

### 16.2 Suggested Views
- Awaiting Allocation
- Allocation Failed
- Ready for Fulfillment
- Split Orders
- Shipment Creation Pending

### 16.3 Key Components
- Dense queue
- Allocation result cards
- Warehouse / node selectors
- Hold reason indicators
- Bulk rerun actions

---

## 17. Returns / Refunds Center

OMS for e-commerce should treat post-sales as first-class work, not secondary detail only.

### 17.1 Page Goal
Manage:
- Return requests
- Refund review
- Reverse logistics
- Exchange / replacement processing
- Return exceptions

### 17.2 Recommended Views
- New Return Requests
- In Review
- Awaiting Receipt
- Awaiting Inspection
- Refund Pending
- Refunded
- Exception Returns

### 17.3 Return Detail Structure
Should include:
- Original order reference
- Customer
- Item lines
- Return reason
- Return shipment info
- Inspection result
- Refund amount
- Disposition
- Timeline

---

## 18. Payment / Risk Queue

This workspace is useful when transaction review is frequent.

### 18.1 Page Goal
Handle:
- Payment failures
- Capture issues
- Manual review
- Fraud / suspicious orders
- Refund approval queue

### 18.2 Suggested Layout
- Queue table
- Filters for risk/payment type
- Decision panel
- Timeline and transaction history preview

---

## 19. Customers (Lightweight OMS Linkage)

OMS does not need to become a full CRM. However, lightweight customer views are valuable.

### 19.1 Customer Quick View Should Show
- Basic profile
- Recent orders
- Return history
- Risk history
- Notes
- Default addresses

### 19.2 UX Principle
Keep this linked to order operations. Do not turn OMS into a separate customer master system.

---

## 20. Role-based Default Experiences

The OMS UI foundation should remain stable, but different roles should see different landing emphasis.

### 20.1 Customer Service Landing
Recommended default:
- Orders
- Order detail
- Notes / communication emphasis
- Returns and refunds

### 20.2 Order Operations Landing
Recommended default:
- Dashboard
- New orders
- Review queue
- Exception center

### 20.3 Fulfillment Coordination Landing
Recommended default:
- Awaiting allocation
- Fulfillment center
- Shipment readiness queues

### 20.4 Finance / Risk Landing
Recommended default:
- Payment failures
- Risk queue
- Refund approvals

### 20.5 Manager Landing
Recommended default:
- OMS control tower
- Team queues
- SLA risk
- Escalation and backlog widgets

---

## 21. Key UX Rules Across the Whole OMS

### 21.1 Every action must have feedback
Users must receive clear responses for:
- Success
- Failure
- In progress
- Queued
- Partial success

### 21.2 High-risk actions need confirmation
Examples:
- Cancel order
- Refund
- Force release hold
- Override exception
- Delete or void shipment artifact

### 21.3 Partial refresh over full-page reload
The system should preserve context whenever possible.

### 21.4 Empty states must teach next action
Never show blank “No data” messages without guidance.

### 21.5 Dense tables must still be scannable
Use hierarchy, spacing, and status conventions carefully.

### 21.6 Notes and audit matter
OMS is an operations system. Human decisions and accountability must be visible.

---

## 22. Visual Language Rules for OMS

OMS should inherit the shared workspace design language.

### 22.1 Page Tone
- Professional
- Operational
- High-density
- Calm
- Precise

### 22.2 Emphasis Rules
Strong emphasis should be reserved for:
- Primary action
- Active exception
- Severe risk
- SLA breach / near breach

### 22.3 Color Semantics
Suggested usage:
- Blue: information, active focus, neutral action
- Green: success, healthy, completed
- Yellow: warning, attention needed
- Red: error, blocked, severe exception
- Gray: secondary, archived, disabled, neutral

### 22.4 Typography and Spacing
- Dense but breathable tables
- Strong module titles
- Clear secondary metadata
- Stable badge rhythm

---

## 23. Key OMS Components to Build

OMS should not be implemented directly from raw primitives. It should use the shared workspace system plus an OMS-specific component layer.

### 23.1 Shared Components Used
- PageHeader
- ContextBar
- StatusBadge
- SummaryMetric
- InspectorPanel
- ActivityTimeline
- ObjectTabs
- DenseDataTable
- FilterBar
- EmptyState
- ErrorState
- ActionBar
- CommandPalette

### 23.2 OMS-specific Components Recommended
- OrderStatusBadge
- PaymentStatusBadge
- FulfillmentStatusBadge
- ShipmentStatusBadge
- ExceptionSeverityBadge
- OrderHealthSummary
- OrderLineTable
- OrderTimeline
- FulfillmentSummaryCard
- ShipmentCard
- RefundSummaryCard
- QuickResolvePanel
- ReturnReasonBadge
- RiskDecisionPanel

---

## 24. Suggested Figma Structure

Recommended Figma page structure:

```text
OMS UI/UX Blueprint
├─ 00 Foundations Reference
├─ 01 Navigation & Layout
├─ 02 Dashboard
├─ 03 Orders List
├─ 04 Order Detail
├─ 05 Exception Center
├─ 06 Fulfillment Center
├─ 07 Returns / Refunds
├─ 08 Payment / Risk Queue
├─ 09 Shared OMS Components
├─ 10 States / Empty / Error / Loading
└─ 11 Role-based Views
```

Within each page, organize by:
- Information architecture
- Low-fidelity wireframe
- Mid-fidelity layout
- Component mapping
- State variants

---

## 25. P0 / P1 Delivery Recommendation

### 25.1 P0 Must-have Screens
1. OMS Dashboard
2. Orders List Workspace
3. Order Detail Workspace
4. Exception Center

### 25.2 P1 High-value Screens
5. Fulfillment Center
6. Returns / Refunds Center
7. Payment / Risk Queue
8. Channels / Stores / Rules linkage

### 25.3 P2 Later Enhancements
- Advanced collaboration views
- Order-side command palette depth
- Saved layouts / customizable workspace
- More advanced role dashboards
- Embedded AI assistance / suggested resolutions

---

## 26. Final Design Verdict

The OMS part of the e-commerce admin system should not be designed as a conventional admin backend made of isolated forms and tables.

Its best-practice form is:

- A **control tower** for operational awareness
- A **dense orders workspace** for daily throughput
- A **rich order detail workspace** for full lifecycle understanding
- A dedicated **exception center** for operational problem-solving
- A dedicated **returns / refunds center** for post-sales operations
- A **shared workspace foundation** that keeps OMS aligned with the broader product family

The core principle is:

> OMS UI must help users understand order truth, process large queues efficiently, detect risk early, and resolve operational issues with confidence.

That is the foundation of a professional, scalable OMS backend for a modern e-commerce administration system.

