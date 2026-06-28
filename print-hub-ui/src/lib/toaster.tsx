import {
  Toaster as ChakraToaster,
  CloseButton,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react"

export const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
  overlap: true,
  duration: 4500,
})

export function AppToaster() {
  return (
    <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
      {(toast) => (
        <Toast.Root width={{ md: "sm" }}>
          {toast.type !== "loading" && <Toast.Indicator />}
          <Stack gap={1} flex="1" maxWidth="100%">
            {toast.title != null && <Toast.Title>{toast.title}</Toast.Title>}
            {toast.description != null && (
              <Toast.Description>{toast.description}</Toast.Description>
            )}
          </Stack>
          <Toast.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Toast.CloseTrigger>
        </Toast.Root>
      )}
    </ChakraToaster>
  )
}
