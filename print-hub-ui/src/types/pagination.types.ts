export interface PaginationProps {
  count: number
  pageSize: number
  page: number
  onPageChange: (page: number) => void
}
