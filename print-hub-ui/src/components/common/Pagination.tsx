import { ButtonGroup, IconButton, Pagination } from "@chakra-ui/react"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import type { PaginationProps } from "../../types/pagination.types"

function AppPagination({ count, pageSize, page, onPageChange }: PaginationProps) {
  return (
    <Pagination.Root
      count={count}
      pageSize={pageSize}
      page={page}
      onPageChange={(e) => onPageChange(e.page)}
    >
      <ButtonGroup variant="ghost" size="sm" gap={1}>
        <Pagination.PrevTrigger asChild>
          <IconButton
            aria-label="Previous page"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
            _hover={{ bg: "gray.100" }}
          >
            <LuChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>

        <Pagination.Items
          render={(p) => (
            <IconButton
              aria-label={`Page ${p.value}`}
              variant={p.type === "page" && p.value === page ? "solid" : "ghost"}
              colorPalette={p.type === "page" && p.value === page ? "blue" : undefined}
              borderRadius="md"
              border="1px solid"
              borderColor={p.type === "page" && p.value === page ? "blue.500" : "gray.200"}
              fontWeight={p.type === "page" && p.value === page ? "bold" : "normal"}
              _hover={{ bg: p.value === page ? "blue.600" : "gray.100" }}
            >
              {p.value}
            </IconButton>
          )}
        />

        <Pagination.NextTrigger asChild>
          <IconButton
            aria-label="Next page"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
            _hover={{ bg: "gray.100" }}
          >
            <LuChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  )
}

export default AppPagination
