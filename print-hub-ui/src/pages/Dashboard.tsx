import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Spacer,
  Stack,
} from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate } from "react-router"
import { LuLogOut } from "react-icons/lu"
import { useAuth } from "../contexts/AuthContext"

import ProfileMenu from "../components/layout/ProfileMenu"

import SummaryGrid from "../components/dashboard/SummaryGrid"
import OrdersTable from "../components/orders/OrdersTable"
import OrderFilters from "../components/orders/OrderFilters"

function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [searchId, setSearchId] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [range, setRange] = useState<string | null>(null)

  function handleReset() {
    setSearchId("")
    setStatus(null)
    setPaymentStatus(null)
    setRange(null)
  }

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Top Navbar */}
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
              color="white"
              _hover={{ bg: "gray.700" }}
              onClick={() => navigate("/print-configs")}
            >
              Configs
            </Button>
            <Button
              size="sm"
              variant="ghost"
              color="white"
              _hover={{ bg: "gray.700" }}
              onClick={handleLogout}
            >
              <LuLogOut />
              Logout
            </Button>
            <ProfileMenu />
          </HStack>
        </Flex>
      </Box>



      {/* Page Body */}
      <Flex gap={5} px={6} py={6} align="flex-start">
        {/* Sidebar Filters */}
        <Box flexShrink={0} w="220px">
          <OrderFilters
            searchId={searchId}
            onSearchIdChange={setSearchId}
            status={status}
            onStatusChange={setStatus}
            paymentStatus={paymentStatus}
            onPaymentStatusChange={setPaymentStatus}
            range={range}
            onRangeChange={setRange}
            onReset={handleReset}
          />
        </Box>

        {/* Main Content */}
        <Stack flex={1} gap={5}>
          {/* Summary Cards */}
          <SummaryGrid />

          {/* Orders Table */}
          <Box
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            pb={2}
          >
            <OrdersTable
              searchId={searchId}
              status={status}
              paymentStatus={paymentStatus}
              range={range}
            />
          </Box>
        </Stack>
      </Flex>
    </Box>
  )
}

export default Dashboard
