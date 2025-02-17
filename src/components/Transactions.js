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
  Box,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import {
  applyFilters,
  applySorting,
  applyPagination,
} from "../utils/dataTransformationUtils";

const Transactions = ({ transactions }) => {
  // State for filters
  const [filters, setFilters] = useState({
    customer: "",
    product: "",
    month: "",
    year: "",
  });
  // State for sorting
  const [sorting, setSorting] = useState({
    column: "customerName",
    order: "asc",
  });
  // State for pagination
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 5,
  });

  // Current date values for validation.
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Extracting unique values for Autocomplete inputs
  const uniqueCustomers = useMemo(
    () => [...new Set(transactions.map((t) => t.customerName))],
    [transactions]
  );
  const uniqueProducts = useMemo(
    () => [...new Set(transactions.map((t) => t.product))],
    [transactions]
  );

  // Filter configuration
  const filterConfig = {
    customer: { field: "customerName", op: "includes" },
    product: { field: "product", op: "includes" },
    month: { field: "purchaseDate", op: "monthEquals" },
    year: { field: "purchaseDate", op: "yearEquals" },
  };

  // Applying filters
  const filteredData = useMemo(
    () => applyFilters(transactions, filters, filterConfig),
    [transactions, filters]
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

  // Updating filters: resets page to 0 when a filter changes.
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  // Toggle sorting for a provided column
  const handleSort = (column) => {
    setSorting((prev) => ({
      column,
      order: prev.column === column && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  // Update the current page.
  const handleChangePage = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <Autocomplete
          options={uniqueCustomers}
          value={filters.customer}
          onChange={(e, value) => handleFilterChange("customer", value || "")}
          renderInput={(params) => (
            <TextField {...params} label="Customer" variant="outlined" />
          )}
          sx={{ minWidth: 200 }}
        />
        <Autocomplete
          options={uniqueProducts}
          value={filters.product}
          onChange={(e, value) => handleFilterChange("product", value || "")}
          renderInput={(params) => (
            <TextField {...params} label="Product" variant="outlined" />
          )}
          sx={{ minWidth: 200 }}
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
              !isNaN(num) &&
              num >= 1 &&
              (filters.year && parseInt(filters.year, 10) === currentYear
                ? num <= currentMonth
                : num <= 12)
            ) {
              handleFilterChange("month", value);
            } else {
              handleFilterChange("month", "");
            }
          }}
          sx={{ minWidth: 150 }}
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
          sx={{ minWidth: 150 }}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#0a8292" }}>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sorting.column === "customerName"}
                  direction={sorting.order}
                  onClick={() => handleSort("customerName")}
                  sx={{ color: "white" }}
                >
                  Customer Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sorting.column === "purchaseDate"}
                  direction={sorting.order}
                  onClick={() => handleSort("purchaseDate")}
                  sx={{ color: "white" }}
                >
                  Purchase Date
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: "white" }}>
                <TableSortLabel
                  active={sorting.column === "product"}
                  direction={sorting.order}
                  onClick={() => handleSort("product")}
                  sx={{ color: "white" }}
                >
                  Product
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: "white" }}>
                <TableSortLabel
                  active={sorting.column === "price"}
                  direction={sorting.column === "price" ? sorting.order : "asc"}
                  onClick={() => handleSort("price")}
                  sx={{ color: "white" }}
                >
                  $ Price
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((trans) => (
              <TableRow key={trans.id}>
                <TableCell>{trans.customerName}</TableCell>
                <TableCell>
                  {new Date(trans.purchaseDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{trans.product}</TableCell>
                <TableCell>$ {Number(trans.price).toFixed(2)}</TableCell>
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
};

export default React.memo(Transactions);
