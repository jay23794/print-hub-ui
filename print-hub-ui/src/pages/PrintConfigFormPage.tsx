import {
  Badge,
  Box,
  Button,
  Dialog,
  Field,
  Flex,
  Grid,
  HStack,
  Heading,
  IconButton,
  Input,
  Spacer,
  Stack,
  Switch,
  Table,
  Text,
} from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { LuArrowLeft, LuPlus, LuTrash2 } from "react-icons/lu"

import ProfileMenu from "../components/layout/ProfileMenu"
import {
  createPrintConfig,
  fetchPrintConfig,
  updatePrintConfig,
  type PaperQuality,
  type PrintConfigInput,
  type PrintSize,
} from "../services/printConfig.service"
import { ApiError } from "../lib/api"
import { toaster } from "../lib/toaster"

const EMPTY_PAPER: PaperQuality = { name: "", gsm: "", extra: 0 }
const EMPTY_SIZE: PrintSize = { name: "", width: 0, height: 0, extra: 0 }

function emptyForm(): PrintConfigInput {
  return {
    name: "",
    options: {
      paperQualities: [{ ...EMPTY_PAPER }],
      sizes: [{ ...EMPTY_SIZE }],
    },
    pricing: { baseRate: 0 },
    active: true,
  }
}

function PrintConfigFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = useMemo(() => Boolean(id), [id])

  const [form, setForm] = useState<PrintConfigInput>(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchPrintConfig(id)
      .then((cfg) => {
        setForm({
          name: cfg.name,
          options: {
            paperQualities: cfg.options.paperQualities.length
              ? cfg.options.paperQualities
              : [{ ...EMPTY_PAPER }],
            sizes: cfg.options.sizes.length ? cfg.options.sizes : [{ ...EMPTY_SIZE }],
          },
          pricing: { baseRate: cfg.pricing.baseRate ?? 0 },
          active: cfg.active,
        })
      })
      .catch((err) => {
        const message =
          err instanceof ApiError ? err.message : "Couldn't reach the server."
        toaster.error({ title: "Failed to load config", description: message })
        navigate("/print-configs")
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  function updatePaperQuality(index: number, patch: Partial<PaperQuality>) {
    setForm((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        paperQualities: prev.options.paperQualities.map((p, i) =>
          i === index ? { ...p, ...patch } : p,
        ),
      },
    }))
  }

  function addPaperQuality() {
    setForm((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        paperQualities: [...prev.options.paperQualities, { ...EMPTY_PAPER }],
      },
    }))
  }

  function removePaperQuality(index: number) {
    setForm((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        paperQualities: prev.options.paperQualities.filter((_, i) => i !== index),
      },
    }))
  }

  function updateSize(index: number, patch: Partial<PrintSize>) {
    setForm((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        sizes: prev.options.sizes.map((s, i) => (i === index ? { ...s, ...patch } : s)),
      },
    }))
  }

  function addSize() {
    setForm((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        sizes: [...prev.options.sizes, { ...EMPTY_SIZE }],
      },
    }))
  }

  function removeSize(index: number) {
    setForm((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        sizes: prev.options.sizes.filter((_, i) => i !== index),
      },
    }))
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = "Name is required"
    if (form.pricing.baseRate < 0) next.baseRate = "Base rate cannot be negative"
    if (form.options.paperQualities.length === 0)
      next.paperQualities = "At least one paper quality is required"
    if (form.options.sizes.length === 0) next.sizes = "At least one size is required"

    form.options.paperQualities.forEach((p, i) => {
      if (!p.name.trim()) next[`paper.${i}.name`] = "Name is required"
      if (!p.gsm.trim()) next[`paper.${i}.gsm`] = "GSM is required"
      if (p.extra < 0) next[`paper.${i}.extra`] = "Must be ≥ 0"
    })
    form.options.sizes.forEach((s, i) => {
      if (!s.name.trim()) next[`size.${i}.name`] = "Name is required"
      if (s.width <= 0) next[`size.${i}.width`] = "Width must be > 0"
      if (s.height <= 0) next[`size.${i}.height`] = "Height must be > 0"
      if (s.extra < 0) next[`size.${i}.extra`] = "Must be ≥ 0"
    })

    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setPreviewOpen(true)
  }

  async function confirmSave() {
    setSaving(true)
    try {
      if (isEdit && id) {
        await updatePrintConfig(id, form)
        toaster.success({
          title: "Config updated",
          description: `${form.name} was updated.`,
        })
      } else {
        await createPrintConfig(form)
        toaster.success({
          title: "Config created",
          description: `${form.name} was added.`,
        })
      }
      setPreviewOpen(false)
      navigate("/print-configs")
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Couldn't reach the server."
      toaster.error({
        title: isEdit ? "Update failed" : "Create failed",
        description: message,
      })
    } finally {
      setSaving(false)
    }
  }

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
              onClick={() => navigate("/print-configs")}
            >
              Configs
            </Button>
            <ProfileMenu />
          </HStack>
        </Flex>
      </Box>

      {/* Body */}
      <Flex justify="center" px={6} py={8}>
        <Box w="full" maxW="880px">
          <HStack mb={5} gap={2}>
            <IconButton
              aria-label="Back to configs"
              size="sm"
              variant="ghost"
              onClick={() => navigate("/print-configs")}
            >
              <LuArrowLeft />
            </IconButton>
            <Stack gap={0}>
              <Heading size="lg" color="gray.800">
                {isEdit ? "Edit Print Config" : "Add Print Config"}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Configure paper qualities, sizes and pricing.
              </Text>
            </Stack>
          </HStack>

          {loading ? (
            <Text color="gray.500">Loading…</Text>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack gap={6}>
                {/* Basics */}
                <Box
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                  boxShadow="sm"
                  p={6}
                >
                  <Text fontSize="sm" fontWeight="700" color="gray.600" mb={4}>
                    BASICS
                  </Text>
                  <Grid templateColumns={{ base: "1fr", md: "2fr 1fr 1fr" }} gap={4}>
                    <Field.Root invalid={!!errors.name} required>
                      <Field.Label>Name</Field.Label>
                      <Input
                        placeholder="e.g. Color"
                        value={form.name}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                      />
                      {errors.name && <Field.ErrorText>{errors.name}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root invalid={!!errors.baseRate} required>
                      <Field.Label>Base Rate (₹)</Field.Label>
                      <Input
                        type="number"
                        min={0}
                        value={form.pricing.baseRate}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            pricing: { baseRate: Number(e.target.value) },
                          }))
                        }
                      />
                      {errors.baseRate && (
                        <Field.ErrorText>{errors.baseRate}</Field.ErrorText>
                      )}
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Active</Field.Label>
                      <Switch.Root
                        checked={form.active}
                        onCheckedChange={(e) =>
                          setForm((prev) => ({ ...prev, active: e.checked }))
                        }
                        mt={2}
                      >
                        <Switch.HiddenInput />
                        <Switch.Control />
                        <Switch.Label>
                          {form.active ? "Active" : "Inactive"}
                        </Switch.Label>
                      </Switch.Root>
                    </Field.Root>
                  </Grid>
                </Box>

                {/* Paper Qualities */}
                <Box
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                  boxShadow="sm"
                  p={6}
                >
                  <Flex align="center" mb={4}>
                    <Text fontSize="sm" fontWeight="700" color="gray.600">
                      PAPER QUALITIES
                    </Text>
                    <Spacer />
                    <Button
                      size="xs"
                      variant="outline"
                      colorPalette="blue"
                      onClick={addPaperQuality}
                      type="button"
                    >
                      <LuPlus />
                      Add
                    </Button>
                  </Flex>
                  {errors.paperQualities && (
                    <Text fontSize="xs" color="red.500" mb={2}>
                      {errors.paperQualities}
                    </Text>
                  )}
                  <Stack gap={3}>
                    {form.options.paperQualities.map((paper, i) => (
                      <Grid
                        key={i}
                        templateColumns={{
                          base: "1fr",
                          md: "1fr 1fr 1fr auto",
                        }}
                        gap={3}
                        alignItems="start"
                      >
                        <Field.Root invalid={!!errors[`paper.${i}.name`]}>
                          <Field.Label fontSize="xs">Name</Field.Label>
                          <Input
                            size="sm"
                            placeholder="Regular"
                            value={paper.name}
                            onChange={(e) =>
                              updatePaperQuality(i, { name: e.target.value })
                            }
                          />
                          {errors[`paper.${i}.name`] && (
                            <Field.ErrorText fontSize="xs">
                              {errors[`paper.${i}.name`]}
                            </Field.ErrorText>
                          )}
                        </Field.Root>
                        <Field.Root invalid={!!errors[`paper.${i}.gsm`]}>
                          <Field.Label fontSize="xs">GSM</Field.Label>
                          <Input
                            size="sm"
                            placeholder="70 GSM"
                            value={paper.gsm}
                            onChange={(e) =>
                              updatePaperQuality(i, { gsm: e.target.value })
                            }
                          />
                          {errors[`paper.${i}.gsm`] && (
                            <Field.ErrorText fontSize="xs">
                              {errors[`paper.${i}.gsm`]}
                            </Field.ErrorText>
                          )}
                        </Field.Root>
                        <Field.Root invalid={!!errors[`paper.${i}.extra`]}>
                          <Field.Label fontSize="xs">Extra (₹)</Field.Label>
                          <Input
                            size="sm"
                            type="number"
                            min={0}
                            value={paper.extra}
                            onChange={(e) =>
                              updatePaperQuality(i, { extra: Number(e.target.value) })
                            }
                          />
                          {errors[`paper.${i}.extra`] && (
                            <Field.ErrorText fontSize="xs">
                              {errors[`paper.${i}.extra`]}
                            </Field.ErrorText>
                          )}
                        </Field.Root>
                        <IconButton
                          aria-label="Remove paper quality"
                          size="sm"
                          variant="ghost"
                          colorPalette="red"
                          alignSelf="end"
                          disabled={form.options.paperQualities.length === 1}
                          onClick={() => removePaperQuality(i)}
                          type="button"
                        >
                          <LuTrash2 />
                        </IconButton>
                      </Grid>
                    ))}
                  </Stack>
                </Box>

                {/* Sizes */}
                <Box
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                  boxShadow="sm"
                  p={6}
                >
                  <Flex align="center" mb={4}>
                    <Text fontSize="sm" fontWeight="700" color="gray.600">
                      SIZES
                    </Text>
                    <Spacer />
                    <Button
                      size="xs"
                      variant="outline"
                      colorPalette="blue"
                      onClick={addSize}
                      type="button"
                    >
                      <LuPlus />
                      Add
                    </Button>
                  </Flex>
                  {errors.sizes && (
                    <Text fontSize="xs" color="red.500" mb={2}>
                      {errors.sizes}
                    </Text>
                  )}
                  <Stack gap={3}>
                    {form.options.sizes.map((size, i) => (
                      <Grid
                        key={i}
                        templateColumns={{
                          base: "1fr",
                          md: "1fr 1fr 1fr 1fr auto",
                        }}
                        gap={3}
                        alignItems="start"
                      >
                        <Field.Root invalid={!!errors[`size.${i}.name`]}>
                          <Field.Label fontSize="xs">Name</Field.Label>
                          <Input
                            size="sm"
                            placeholder="A4"
                            value={size.name}
                            onChange={(e) => updateSize(i, { name: e.target.value })}
                          />
                          {errors[`size.${i}.name`] && (
                            <Field.ErrorText fontSize="xs">
                              {errors[`size.${i}.name`]}
                            </Field.ErrorText>
                          )}
                        </Field.Root>
                        <Field.Root invalid={!!errors[`size.${i}.width`]}>
                          <Field.Label fontSize="xs">Width (mm)</Field.Label>
                          <Input
                            size="sm"
                            type="number"
                            min={0}
                            value={size.width}
                            onChange={(e) =>
                              updateSize(i, { width: Number(e.target.value) })
                            }
                          />
                          {errors[`size.${i}.width`] && (
                            <Field.ErrorText fontSize="xs">
                              {errors[`size.${i}.width`]}
                            </Field.ErrorText>
                          )}
                        </Field.Root>
                        <Field.Root invalid={!!errors[`size.${i}.height`]}>
                          <Field.Label fontSize="xs">Height (mm)</Field.Label>
                          <Input
                            size="sm"
                            type="number"
                            min={0}
                            value={size.height}
                            onChange={(e) =>
                              updateSize(i, { height: Number(e.target.value) })
                            }
                          />
                          {errors[`size.${i}.height`] && (
                            <Field.ErrorText fontSize="xs">
                              {errors[`size.${i}.height`]}
                            </Field.ErrorText>
                          )}
                        </Field.Root>
                        <Field.Root invalid={!!errors[`size.${i}.extra`]}>
                          <Field.Label fontSize="xs">Extra (₹)</Field.Label>
                          <Input
                            size="sm"
                            type="number"
                            min={0}
                            value={size.extra}
                            onChange={(e) =>
                              updateSize(i, { extra: Number(e.target.value) })
                            }
                          />
                          {errors[`size.${i}.extra`] && (
                            <Field.ErrorText fontSize="xs">
                              {errors[`size.${i}.extra`]}
                            </Field.ErrorText>
                          )}
                        </Field.Root>
                        <IconButton
                          aria-label="Remove size"
                          size="sm"
                          variant="ghost"
                          colorPalette="red"
                          alignSelf="end"
                          disabled={form.options.sizes.length === 1}
                          onClick={() => removeSize(i)}
                          type="button"
                        >
                          <LuTrash2 />
                        </IconButton>
                      </Grid>
                    ))}
                  </Stack>
                </Box>

                {/* Actions */}
                <Flex justify="flex-end" gap={3}>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/print-configs")}
                    type="button"
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    bg="gray.800"
                    color="white"
                    _hover={{ bg: "gray.700" }}
                  >
                    {isEdit ? "Review & Save" : "Review & Create"}
                  </Button>
                </Flex>
              </Stack>
            </form>
          )}
        </Box>
      </Flex>

      {/* Preview / Confirm Dialog */}
      <Dialog.Root
        open={previewOpen}
        onOpenChange={(e) => {
          if (!e.open && !saving) setPreviewOpen(false)
        }}
        size="lg"
        role="alertdialog"
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="xl">
            <Dialog.Header pb={2}>
              <Dialog.Title fontSize="md" fontWeight="semibold" color="gray.800">
                {isEdit
                  ? `Update "${form.name}" config?`
                  : `Add "${form.name}" config?`}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pt={2} pb={4}>
              <Text fontSize="sm" color="gray.600" mb={4}>
                Please review the details below. Are you sure you want to{" "}
                {isEdit ? "update" : "add"} this config?
              </Text>

              <Stack gap={4}>
                {/* Basics */}
                <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4}>
                  <Text fontSize="xs" fontWeight="700" color="gray.500" mb={3}>
                    BASICS
                  </Text>
                  <Grid templateColumns="1fr 1fr 1fr" gap={3}>
                    <Stack gap={0}>
                      <Text fontSize="xs" color="gray.500">Name</Text>
                      <Text fontSize="sm" fontWeight="medium" color="gray.800">
                        {form.name}
                      </Text>
                    </Stack>
                    <Stack gap={0}>
                      <Text fontSize="xs" color="gray.500">Base Rate</Text>
                      <Text fontSize="sm" fontWeight="medium" color="gray.800">
                        ₹{form.pricing.baseRate}
                      </Text>
                    </Stack>
                    <Stack gap={0}>
                      <Text fontSize="xs" color="gray.500">Status</Text>
                      <Box>
                        <Badge
                          colorPalette={form.active ? "green" : "gray"}
                          variant="subtle"
                          borderRadius="full"
                          px={2}
                        >
                          {form.active ? "Active" : "Inactive"}
                        </Badge>
                      </Box>
                    </Stack>
                  </Grid>
                </Box>

                {/* Paper Qualities */}
                <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4}>
                  <Text fontSize="xs" fontWeight="700" color="gray.500" mb={3}>
                    PAPER QUALITIES ({form.options.paperQualities.length})
                  </Text>
                  <Table.Root size="sm" variant="line">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader fontSize="xs">Name</Table.ColumnHeader>
                        <Table.ColumnHeader fontSize="xs">GSM</Table.ColumnHeader>
                        <Table.ColumnHeader fontSize="xs" textAlign="end">
                          Extra
                        </Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {form.options.paperQualities.map((p, i) => (
                        <Table.Row key={i}>
                          <Table.Cell fontSize="sm">{p.name}</Table.Cell>
                          <Table.Cell fontSize="sm">{p.gsm}</Table.Cell>
                          <Table.Cell fontSize="sm" textAlign="end">
                            ₹{p.extra}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Box>

                {/* Sizes */}
                <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4}>
                  <Text fontSize="xs" fontWeight="700" color="gray.500" mb={3}>
                    SIZES ({form.options.sizes.length})
                  </Text>
                  <Table.Root size="sm" variant="line">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader fontSize="xs">Name</Table.ColumnHeader>
                        <Table.ColumnHeader fontSize="xs" textAlign="end">
                          Width (mm)
                        </Table.ColumnHeader>
                        <Table.ColumnHeader fontSize="xs" textAlign="end">
                          Height (mm)
                        </Table.ColumnHeader>
                        <Table.ColumnHeader fontSize="xs" textAlign="end">
                          Extra
                        </Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {form.options.sizes.map((s, i) => (
                        <Table.Row key={i}>
                          <Table.Cell fontSize="sm">{s.name}</Table.Cell>
                          <Table.Cell fontSize="sm" textAlign="end">{s.width}</Table.Cell>
                          <Table.Cell fontSize="sm" textAlign="end">{s.height}</Table.Cell>
                          <Table.Cell fontSize="sm" textAlign="end">₹{s.extra}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Box>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer pt={2}>
              <HStack gap={2} justify="flex-end" width="full">
                <Button
                  size="sm"
                  variant="ghost"
                  colorPalette="gray"
                  disabled={saving}
                  onClick={() => setPreviewOpen(false)}
                >
                  Back to edit
                </Button>
                <Button
                  size="sm"
                  bg="gray.800"
                  color="white"
                  _hover={{ bg: "gray.700" }}
                  loading={saving}
                  onClick={confirmSave}
                >
                  {isEdit ? "Yes, update" : "Yes, add"}
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  )
}

export default PrintConfigFormPage
