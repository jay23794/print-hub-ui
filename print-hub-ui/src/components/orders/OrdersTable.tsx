import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Skeleton,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { LuChevronLeft, LuChevronRight, LuCheck, LuCopy } from "react-icons/lu"
import {
  searchOrders,
  listOrders,
  acceptOrder,
  cancelOrder,
  dispatchOrder,
  markDelivered,
  getOrderById,
  ORDERS_PAGE_SIZE,
} from "../../services/orders.service"
import type { OrderActionResponse, OrderItem } from "../../services/orders.service"
import OrderDetailModal from "./OrderDetailModal"
import OrderActionConfirm from "./OrderActionConfirm"
import {
  getStatusMeta,
  getPaymentStatusMeta,
  getPaymentMethodMeta,
  normalizeOrderStatus,
  normalizePaymentStatus,
  normalizePaymentMethod,
} from "../../constants/orderStatus.constants"
import { ApiError } from "../../lib/api"
import { toaster } from "../../lib/toaster"

const DISPATCHABLE_STATUSES = new Set(["ACCEPTED", "PRINTING", "PRINTED", "PACKED"])

type PendingAction =
  | { type: "dispatch"; order: OrderActionResponse }
  | { type: "delivered"; order: OrderActionResponse }

function formatDate(date: Date | string) {
  const d = new Date(date)
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, "0")
  const min = String(d.getMinutes()).padStart(2, "0")
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`
}

function OrderIdCell({ id }: { id: string }) {
  const [copied, setCopied] = useState(false)
  const short = id.slice(0, 8)

  async function copy() {
    try {
      await navigator.clipboard.writeText(id)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore — clipboard may be unavailable
    }
  }

  return (
    <HStack gap={1.5} align="center" title={id}>
      <Text fontSize="xs" fontFamily="mono" color="gray.700" fontWeight="medium">
        {short}…
      </Text>
      <IconButton
        aria-label="Copy order ID"
        size="2xs"
        variant="ghost"
        colorPalette={copied ? "green" : "gray"}
        onClick={copy}
      >
        {copied ? <LuCheck /> : <LuCopy />}
      </IconButton>
    </HStack>
  )
}

interface OrdersTableProps {
  searchId: string
  status: string | null
  paymentStatus: string | null
  range: string | null
}

function OrdersTable({ searchId, status, paymentStatus, range }: OrdersTableProps) {
  const [orders, setOrders] = useState<OrderActionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<Record<string, string>>({})
  const [selectedOrder, setSelectedOrder] = useState<OrderActionResponse | null>(null)
  const [orderDetail, setOrderDetail] = useState<OrderItem[] | null>(null)
  const [detailLoading, setDetailLoading] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  // Cursor-based pagination state. We keep a stack of cursors so we can
  // walk back through previously fetched pages. Page 1 has a null cursor;
  // subsequent entries are the `_id` of the last row of the prior page.
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null])
  const [hasNextPage, setHasNextPage] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pageIndex = cursorStack.length - 1

  function loadPage(stack: (string | null)[]) {
    setLoading(true)
    const cursor = stack[stack.length - 1]

    // Search by ID short-circuits cursor pagination — backend supports it
    // via /admin/order/search and returns a single record.
    if (searchId) {
      searchOrders({ id: searchId })
        .then(({ orders: result }) => {
          // Client-side filter so the ID search still respects status filters.
          const filtered = result.filter((o) => {
            if (status && normalizeOrderStatus(o.orderStatus) !== status) return false
            if (paymentStatus && normalizePaymentStatus(o.paymentStatus) !== paymentStatus) return false
            return true
          })
          setOrders(filtered)
          setHasNextPage(false)
        })
        .catch(() => {
          setOrders([])
          setHasNextPage(false)
        })
        .finally(() => setLoading(false))
      return
    }

    listOrders({ cursor, orderStatus: status })
      .then(({ orders: result, hasNextPage: next }) => {
        // paymentStatus is filtered client-side; the list API only filters by orderStatus.
        const filtered = paymentStatus
          ? result.filter((o) => normalizePaymentStatus(o.paymentStatus) === paymentStatus)
          : result
        setOrders(filtered)
        setHasNextPage(next)
      })
      .catch(() => {
        setOrders([])
        setHasNextPage(false)
      })
      .finally(() => setLoading(false))
  }

  // Reset to page 1 whenever filters or the search box change.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const fresh: (string | null)[] = [null]
      setCursorStack(fresh)
      loadPage(fresh)
    }, searchId ? 400 : 0)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchId, status, paymentStatus, range])

  function reloadCurrent() {
    loadPage(cursorStack)
  }

  function goNext() {
    if (!hasNextPage || orders.length === 0) return
    const last = orders[orders.length - 1]
    if (!last?._id) return
    const next = [...cursorStack, last._id]
    setCursorStack(next)
    loadPage(next)
  }

  function goPrev() {
    if (pageIndex === 0) return
    const next = cursorStack.slice(0, -1)
    setCursorStack(next)
    loadPage(next)
  }

  async function handleAction(orderId: string, action: "accept" | "cancel") {
    setActionLoading((prev) => ({ ...prev, [orderId]: action }))
    try {
      if (action === "accept") await acceptOrder(orderId)
      if (action === "cancel") await cancelOrder(orderId)
      reloadCurrent()
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev }
        delete next[orderId]
        return next
      })
    }
  }

  function patchOrderInPlace(orderId: string, patch: Partial<OrderActionResponse>) {
    setOrders((prev) => prev.map((o) => (o.orderId === orderId ? { ...o, ...patch } : o)))
    setSelectedOrder((prev) => (prev && prev.orderId === orderId ? { ...prev, ...patch } : prev))
  }

  function requestDispatch(order: OrderActionResponse) {
    setPendingAction({ type: "dispatch", order })
  }

  function requestDelivered(order: OrderActionResponse) {
    setPendingAction({ type: "delivered", order })
  }

  function closeConfirm() {
    if (confirmLoading) return
    setPendingAction(null)
  }

  async function runPendingAction() {
    if (!pendingAction) return
    const { type, order } = pendingAction
    const orderId = order.orderId

    setConfirmLoading(true)
    setActionLoading((prev) => ({ ...prev, [orderId]: type }))

    try {
      if (type === "dispatch") {
        const res = await dispatchOrder(orderId)
        patchOrderInPlace(orderId, { orderStatus: res.data.orderStatus })
        toaster.success({ title: "Order dispatched", description: res.message })
      } else {
        const res = await markDelivered(orderId)
        patchOrderInPlace(orderId, {
          orderStatus: res.data.orderStatus,
          paymentStatus: res.data.paymentStatus ?? order.paymentStatus,
          paymentMethod: res.data.paymentMethod ?? order.paymentMethod,
        })
        toaster.success({ title: "Order delivered", description: res.message })
      }
      setPendingAction(null)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400) {
          toaster.error({
            title: "Couldn't update order",
            description: "Missing order ID — please refresh and try again.",
          })
        } else if (err.status === 409) {
          toaster.error({ title: "State changed", description: err.message })
          // Server says the order isn't in the expected state — likely
          // updated in another tab/session. Re-sync from the list so the
          // button gets recomputed and hidden.
          reloadCurrent()
          setPendingAction(null)
        } else {
          toaster.error({
            title: "Couldn't update order",
            description: err.message || "Something went wrong. Please try again.",
          })
        }
      } else {
        toaster.error({
          title: "Network error",
          description: "Couldn't reach the server. Please try again.",
        })
      }
    } finally {
      setConfirmLoading(false)
      setActionLoading((prev) => {
        const next = { ...prev }
        delete next[orderId]
        return next
      })
    }
  }

  const COLUMNS = [
    "Order ID",
    "Customer",
    "Items",
    "Order Status",
    "Payment",
    "Method",
    "Updated",
    "View",
    "Actions",
  ]

  return (
    <Stack gap="4">
      <Box overflowX="auto">
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
                  whiteSpace="nowrap"
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
                  const payMeta = getPaymentStatusMeta(order.paymentStatus)
                  const methodMeta = getPaymentMethodMeta(order.paymentMethod)
                  return (
                    <Table.Row
                      key={order._id ?? order.orderId}
                      _hover={{ bg: "gray.50" }}
                      transition="background 0.15s"
                    >
                      <Table.Cell py={3} px={4}>
                        <OrderIdCell id={order.orderId} />
                      </Table.Cell>
                      <Table.Cell py={3} px={4} color="gray.600">
                        {order.email}
                      </Table.Cell>
                      <Table.Cell py={3} px={4} color="gray.600">
                        {order.itemCount}
                      </Table.Cell>
                      <Table.Cell py={3} px={4}>
                        <Badge
                          colorPalette={statusMeta.color}
                          variant="subtle"
                          borderRadius="full"
                          px={2}
                          title={statusMeta.description}
                        >
                          {statusMeta.label}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell py={3} px={4}>
                        <Badge
                          colorPalette={payMeta.color}
                          variant="subtle"
                          borderRadius="full"
                          px={2}
                        >
                          {payMeta.label}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell py={3} px={4}>
                        <Badge
                          colorPalette={methodMeta.color}
                          variant="outline"
                          borderRadius="md"
                          px={2}
                          fontSize="xs"
                        >
                          {methodMeta.label}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell
                        py={3}
                        px={4}
                        color="gray.500"
                        fontSize="sm"
                        whiteSpace="nowrap"
                      >
                        {formatDate(order.updatedAt ?? order.createdAt)}
                      </Table.Cell>
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
                          ) : DISPATCHABLE_STATUSES.has(statusCode) ? (
                            <Button
                              size="xs"
                              colorPalette="purple"
                              variant="subtle"
                              loading={busy === "dispatch"}
                              disabled={!!busy}
                              onClick={() => requestDispatch(order)}
                            >
                              Mark out for delivery
                            </Button>
                          ) : statusCode === "OUT_FOR_DELIVERY" ? (
                            <Button
                              size="xs"
                              colorPalette="green"
                              variant="subtle"
                              loading={busy === "delivered"}
                              disabled={!!busy}
                              onClick={() => requestDelivered(order)}
                            >
                              Mark delivered
                            </Button>
                          ) : (
                            <Text fontSize="xs" color="gray.400">
                              —
                            </Text>
                          )}
                        </HStack>
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
          </Table.Body>
        </Table.Root>
      </Box>

      {!loading && orders.length === 0 && (
        <Text textAlign="center" color="gray.400" py={4}>
          No orders found.
        </Text>
      )}

      {!loading && !searchId && (pageIndex > 0 || hasNextPage) && (
        <Flex justify="center" align="center" pb={2} gap={3}>
          <ButtonGroup variant="ghost" size="sm" gap={1}>
            <IconButton
              aria-label="Previous page"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              _hover={{ bg: "gray.100" }}
              disabled={pageIndex === 0}
              onClick={goPrev}
            >
              <LuChevronLeft />
            </IconButton>
            <Box
              px={3}
              alignSelf="center"
              fontSize="sm"
              color="gray.600"
              minW="20"
              textAlign="center"
            >
              Page {pageIndex + 1}
            </Box>
            <IconButton
              aria-label="Next page"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              _hover={{ bg: "gray.100" }}
              disabled={!hasNextPage}
              onClick={goNext}
            >
              <LuChevronRight />
            </IconButton>
          </ButtonGroup>
          <Text fontSize="xs" color="gray.400">
            up to {ORDERS_PAGE_SIZE} per page
          </Text>
        </Flex>
      )}

      <OrderDetailModal
        order={selectedOrder}
        orderDetail={orderDetail}
        open={!!selectedOrder}
        onClose={() => {
          setSelectedOrder(null)
          setOrderDetail(null)
        }}
        onAccept={() => selectedOrder && handleAction(selectedOrder.orderId, "accept")}
        onReject={() => selectedOrder && handleAction(selectedOrder.orderId, "cancel")}
        onDispatch={() => selectedOrder && requestDispatch(selectedOrder)}
        onMarkDelivered={() => selectedOrder && requestDelivered(selectedOrder)}
        actionBusy={selectedOrder ? actionLoading[selectedOrder.orderId] : undefined}
      />

      {pendingAction && (() => {
        const { type, order } = pendingAction
        const shortId = order.orderId.slice(0, 8)
        if (type === "dispatch") {
          return (
            <OrderActionConfirm
              open
              title={`Dispatch order ${shortId}?`}
              body="This will move the order to OUT_FOR_DELIVERY. The customer-facing status will update immediately."
              confirmLabel="Dispatch"
              cancelLabel="Back"
              confirmColor="purple"
              loading={confirmLoading}
              onCancel={closeConfirm}
              onConfirm={runPendingAction}
            />
          )
        }
        const method = normalizePaymentMethod(order.paymentMethod)
        if (method === "COD") {
          return (
            <OrderActionConfirm
              open
              title="Confirm delivery and cash collection?"
              body="This is a COD order. Confirming delivery will also mark payment as collected (Bill → PAID). Only confirm after the customer has paid in cash."
              confirmLabel="Mark delivered & paid"
              cancelLabel="Back"
              confirmColor="green"
              loading={confirmLoading}
              onCancel={closeConfirm}
              onConfirm={runPendingAction}
            />
          )
        }
        return (
          <OrderActionConfirm
            open
            title="Confirm delivery?"
            body="Payment was already captured via UPI. Confirming will mark the order as DELIVERED."
            confirmLabel="Mark delivered"
            cancelLabel="Back"
            confirmColor="green"
            loading={confirmLoading}
            onCancel={closeConfirm}
            onConfirm={runPendingAction}
          />
        )
      })()}
    </Stack>
  )
}

export default OrdersTable
