import {
  Box,
  Flex,
  Heading,
  HStack,
  Spacer,
  Drawer,
  Stack,
} from "@chakra-ui/react"
import { useState } from "react"
import Navbar from "../components/layout/Navbar"
import ProfileMenu from "../components/layout/ProfileMenu"
import SideNav from "../components/layout/SideNav"
import SummaryGrid from "../components/dashboard/SummaryGrid"
import OrdersTable from "../components/orders/OrdersTable"
import OrderFilters from "../components/orders/OrderFilters"

function Dashboard() {
  const [open, setOpen] = useState(false)

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Top Navbar */}
      <Box bg="gray.800" px={6} py={4} position="sticky" top={0} zIndex={10} boxShadow="md">
        <Flex align="center">
          <Navbar onOpenDrawer={() => setOpen(true)} />
          <Heading size="md" color="white" letterSpacing="wide">
            Print HuB
          </Heading>
          <Spacer />
          <HStack>
            <ProfileMenu />
          </HStack>
        </Flex>
      </Box>

      {/* Side Navigation Drawer */}
      <Drawer.Root
        placement="start"
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
      >
        <SideNav />
      </Drawer.Root>

      {/* Page Body */}
      <Flex gap={5} px={6} py={6} align="flex-start">
        {/* Sidebar Filters */}
        <Box flexShrink={0} w="220px">
          <OrderFilters />
        </Box>

        {/* Main Content */}
        <Stack flex={1} gap={5}>
          {/* Summary Cards */}
          <SummaryGrid />

          {/* Orders Table */}
          <Box
            bg="white"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="sm"
            p={4}
          >
            <Heading size="sm" color="gray.700" mb={4}>
              Daily Orders
            </Heading>
            <OrdersTable />
          </Box>
        </Stack>
      </Flex>
    </Box>
  )
}

export default Dashboard
