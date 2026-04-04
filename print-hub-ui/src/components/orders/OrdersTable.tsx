import { Badge, Button, HStack, Skeleton, Stack, Table, Text } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { searchOrders, acceptOrder, completeOrder, cancelOrder, getOrderById } from "../../services/orders.service"
import type { OrderActionResponse, OrderItem } from "../../services/orders.service"
import OrderDetailModal from "./OrderDetailModal"

const STATUS_COLOR: Record<string, string> = {
  pending:          "orange",
  approval_pending: "yellow",
  accepted:         "blue",
  completed:        "green",
  cancelled:        "red",
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleString()
}

interface OrdersTableProps {
  searchId: string
  status: string | null
  range: string | null
}

function OrdersTable({ searchId, status, range }: OrdersTableProps) {
  const [orders, setOrders] = useState<OrderActionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<Record<string, string>>({})
  const [selectedOrder, setSelectedOrder] = useState<OrderActionResponse | null>(null)
  const [orderDetail, setOrderDetail] = useState<OrderItem[] | null>(null)
  const [detailLoading, setDetailLoading] = useState<string | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function fetchOrders(cursor?: string) {
    const isLoadMore = !!cursor
    if (isLoadMore) setLoadingMore(true)
    else setLoading(true)

    searchOrders({ id: searchId || undefined, status: status ?? undefined, range: range ?? undefined, cursor })
      .then(({ orders: newOrders, nextCursor: nc }) => {
        setOrders((prev) => isLoadMore ? [...prev, ...newOrders] : newOrders)
        setNextCursor(nc)
      })
      .finally(() => {
        setLoading(false)
        setLoadingMore(false)
      })
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setOrders([])
      setNextCursor(null)
      fetchOrders()
    }, searchId ? 400 : 0)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchId, status, range])

  function reloadCurrent() {
    setOrders([])
    setNextCursor(null)
    fetchOrders()
  }

  async function handleAction(orderId: string, action: "accept" | "complete" | "cancel") {
    setActionLoading((prev) => ({ ...prev, [orderId]: action }))
    try {
      if (action === "accept")   await acceptOrder(orderId)
      if (action === "complete") await completeOrder(orderId)
      if (action === "cancel")   await cancelOrder(orderId)
      reloadCurrent()
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev }
        delete next[orderId]
        return next
      })
    }
  }

  const COLUMNS = ["Order ID", "Email", "Items", "Status", "Created At", "View", "Actions"]

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
                    <Table.Cell py={3} px={4} color="gray.700" fontWeight="medium" fontSize="xs">{order.orderId}</Table.Cell>
                    <Table.Cell py={3} px={4} color="gray.600">{order.email}</Table.Cell>
                    <Table.Cell py={3} px={4} color="gray.600">{order.itemCount}</Table.Cell>
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
                    <Table.Cell py={3} px={4}>
                      <Button
                        size="xs"
                        colorPalette="gray"
                        variant="outline"
                        loading={detailLoading === order.orderId}
                        onClick={() => {
                          setDetailLoading(order.orderId)
                          setSelectedOrder(order)
                          getOrderById(order.orderId)
                            .then(setOrderDetail)
                            .finally(() => setDetailLoading(null))
                        }}
                      >
                        View
                      </Button>
                    </Table.Cell>
                    <Table.Cell py={3} px={4}>
                      <HStack gap={2}>
                        {status === "accepted" ? (
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
                        ) : status === "pending" || status === "approval_pending" ? (
                          <>
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
                              colorPalette="red"
                              variant="subtle"
                              loading={busy === "cancel"}
                              disabled={!!busy}
                              onClick={() => handleAction(order.orderId, "cancel")}
                            >
                              Reject
                            </Button>
                          </>
                        ) : null}
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

      {!loading && nextCursor && (
        <Button
          size="sm"
          variant="outline"
          colorPalette="gray"
          alignSelf="center"
          loading={loadingMore}
          onClick={() => fetchOrders(nextCursor)}
        >
          Load More
        </Button>
      )}

      <OrderDetailModal
        order={selectedOrder}
        orderDetail={orderDetail}
        open={!!selectedOrder}
        onClose={() => { setSelectedOrder(null); setOrderDetail(null) }}
        onAccept={() => selectedOrder && handleAction(selectedOrder.orderId, "accept")}
        onReject={() => selectedOrder && handleAction(selectedOrder.orderId, "cancel")}
        actionBusy={selectedOrder ? actionLoading[selectedOrder.orderId] : undefined}
      />
    </Stack>
  )
}

export default OrdersTable
