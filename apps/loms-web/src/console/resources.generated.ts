/* AUTO-GENERATED from LOMS OpenAPI. */
export interface ResAction { name: string; fields: string[] }
export interface ResSub { path: string; fields: string[] }
export interface ResConfig { key: string; title: string; base: string; list: boolean; get: boolean; create: string[] | null; sub: ResSub[]; actions: ResAction[] }
export const RESOURCES: ResConfig[] = [
  {
    "key": "adapters",
    "title": "Adapters",
    "base": "/adapters",
    "list": true,
    "get": true,
    "create": [
      "adapter_name",
      "provider_ref",
      "protocol",
      "base_url",
      "api_version"
    ],
    "sub": [
      {
        "path": "capabilities",
        "fields": [
          "capability"
        ]
      },
      {
        "path": "health-checks",
        "fields": [
          "endpoint",
          "status_code",
          "latency_ms",
          "healthy",
          "checked_at"
        ]
      }
    ],
    "actions": [
      {
        "name": "startTesting",
        "fields": []
      },
      {
        "name": "certify",
        "fields": [
          "certified_at"
        ]
      },
      {
        "name": "activate",
        "fields": []
      },
      {
        "name": "suspend",
        "fields": []
      },
      {
        "name": "deprecate",
        "fields": []
      }
    ]
  },
  {
    "key": "addresses",
    "title": "Addresses",
    "base": "/addresses",
    "list": true,
    "get": true,
    "create": [
      "address_id",
      "country",
      "state",
      "city",
      "postal_code",
      "line1",
      "line2",
      "geo_lat",
      "geo_lng"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "allocations",
    "title": "Allocations",
    "base": "/allocations",
    "list": true,
    "get": true,
    "create": [
      "equipment_id",
      "equipment_no",
      "leg_id",
      "shipment_id",
      "booking_id",
      "reason",
      "correlation_id"
    ],
    "sub": [],
    "actions": [
      {
        "name": "release",
        "fields": [
          "reason",
          "correlation_id"
        ]
      },
      {
        "name": "reportDamage",
        "fields": [
          "reason",
          "correlation_id"
        ]
      },
      {
        "name": "startReview",
        "fields": [
          "correlation_id"
        ]
      },
      {
        "name": "resolveReview",
        "fields": [
          "reason",
          "correlation_id"
        ]
      },
      {
        "name": "markUnavailable",
        "fields": [
          "correlation_id"
        ]
      }
    ]
  },
  {
    "key": "analytics-facts",
    "title": "Analytics Facts",
    "base": "/analytics-facts",
    "list": true,
    "get": false,
    "create": null,
    "sub": [],
    "actions": []
  },
  {
    "key": "analytics-quality-checks",
    "title": "Analytics Quality Checks",
    "base": "/analytics-quality-checks",
    "list": true,
    "get": false,
    "create": null,
    "sub": [],
    "actions": []
  },
  {
    "key": "analytics-reports",
    "title": "Analytics Reports",
    "base": "/analytics-reports",
    "list": true,
    "get": true,
    "create": [
      "report_type",
      "name",
      "metrics",
      "data_source_facts",
      "refresh_interval_seconds"
    ],
    "sub": [
      {
        "path": "metrics",
        "fields": [
          "metric_id"
        ]
      },
      {
        "path": "data-sources",
        "fields": [
          "fact_name"
        ]
      }
    ],
    "actions": [
      {
        "name": "govern",
        "fields": []
      }
    ]
  },
  {
    "key": "api-catalog",
    "title": "Api Catalog",
    "base": "/api-catalog",
    "list": true,
    "get": true,
    "create": null,
    "sub": [],
    "actions": []
  },
  {
    "key": "bookings",
    "title": "Bookings",
    "base": "/bookings",
    "list": true,
    "get": true,
    "create": [
      "booking_type",
      "provider_id",
      "service_code",
      "leg_id",
      "shipment_id",
      "execution_plan_id",
      "equipment_requirements"
    ],
    "sub": [],
    "actions": [
      {
        "name": "confirm",
        "fields": [
          "booking_ref_no",
          "confirmed_vessel",
          "confirmed_voyage",
          "etd",
          "eta"
        ]
      },
      {
        "name": "reject",
        "fields": [
          "rejection_reason"
        ]
      },
      {
        "name": "amend",
        "fields": [
          "reason",
          "changes"
        ]
      },
      {
        "name": "cancel",
        "fields": [
          "reason"
        ]
      }
    ]
  },
  {
    "key": "charge-allocations",
    "title": "Charge Allocations",
    "base": "/charge-allocations",
    "list": false,
    "get": false,
    "create": [
      "charge_ref",
      "total_amount",
      "currency",
      "targets"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "commercial__charge-rules",
    "title": "Charge Rules",
    "base": "/commercial/charge-rules",
    "list": true,
    "get": true,
    "create": [
      "rule_type",
      "charge_code",
      "description",
      "condition",
      "calculation_type",
      "amount_value",
      "percentage",
      "tiers",
      "currency",
      "applicable_contract_ids",
      "priority",
      "stackable"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "commercial__contracts",
    "title": "Contracts",
    "base": "/commercial/contracts",
    "list": true,
    "get": true,
    "create": [
      "customer_id",
      "contract_no",
      "effective_date",
      "expiry_date",
      "payment_terms",
      "credit_limit_value",
      "credit_limit_currency",
      "billing_currency",
      "auto_renew",
      "eligible_service_profile_ids",
      "eligible_lane_keys",
      "notes"
    ],
    "sub": [],
    "actions": [
      {
        "name": "activate",
        "fields": []
      },
      {
        "name": "suspend",
        "fields": [
          "reason"
        ]
      },
      {
        "name": "terminate",
        "fields": [
          "reason"
        ]
      },
      {
        "name": "changeCreditLimit",
        "fields": []
      },
      {
        "name": "freezeCredit",
        "fields": []
      },
      {
        "name": "releaseCredit",
        "fields": []
      }
    ]
  },
  {
    "key": "commercial__customer-accounts",
    "title": "Customer Accounts",
    "base": "/commercial/customer-accounts",
    "list": false,
    "get": false,
    "create": [],
    "sub": [],
    "actions": [
      {
        "name": "assignContract",
        "fields": []
      },
      {
        "name": "changeStatus",
        "fields": []
      }
    ]
  },
  {
    "key": "commercial__customer-tiers",
    "title": "Customer Tiers",
    "base": "/commercial/customer-tiers",
    "list": false,
    "get": false,
    "create": null,
    "sub": [],
    "actions": [
      {
        "name": "evaluate",
        "fields": []
      }
    ]
  },
  {
    "key": "commercial__promotions",
    "title": "Promotions",
    "base": "/commercial/promotions",
    "list": false,
    "get": false,
    "create": [],
    "sub": [],
    "actions": [
      {
        "name": "activate",
        "fields": []
      },
      {
        "name": "disable",
        "fields": []
      }
    ]
  },
  {
    "key": "commercial__rate-cards",
    "title": "Rate Cards",
    "base": "/commercial/rate-cards",
    "list": true,
    "get": true,
    "create": [
      "name",
      "contract_id",
      "effective_date",
      "expiry_date",
      "currency"
    ],
    "sub": [
      {
        "path": "lines",
        "fields": [
          "lane_key",
          "service_profile_id",
          "weight_min_kg",
          "weight_max_kg",
          "price_type",
          "unit_price",
          "min_charge",
          "fuel_surcharge_pct",
          "notes"
        ]
      }
    ],
    "actions": [
      {
        "name": "publish",
        "fields": []
      }
    ]
  },
  {
    "key": "commodities",
    "title": "Commodities",
    "base": "/commodities",
    "list": true,
    "get": true,
    "create": [
      "commodity_id",
      "hs_code",
      "description",
      "duty_rate",
      "restricted",
      "dg_class",
      "un_number",
      "packaging_group",
      "country_restrictions",
      "customs_declaration_required"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "consolidation-groups",
    "title": "Consolidation Groups",
    "base": "/consolidation-groups",
    "list": false,
    "get": false,
    "create": [],
    "sub": [
      {
        "path": "members",
        "fields": []
      },
      {
        "path": "outbound-mappings",
        "fields": []
      }
    ],
    "actions": [
      {
        "name": "remove",
        "fields": []
      },
      {
        "name": "seal",
        "fields": []
      },
      {
        "name": "allocateCost",
        "fields": []
      },
      {
        "name": "isolate",
        "fields": []
      },
      {
        "name": "awaitDeconsolidation",
        "fields": []
      },
      {
        "name": "dispatch",
        "fields": []
      },
      {
        "name": "disband",
        "fields": []
      }
    ]
  },
  {
    "key": "customs-declarations",
    "title": "Customs Declarations",
    "base": "/customs-declarations",
    "list": true,
    "get": true,
    "create": [
      "declaration_type",
      "origin_country",
      "destination_country",
      "shipment_ref"
    ],
    "sub": [
      {
        "path": "items",
        "fields": [
          "hs_code",
          "description",
          "value",
          "currency",
          "country_of_origin",
          "quantity",
          "weight_kg"
        ]
      }
    ],
    "actions": [
      {
        "name": "declare",
        "fields": [
          "customs_ref"
        ]
      },
      {
        "name": "review",
        "fields": []
      },
      {
        "name": "clear",
        "fields": [
          "duties_amount"
        ]
      },
      {
        "name": "hold",
        "fields": [
          "reason"
        ]
      },
      {
        "name": "reject",
        "fields": []
      },
      {
        "name": "complianceCheck",
        "fields": []
      }
    ]
  },
  {
    "key": "decision-traces",
    "title": "Decision Traces",
    "base": "/decision-traces",
    "list": true,
    "get": true,
    "create": [
      "decision_type",
      "fulfillment_request_id",
      "orchestration_plan_id",
      "selected_provider_id",
      "selected_lane_key",
      "outcome_reason_code",
      "redaction_level",
      "policy_version",
      "feed_version",
      "product_catalog_version",
      "reference_data_version",
      "mapping_version",
      "candidates"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "disputes",
    "title": "Disputes",
    "base": "/disputes",
    "list": false,
    "get": false,
    "create": [
      "invoice_id",
      "reason_code",
      "disputed_amount",
      "currency",
      "shipment_ref",
      "customer_account_id",
      "opened_by"
    ],
    "sub": [],
    "actions": [
      {
        "name": "review",
        "fields": []
      },
      {
        "name": "resolve",
        "fields": [
          "outcome",
          "adjustment_amount",
          "resolution_ref"
        ]
      },
      {
        "name": "withdraw",
        "fields": []
      }
    ]
  },
  {
    "key": "documents",
    "title": "Documents",
    "base": "/documents",
    "list": false,
    "get": true,
    "create": [
      "document_type",
      "subject_type",
      "subject_id",
      "shipment_id",
      "execution_leg_id",
      "runtime_plan_id",
      "content_base64",
      "mime_type",
      "sensitivity_class",
      "retention_policy",
      "declared_fingerprint"
    ],
    "sub": [],
    "actions": [
      {
        "name": "retry",
        "fields": []
      },
      {
        "name": "void",
        "fields": []
      },
      {
        "name": "reissue",
        "fields": []
      }
    ]
  },
  {
    "key": "dsr-requests",
    "title": "Dsr Requests",
    "base": "/dsr-requests",
    "list": false,
    "get": false,
    "create": [],
    "sub": [],
    "actions": [
      {
        "name": "verify",
        "fields": []
      },
      {
        "name": "process",
        "fields": []
      },
      {
        "name": "complete",
        "fields": []
      },
      {
        "name": "reject",
        "fields": []
      }
    ]
  },
  {
    "key": "equipment",
    "title": "Equipment",
    "base": "/equipment",
    "list": true,
    "get": true,
    "create": [
      "equipment_type",
      "equipment_no",
      "size_type",
      "owner_operator",
      "tare_weight",
      "max_payload"
    ],
    "sub": [],
    "actions": [
      {
        "name": "assign",
        "fields": [
          "leg_id",
          "shipment_id",
          "booking_id"
        ]
      },
      {
        "name": "pickup",
        "fields": []
      },
      {
        "name": "gateIn",
        "fields": []
      },
      {
        "name": "load",
        "fields": [
          "seal_no"
        ]
      },
      {
        "name": "discharge",
        "fields": []
      },
      {
        "name": "return",
        "fields": []
      }
    ]
  },
  {
    "key": "event-catalog",
    "title": "Event Catalog",
    "base": "/event-catalog",
    "list": true,
    "get": true,
    "create": null,
    "sub": [],
    "actions": []
  },
  {
    "key": "event-subscriptions",
    "title": "Event Subscriptions",
    "base": "/event-subscriptions",
    "list": true,
    "get": true,
    "create": [
      "endpoint_url",
      "event_types"
    ],
    "sub": [],
    "actions": [
      {
        "name": "suspend",
        "fields": [
          "reason"
        ]
      },
      {
        "name": "resume",
        "fields": []
      },
      {
        "name": "rotateSecret",
        "fields": []
      }
    ]
  },
  {
    "key": "exception-taxonomy",
    "title": "Exception Taxonomy",
    "base": "/exception-taxonomy",
    "list": true,
    "get": false,
    "create": [
      "exception_type_code",
      "exception_name",
      "exception_category",
      "severity",
      "parent_type_code",
      "auto_compensatable",
      "reorchestrate_allowed",
      "manual_intervention_required",
      "sla_target_minutes"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "exceptions",
    "title": "Exceptions",
    "base": "/exceptions",
    "list": true,
    "get": true,
    "create": [
      "object_type",
      "object_id",
      "exception_code",
      "severity",
      "reason",
      "reason_code",
      "runtime_plan_id",
      "request_id",
      "assigned_to"
    ],
    "sub": [],
    "actions": [
      {
        "name": "resolve",
        "fields": [
          "resolved_by",
          "resolution_notes"
        ]
      }
    ]
  },
  {
    "key": "execution-legs",
    "title": "Execution Legs",
    "base": "/execution-legs",
    "list": false,
    "get": true,
    "create": null,
    "sub": [
      {
        "path": "derive-shipment",
        "fields": [
          "lane",
          "provider",
          "service_product",
          "ship_from",
          "ship_to",
          "parcel",
          "order_refs",
          "policy_version",
          "transport_mode"
        ]
      },
      {
        "path": "retry",
        "fields": []
      },
      {
        "path": "hold",
        "fields": [
          "reason"
        ]
      },
      {
        "path": "resume",
        "fields": []
      },
      {
        "path": "cancel",
        "fields": [
          "reason"
        ]
      }
    ],
    "actions": []
  },
  {
    "key": "execution-plan-runtimes",
    "title": "Execution Plan Runtimes",
    "base": "/execution-plan-runtimes",
    "list": false,
    "get": true,
    "create": [],
    "sub": [
      {
        "path": "derive-shipment",
        "fields": [
          "lane",
          "leg_specs",
          "order_refs",
          "policy_version"
        ]
      }
    ],
    "actions": [
      {
        "name": "finalize",
        "fields": []
      },
      {
        "name": "activate",
        "fields": []
      },
      {
        "name": "start",
        "fields": []
      }
    ]
  },
  {
    "key": "facts",
    "title": "Facts",
    "base": "/facts",
    "list": false,
    "get": true,
    "create": [
      "fact_type",
      "subject_type",
      "subject_id",
      "code",
      "code_category",
      "amount_value",
      "amount_currency",
      "source_ref",
      "evidence_ref",
      "policy_version",
      "correlation_id"
    ],
    "sub": [],
    "actions": [
      {
        "name": "reverse",
        "fields": [
          "reason_code",
          "reversal_amount_value",
          "reversal_amount_currency",
          "correlation_id"
        ]
      }
    ]
  },
  {
    "key": "feed-build-runs",
    "title": "Feed Build Runs",
    "base": "/feed-build-runs",
    "list": true,
    "get": true,
    "create": [
      "feed_name",
      "transform_version",
      "source_versions"
    ],
    "sub": [],
    "actions": [
      {
        "name": "complete",
        "fields": [
          "records_input",
          "records_output",
          "records_deduped",
          "records_redacted",
          "quality_gates"
        ]
      },
      {
        "name": "fail",
        "fields": [
          "failure_reason"
        ]
      },
      {
        "name": "qualityGateFail",
        "fields": [
          "failure_reason",
          "quality_gates"
        ]
      }
    ]
  },
  {
    "key": "feed-contracts",
    "title": "Feed Contracts",
    "base": "/feed-contracts",
    "list": true,
    "get": true,
    "create": null,
    "sub": [],
    "actions": []
  },
  {
    "key": "feedback-records",
    "title": "Feedback Records",
    "base": "/feedback-records",
    "list": true,
    "get": true,
    "create": [
      "category",
      "metric_name",
      "metric_value",
      "expected_value",
      "variance",
      "quality_status",
      "source_decision_trace_id",
      "source_orchestration_plan_id",
      "source_event_ref",
      "source_version"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "forecast-datasets",
    "title": "Forecast Datasets",
    "base": "/forecast-datasets",
    "list": true,
    "get": true,
    "create": [
      "name",
      "horizon",
      "source_facts",
      "product_catalog_version",
      "reference_data_version"
    ],
    "sub": [
      {
        "path": "sources",
        "fields": [
          "fact_name"
        ]
      }
    ],
    "actions": [
      {
        "name": "govern",
        "fields": []
      }
    ]
  },
  {
    "key": "fulfillment-requests",
    "title": "Fulfillment Requests",
    "base": "/fulfillment-requests",
    "list": true,
    "get": true,
    "create": [
      "request_type",
      "customer_id",
      "owner_id",
      "channel",
      "business_mode",
      "source_type",
      "external_ref_no",
      "idempotency_key",
      "requested_ship_date",
      "origin_node_id",
      "destination_node_id",
      "service_profile_id",
      "references",
      "notes",
      "shipper",
      "consignee",
      "notify_party",
      "billing_party",
      "origin",
      "destination",
      "parcel_profile",
      "freight_profile",
      "promised_delivery_window",
      "package_info",
      "items",
      "service_intent",
      "customs_declaration",
      "order_refs",
      "raw_inbound_payload"
    ],
    "sub": [
      {
        "path": "replan",
        "fields": [
          "reason_code",
          "override_route_code",
          "override_warehouse_id",
          "override_service_code"
        ]
      },
      {
        "path": "item-snapshot",
        "fields": []
      }
    ],
    "actions": [
      {
        "name": "validate",
        "fields": []
      },
      {
        "name": "confirm",
        "fields": []
      },
      {
        "name": "release",
        "fields": [
          "shipment_id"
        ]
      },
      {
        "name": "cancel",
        "fields": [
          "reason_code",
          "reason"
        ]
      },
      {
        "name": "complete",
        "fields": [
          "shipment_id"
        ]
      },
      {
        "name": "confirmCancellation",
        "fields": []
      }
    ]
  },
  {
    "key": "governance",
    "title": "Governance",
    "base": "/governance",
    "list": false,
    "get": false,
    "create": null,
    "sub": [],
    "actions": [
      {
        "name": "resolveServiceProduct",
        "fields": [
          "origin_country",
          "destination_country",
          "weight_kg",
          "provider_hint",
          "service_product_hint"
        ]
      }
    ]
  },
  {
    "key": "governed-metrics",
    "title": "Governed Metrics",
    "base": "/governed-metrics",
    "list": true,
    "get": true,
    "create": [
      "name",
      "formula_description",
      "unit",
      "governance_version"
    ],
    "sub": [],
    "actions": [
      {
        "name": "govern",
        "fields": [
          "governance_version"
        ]
      },
      {
        "name": "deprecate",
        "fields": []
      }
    ]
  },
  {
    "key": "handling-profiles",
    "title": "Handling Profiles",
    "base": "/handling-profiles",
    "list": true,
    "get": true,
    "create": [
      "profile_id",
      "name",
      "handling_type",
      "instructions",
      "temperature_min",
      "temperature_max",
      "temperature_unit",
      "requires_special_equipment"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "intervention-tasks",
    "title": "Intervention Tasks",
    "base": "/intervention-tasks",
    "list": true,
    "get": true,
    "create": [
      "exception_id",
      "object_type",
      "object_id",
      "intervention_action",
      "instructions",
      "priority",
      "runtime_plan_id",
      "request_id"
    ],
    "sub": [],
    "actions": [
      {
        "name": "complete",
        "fields": [
          "action_taken",
          "completed_by",
          "approved_by",
          "result_notes"
        ]
      }
    ]
  },
  {
    "key": "invoices",
    "title": "Invoices",
    "base": "/invoices",
    "list": false,
    "get": false,
    "create": null,
    "sub": [],
    "actions": [
      {
        "name": "markPaid",
        "fields": [
          "payment_ref"
        ]
      },
      {
        "name": "reconcile",
        "fields": [
          "paid_amount",
          "notes"
        ]
      }
    ]
  },
  {
    "key": "lane-scoring-snapshots",
    "title": "Lane Scoring Snapshots",
    "base": "/lane-scoring-snapshots",
    "list": true,
    "get": true,
    "create": [
      "lane_id",
      "origin_zone_id",
      "destination_zone_id",
      "lane_key",
      "lane_version",
      "capability_id",
      "provider_id",
      "service_modes",
      "capability_version",
      "product_id",
      "product_version",
      "profile_id",
      "reference_data_version",
      "staleness_action"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "lanes",
    "title": "Lanes",
    "base": "/lanes",
    "list": true,
    "get": true,
    "create": [
      "origin_country",
      "dest_country",
      "zone",
      "display_name",
      "eligible_providers",
      "eligible_service_products",
      "distance_band",
      "transit_days_min",
      "transit_days_max",
      "notes"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "lineage-graphs",
    "title": "Lineage Graphs",
    "base": "/lineage-graphs",
    "list": true,
    "get": true,
    "create": [
      "name",
      "target_node_id"
    ],
    "sub": [
      {
        "path": "nodes",
        "fields": [
          "node_id",
          "node_type",
          "name",
          "owning_bc",
          "version",
          "freshness_target_seconds"
        ]
      },
      {
        "path": "edges",
        "fields": [
          "from_node_id",
          "to_node_id",
          "transform_version",
          "description"
        ]
      }
    ],
    "actions": []
  },
  {
    "key": "locations",
    "title": "Locations",
    "base": "/locations",
    "list": true,
    "get": true,
    "create": [
      "location_id",
      "location_type",
      "name",
      "address_id",
      "timezone",
      "geo_lat",
      "geo_lng",
      "operator"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "logistics-networks",
    "title": "Logistics Networks",
    "base": "/logistics-networks",
    "list": true,
    "get": true,
    "create": [
      "network_id",
      "name",
      "network_type",
      "operator",
      "description"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "measurement-policies",
    "title": "Measurement Policies",
    "base": "/measurement-policies",
    "list": false,
    "get": false,
    "create": [
      "provider_code",
      "service_code",
      "volumetric_divisor",
      "chargeable_weight_method",
      "weight_precision",
      "dimension_precision",
      "canonical_weight_unit",
      "canonical_dimension_unit",
      "max_weight_kg",
      "max_length_cm",
      "max_width_cm",
      "max_height_cm",
      "max_girth_cm",
      "channel_unit_overrides",
      "notes"
    ],
    "sub": [
      {
        "path": "calculate-weight",
        "fields": [
          "actual_weight_kg",
          "length_cm",
          "width_cm",
          "height_cm"
        ]
      },
      {
        "path": "validate-constraints",
        "fields": [
          "actual_weight_kg",
          "length_cm",
          "width_cm",
          "height_cm"
        ]
      }
    ],
    "actions": []
  },
  {
    "key": "multi-leg-routes",
    "title": "Multi Leg Routes",
    "base": "/multi-leg-routes",
    "list": true,
    "get": true,
    "create": [
      "shipment_ref",
      "leg_sequence",
      "total_countries",
      "estimated_transit_days",
      "correlation_id"
    ],
    "sub": [
      {
        "path": "handoffs",
        "fields": [
          "location_ref",
          "handoff_type",
          "inbound_leg_ref",
          "outbound_leg_ref",
          "inbound_provider_ref",
          "outbound_provider_ref",
          "dwell_time_hours"
        ]
      },
      {
        "path": "checks",
        "fields": [
          "check_type",
          "country"
        ]
      }
    ],
    "actions": [
      {
        "name": "updateStatus",
        "fields": [
          "status",
          "processing_notes"
        ]
      },
      {
        "name": "record",
        "fields": [
          "passed",
          "notes",
          "checked_at"
        ]
      }
    ]
  },
  {
    "key": "operational-marts",
    "title": "Operational Marts",
    "base": "/operational-marts",
    "list": true,
    "get": true,
    "create": [
      "name",
      "source_projections",
      "source_events",
      "refresh_interval_seconds"
    ],
    "sub": [
      {
        "path": "projections",
        "fields": [
          "projection"
        ]
      },
      {
        "path": "events",
        "fields": [
          "event"
        ]
      }
    ],
    "actions": []
  },
  {
    "key": "ops",
    "title": "Ops",
    "base": "/ops",
    "list": false,
    "get": false,
    "create": null,
    "sub": [],
    "actions": [
      {
        "name": "dismiss",
        "fields": [
          "dlq_entry_id",
          "reason"
        ]
      },
      {
        "name": "retry",
        "fields": [
          "action_type",
          "reason"
        ]
      },
      {
        "name": "replay",
        "fields": [
          "projection_type",
          "reason"
        ]
      },
      {
        "name": "triage",
        "fields": [
          "reason",
          "severity",
          "assigned_to",
          "assigned_team"
        ]
      },
      {
        "name": "start-work",
        "fields": [
          "reason",
          "assigned_to"
        ]
      },
      {
        "name": "wait-external",
        "fields": [
          "reason",
          "waiting_on"
        ]
      },
      {
        "name": "resume",
        "fields": [
          "reason"
        ]
      },
      {
        "name": "escalate",
        "fields": [
          "reason"
        ]
      },
      {
        "name": "resolve",
        "fields": [
          "reason",
          "summary",
          "resolution_code"
        ]
      },
      {
        "name": "close",
        "fields": [
          "reason"
        ]
      },
      {
        "name": "dismiss",
        "fields": [
          "reason"
        ]
      },
      {
        "name": "cancel",
        "fields": [
          "reason"
        ]
      },
      {
        "name": "execute",
        "fields": []
      }
    ]
  },
  {
    "key": "optimization-plans",
    "title": "Optimization Plans",
    "base": "/optimization-plans",
    "list": true,
    "get": true,
    "create": [
      "fulfillment_request_id",
      "attempt_number"
    ],
    "sub": [
      {
        "path": "candidates",
        "fields": [
          "candidates"
        ]
      }
    ],
    "actions": [
      {
        "name": "select",
        "fields": [
          "selected_candidate_id",
          "policy_version",
          "feed_version",
          "product_catalog_version",
          "reference_data_version",
          "decision_trace_ref",
          "reason_code"
        ]
      },
      {
        "name": "confirm",
        "fields": []
      },
      {
        "name": "release",
        "fields": []
      }
    ]
  },
  {
    "key": "options",
    "title": "Options",
    "base": "/options",
    "list": true,
    "get": true,
    "create": null,
    "sub": [
      {
        "path": "deactivate",
        "fields": []
      },
      {
        "path": "toggle",
        "fields": [
          "enabled"
        ]
      }
    ],
    "actions": []
  },
  {
    "key": "orchestration",
    "title": "Orchestration",
    "base": "/orchestration",
    "list": false,
    "get": false,
    "create": null,
    "sub": [],
    "actions": [
      {
        "name": "reorchestrate",
        "fields": [
          "reason_code",
          "override_provider",
          "correlation_id"
        ]
      }
    ]
  },
  {
    "key": "packaging-profiles",
    "title": "Packaging Profiles",
    "base": "/packaging-profiles",
    "list": true,
    "get": true,
    "create": [
      "profile_id",
      "name",
      "package_type",
      "length",
      "width",
      "height",
      "max_weight",
      "dimension_unit",
      "weight_unit"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "parties",
    "title": "Parties",
    "base": "/parties",
    "list": true,
    "get": true,
    "create": [
      "party_id",
      "party_type",
      "legal_name",
      "display_name",
      "tax_id",
      "contacts",
      "default_address_id"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "partner-delivery-metrics",
    "title": "Partner Delivery Metrics",
    "base": "/partner-delivery-metrics",
    "list": true,
    "get": false,
    "create": null,
    "sub": [],
    "actions": []
  },
  {
    "key": "partner-deprecations",
    "title": "Partner Deprecations",
    "base": "/partner-deprecations",
    "list": true,
    "get": true,
    "create": [
      "contract_name",
      "contract_type",
      "deprecated_at",
      "replacement",
      "compatibility_window_days",
      "removal_not_before",
      "owner",
      "migration_note"
    ],
    "sub": [],
    "actions": [
      {
        "name": "remove",
        "fields": []
      }
    ]
  },
  {
    "key": "partner-entitlements",
    "title": "Partner Entitlements",
    "base": "/partner-entitlements",
    "list": true,
    "get": true,
    "create": [
      "partner_id",
      "scope",
      "resource_ref",
      "entitlement_version",
      "effective_from",
      "effective_until",
      "reason"
    ],
    "sub": [],
    "actions": [
      {
        "name": "suspend",
        "fields": [
          "reason"
        ]
      },
      {
        "name": "revoke",
        "fields": [
          "reason"
        ]
      },
      {
        "name": "expire",
        "fields": [
          "reason"
        ]
      },
      {
        "name": "reactivate",
        "fields": [
          "reason"
        ]
      }
    ]
  },
  {
    "key": "partner-sandbox-rules",
    "title": "Partner Sandbox Rules",
    "base": "/partner-sandbox-rules",
    "list": true,
    "get": false,
    "create": null,
    "sub": [],
    "actions": []
  },
  {
    "key": "plan-definitions",
    "title": "Plan Definitions",
    "base": "/plan-definitions",
    "list": false,
    "get": true,
    "create": [
      "request_id",
      "planning_version",
      "selected_route_code",
      "selected_warehouse_id",
      "selected_service_code",
      "selection_snapshot",
      "leg_specs"
    ],
    "sub": [
      {
        "path": "plan-input-snapshot",
        "fields": []
      }
    ],
    "actions": [
      {
        "name": "finalize",
        "fields": []
      },
      {
        "name": "release",
        "fields": []
      }
    ]
  },
  {
    "key": "policies",
    "title": "Policies",
    "base": "/policies",
    "list": false,
    "get": false,
    "create": null,
    "sub": [],
    "actions": [
      {
        "name": "rollout",
        "fields": [
          "tenant_scope",
          "change_reason",
          "rules",
          "effective_at",
          "created_by"
        ]
      }
    ]
  },
  {
    "key": "policy-versions",
    "title": "Policy Versions",
    "base": "/policy-versions",
    "list": false,
    "get": true,
    "create": [],
    "sub": [],
    "actions": [
      {
        "name": "rollout",
        "fields": []
      }
    ]
  },
  {
    "key": "provider-capabilities",
    "title": "Provider Capabilities",
    "base": "/provider-capabilities",
    "list": false,
    "get": true,
    "create": [
      "provider",
      "capability_code",
      "capability_type",
      "max_weight_kg",
      "dangerous_goods_supported",
      "battery_supported",
      "supported_label_formats"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "provider-invoices",
    "title": "Provider Invoices",
    "base": "/provider-invoices",
    "list": false,
    "get": false,
    "create": [
      "provider_id",
      "provider_invoice_number",
      "billed_amount",
      "currency"
    ],
    "sub": [],
    "actions": [
      {
        "name": "reconcile",
        "fields": [
          "expected_amount"
        ]
      },
      {
        "name": "approve",
        "fields": []
      },
      {
        "name": "markPaid",
        "fields": [
          "payment_ref"
        ]
      }
    ]
  },
  {
    "key": "quotes",
    "title": "Quotes",
    "base": "/quotes",
    "list": true,
    "get": true,
    "create": [
      "customer_id",
      "contract_id",
      "service_product_id",
      "business_ref"
    ],
    "sub": [],
    "actions": [
      {
        "name": "offer",
        "fields": [
          "lines",
          "total",
          "currency",
          "fx_snapshot",
          "valid_until"
        ]
      },
      {
        "name": "accept",
        "fields": [
          "accepted_by"
        ]
      },
      {
        "name": "reject",
        "fields": [
          "reason"
        ]
      },
      {
        "name": "expire",
        "fields": []
      }
    ]
  },
  {
    "key": "registry",
    "title": "Registry",
    "base": "/registry",
    "list": false,
    "get": false,
    "create": null,
    "sub": [],
    "actions": [
      {
        "name": "disable",
        "fields": [
          "reason"
        ]
      }
    ]
  },
  {
    "key": "returns",
    "title": "Returns",
    "base": "/returns",
    "list": true,
    "get": true,
    "create": [
      "shipment_ref",
      "correlation_id"
    ],
    "sub": [
      {
        "path": "lines",
        "fields": [
          "original_order_ref",
          "product_ref",
          "quantity",
          "reason",
          "condition_notes"
        ]
      }
    ],
    "actions": [
      {
        "name": "authorize",
        "fields": []
      },
      {
        "name": "reject",
        "fields": []
      },
      {
        "name": "schedulePickup",
        "fields": [
          "pickup_ref"
        ]
      },
      {
        "name": "markInTransit",
        "fields": [
          "return_shipment_ref"
        ]
      },
      {
        "name": "markReceived",
        "fields": []
      },
      {
        "name": "startInspection",
        "fields": []
      },
      {
        "name": "completeInspection",
        "fields": [
          "inspector",
          "condition",
          "disposition",
          "notes",
          "inspected_at",
          "refund_amount"
        ]
      },
      {
        "name": "cancel",
        "fields": []
      }
    ]
  },
  {
    "key": "route-groups",
    "title": "Route Groups",
    "base": "/route-groups",
    "list": true,
    "get": false,
    "create": null,
    "sub": [],
    "actions": []
  },
  {
    "key": "route-templates",
    "title": "Route Templates",
    "base": "/route-templates",
    "list": false,
    "get": true,
    "create": [
      "template_code",
      "name",
      "total_legs",
      "legs",
      "route_group_code",
      "handoff_strategy",
      "customs_leg_positions"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "selection-policies",
    "title": "Selection Policies",
    "base": "/selection-policies",
    "list": true,
    "get": true,
    "create": [
      "version",
      "description",
      "product_catalog_version_ref",
      "service_product_ref",
      "lane_key",
      "provider_capability_ref",
      "product_mode"
    ],
    "sub": [
      {
        "path": "rules",
        "fields": [
          "rule_name",
          "weight",
          "threshold",
          "description",
          "reason_code_on_reject"
        ]
      }
    ],
    "actions": [
      {
        "name": "publish",
        "fields": []
      },
      {
        "name": "rollback",
        "fields": [
          "reason"
        ]
      },
      {
        "name": "archive",
        "fields": []
      }
    ]
  },
  {
    "key": "service-profiles",
    "title": "Service Profiles",
    "base": "/service-profiles",
    "list": true,
    "get": true,
    "create": [
      "profile_id",
      "name",
      "service_type",
      "delivery_commitment",
      "signature_required",
      "temperature_control",
      "dangerous_goods_allowed",
      "insurance_included",
      "pickup_window",
      "max_transit_days"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "settlements",
    "title": "Settlements",
    "base": "/settlements",
    "list": true,
    "get": true,
    "create": [
      "settlement_type",
      "counterparty_ref",
      "currency",
      "correlation_id"
    ],
    "sub": [
      {
        "path": "lines",
        "fields": [
          "fact_ref",
          "description",
          "amount",
          "currency"
        ]
      }
    ],
    "actions": [
      {
        "name": "submit",
        "fields": []
      },
      {
        "name": "approve",
        "fields": []
      },
      {
        "name": "invoice",
        "fields": [
          "invoice_ref"
        ]
      },
      {
        "name": "markPaid",
        "fields": [
          "payment_ref"
        ]
      },
      {
        "name": "cancel",
        "fields": []
      },
      {
        "name": "issueInvoice",
        "fields": [
          "invoice_number",
          "due_days"
        ]
      }
    ]
  },
  {
    "key": "shipments",
    "title": "Shipments",
    "base": "/shipments",
    "list": true,
    "get": true,
    "create": [
      "lane",
      "legs",
      "order_refs",
      "policy_version",
      "consignee_address_snapshot",
      "service_profile_snapshot",
      "shipper_snapshot",
      "package_snapshot",
      "customs_items_snapshot"
    ],
    "sub": [
      {
        "path": "legs",
        "fields": [
          "provider",
          "service_product",
          "ship_from",
          "ship_to",
          "parcel",
          "sequence",
          "transport_mode",
          "mapping_version",
          "origin_location_id",
          "destination_location_id"
        ]
      }
    ],
    "actions": [
      {
        "name": "plan",
        "fields": []
      },
      {
        "name": "confirm",
        "fields": []
      },
      {
        "name": "replan",
        "fields": []
      },
      {
        "name": "complete",
        "fields": []
      },
      {
        "name": "assignProvider",
        "fields": []
      },
      {
        "name": "requestLabel",
        "fields": []
      },
      {
        "name": "markFailed",
        "fields": [
          "reason_code"
        ]
      },
      {
        "name": "reassignProvider",
        "fields": [
          "provider",
          "service_product"
        ]
      },
      {
        "name": "createLabel",
        "fields": [
          "idempotency_key",
          "correlation_id",
          "label_options"
        ]
      },
      {
        "name": "markInTransit",
        "fields": []
      },
      {
        "name": "markDelivered",
        "fields": []
      },
      {
        "name": "cancel",
        "fields": [
          "reason_code"
        ]
      },
      {
        "name": "cancel",
        "fields": [
          "reason_code"
        ]
      },
      {
        "name": "cancelWithCompensation",
        "fields": [
          "reason_code",
          "correlation_id"
        ]
      },
      {
        "name": "swapTracking",
        "fields": [
          "new_tracking_number"
        ]
      },
      {
        "name": "startBooking",
        "fields": []
      },
      {
        "name": "markBooked",
        "fields": []
      },
      {
        "name": "readyForExecution",
        "fields": []
      },
      {
        "name": "arriveDestination",
        "fields": []
      },
      {
        "name": "raiseException",
        "fields": [
          "reason_code"
        ]
      },
      {
        "name": "resolveException",
        "fields": []
      },
      {
        "name": "requestBooking",
        "fields": []
      },
      {
        "name": "confirmBooking",
        "fields": [
          "booking_ref"
        ]
      },
      {
        "name": "rejectBooking",
        "fields": [
          "reason_code"
        ]
      },
      {
        "name": "markReady",
        "fields": []
      },
      {
        "name": "markArrived",
        "fields": []
      },
      {
        "name": "exportEvidencePackage",
        "fields": []
      }
    ]
  },
  {
    "key": "status-mappings",
    "title": "Status Mappings",
    "base": "/status-mappings",
    "list": false,
    "get": true,
    "create": [
      "provider",
      "external_object_type",
      "external_status_code",
      "internal_object_type",
      "internal_status",
      "external_status_text",
      "is_terminal",
      "is_failure",
      "notify_customer"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "tax-calculations",
    "title": "Tax Calculations",
    "base": "/tax-calculations",
    "list": false,
    "get": false,
    "create": [
      "taxable_base",
      "jurisdiction",
      "tax_type",
      "currency"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "tenants",
    "title": "Tenants",
    "base": "/tenants",
    "list": true,
    "get": true,
    "create": [
      "name",
      "display_name",
      "tier",
      "region",
      "country",
      "default_currency",
      "timezone",
      "settings",
      "contact_email"
    ],
    "sub": [],
    "actions": [
      {
        "name": "suspend",
        "fields": [
          "reason"
        ]
      },
      {
        "name": "activate",
        "fields": []
      }
    ]
  },
  {
    "key": "tracking",
    "title": "Tracking",
    "base": "/tracking",
    "list": false,
    "get": true,
    "create": null,
    "sub": [],
    "actions": []
  },
  {
    "key": "unit-mappings",
    "title": "Unit Mappings",
    "base": "/unit-mappings",
    "list": true,
    "get": false,
    "create": [
      "unit_type",
      "source_unit",
      "canonical_unit",
      "channel",
      "locale"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "warehouse-profiles",
    "title": "Warehouse Profiles",
    "base": "/warehouse-profiles",
    "list": false,
    "get": true,
    "create": [
      "warehouse_id",
      "origin_region_code",
      "dangerous_goods_capable",
      "battery_goods_capable",
      "cold_chain_capable",
      "default_provider",
      "max_daily_dispatch_volume"
    ],
    "sub": [],
    "actions": []
  },
  {
    "key": "write-offs",
    "title": "Write Offs",
    "base": "/write-offs",
    "list": false,
    "get": false,
    "create": [
      "invoice_id",
      "amount",
      "reason_code",
      "shipment_ref",
      "currency",
      "requested_by"
    ],
    "sub": [],
    "actions": [
      {
        "name": "approve",
        "fields": [
          "approved_by"
        ]
      },
      {
        "name": "post",
        "fields": []
      },
      {
        "name": "reject",
        "fields": []
      }
    ]
  }
]
