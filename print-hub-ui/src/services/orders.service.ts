import { apiGet, apiPatch } from "../lib/api"

export interface OrderActionResponse {
  email: string
  itemCount: number
  fileName?: string
  orderId: string
  orderStatus?: string
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
