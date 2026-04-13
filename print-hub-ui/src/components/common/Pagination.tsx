import { Button, ButtonGroup, IconButton, Text } from "@chakra-ui/react"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import type { PaginationProps } from "../../types/pagination.types"

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  if (current <= 4) return [1, 2, 3, 4, 5, "…", total]
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total]
  return [1, "…", current - 1, current, current + 1, "…", total]
}

function AppPagination({ count, pageSize, page, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(count / pageSize)
  if (totalPages <= 1) return null

  const items = getPageNumbers(page, totalPages)

  return (
    <ButtonGroup variant="ghost" size="sm" gap={1}>
      <IconButton
        aria-label="Previous page"
        borderRadius="md"
        border="1px solid"
        borderColor="gray.200"
        _hover={{ bg: "gray.100" }}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <LuChevronLeft />
      </IconButton>

      {items.map((item, i) =>
        item === "…" ? (
          <Text key={`ellipsis-${i}`} px={2} alignSelf="center" color="gray.400" fontSize="sm">
            …
          </Text>
        ) : (
          <Button
            key={item}
            aria-label={`Page ${item}`}
            borderRadius="md"
            border="1px solid"
            borderColor={item === page ? "blue.500" : "gray.200"}
            bg={item === page ? "blue.500" : "transparent"}
            color={item === page ? "white" : "gray.700"}
            fontWeight={item === page ? "bold" : "normal"}
            minW="8"
            px={0}
            _hover={{ bg: item === page ? "blue.600" : "gray.100" }}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        )
      )}

      <IconButton
        aria-label="Next page"
        borderRadius="md"
        border="1px solid"
        borderColor="gray.200"
        _hover={{ bg: "gray.100" }}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <LuChevronRight />
      </IconButton>
    </ButtonGroup>
  )
}

export default AppPagination
