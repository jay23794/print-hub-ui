import { Badge, Button, Flex, HStack, Skeleton, Stack, Table, Text } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { searchOrders, acceptOrder, completeOrder, cancelOrder, getOrderById } from "../../services/orders.service"
import type { OrderActionResponse, OrderItem } from "../../services/orders.service"
import OrderDetailModal from "./OrderDetailModal"
import AppPagination from "../common/Pagination"
import { getStatusMeta, normalizeOrderStatus } from "../../constants/orderStatus.constants"

const PAGE_SIZE = 10

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
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [actionLoading, setActionLoading] = useState<Record<string, string>>({})
  const [selectedOrder, setSelectedOrder] = useState<OrderActionResponse | null>(null)
  const [orderDetail, setOrderDetail] = useState<OrderItem[] | null>(null)
  const [detailLoading, setDetailLoading] = useState<string | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function fetchOrders(targetPage: number) {
    setLoading(true)
    searchOrders({
      id: searchId || undefined,
      status: status ?? undefined,
      range: range ?? undefined,
      page: targetPage,
      limit: PAGE_SIZE,
    })
      .then(({ orders: newOrders, total: t }) => {
        setOrders(newOrders)
        setTotal(t)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (page !== 1) {
        setPage(1)
      } else {
        fetchOrders(1)
      }
    }, searchId ? 400 : 0)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchId, status, range])

  useEffect(() => {
    fetchOrders(page)
  }, [page])

  function reloadCurrent() {
    fetchOrders(page)
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
                const statusCode = normalizeOrderStatus(order.orderStatus)
                const statusMeta = getStatusMeta(order.orderStatus)
                return (
                  <Table.Row key={order.orderId} _hover={{ bg: "gray.50" }} transition="background 0.15s">
                    <Table.Cell py={3} px={4} color="gray.700" fontWeight="medium" fontSize="xs">{order.orderId}</Table.Cell>
                    <Table.Cell py={3} px={4} color="gray.600">{order.email}</Table.Cell>
                    <Table.Cell py={3} px={4} color="gray.600">{order.itemCount}</Table.Cell>
                    <Table.Cell py={3} px={4}>
                      <Stack gap={1} align="flex-start">
                        <Badge
                          colorPalette={statusMeta.color}
                          variant="subtle"
                          borderRadius="full"
                          px={2}
                        >
                          {statusMeta.label}
                        </Badge>
                        <Text fontSize="xs" color="gray.400">{statusMeta.stage}</Text>
                      </Stack>
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
                        {statusCode === "PENDING_ACCEPTANCE" ? (
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
                        ) : statusCode === "ACCEPTED" || statusCode === "PRINTING" || statusCode === "PRINTED" || statusCode === "PACKED" || statusCode === "OUT_FOR_DELIVERY" ? (
                          <Button
                            size="xs"
                            colorPalette="green"
                            variant="subtle"
                            loading={busy === "complete"}
                            disabled={!!busy}
                            onClick={() => handleAction(order.orderId, "complete")}
                          >
                            Mark Delivered
                          </Button>
                        ) : (
                          <Text fontSize="xs" color="gray.400">—</Text>
                        )}
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

      {!loading && total > PAGE_SIZE && (
        <Flex justify="center" pb={2}>
          <AppPagination
            count={total}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={(p) => setPage(p)}
          />
        </Flex>
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
