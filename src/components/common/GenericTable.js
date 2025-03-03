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

/**
 * @file GenericTable.js
 * @description A generic table component that renders table headers, rows, and pagination controls using Material‑UI.
 * @component GenericTable
 * @param {Object} props - The component props.
 * @param {Array} props.columns - Array of column definitions. Each object should contain:
 *   - id - The key for accessing data from each row.
 *   - label - The column header label.
 *   - sortable - Indicates if the column is sortable.
 *   - render - A custom render function for displaying the cell's data.
 * @param {Array} props.data - Array of data objects to be rendered as rows.
 * @param {Object} props.sorting - Sorting configuration.
 * @param {string} props.sorting.column - The column ID that is currently sorted.
 * @param {string} props.sorting.order - The current sort order(asc or desc).
 * @param {function} props.onSort - Callback function that is triggered when a sortable header is clicked.
 * @param {Object} props.pagination - Pagination configuration, including:
 *   - count - Total number of rows.
 *   - page - Current page.
 *   - rowsPerPage - Number of rows per page.
 *   - onPageChange - Callback function to handle page changes.
 * @param {function} [props.rowKey] - Optional function that returns a unique key for each row.
 *                                    by default, the row index will be used.
 * @returns {JSX.Element} The rendered GenericTable component.
 */
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
  const getTextAlign = (columnId) => {
    return columnId === "rewardPoints" || columnId === "price"
      ? "right"
      : "left";
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
                  <TableCell
                    key={col.id}
                    style={{ textAlign: getTextAlign(col.id) }}
                  >
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
