import { useState, useCallback } from "react";

const useTableControls = (
  initialSort = { column: "customerName", order: "asc" },
  initialPagination = { page: 0, rowsPerPage: 5 }
) => {
  const [sorting, setSorting] = useState(initialSort);
  const [pagination, setPagination] = useState(initialPagination);

  const handleSort = useCallback((column) => {
    setSorting((prev) => ({
      column,
      order: prev.column === column && prev.order === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleChangePage = useCallback((_event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  return { sorting, pagination, handleSort, handleChangePage };
};

export default useTableControls;
