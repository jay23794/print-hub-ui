export type OrderStatusCode =
  | "UPLOADING"
  | "UPLOAD_FAILED"
  | "READY_FOR_PRINT"
  | "PAYMENT_PENDING"
  | "PAYMENT_FAILED"
  | "PAID"
  | "PENDING_ACCEPTANCE"
  | "ACCEPTED"
  | "REJECTED"
  | "PRINTING"
  | "PRINTED"
  | "PACKED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "DELIVERY_FAILED"
  | "CANCELLED"
  | "REFUNDED"

export type OrderStage =
  | "Intake"
  | "Payment"
  | "Admin Review"
  | "Fulfillment"
  | "Delivery"
  | "Terminal"

export interface OrderStatusMeta {
  code: OrderStatusCode
  label: string
  stage: OrderStage
  color: string
  description: string
}

export const ORDER_STATUS_META: Record<OrderStatusCode, OrderStatusMeta> = {
  UPLOADING:          { code: "UPLOADING",          label: "Uploading",           stage: "Intake",       color: "cyan",   description: "Awaiting per-item upload completion." },
  UPLOAD_FAILED:      { code: "UPLOAD_FAILED",      label: "Upload Failed",       stage: "Intake",       color: "red",    description: "One or more items failed to upload." },
  READY_FOR_PRINT:    { code: "READY_FOR_PRINT",    label: "Ready for Print",     stage: "Intake",       color: "teal",   description: "Files uploaded; awaiting checkout." },
  PAYMENT_PENDING:    { code: "PAYMENT_PENDING",    label: "Payment Pending",     stage: "Payment",      color: "orange", description: "Payment in flight with gateway." },
  PAYMENT_FAILED:     { code: "PAYMENT_FAILED",     label: "Payment Failed",      stage: "Payment",      color: "red",    description: "Payment attempt failed; retryable." },
  PAID:               { code: "PAID",               label: "Paid",                stage: "Payment",      color: "green",  description: "Payment confirmed; order locked in." },
  PENDING_ACCEPTANCE: { code: "PENDING_ACCEPTANCE", label: "Pending Acceptance",  stage: "Admin Review", color: "yellow", description: "Awaiting admin review." },
  ACCEPTED:           { code: "ACCEPTED",           label: "Accepted",            stage: "Admin Review", color: "blue",   description: "Approved; enters print queue." },
  REJECTED:           { code: "REJECTED",           label: "Rejected",            stage: "Admin Review", color: "red",    description: "Declined; usually refunded." },
  PRINTING:           { code: "PRINTING",           label: "Printing",            stage: "Fulfillment",  color: "purple", description: "Job actively printing." },
  PRINTED:            { code: "PRINTED",            label: "Printed",             stage: "Fulfillment",  color: "purple", description: "Print done; awaiting packing." },
  PACKED:             { code: "PACKED",             label: "Packed",              stage: "Fulfillment",  color: "teal",   description: "Packed; awaiting courier pickup." },
  OUT_FOR_DELIVERY:   { code: "OUT_FOR_DELIVERY",   label: "Out for Delivery",    stage: "Delivery",     color: "blue",   description: "En route to customer." },
  DELIVERED:          { code: "DELIVERED",          label: "Delivered",           stage: "Delivery",     color: "green",  description: "Successfully delivered." },
  DELIVERY_FAILED:    { code: "DELIVERY_FAILED",    label: "Delivery Failed",     stage: "Delivery",     color: "red",    description: "Attempt failed; retry or refund." },
  CANCELLED:          { code: "CANCELLED",          label: "Cancelled",           stage: "Terminal",     color: "gray",   description: "Cancelled before fulfillment." },
  REFUNDED:           { code: "REFUNDED",           label: "Refunded",            stage: "Terminal",     color: "gray",   description: "Payment returned." },
}

export const ORDER_STAGES: OrderStage[] = [
  "Intake",
  "Payment",
  "Admin Review",
  "Fulfillment",
  "Delivery",
  "Terminal",
]

export const STATUSES_BY_STAGE: Record<OrderStage, OrderStatusMeta[]> = ORDER_STAGES.reduce(
  (acc, stage) => {
    acc[stage] = Object.values(ORDER_STATUS_META).filter((s) => s.stage === stage)
    return acc
  },
  {} as Record<OrderStage, OrderStatusMeta[]>,
)

const LEGACY_STATUS_MAP: Record<string, OrderStatusCode> = {
  pending:          "PENDING_ACCEPTANCE",
  approval_pending: "PENDING_ACCEPTANCE",
  accepted:         "ACCEPTED",
  completed:        "DELIVERED",
  cancelled:        "CANCELLED",
  rejected:         "REJECTED",
}

export function normalizeOrderStatus(status?: string | null): OrderStatusCode {
  if (!status) return "PENDING_ACCEPTANCE"
  const upper = status.toUpperCase() as OrderStatusCode
  if (ORDER_STATUS_META[upper]) return upper
  const legacy = LEGACY_STATUS_MAP[status.toLowerCase()]
  return legacy ?? "PENDING_ACCEPTANCE"
}

export function getStatusMeta(status?: string | null): OrderStatusMeta {
  return ORDER_STATUS_META[normalizeOrderStatus(status)]
}
