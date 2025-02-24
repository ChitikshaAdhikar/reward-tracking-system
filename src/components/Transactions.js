import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import GenericTable from "./commonComponents/GenericTable";
import {
  applySorting,
  applyPagination,
} from "../utils/dataTransformationUtils";
import { getFilteredTransactions } from "../utils/rewardsCalculator";

/**
 * @file Transactions.js
 * @description This component filters, sorts, and paginates a list of transactions,
 * then displays them in a table using the GenericTable component.
 * @component  Transactions
 * @param {Object} props - Component properties.
 * @param {Array} props.transactions - Array of transaction objects.
 * @param {Object} props.globalFilters - Global filters (e.g., customerName, fromDate, toDate) applied to transactions.
 * @returns {JSX.Element} The rendered Transactions component.
 */

const Transactions = ({ transactions, globalFilters }) => {
  // State for sorting
  const [sorting, setSorting] = useState({
    column: "transactionId",
    order: "asc",
  });

  // State for pagination
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 5,
  });

  // getFilteredTransactions applies the filtering logic based on globalFilters.
  const filteredTransactions = useMemo(() => {
    try {
      return getFilteredTransactions(transactions, globalFilters);
    } catch (err) {
      console.log("Error in Transactions:" + err);
      throw new Error(err);
    }
  }, [transactions, globalFilters]);

  // Apply sorting on the filtered transactions
  const sortedData = useMemo(
    () => applySorting(filteredTransactions, sorting),
    [filteredTransactions, sorting]
  );

  // Apply pagination on the sorted data
  const paginatedData = useMemo(
    () => applyPagination(sortedData, pagination.page, pagination.rowsPerPage),
    [sortedData, pagination]
  );

  // Function to handle sorting when a column header is clicked
  const handleSort = (column) => {
    setSorting((prev) => ({
      column,
      order: prev.column === column && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  // Function to handle pagination page changes
  const handleChangePage = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Define table columns and labels
  const columns = [
    { id: "transactionId", label: "Transaction Id", sortable: true },
    { id: "customerName", label: "Customer Name", sortable: true },
    {
      id: "purchaseDate",
      label: "Purchase Date",
      sortable: true,
      render: (row) => new Date(row.purchaseDate).toLocaleDateString(),
    },
    { id: "product", label: "Product", sortable: true },
    {
      id: "price",
      label: "$ Price",
      sortable: true,
      render: (row) => `$ ${Number(row.price).toFixed(2)}`,
    },
    { id: "rewardPoints", label: "Reward Points", sortable: true },
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
        rowKey={(row, idx) => row.transactionId}
      />
    </div>
  );
};

Transactions.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      customerName: PropTypes.string.isRequired,
      purchaseDate: PropTypes.string.isRequired,
      product: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  globalFilters: PropTypes.shape({
    customerName: PropTypes.string,
    fromDate: PropTypes.string,
    toDate: PropTypes.string,
  }).isRequired,
};

export default React.memo(Transactions);
