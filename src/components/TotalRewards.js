import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import GenericTable from "./common/GenericTable";
import {
  applySorting,
  applyPagination,
} from "../utils/dataTransformationUtils";
import { getTotalRewards } from "../utils/rewardsCalculator";
import Logger from "../utils/logger";
import useTableControls from "../hooks/useTableControls";

/**
 * @file TotalRewards.js
 * @description  This component calculates and displays aggregated total reward points per customer
 * based on the provided transactions and global filters. It supports sorting and pagination.
 * @component TotalRewards
 * @param {Object} props - Component props.
 * @param {Array} props.transactions - An array of transaction objects.
 * @param {Object} props.globalFilters - Global filters (customerName, fromDate, toDate) to filter transactions.
 * @returns {JSX.Element} The rendered TotalRewards table.
 */
const logger = new Logger("error");
const TotalRewards = ({ transactions, globalFilters }) => {
  const { sorting, pagination, handleSort, handleChangePage } =
    useTableControls(
      {
        column: "customerName",
        order: "asc",
      },
      { page: 0, rowsPerPage: 5 }
    );

  // The getTotalRewards function internally filters transactions based on globalFilters
  const filteredTotalRewards = useMemo(() => {
    try {
      return getTotalRewards(transactions, globalFilters);
    } catch (error) {
      logger.error("Error computing total rewards:", error);
      throw Error(error);
    }
  }, [transactions, globalFilters]);

  const sortedData = useMemo(
    () => applySorting(filteredTotalRewards, sorting),
    [filteredTotalRewards, sorting]
  );

  const paginatedData = useMemo(
    () => applyPagination(sortedData, pagination.page, pagination.rowsPerPage),
    [sortedData, pagination]
  );

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
