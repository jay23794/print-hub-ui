import { SimpleGrid } from "@chakra-ui/react"
import SummaryCard from "./SummaryCard"

const STATIC_CARDS = [
  { label: "Today Orders", value: 0, color: "blue.500" },
  { label: "Pending",      value: 0, color: "orange.400" },
  { label: "Cancelled",    value: 0, color: "red.500" },
  { label: "Delivered",    value: 0, color: "green.500" },
  { label: "Total Prints", value: 0, color: "purple.500" },
  { label: "Total Orders", value: 0, color: "teal.500" },
]

function SummaryGrid() {
  return (
    <SimpleGrid minChildWidth="150px" gap="4">
      {STATIC_CARDS.map((card) => (
        <SummaryCard key={card.label} label={card.label} value={card.value} color={card.color} />
      ))}
    </SimpleGrid>
  )
}

export default SummaryGrid
