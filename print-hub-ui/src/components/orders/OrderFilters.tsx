import { useState } from "react"
import {
  Box,
  Checkbox,
  Separator,
  Field,
  Flex,
  Input,
  InputGroup,
  Stack,
  Text,
} from "@chakra-ui/react"
import { FiSearch } from "react-icons/fi"

function OrderFilters() {
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [dateError, setDateError] = useState("")

  function handleFromDate(value: string) {
    setFromDate(value)
    if (toDate && value > toDate) {
      setDateError("'From' date cannot be after 'To' date.")
    } else {
      setDateError("")
    }
  }

  function handleToDate(value: string) {
    setToDate(value)
    if (fromDate && value < fromDate) {
      setDateError("'To' date cannot be before 'From' date.")
    } else {
      setDateError("")
    }
  }

  function handleReset() {
    setFromDate("")
    setToDate("")
    setDateError("")
  }

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      shadow="sm"
      overflow="hidden"
    >
      {/* Header */}
      <Flex
        px={4}
        py={3}
        justify="space-between"
        align="center"
        borderBottom="1px solid"
        borderColor="gray.100"
        bg="gray.50"
      >
        <Text fontSize="sm" fontWeight="700" letterSpacing="wider" color="gray.700">
          FILTERS
        </Text>
        <Text
          fontSize="xs"
          fontWeight="600"
          color="blue.500"
          cursor="pointer"
          _hover={{ color: "blue.700" }}
          onClick={handleReset}
        >
          RESET
        </Text>
      </Flex>

      <Stack gap={0} px={4} pb={4}>
        {/* Search */}
        <Box pt={3} pb={3}>
          <InputGroup width="full" startElement={<FiSearch size={14} color="gray" />}>
            <Input placeholder="Search..." size="sm" borderRadius="md" />
          </InputGroup>
        </Box>

        <Separator borderColor="gray.100" />

        {/* Status */}
        <Box pt={3} pb={3}>
          <Text fontSize="xs" fontWeight="700" letterSpacing="wider" color="gray.400" mb={2}>
            STATUS
          </Text>
          <Stack gap={2}>
            <Checkbox.Root variant="solid">
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                <Text fontSize="sm" color="gray.700">Pending</Text>
              </Checkbox.Label>
            </Checkbox.Root>

            <Checkbox.Root variant="solid">
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                <Text fontSize="sm" color="gray.700">Cancel / Rejected</Text>
              </Checkbox.Label>
            </Checkbox.Root>

            <Checkbox.Root variant="solid">
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                <Text fontSize="sm" color="gray.700">Success</Text>
              </Checkbox.Label>
            </Checkbox.Root>
          </Stack>
        </Box>

        <Separator borderColor="gray.100" />

        {/* Quick Range */}
        <Box pt={3} pb={3}>
          <Text fontSize="xs" fontWeight="700" letterSpacing="wider" color="gray.400" mb={2}>
            QUICK RANGE
          </Text>
          <Stack gap={2}>
            <Checkbox.Root variant="solid">
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                <Text fontSize="sm" color="gray.700">Last 24 Hours</Text>
              </Checkbox.Label>
            </Checkbox.Root>

            <Checkbox.Root variant="solid">
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                <Text fontSize="sm" color="gray.700">Last 3 Days</Text>
              </Checkbox.Label>
            </Checkbox.Root>

            <Checkbox.Root variant="solid">
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                <Text fontSize="sm" color="gray.700">Last 7 Days</Text>
              </Checkbox.Label>
            </Checkbox.Root>
          </Stack>
        </Box>

        <Separator borderColor="gray.100" />

        {/* Date Range */}
        <Box pt={3}>
          <Text fontSize="xs" fontWeight="700" letterSpacing="wider" color="gray.400" mb={3}>
            DATE RANGE
          </Text>
          <Stack gap={3}>
            <Field.Root invalid={!!dateError}>
              <Field.Label fontSize="xs" color="gray.600" mb={1}>From</Field.Label>
              <Input
                type="date"
                size="sm"
                borderRadius="md"
                value={fromDate}
                onChange={(e) => handleFromDate(e.target.value)}
              />
            </Field.Root>

            <Field.Root invalid={!!dateError}>
              <Field.Label fontSize="xs" color="gray.600" mb={1}>To</Field.Label>
              <Input
                type="date"
                size="sm"
                borderRadius="md"
                value={toDate}
                onChange={(e) => handleToDate(e.target.value)}
              />
              {dateError && (
                <Field.ErrorText fontSize="xs">{dateError}</Field.ErrorText>
              )}
            </Field.Root>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

export default OrderFilters
