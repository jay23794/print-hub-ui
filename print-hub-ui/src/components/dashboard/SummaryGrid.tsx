import { SimpleGrid } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import SummaryCard from "./SummaryCard"
import { getOrderSummary, type OrderSummary } from "../../services/orders.service"

const CARD_CONFIG: { key: keyof OrderSummary; label: string; color: string }[] = [
  { key: "todayOrders", label: "Today Orders", color: "blue.500" },
  { key: "pending",     label: "Pending",      color: "orange.400" },
  { key: "cancelled",   label: "Cancelled",    color: "red.500" },
  { key: "delivered",   label: "Delivered",    color: "green.500" },
  { key: "totalPrints", label: "Total Prints", color: "purple.500" },
  { key: "totalOrders", label: "Total Orders", color: "teal.500" },
]

function SummaryGrid() {
  const [summary, setSummary] = useState<OrderSummary | null>(null)

  useEffect(() => {
    let cancelled = false
    getOrderSummary()
      .then((data) => {
        if (!cancelled) setSummary(data)
      })
      .catch(() => {
        // Leave cards showing "—" on failure.
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <SimpleGrid minChildWidth="150px" gap="4">
      {CARD_CONFIG.map((card) => (
        <SummaryCard
          key={card.key}
          label={card.label}
          value={summary ? summary[card.key] : "—"}
          color={card.color}
        />
      ))}
    </SimpleGrid>
  )
}

export default SummaryGrid
