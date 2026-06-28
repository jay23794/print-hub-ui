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
import { useAuth } from "../contexts/AuthContext"
import { loginAdmin } from "../services/auth.service"

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await loginAdmin({ username, password })
      login(res.data.token)
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
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
                Username
              </Field.Label>
              <Input
                type="text"
                placeholder="adminph@printhub.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

            {error && (
              <Text color="red.500" fontSize="sm" textAlign="center">
                {error}
              </Text>
            )}

            <Button
              type="submit"
              bg="gray.800"
              color="white"
              size="md"
              w="full"
              mt={2}
              _hover={{ bg: "gray.700" }}
              loading={loading}
              loadingText="Signing in..."
            >
              Sign In
            </Button>

            {/* TEMP: game UI preview */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              w="full"
              color="gray.400"
              fontSize="xs"
              _hover={{ color: "gray.600" }}
              onClick={() => navigate("/game-preview")}
            >
              Preview Game UI →
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  )
}

export default LoginPage
