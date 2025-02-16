export const genericFilter = (filters, config) => {
  const filterFunctions = [];
  Object.keys(config).forEach((key) => {
    const filterValue = filters[key];
    if (filterValue === "" || filterValue == null) return;
    const { field, op } = config[key];
    switch (op) {
      case "includes":
        filterFunctions.push((item) =>
          item[field]
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toString().toLowerCase())
        );
        break;
      case "monthEquals":
        filterFunctions.push((item) => {
          let month;
          if (typeof item[field] === "number") {
            month = item[field];
          } else {
            month = new Date(item[field]).getMonth() + 1;
          }
          return month === parseInt(filterValue, 10);
        });
        break;
      case "yearEquals":
        filterFunctions.push((item) => {
          let year;
          if (typeof item[field] === "number") {
            year = item[field];
          } else {
            year = new Date(item[field]).getFullYear();
          }
          return year === parseInt(filterValue, 10);
        });
        break;
      default:
        console.warn(`Unknown filter operation: ${op}`);
        break;
    }
  });
  return filterFunctions;
};
