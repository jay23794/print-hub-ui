import { SimpleGrid } from "@chakra-ui/react"
import type { SummaryCardData } from "../../types/dashboard.types"
import SummaryCard from "./SummaryCard"

const SUMMARY_CARDS: SummaryCardData[] = [
  { label: "Today Orders", value: 24, color: "blue.500" },
  { label: "Pending", value: 8, color: "orange.400" },
  { label: "Cancelled", value: 3, color: "red.500" },
  { label: "Delivered", value: 13, color: "green.500" },
  { label: "Total Prints", value: 1240, color: "purple.500" },
  { label: "Total Orders", value: 320, color: "teal.500" },
]

function SummaryGrid() {
  return (
    <SimpleGrid minChildWidth="150px" gap="4">
      {SUMMARY_CARDS.map((card) => (
        <SummaryCard
          key={card.label}
          label={card.label}
          value={card.value}
          color={card.color}
        />
      ))}
    </SimpleGrid>
  )
}

export default SummaryGrid
