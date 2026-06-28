import { Button, Dialog, HStack, Text } from "@chakra-ui/react"

interface Props {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  cancelLabel?: string
  confirmColor?: string
  loading?: boolean
  onCancel: () => void
  onConfirm: () => void
}

function OrderActionConfirm({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel = "Back",
  confirmColor = "blue",
  loading = false,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => {
        if (!e.open && !loading) onCancel()
      }}
      size="sm"
      role="alertdialog"
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content borderRadius="xl" p={5}>
          <Dialog.Header pb={3}>
            <Dialog.Title fontSize="md" fontWeight="semibold" color="gray.800">
              {title}
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body pt={1} pb={4}>
            <Text fontSize="sm" color="gray.600" lineHeight="1.55">
              {body}
            </Text>
          </Dialog.Body>

          <Dialog.Footer pt={2}>
            <HStack gap={2} justify="flex-end" width="full">
              <Button
                size="sm"
                variant="ghost"
                colorPalette="gray"
                disabled={loading}
                onClick={onCancel}
              >
                {cancelLabel}
              </Button>
              <Button
                size="sm"
                colorPalette={confirmColor}
                variant="solid"
                loading={loading}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

export default OrderActionConfirm
