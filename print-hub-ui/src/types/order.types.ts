export type PaymentMode = "UPI" | "CASH"

export type OrderStatus = "pending" | "accepted" | "rejected"

export interface IOrder {
  userId: string
  orderId: string
  name: string
  mobile: string
  paid: boolean
  accepted: boolean
  copies: string
  time: string
  paymentMode: PaymentMode
}
