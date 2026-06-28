import {
  Badge,
  Box,
  Button,
  Dialog,
  Grid,
  GridItem,
  HStack,
  Spinner,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react"
import type { OrderActionResponse, OrderItem } from "../../services/orders.service"
import { getStatusMeta, normalizeOrderStatus } from "../../constants/orderStatus.constants"

function formatDate(date: Date | string) {
  return new Date(date).toLocaleString()
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <Text fontSize="xs" color="gray.500" fontWeight="medium" mb={1}>
        {label}
      </Text>
      <Box fontSize="sm" color="gray.800" fontWeight="medium">
        {children}
      </Box>
    </Box>
  )
}

interface Props {
  order: OrderActionResponse | null
  orderDetail: OrderItem[] | null
  open: boolean
  onClose: () => void
  onAccept?: () => void
  onReject?: () => void
  actionBusy?: string
}

function OrderDetailModal({ order, orderDetail, open, onClose, onAccept, onReject, actionBusy }: Props) {
  if (!order) return null

  const statusCode = normalizeOrderStatus(order.orderStatus)
  const statusMeta = getStatusMeta(order.orderStatus)

  return (
    <Dialog.Root open={open} onOpenChange={(e) => { if (!e.open) onClose() }} size="xl">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content borderRadius="xl" p={6}>
          <Dialog.Header pb={4} borderBottom="1px solid" borderColor="gray.100">
            <Dialog.Title fontSize="md" fontWeight="semibold" color="gray.800">
              Order Details
            </Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <Button size="xs" variant="ghost" colorPalette="gray" position="absolute" top={4} right={4}>
                ✕
              </Button>
            </Dialog.CloseTrigger>
          </Dialog.Header>

          <Dialog.Body pt={5}>
            {/* Order summary */}
            <Grid templateColumns="1fr 1fr" gap={5} mb={6}>
              <GridItem colSpan={2}>
                <Field label="Order ID">
                  <Text fontSize="xs" fontFamily="mono" color="gray.700">{order.orderId}</Text>
                </Field>
              </GridItem>

              <Field label="Email">{order.email}</Field>

              <Field label="Status">
                <Stack gap={1} align="flex-start">
                  <Badge
                    colorPalette={statusMeta.color}
                    variant="subtle"
                    borderRadius="full"
                    px={2}
                  >
                    {statusMeta.label}
                  </Badge>
                  <Text fontSize="xs" color="gray.500">{statusMeta.stage} · {statusMeta.description}</Text>
                </Stack>
              </Field>

              <Field label="Created At">{formatDate(order.createdAt)}</Field>
              <Field label="Updated At">{formatDate(order.updatedAt)}</Field>
            </Grid>

            {/* Items table */}
            <Text fontSize="xs" fontWeight="700" letterSpacing="wider" color="gray.400" mb={2}>
              ITEMS
            </Text>

            {!orderDetail ? (
              <Box display="flex" justifyContent="center" py={6}>
                <Spinner size="sm" />
              </Box>
            ) : orderDetail.length === 0 ? (
              <Text fontSize="sm" color="gray.400" textAlign="center" py={4}>No items found.</Text>
            ) : (
              <Box border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
                <Table.Root size="sm" variant="outline">
                  <Table.Header>
                    <Table.Row bg="gray.50">
                      <Table.ColumnHeader fontSize="xs" color="gray.500" fontWeight="600" textTransform="none" px={3} py={2}>#</Table.ColumnHeader>
                      <Table.ColumnHeader fontSize="xs" color="gray.500" fontWeight="600" textTransform="none" px={3} py={2}>File Name</Table.ColumnHeader>
                      <Table.ColumnHeader fontSize="xs" color="gray.500" fontWeight="600" textTransform="none" px={3} py={2}>Type</Table.ColumnHeader>
                      <Table.ColumnHeader fontSize="xs" color="gray.500" fontWeight="600" textTransform="none" px={3} py={2}>Print Type</Table.ColumnHeader>
                      <Table.ColumnHeader fontSize="xs" color="gray.500" fontWeight="600" textTransform="none" px={3} py={2}>Copies</Table.ColumnHeader>
                      <Table.ColumnHeader fontSize="xs" color="gray.500" fontWeight="600" textTransform="none" px={3} py={2}>Same Page</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {orderDetail.map((item, idx) => (
                      <Table.Row key={item._id ?? idx} _hover={{ bg: "gray.50" }}>
                        <Table.Cell px={3} py={2} color="gray.400" fontSize="xs">{idx + 1}</Table.Cell>
                        <Table.Cell px={3} py={2}>
                          <Text fontSize="xs" fontWeight="medium" color="gray.700">{item.fileName ?? "—"}</Text>
                          {(item.documentLinks ?? []).length > 0 && (
                            <Text fontSize="xs" color="blue.500" fontFamily="mono">{item.documentLinks[0]}</Text>
                          )}
                        </Table.Cell>
                        <Table.Cell px={3} py={2}>
                          <Badge variant="subtle" colorPalette="purple" borderRadius="full" fontSize="xs">
                            {item.fileType?.toUpperCase() ?? "—"}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell px={3} py={2}>
                          <Text fontSize="xs" color="gray.700">{item.printType ?? "—"}</Text>
                        </Table.Cell>
                        <Table.Cell px={3} py={2}>
                          <Text fontSize="xs" fontWeight="semibold" color="gray.800">{item.numberOfCopy ?? "—"}</Text>
                        </Table.Cell>
                        <Table.Cell px={3} py={2}>
                          <Badge
                            variant="subtle"
                            colorPalette={item.samePage ? "green" : "gray"}
                            borderRadius="full"
                            fontSize="xs"
                          >
                            {item.samePage ? "Yes" : "No"}
                          </Badge>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            )}
          </Dialog.Body>

          {statusCode === "PENDING_ACCEPTANCE" && (
            <Dialog.Footer pt={4} borderTop="1px solid" borderColor="gray.100">
              <HStack gap={3} justify="flex-end">
                <Button
                  size="sm"
                  colorPalette="blue"
                  variant="subtle"
                  loading={actionBusy === "accept"}
                  disabled={!!actionBusy}
                  onClick={onAccept}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  colorPalette="red"
                  variant="subtle"
                  loading={actionBusy === "cancel"}
                  disabled={!!actionBusy}
                  onClick={onReject}
                >
                  Reject
                </Button>
              </HStack>
            </Dialog.Footer>
          )}
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

export default OrderDetailModal
