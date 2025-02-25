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
  const clonedData = JSON.parse(JSON.stringify(data));
  if (!clonedData || clonedData.length === 0) return [];
  const sortedData = clonedData.sort((a, b) => {
    let aValue = a[sorting.column];
    let bValue = b[sorting.column];

    // Trying to interpret both values as dates.
    const aDate = new Date(aValue);
    const bDate = new Date(bValue);
    const aTime = aDate.getTime();
    const bTime = bDate.getTime();

    // If both values are valid dates compare them based on converted timestamps.
    if (!isNaN(aTime) && !isNaN(bTime)) {
      aValue = aTime;
      bValue = bTime;
    }
    //If both values are strings use localeCompare.
    else if (typeof aValue === "string" && typeof bValue === "string") {
      return sorting.order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // For numbers or other types, use standard comparison
    if (aValue < bValue) return sorting.order === "asc" ? -1 : 1;
    if (aValue > bValue) return sorting.order === "asc" ? 1 : -1;
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
