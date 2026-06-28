import { apiGet, apiPatch } from "../lib/api"

export interface OrderActionResponse {
  _id: string
  email: string
  itemCount: number
  fileName?: string
  orderId: string
  orderStatus?: string
  paymentStatus?: string
  paymentMethod?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  _id: string
  orderId: string
  fileType: string
  fileName: string
  numberOfCopy: number
  samePage: boolean
  documentLinks: string[]
  printType: string
}

export interface SearchOrdersParams {
  id?: string
  status?: string
  range?: string
  page?: number
  limit?: number
}

export interface SearchOrdersResult {
  orders: OrderActionResponse[]
  total: number
}

export async function searchOrders(params: SearchOrdersParams): Promise<SearchOrdersResult> {
  const query = new URLSearchParams()
  if (params.id)     query.set("id", params.id)
  if (params.status) query.set("status", params.status)
  if (params.range)  query.set("range", params.range)
  if (params.page  != null) query.set("page", String(params.page))
  if (params.limit != null) query.set("limit", String(params.limit))

  const url = `/admin/order/search${query.toString() ? `?${query}` : ""}`

  if (params.id) {
    const res = await apiGet<{ data: OrderActionResponse }>(url)
    return { orders: [res.data], total: 1 }
  }

  const res = await apiGet<{ data: OrderActionResponse[]; total: number }>(url)
  return { orders: res.data ?? [], total: res.total ?? 0 }
}

export interface ListOrdersParams {
  cursor?: string | null
  orderStatus?: string | null
}

export interface ListOrdersResult {
  orders: OrderActionResponse[]
  hasNextPage: boolean
}

export const ORDERS_PAGE_SIZE = 30

export async function listOrders({ cursor, orderStatus }: ListOrdersParams): Promise<ListOrdersResult> {
  // Endpoints:
  //   /admin/order/all                       — first page, no filter
  //   /admin/order/all/:orderStatus          — first page, filtered
  //   /admin/order/all/:cursor/:orderStatus  — subsequent pages
  // For paging without a status filter we pass "ALL" as the sentinel.
  let path: string
  if (!cursor) {
    path = orderStatus
      ? `/admin/order/all/${encodeURIComponent(orderStatus)}`
      : `/admin/order/all`
  } else {
    path = `/admin/order/all/${encodeURIComponent(cursor)}/${encodeURIComponent(orderStatus ?? "ALL")}`
  }

  const res = await apiGet<{ data: OrderActionResponse[]; hasNextPage: boolean }>(path)
  return {
    orders: res.data ?? [],
    hasNextPage: !!res.hasNextPage,
  }
}

export async function getOrderById(id: string): Promise<OrderItem[]> {
  const res = await apiGet<{ data: { items: OrderItem[] } }>(`/admin/order/get/${id}`)
  return res.data.items
}

export async function getAllOrders(): Promise<OrderActionResponse[]> {
  const res = await apiGet<{ data: OrderActionResponse[] }>("/admin/order/all")
  return res.data
}

export async function acceptOrder(orderId: string): Promise<OrderActionResponse> {
  return apiPatch<OrderActionResponse>("/admin/order/accept", { orderId })
}

export async function completeOrder(orderId: string): Promise<OrderActionResponse> {
  return apiPatch<OrderActionResponse>("/admin/order/complete", { orderId })
}

export async function cancelOrder(orderId: string): Promise<OrderActionResponse> {
  return apiPatch<OrderActionResponse>("/admin/order/cancel", { orderId })
}

export interface DispatchResult {
  orderId: string
  orderStatus: string
}

export interface DeliveredResult {
  orderId: string
  orderStatus: string
  paymentStatus?: string
  paymentMethod?: string
}

interface AdminEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export async function dispatchOrder(orderId: string): Promise<AdminEnvelope<DispatchResult>> {
  return apiPatch<AdminEnvelope<DispatchResult>>("/admin/order/dispatch", { orderId })
}

export async function markDelivered(orderId: string): Promise<AdminEnvelope<DeliveredResult>> {
  return apiPatch<AdminEnvelope<DeliveredResult>>("/admin/order/delivered", { orderId })
}
