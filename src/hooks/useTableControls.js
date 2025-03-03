import { useState } from "react";

const useTableControls = (
  initialSort = { column: "customerName", order: "asc" },
  initialPagination = { page: 0, rowsPerPage: 5 }
) => {
  const [sorting, setSorting] = useState(initialSort);
  const [pagination, setPagination] = useState(initialPagination);

  const handleSort = (column) => {
    setSorting((prev) => ({
      column,
      order: prev.column === column && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleChangePage = (_event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return { sorting, pagination, handleSort, handleChangePage };
};

export default useTableControls;
