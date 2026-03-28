import { Badge, HStack, Stack, Table } from "@chakra-ui/react"
import { useState } from "react"
import { orders } from "../../data/orders.data"
import { PAGE_SIZE, ORDER_COLUMN_LABELS } from "../../constants/table.constants"
import AppPagination from "../common/Pagination"

function formatColumnLabel(key: string): string {
  return (
    ORDER_COLUMN_LABELS[key] ??
    key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())
  )
}

function OrdersTable() {
  const [page, setPage] = useState(1)

  const start = (page - 1) * PAGE_SIZE
  const paginated = orders.slice(start, start + PAGE_SIZE)

  return (
    <Stack gap="4">
      <Table.Root
        size="lg"
        variant="outline"
        bg="white"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="sm"
      >
        <Table.Header>
          <Table.Row bg="gray.50">
            {Object.keys(orders[0]).map((key) => (
              <Table.ColumnHeader
                key={key}
                fontWeight="semibold"
                color="gray.600"
                fontSize="sm"
                textTransform="none"
                letterSpacing="normal"
                py={3}
                px={4}
              >
                {formatColumnLabel(key)}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {paginated.map((item) => (
            <Table.Row
              key={item.orderId}
              _hover={{ bg: "gray.50" }}
              transition="background 0.15s"
            >
              <Table.Cell py={3} px={4} color="gray.700" fontWeight="medium">{item.orderId}</Table.Cell>
              <Table.Cell py={3} px={4} color="gray.600">{item.userId}</Table.Cell>
              <Table.Cell py={3} px={4} color="gray.800" fontWeight="medium">{item.name}</Table.Cell>
              <Table.Cell py={3} px={4} color="gray.600">{item.mobile}</Table.Cell>
              <Table.Cell py={3} px={4}>
                <Badge colorPalette={item.paid ? "green" : "red"} variant="subtle" borderRadius="full" px={2}>
                  {item.paid ? "Paid" : "Unpaid"}
                </Badge>
              </Table.Cell>
              <Table.Cell py={3} px={4}>
                <Badge colorPalette={item.accepted ? "blue" : "orange"} variant="subtle" borderRadius="full" px={2}>
                  {item.accepted ? "Accepted" : "Rejected"}
                </Badge>
              </Table.Cell>
              <Table.Cell py={3} px={4} color="gray.600">{item.copies}</Table.Cell>
              <Table.Cell py={3} px={4} color="gray.600">{item.time}</Table.Cell>
              <Table.Cell py={3} px={4} color="gray.600">{item.paymentMode}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <HStack justify="flex-end" px={1}>
        <AppPagination
          count={orders.length}
          pageSize={PAGE_SIZE}
          page={page}
          onPageChange={setPage}
        />
      </HStack>
    </Stack>
  )
}

export default OrdersTable
