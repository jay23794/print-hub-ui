import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate } from "react-router"

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: replace with real auth logic
    navigate("/")
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="md"
        w="full"
        maxW="400px"
        border="1px solid"
        borderColor="gray.200"
      >
        {/* Header */}
        <Stack gap={1} mb={8} textAlign="center">
          <Heading size="lg" color="gray.800" letterSpacing="wide">
            Print HuB
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Sign in to your account
          </Text>
        </Stack>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <Stack gap={5}>
            <Field.Root required>
              <Field.Label color="gray.700" fontSize="sm" fontWeight="medium">
                Email
              </Field.Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="md"
                borderColor="gray.300"
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label color="gray.700" fontSize="sm" fontWeight="medium">
                Password
              </Field.Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="md"
                borderColor="gray.300"
              />
            </Field.Root>

            <Button
              type="submit"
              bg="gray.800"
              color="white"
              size="md"
              w="full"
              mt={2}
              _hover={{ bg: "gray.700" }}
            >
              Sign In
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  )
}

export default LoginPage
