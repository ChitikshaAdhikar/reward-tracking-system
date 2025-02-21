/**
 * @file dataTransformationUtils.js
 * @description Provides helper functions for sorting and paginating data.
 */

/**
 * @description Applies sorting to the provided data array based on the given sorting configuration.
 * @function  applySorting
 * @param {Array} data  The array of data to sort.
 * @param {Object} sorting - The sorting configuration. sorting configuration contains sorting order and sorting column.
 * @returns {Array} The sorted data array.
 */
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

/**
 * @description Applies pagination to the provided data array.
 * @function applyPagination
 * @param {Array} data - The array of data to paginate.
 * @param {number} page - The current page number.
 * @param {number} rowsPerPage - The number of rows per page.
 * @returns {Array} A slice of the data array corresponding to the current page.
 */
export const applyPagination = (data, page, rowsPerPage) => {
  if (!data || data.length === 0) return [];
  const startIndex = page * rowsPerPage;
  return data.slice(startIndex, startIndex + rowsPerPage);
};
