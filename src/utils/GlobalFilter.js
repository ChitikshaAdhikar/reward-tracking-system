/**
 * @file GlobalFilter.js
 * @description A reusable component that provides filter input fields for Customer Name, From Date, and To Date,
 * along with Apply and Reset buttons.
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, TextField, Button } from "@mui/material";

const GlobalFilter = ({ initialFilters, onApply, onReset }) => {
  // Initialize state with the initial filters
  const [localFilters, setLocalFilters] = useState(initialFilters);

  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  // Handle change for any filter field by updating the filter state
  const handleChange = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  // When the Apply button is clicked, pass the current localFilters back to the parent.
  const handleApply = () => {
    onApply(localFilters);
  };

  // When the Reset button is clicked, reset localFilters to empty values, and pass it to the parent by calling onReset.
  const handleReset = () => {
    const resetFilters = { customerName: "", fromDate: "", toDate: "" };
    setLocalFilters(resetFilters);
    onReset(resetFilters);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        borderBottom: "1px solid #ccc",
      }}
    >
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Customer Name"
          variant="outlined"
          value={localFilters.customerName || ""}
          onChange={(e) => handleChange("customerName", e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="From Date"
          variant="outlined"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={localFilters.fromDate || ""}
          onChange={(e) => handleChange("fromDate", e.target.value)}
        />
        <TextField
          label="To Date"
          variant="outlined"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={localFilters.toDate || ""}
          onChange={(e) => handleChange("toDate", e.target.value)}
        />
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" sx={{ backgroundColor: "#0a8292" }} onClick={handleApply}>
          Apply
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Reset
        </Button>
      </Box>
    </Box>
  );
};

GlobalFilter.propTypes = {
  initialFilters: PropTypes.shape({
    customerName: PropTypes.string,
    fromDate: PropTypes.string,
    toDate: PropTypes.string,
  }),
  onApply: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default GlobalFilter;
