/**
 * @file GenericTable.js
 * @description A generic table component that renders table headers, rows, and pagination controls using Material‑UI.
 */

import React from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TablePagination,
} from "@mui/material";

const GenericTable = ({
  columns,
  data,
  sorting,
  onSort,
  pagination,
  rowKey,
}) => {
  const handleSort = (columnId) => {
    if (onSort) {
      onSort(columnId);
    }
  };
  
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "#0a8292" }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.id} style={{ color: "white" }}>
                  {col.sortable ? (
                    <TableSortLabel
                      active={sorting?.column === col.id}
                      direction={
                        sorting?.column === col.id ? sorting.order : "asc"
                      }
                      onClick={() => handleSort(col.id)}
                      style={{ color: "white" }}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={rowKey ? rowKey(row, idx) : idx}>
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    {col.render ? col.render(row) : row[col.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.count}
          page={pagination.page}
          onPageChange={pagination.onPageChange}
          rowsPerPage={pagination.rowsPerPage}
          rowsPerPageOptions={[]}
          labelDisplayedRows={({ count, page }) =>
            `Page ${page + 1} of ${Math.ceil(count / pagination.rowsPerPage)}`
          }
        />
      )}
    </>
  );
};

GenericTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  sorting: PropTypes.shape({
    column: PropTypes.string,
    order: PropTypes.oneOf(["asc", "desc"]),
  }),
  onSort: PropTypes.func,
  pagination: PropTypes.shape({
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
  }),
  rowKey: PropTypes.func,
};

export default GenericTable;
