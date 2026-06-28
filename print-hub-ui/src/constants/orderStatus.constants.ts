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
  | "Review"
  | "In Shop"
  | "Delivery"
  | "Terminal"

export type StatusIntent =
  | "intake"
  | "review"
  | "in-shop"
  | "delivery"
  | "success"
  | "failure"
  | "refund"

export interface OrderStatusMeta {
  code: OrderStatusCode
  label: string
  stage: OrderStage
  intent: StatusIntent
  color: string
  description: string
}

export const ORDER_STATUS_META: Record<OrderStatusCode, OrderStatusMeta> = {
  UPLOADING:          { code: "UPLOADING",          label: "Uploading",         stage: "Intake",   intent: "intake",   color: "gray",   description: "Awaiting per-item upload completion." },
  UPLOAD_FAILED:      { code: "UPLOAD_FAILED",      label: "Upload failed",     stage: "Intake",   intent: "intake",   color: "yellow", description: "One or more items failed to upload; retryable." },
  READY_FOR_PRINT:    { code: "READY_FOR_PRINT",    label: "Ready for print",   stage: "Intake",   intent: "intake",   color: "gray",   description: "Files uploaded; awaiting checkout." },
  PAYMENT_PENDING:    { code: "PAYMENT_PENDING",    label: "Payment pending",   stage: "Intake",   intent: "review",   color: "yellow", description: "Payment in flight with gateway." },
  PAYMENT_FAILED:     { code: "PAYMENT_FAILED",     label: "Payment failed",    stage: "Intake",   intent: "failure",  color: "red",    description: "Payment attempt failed; retryable." },
  PAID:               { code: "PAID",               label: "Paid",              stage: "Intake",   intent: "in-shop",  color: "blue",   description: "Payment confirmed; awaiting review." },
  PENDING_ACCEPTANCE: { code: "PENDING_ACCEPTANCE", label: "Pending acceptance", stage: "Review",  intent: "review",   color: "yellow", description: "Awaiting admin review." },
  ACCEPTED:           { code: "ACCEPTED",           label: "Accepted",          stage: "In Shop",  intent: "in-shop",  color: "blue",   description: "Approved; enters print queue." },
  REJECTED:           { code: "REJECTED",           label: "Rejected",          stage: "Terminal", intent: "failure",  color: "red",    description: "Declined; refund may be owed." },
  PRINTING:           { code: "PRINTING",           label: "Printing",          stage: "In Shop",  intent: "in-shop",  color: "blue",   description: "Job actively printing." },
  PRINTED:            { code: "PRINTED",            label: "Printed",           stage: "In Shop",  intent: "in-shop",  color: "blue",   description: "Print done; awaiting packing." },
  PACKED:             { code: "PACKED",             label: "Packed",            stage: "In Shop",  intent: "in-shop",  color: "blue",   description: "Packed; awaiting courier pickup." },
  OUT_FOR_DELIVERY:   { code: "OUT_FOR_DELIVERY",   label: "Out for delivery",  stage: "Delivery", intent: "delivery", color: "purple", description: "En route to customer." },
  DELIVERED:          { code: "DELIVERED",          label: "Delivered",         stage: "Delivery", intent: "success",  color: "green",  description: "Successfully delivered." },
  DELIVERY_FAILED:    { code: "DELIVERY_FAILED",    label: "Delivery failed",   stage: "Delivery", intent: "failure",  color: "red",    description: "Attempt failed; retry or refund." },
  CANCELLED:          { code: "CANCELLED",          label: "Cancelled",         stage: "Terminal", intent: "failure",  color: "red",    description: "Cancelled before fulfillment." },
  REFUNDED:           { code: "REFUNDED",           label: "Refunded",          stage: "Terminal", intent: "refund",   color: "gray",   description: "Payment returned." },
}

export const ORDER_STAGES: OrderStage[] = [
  "Intake",
  "Review",
  "In Shop",
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

// ---------- Payment status ----------

export type PaymentStatusCode =
  | "NOT_REQUIRED"
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"

export interface PaymentStatusMeta {
  code: PaymentStatusCode
  label: string
  color: string
}

export const PAYMENT_STATUS_META: Record<PaymentStatusCode, PaymentStatusMeta> = {
  NOT_REQUIRED: { code: "NOT_REQUIRED", label: "Not required", color: "gray"   },
  PENDING:      { code: "PENDING",      label: "Pending",      color: "yellow" },
  PAID:         { code: "PAID",         label: "Paid",         color: "green"  },
  FAILED:       { code: "FAILED",       label: "Failed",       color: "red"    },
  REFUNDED:     { code: "REFUNDED",     label: "Refunded",     color: "gray"   },
}

export const PAYMENT_STATUSES: PaymentStatusCode[] = [
  "NOT_REQUIRED",
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
]

export function normalizePaymentStatus(status?: string | null): PaymentStatusCode {
  if (!status) return "PENDING"
  const upper = status.toUpperCase() as PaymentStatusCode
  return PAYMENT_STATUS_META[upper] ? upper : "PENDING"
}

export function getPaymentStatusMeta(status?: string | null): PaymentStatusMeta {
  return PAYMENT_STATUS_META[normalizePaymentStatus(status)]
}

// ---------- Payment method ----------

export type PaymentMethodCode = "COD" | "UPI"

export interface PaymentMethodMeta {
  code: PaymentMethodCode
  label: string
  color: string
}

export const PAYMENT_METHOD_META: Record<PaymentMethodCode, PaymentMethodMeta> = {
  COD: { code: "COD", label: "COD", color: "orange" },
  UPI: { code: "UPI", label: "UPI", color: "teal"   },
}

export function normalizePaymentMethod(method?: string | null): PaymentMethodCode {
  const upper = (method ?? "").toUpperCase() as PaymentMethodCode
  return PAYMENT_METHOD_META[upper] ? upper : "COD"
}

export function getPaymentMethodMeta(method?: string | null): PaymentMethodMeta {
  return PAYMENT_METHOD_META[normalizePaymentMethod(method)]
}
