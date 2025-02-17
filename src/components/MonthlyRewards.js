import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Paper,
  TablePagination,
} from "@mui/material";
import {
  applyFilters,
  applySorting,
  applyPagination,
} from "../utils/dataTransformationUtils";

const MonthlyRewards = ({ monthlyRewards }) => {
  // Sorting state
  const [sorting, setSorting] = useState({
    column: "",
    order: "",
  });

  // Filters state
  const [filters, setFilters] = useState({
    customer: "",
    month: "",
    year: "",
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 5,
  });

  // Current date values for validation.
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Handle sorting changes
  const handleSort = (column) => {
    setSorting((prev) => {
      if (prev.column === column) {
        return { column, order: prev.order === "asc" ? "desc" : "asc" };
      }
      return { column, order: "asc" };
    });
  };

  // filter configuration
  const filterConfig = {
    customer: { field: "customerName", op: "includes" },
    month: { field: "month", op: "monthEquals" },
    year: { field: "year", op: "yearEquals" },
  };

  // Applying filters
  const filteredData = useMemo(
    () => applyFilters(monthlyRewards, filters, filterConfig),
    [monthlyRewards, filters]
  );

  // Applying sorting
  const sortedData = useMemo(
    () => applySorting(filteredData, sorting),
    [filteredData, sorting]
  );

  // Applying pagination
  const paginatedData = useMemo(
    () => applyPagination(sortedData, pagination.page, pagination.rowsPerPage),
    [sortedData, pagination]
  );

  // Handle filter changes and reset page to 0.
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  // Handle pagination page change.
  const handleChangePage = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <TextField
          label="Filter by Customer Name"
          variant="outlined"
          value={filters.customer}
          onChange={(e) => handleFilterChange("customer", e.target.value)}
        />
        <TextField
          type="number"
          label="Month (1-12)"
          variant="outlined"
          value={filters.month}
          onChange={(e) => {
            const value = e.target.value;
            const num = parseInt(value, 10);
            if (value === "") {
              handleFilterChange("month", "");
            } else if (
              filters.year &&
              parseInt(filters.year, 10) === currentYear
            ) {
              if (!isNaN(num) && num >= 1 && num <= currentMonth) {
                handleFilterChange("month", value);
              } else {
                handleFilterChange("month", "");
              }
            } else {
              if (!isNaN(num) && num >= 1 && num <= 12) {
                handleFilterChange("month", value);
              } else {
                handleFilterChange("month", "");
              }
            }
          }}
          style={{ minWidth: "150px" }}
        />
        <TextField
          type="number"
          label={`Year (<= ${currentYear})`}
          variant="outlined"
          value={filters.year}
          onChange={(e) => {
            const value = e.target.value;
            const num = parseInt(value, 10);
            if (
              value === "" ||
              (!isNaN(num) && num > 0 && num <= currentYear)
            ) {
              handleFilterChange("year", value);
            } else {
              handleFilterChange("year", "");
            }
          }}
          style={{ minWidth: "150px" }}
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "#0a8292" }}>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sorting.column === "customerName"}
                  direction={
                    sorting.column === "customerName" ? sorting.order : "asc"
                  }
                  onClick={() => handleSort("customerName")}
                  style={{ color: "white" }}
                >
                  Customer Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sorting.column === "month"}
                  direction={sorting.column === "month" ? sorting.order : "asc"}
                  onClick={() => handleSort("month")}
                  style={{ color: "white" }}
                >
                  Transaction Month
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sorting.column === "year"}
                  direction={sorting.column === "year" ? sorting.order : "asc"}
                  onClick={() => handleSort("year")}
                  style={{ color: "white" }}
                >
                  Transaction Year
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sorting.column === "rewardPoints"}
                  direction={
                    sorting.column === "rewardPoints" ? sorting.order : "asc"
                  }
                  onClick={() => handleSort("rewardPoints")}
                  style={{ color: "white" }}
                >
                  Reward Points
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((reward, index) => (
              <TableRow key={index}>
                <TableCell>{reward.customerName}</TableCell>
                <TableCell>{reward.month}</TableCell>
                <TableCell>{reward.year}</TableCell>
                <TableCell>{reward.rewardPoints}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sortedData.length}
        page={pagination.page}
        onPageChange={handleChangePage}
        rowsPerPage={pagination.rowsPerPage}
        rowsPerPageOptions={[]}
        labelDisplayedRows={({ count, page }) =>
          `Page ${page + 1} of ${Math.ceil(count / pagination.rowsPerPage)}`
        }
      />
    </div>
  );
};

MonthlyRewards.propTypes = {
  monthlyRewards: PropTypes.arrayOf(
    PropTypes.shape({
      customerName: PropTypes.string.isRequired,
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
      rewardPoints: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default React.memo(MonthlyRewards);
