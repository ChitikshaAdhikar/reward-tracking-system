import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
  TablePagination,
} from "@mui/material";
import PropTypes from "prop-types";
import {
  applyFilters,
  applySorting,
  applyPagination,
} from "../utils/dataTransformationUtils";

const TotalRewards = ({ totalRewards }) => {
  const [sorting, setSorting] = useState({
    order: "asc",
    column: "customerName",
  });
  const [filters, setFilters] = useState({
    customer: "",
  });
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 5,
  });

  // Filter configuration
  const filterConfig = {
    customer: { field: "customerName", op: "includes" },
  };

  // Applying filters
  const filteredData = useMemo(
    () => applyFilters(totalRewards, filters, filterConfig),
    [totalRewards, filters]
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

  // Handle sorting
  const handleSort = (column) => {
    setSorting((prev) => {
      if (prev.column === column) {
        return { column, order: prev.order === "asc" ? "desc" : "asc" };
      }
      return { column, order: "asc" };
    });
  };

  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Handle filter changes
  const handleFilterChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
    setPagination((prev) => ({ ...prev, page: 0 }));
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
          onChange={handleFilterChange("customer")}
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
                  active={sorting.column === "rewardPoints"}
                  direction={
                    sorting.column === "rewardPoints" ? sorting.order : "asc"
                  }
                  onClick={() => handleSort("rewardPoints")}
                  style={{ color: "white" }}
                >
                  Total Reward Points
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((reward, index) => (
              <TableRow key={index}>
                <TableCell>{reward.customerName}</TableCell>
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
        rowsPerPageOptions={[]} // Remove rows-per-page dropdown.
        labelDisplayedRows={({ count, page }) =>
          `Page ${page + 1} of ${Math.ceil(count / pagination.rowsPerPage)}`
        }
      />
    </div>
  );
};

TotalRewards.propTypes = {
  totalRewards: PropTypes.arrayOf(
    PropTypes.shape({
      customerName: PropTypes.string.isRequired,
      rewardPoints: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default TotalRewards;
