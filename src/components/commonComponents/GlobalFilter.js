/**
 * @file GlobalFilter.js
 * @description A reusable component that provides filter input fields for Customer Name, From Date, and To Date,
 * along with Apply and Reset buttons.
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, TextField, Button } from "@mui/material";

/**
 * @file GlobalFilter.js
 * @description A reusable component that provides filter input fields for Customer Name, From Date, and To Date,
 * along with Apply and Reset buttons.
 * @component GlobalFilter
 * @param {Object} props - Component props.
 * @param {Object} props.initialFilters - The initial filter values.
 * @param {string} [props.initialFilters.customerName] - The initial customer name filter.
 * @param {string} [props.initialFilters.fromDate] - The initial "from" date filter.
 * @param {string} [props.initialFilters.toDate] - The initial "to" date filter.
 * @param {Function} props.onApply - Callback function invoked when the Apply button is clicked.
 * @param {Function} props.onReset - Callback function invoked when the Reset button is clicked.
 * @returns {JSX.Element} The rendered GlobalFilter component.
 */
const GlobalFilter = ({ initialFilters, onApply, onReset }) => {
  // Initialize state with the initial filters passed from the parent.
  const [localFilters, setLocalFilters] = useState(initialFilters);

  // Update local state if initialFilters prop changes.
  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  //Updates a specific filter field in the localFilters state.
  const handleChange = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  //Invokes the onApply with the current localFilters.
  const handleApply = () => {
    onApply(localFilters);
  };

  //Resets the filter values to empty strings and invokes the onReset.
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
      {/* Filter inputs container */}
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
          // Used slotProps to ensure the label remains shrunk above the input
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
      {/* Action buttons container */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#0a8292" }}
          onClick={handleApply}
        >
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

GlobalFilter.defaultProps = {
  initialFilters: { customerName: "", fromDate: "", toDate: "" },
};

export default GlobalFilter;
