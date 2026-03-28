import { Card, Text } from "@chakra-ui/react"
import type { SummaryCardProps } from "../../types/dashboard.types"

function SummaryCard({ label, value, color = "blue.500" }: SummaryCardProps) {
  return (
    <Card.Root bg="white" shadow="sm" borderRadius="lg" p="4" border="1px solid" borderColor="gray.100">
      <Card.Body p="0">
        <Text fontSize="2xl" fontWeight="bold" color={color}>
          {value}
        </Text>
      </Card.Body>
      <Card.Footer p="0" mt="2">
        <Text fontSize="sm" color="gray.500" fontWeight="medium">
          {label}
        </Text>
      </Card.Footer>
    </Card.Root>
  )
}

export default SummaryCard
