/**
 * @file dataTransformationUtils.js
 * @description Provides helper functions for sorting and paginating data.
 */

// Sorts data based on the provided sorting column and  order
export const applySorting = (data, sorting) => {
  if (!data || data.length === 0) return [];
  const sortedData = [...data].sort((a, b) => {
    let valA = a[sorting.column];
    let valB = b[sorting.column];

    if (typeof valA === "string") valA = valA.toLowerCase().trim();
    if (typeof valB === "string") valB = valB.toLowerCase().trim();
    if (valA < valB) return sorting.order === "asc" ? -1 : 1;
    if (valA > valB) return sorting.order === "asc" ? 1 : -1;
    return 0;
  });
  return sortedData;
};

// Paginates the data based on current page number and  number of rows per page
export const applyPagination = (data, page, rowsPerPage) => {
  if (!data || data.length === 0) return [];
  const startIndex = page * rowsPerPage;
  return data.slice(startIndex, startIndex + rowsPerPage);
};
