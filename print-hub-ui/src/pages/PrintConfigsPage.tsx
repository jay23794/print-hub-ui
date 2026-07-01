import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  IconButton,
  Skeleton,
  Spacer,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu"

import ProfileMenu from "../components/layout/ProfileMenu"
import OrderActionConfirm from "../components/orders/OrderActionConfirm"
import {
  deletePrintConfig,
  fetchAllPrintConfigs,
  type PrintConfig,
} from "../services/printConfig.service"
import { ApiError } from "../lib/api"
import { toaster } from "../lib/toaster"

function PrintConfigsPage() {
  const navigate = useNavigate()

  const [configs, setConfigs] = useState<PrintConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingDelete, setPendingDelete] = useState<PrintConfig | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  function loadConfigs() {
    setLoading(true)
    fetchAllPrintConfigs()
      .then(setConfigs)
      .catch((err) => {
        const message =
          err instanceof ApiError ? err.message : "Couldn't reach the server."
        toaster.error({ title: "Failed to load configs", description: message })
        setConfigs([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadConfigs()
  }, [])

  async function runDelete() {
    if (!pendingDelete?._id) return
    setDeleteLoading(true)
    try {
      await deletePrintConfig(pendingDelete._id)
      toaster.success({
        title: "Config deleted",
        description: `${pendingDelete.name} was removed.`,
      })
      setPendingDelete(null)
      loadConfigs()
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Couldn't reach the server."
      toaster.error({ title: "Delete failed", description: message })
    } finally {
      setDeleteLoading(false)
    }
  }

  const COLUMNS = ["Name", "Paper Qualities", "Sizes", "Base Rate", "Status", "Actions"]

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Navbar */}
      <Box bg="gray.800" px={6} py={4} position="sticky" top={0} zIndex={10} boxShadow="md">
        <Flex align="center">
          <Heading size="md" color="white" letterSpacing="wide">
            Print HuB
          </Heading>
          <Spacer />
          <HStack gap={3}>
            <Button
              size="sm"
              variant="ghost"
              color="gray.300"
              _hover={{ color: "white" }}
              onClick={() => navigate("/")}
            >
              Dashboard
            </Button>
            <ProfileMenu />
          </HStack>
        </Flex>
      </Box>

      {/* Body */}
      <Box px={6} py={6}>
        <Flex align="center" mb={5}>
          <Stack gap={0}>
            <Heading size="lg" color="gray.800">
              Print Configs
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Manage paper qualities, sizes and pricing for each print type.
            </Text>
          </Stack>
          <Spacer />
          <Button
            colorPalette="blue"
            size="sm"
            onClick={() => navigate("/print-configs/new")}
          >
            <LuPlus />
            Add Config
          </Button>
        </Flex>

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
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Table.Row key={i}>
                      {COLUMNS.map((col) => (
                        <Table.Cell key={col} py={3} px={4}>
                          <Skeleton height="18px" borderRadius="md" />
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))
                : configs.map((cfg) => (
                    <Table.Row
                      key={cfg._id}
                      _hover={{ bg: "gray.50" }}
                      transition="background 0.15s"
                    >
                      <Table.Cell py={3} px={4} fontWeight="medium" color="gray.800">
                        {cfg.name}
                      </Table.Cell>
                      <Table.Cell py={3} px={4} color="gray.600">
                        {cfg.options.paperQualities
                          .map((p) => `${p.name} (${p.gsm})`)
                          .join(", ")}
                      </Table.Cell>
                      <Table.Cell py={3} px={4} color="gray.600">
                        {cfg.options.sizes.map((s) => s.name).join(", ")}
                      </Table.Cell>
                      <Table.Cell py={3} px={4} color="gray.700">
                        ₹{cfg.pricing.baseRate}
                      </Table.Cell>
                      <Table.Cell py={3} px={4}>
                        <Badge
                          colorPalette={cfg.active ? "green" : "gray"}
                          variant="subtle"
                          borderRadius="full"
                          px={2}
                        >
                          {cfg.active ? "Active" : "Inactive"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell py={3} px={4}>
                        <HStack gap={2}>
                          <IconButton
                            aria-label="Edit config"
                            size="xs"
                            variant="outline"
                            colorPalette="gray"
                            onClick={() =>
                              cfg._id && navigate(`/print-configs/${cfg._id}/edit`)
                            }
                          >
                            <LuPencil />
                          </IconButton>
                          <IconButton
                            aria-label="Delete config"
                            size="xs"
                            variant="outline"
                            colorPalette="red"
                            onClick={() => setPendingDelete(cfg)}
                          >
                            <LuTrash2 />
                          </IconButton>
                        </HStack>
                      </Table.Cell>
                    </Table.Row>
                  ))}
            </Table.Body>
          </Table.Root>
        </Box>

        {!loading && configs.length === 0 && (
          <Text textAlign="center" color="gray.400" py={6}>
            No print configs yet. Click "Add Config" to create the first one.
          </Text>
        )}
      </Box>

      {pendingDelete && (
        <OrderActionConfirm
          open
          title={`Delete "${pendingDelete.name}"?`}
          body="This will permanently remove the print config. Orders that already reference it will be unaffected, but new orders won't be able to select it."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmColor="red"
          loading={deleteLoading}
          onCancel={() => !deleteLoading && setPendingDelete(null)}
          onConfirm={runDelete}
        />
      )}
    </Box>
  )
}

export default PrintConfigsPage
