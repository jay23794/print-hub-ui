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
import { ORDER_STAGES, STATUSES_BY_STAGE } from "../../constants/orderStatus.constants"

const RANGE_OPTIONS = [
  { label: "Last 24 Hours", value: "24h" },
  { label: "Last 3 Days",   value: "3d" },
  { label: "Last 7 Days",   value: "7d" },
]

interface OrderFiltersProps {
  searchId: string
  onSearchIdChange: (v: string) => void
  status: string | null
  onStatusChange: (v: string | null) => void
  range: string | null
  onRangeChange: (v: string | null) => void
  onReset: () => void
}

function OrderFilters({
  searchId,
  onSearchIdChange,
  status,
  onStatusChange,
  range,
  onRangeChange,
  onReset,
}: OrderFiltersProps) {
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
    onReset()
  }

  function toggleStatus(value: string) {
    onStatusChange(status === value ? null : value)
  }

  function toggleRange(value: string) {
    onRangeChange(range === value ? null : value)
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
            <Input
              placeholder="Search by Order ID..."
              size="sm"
              borderRadius="md"
              value={searchId}
              onChange={(e) => onSearchIdChange(e.target.value)}
            />
          </InputGroup>
        </Box>

        <Separator borderColor="gray.100" />

        {/* Status */}
        <Box pt={3} pb={3}>
          <Text fontSize="xs" fontWeight="700" letterSpacing="wider" color="gray.400" mb={2}>
            STATUS
          </Text>
          <Stack gap={3}>
            {ORDER_STAGES.map((stage) => (
              <Box key={stage}>
                <Text fontSize="2xs" fontWeight="700" letterSpacing="wider" color="gray.500" mb={1}>
                  {stage.toUpperCase()}
                </Text>
                <Stack gap={1.5} pl={1}>
                  {STATUSES_BY_STAGE[stage].map((opt) => (
                    <Checkbox.Root
                      key={opt.code}
                      variant="solid"
                      checked={status === opt.code}
                      onCheckedChange={() => toggleStatus(opt.code)}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>
                        <Text fontSize="sm" color="gray.700">{opt.label}</Text>
                      </Checkbox.Label>
                    </Checkbox.Root>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>

        <Separator borderColor="gray.100" />

        {/* Quick Range */}
        <Box pt={3} pb={3}>
          <Text fontSize="xs" fontWeight="700" letterSpacing="wider" color="gray.400" mb={2}>
            QUICK RANGE
          </Text>
          <Stack gap={2}>
            {RANGE_OPTIONS.map((opt) => (
              <Checkbox.Root
                key={opt.value}
                variant="solid"
                checked={range === opt.value}
                onCheckedChange={() => toggleRange(opt.value)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>
                  <Text fontSize="sm" color="gray.700">{opt.label}</Text>
                </Checkbox.Label>
              </Checkbox.Root>
            ))}
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
