import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  HStack,
  Input,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate } from "react-router"
import { FaRegUserCircle } from "react-icons/fa"

function ProfilePage() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire up save logic
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Navbar */}
      <Box bg="gray.800" px={6} py={4} boxShadow="md">
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
          </HStack>
        </Flex>
      </Box>

      {/* Content */}
      <Flex justify="center" px={6} py={10}>
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="md"
          border="1px solid"
          borderColor="gray.200"
          w="full"
          maxW="520px"
          p={8}
        >
          {/* Header */}
          <Stack align="center" gap={2} mb={8}>
            <Box color="gray.600">
              <FaRegUserCircle size={56} />
            </Box>
            <Heading size="md" color="gray.800">
              My Profile
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Update your personal information
            </Text>
          </Stack>

          <form onSubmit={handleSave}>
            <Stack gap={5}>
              {/* Name */}
              <Field.Root>
                <Field.Label color="gray.700" fontSize="sm" fontWeight="medium">
                  Full Name
                </Field.Label>
                <Input
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  borderColor="gray.300"
                />
              </Field.Root>

              {/* Mobile */}
              <Field.Root>
                <Field.Label color="gray.700" fontSize="sm" fontWeight="medium">
                  Mobile Number
                </Field.Label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  borderColor="gray.300"
                />
              </Field.Root>

              {/* Email */}
              <Field.Root>
                <Field.Label color="gray.700" fontSize="sm" fontWeight="medium">
                  Email
                </Field.Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  borderColor="gray.300"
                />
              </Field.Root>

              {/* Divider */}
              <Box borderTop="1px solid" borderColor="gray.200" pt={4}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={4}>
                  Change Password
                </Text>
                <Stack gap={4}>
                  <Field.Root>
                    <Field.Label color="gray.700" fontSize="sm" fontWeight="medium">
                      Current Password
                    </Field.Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      borderColor="gray.300"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label color="gray.700" fontSize="sm" fontWeight="medium">
                      New Password
                    </Field.Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      borderColor="gray.300"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label color="gray.700" fontSize="sm" fontWeight="medium">
                      Confirm New Password
                    </Field.Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      borderColor="gray.300"
                    />
                  </Field.Root>
                </Stack>
              </Box>

              <Button
                type="submit"
                bg="gray.800"
                color="white"
                size="md"
                w="full"
                mt={2}
                _hover={{ bg: "gray.700" }}
              >
                Save Changes
              </Button>
            </Stack>
          </form>
        </Box>
      </Flex>
    </Box>
  )
}

export default ProfilePage
