import { Badge, Button, HStack, Skeleton, Stack, Table, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { getAllOrders, acceptOrder, completeOrder, cancelOrder } from "../../services/orders.service"
import type { OrderActionResponse } from "../../services/orders.service"

const STATUS_COLOR: Record<string, string> = {
  pending:   "orange",
  accepted:  "blue",
  completed: "green",
  cancelled: "red",
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleString()
}

function OrdersTable() {
  const [orders, setOrders] = useState<OrderActionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<Record<string, string>>({})

  function fetchOrders() {
    setLoading(true)
    getAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  async function handleAction(
    orderId: string,
    action: "accept" | "complete" | "cancel"
  ) {
    setActionLoading((prev) => ({ ...prev, [orderId]: action }))
    try {
      if (action === "accept")   await acceptOrder(orderId)
      if (action === "complete") await completeOrder(orderId)
      if (action === "cancel")   await cancelOrder(orderId)
      fetchOrders()
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev }
        delete next[orderId]
        return next
      })
    }
  }

  const COLUMNS = ["Order ID", "Email", "Items", "File Name", "Status", "Created At", "Updated At", "Actions"]

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
            {COLUMNS.map((col) => (
              <Table.ColumnHeader
                key={col}
                fontWeight="semibold"
                color="gray.600"
                fontSize="sm"
                textTransform="none"
                letterSpacing="normal"
                py={3}
                px={4}
              >
                {col}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Table.Row key={i}>
                  {COLUMNS.map((col) => (
                    <Table.Cell key={col} py={3} px={4}>
                      <Skeleton height="18px" borderRadius="md" />
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            : orders.map((order) => {
                const busy = actionLoading[order.orderId]
                const status = order.orderStatus?.toLowerCase() ?? "pending"
                return (
                  <Table.Row key={order.orderId} _hover={{ bg: "gray.50" }} transition="background 0.15s">
                    <Table.Cell py={3} px={4} color="gray.700" fontWeight="medium">{order.orderId}</Table.Cell>
                    <Table.Cell py={3} px={4} color="gray.600">{order.email}</Table.Cell>
                    <Table.Cell py={3} px={4} color="gray.600">{order.itemCount}</Table.Cell>
                    <Table.Cell py={3} px={4} color="gray.500">{order.fileName ?? "—"}</Table.Cell>
                    <Table.Cell py={3} px={4}>
                      <Badge
                        colorPalette={STATUS_COLOR[status] ?? "gray"}
                        variant="subtle"
                        borderRadius="full"
                        px={2}
                        textTransform="capitalize"
                      >
                        {order.orderStatus ?? "Pending"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell py={3} px={4} color="gray.500" fontSize="sm">{formatDate(order.createdAt)}</Table.Cell>
                    <Table.Cell py={3} px={4} color="gray.500" fontSize="sm">{formatDate(order.updatedAt)}</Table.Cell>
                    <Table.Cell py={3} px={4}>
                      <HStack gap={2}>
                        <Button
                          size="xs"
                          colorPalette="blue"
                          variant="subtle"
                          loading={busy === "accept"}
                          disabled={!!busy}
                          onClick={() => handleAction(order.orderId, "accept")}
                        >
                          Accept
                        </Button>
                        <Button
                          size="xs"
                          colorPalette="green"
                          variant="subtle"
                          loading={busy === "complete"}
                          disabled={!!busy}
                          onClick={() => handleAction(order.orderId, "complete")}
                        >
                          Complete
                        </Button>
                        <Button
                          size="xs"
                          colorPalette="red"
                          variant="subtle"
                          loading={busy === "cancel"}
                          disabled={!!busy}
                          onClick={() => handleAction(order.orderId, "cancel")}
                        >
                          Cancel
                        </Button>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                )
              })}
        </Table.Body>
      </Table.Root>

      {!loading && orders.length === 0 && (
        <Text textAlign="center" color="gray.400" py={4}>
          No orders found.
        </Text>
      )}
    </Stack>
  )
}

export default OrdersTable
