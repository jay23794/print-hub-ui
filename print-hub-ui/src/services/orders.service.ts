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

export async function getAllOrders(): Promise<OrderActionResponse[]> {
  return apiGet<OrderActionResponse[]>("/admin/order/all")
}

export async function acceptOrder(orderId: string): Promise<OrderActionResponse> {
  return apiPatch<OrderActionResponse>("/accept", { orderId })
}

export async function completeOrder(orderId: string): Promise<OrderActionResponse> {
  return apiPatch<OrderActionResponse>("/complete", { orderId })
}

export async function cancelOrder(orderId: string): Promise<OrderActionResponse> {
  return apiPatch<OrderActionResponse>("/cancel", { orderId })
}
