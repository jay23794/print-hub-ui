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
