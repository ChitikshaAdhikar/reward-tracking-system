import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import GenericTable from "../utils/GenericTable";
import {
  applySorting,
  applyPagination,
} from "../utils/dataTransformationUtils";
import { getTotalRewards } from "../utils/rewardsCalculator";

const TotalRewards = ({ transactions, globalFilters }) => {
  // State to handle sorting
  const [sorting, setSorting] = useState({
    column: "customerName",
    order: "asc",
  });

  // State for pagination
  const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 5 });

  // The getTotalRewards function internally filters transactions based on globalFilters
  const filteredTotalRewards = useMemo(() => {
    try {
      return getTotalRewards(transactions, globalFilters);
    } catch (error) {
      console.error("Error computing monthly rewards:", error);
      return [];
    }
  }, [transactions, globalFilters]);
  
  // Apply sorting to the filtered total rewards
  const sortedData = useMemo(
    () => applySorting(filteredTotalRewards, sorting),
    [filteredTotalRewards, sorting]
  );

  // Apply pagination to the sorted data
  const paginatedData = useMemo(
    () => applyPagination(sortedData, pagination.page, pagination.rowsPerPage),
    [sortedData, pagination]
  );

  // Handler function for sorting
  const handleSort = (column) => {
    setSorting((prev) => ({
      column,
      order: prev.column === column && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  // Handler for pagination page changes
  const handleChangePage = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Define the columns for the table
  const columns = [
    { id: "customerName", label: "Customer Name", sortable: true },
    { id: "rewardPoints", label: "Total Reward Points", sortable: true },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <GenericTable
        columns={columns}
        data={paginatedData}
        sorting={sorting}
        onSort={handleSort}
        pagination={{
          count: sortedData.length,
          page: pagination.page,
          rowsPerPage: pagination.rowsPerPage,
          onPageChange: handleChangePage,
        }}
        rowKey={(row, idx) => idx}
      />
    </div>
  );
};

TotalRewards.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      customerName: PropTypes.string.isRequired,
      purchaseDate: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  globalFilters: PropTypes.shape({
    customerName: PropTypes.string,
    fromDate: PropTypes.string,
    toDate: PropTypes.string,
  }).isRequired,
};

export default React.memo(TotalRewards);
