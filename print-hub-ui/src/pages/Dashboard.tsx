import {
  Box,
  Flex,
  Heading,
  HStack,
  Spacer,
  Stack,
} from "@chakra-ui/react"

import ProfileMenu from "../components/layout/ProfileMenu"

import SummaryGrid from "../components/dashboard/SummaryGrid"
import OrdersTable from "../components/orders/OrdersTable"
import OrderFilters from "../components/orders/OrderFilters"

function Dashboard() {
 
  return (
    <Box minH="100vh" bg="gray.50">
      {/* Top Navbar */}
      <Box bg="gray.800" px={6} py={4} position="sticky" top={0} zIndex={10} boxShadow="md">
        <Flex align="center">
        
          <Heading size="md" color="white" letterSpacing="wide">
            Print HuB
          </Heading>
          <Spacer />
          <HStack>
            <ProfileMenu />
          </HStack>
        </Flex>
      </Box>



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
          
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
           
            pb={2}
          >
          
            <OrdersTable />
          </Box>
        </Stack>
      </Flex>
    </Box>
  )
}

export default Dashboard
