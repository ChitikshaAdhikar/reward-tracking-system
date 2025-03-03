import React, { useMemo } from "react";
import PropTypes from "prop-types";
import GenericTable from "./common/GenericTable";
import {
  applySorting,
  applyPagination,
} from "../utils/dataTransformationUtils";
import { getTransactionsWithRewards } from "../utils/rewardsCalculator";
import Logger from "../utils/logger";
import useTableControls from "../hooks/useTableControls";

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

const logger = new Logger("error");
const Transactions = ({ transactions, globalFilters }) => {
  const { sorting, pagination, handleSort, handleChangePage } =
    useTableControls(
      {
        column: "purchaseDate",
        order: "desc",
      },
      { page: 0, rowsPerPage: 5 }
    );

  // getTransactionsWithRewards fetch the filtered data with rewards attached.
  const filteredTransactions = useMemo(() => {
    try {
      return getTransactionsWithRewards(transactions, globalFilters);
    } catch (err) {
      logger.error("Error in Transactions:" + err);
      throw err;
    }
  }, [transactions, globalFilters]);

  const sortedData = useMemo(
    () => applySorting(filteredTransactions, sorting),
    [filteredTransactions, sorting]
  );

  const paginatedData = useMemo(
    () => applyPagination(sortedData, pagination.page, pagination.rowsPerPage),
    [sortedData, pagination]
  );

  const columns = [
    {
      id: "transactionId",
      label: "Transaction ID",
      sortable: true,
      render: (row) => `${row.transactionId.toUpperCase()}`,
    },
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
      render: (row) => `$${Number(row.price).toFixed(2)}`,
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
        rowKey={(row) => row.transactionId}
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
