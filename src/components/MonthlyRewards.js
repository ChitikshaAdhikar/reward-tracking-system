import React, { useMemo } from "react";
import PropTypes from "prop-types";
import GenericTable from "./common/GenericTable";
import {
  applySorting,
  applyPagination,
} from "../utils/dataTransformationUtils";
import { getMonthlyRewards } from "../utils/rewardsCalculator";
import Logger from "../utils/logger";
import useTableControls from "../hooks/useTableControls";

/**
 * @file MonthlyRewards.js
 * @description This component calculates and displays monthly aggregated reward points based on
 * filtered transaction data. It supports sorting and pagination, allowing users
 * to view reward data by customer, month, and year.
 * @component  MonthlyRewards
 * @param {Object} props - Component properties.
 * @param {Array} props.transactions - Array of transaction objects.
 * @param {Object} props.globalFilters - Global filters (customerName, fromDate, toDate) to apply on transactions.
 * @returns {JSX.Element} The rendered MonthlyRewards table.
 */
const logger = new Logger("error");
const MonthlyRewards = ({ transactions, globalFilters }) => {
  const { pagination, sorting, handleSort, handleChangePage } =
    useTableControls(
      {
        column: "year",
        order: "desc",
      },
      { page: 0, rowsPerPage: 5 }
    );

  //Get filtered monthly rewards data by applying the global filters.
  const filteredMonthlyRewards = useMemo(() => {
    try {
      return getMonthlyRewards(transactions, globalFilters);
    } catch (error) {
      logger.error("Error computing monthly rewards:", error);
      throw error;
    }
  }, [transactions, globalFilters]);

  const sortedData = useMemo(
    () => applySorting(filteredMonthlyRewards, sorting),
    [filteredMonthlyRewards, sorting]
  );

  const paginatedData = useMemo(
    () => applyPagination(sortedData, pagination.page, pagination.rowsPerPage),
    [sortedData, pagination]
  );

  const columns = [
    {
      id: "customerId",
      label: "Customer ID",
      sortable: true,
      render: (row) => `${row.customerId.toUpperCase()}`,
    },
    { id: "customerName", label: "Customer Name", sortable: true },
    { id: "month", label: "Month", sortable: true },
    { id: "year", label: "Year", sortable: true },
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
      />
    </div>
  );
};

MonthlyRewards.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      customerId: PropTypes.number,
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

export default React.memo(MonthlyRewards);
