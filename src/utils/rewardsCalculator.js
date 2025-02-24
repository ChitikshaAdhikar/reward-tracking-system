/**
 * @file rewardsCalculator.js
 * @description Contains functions for calculating reward points and aggregating rewards.
 */

/**
 * @function calculateRewardPoints
 * @description Calculates reward points based on the transaction price.
 * The logic is as follows:
 * - No points for amounts <= 50.
 * - For amounts between 51 and 100, points equal (amount - 50).
 * - For amounts above 100, points equal 50 and 2 points for every dollar over 100.
 * @param {number} price  The transaction price.
 * @returns {number} The calculated reward points.
 */
export const calculateRewardPoints = (price) => {
  // Floor the price to ignore fractional dollars.
  const amount = Math.floor(price);
  if (amount <= 50) return 0;
  if (amount <= 100) return amount - 50;
  // For amount > 100, 50 points for the first 100 dollars + double points for the remainder.
  return 50 + (amount - 100) * 2;
};

/**
 * @function getFilteredTransactions
 * @description Filters an array of transactions based on the provided globalFilters.
 * Additionally, calculates and attaches rewardPoints for each filtered transaction.
 * @param {Array} transactions - The array of transactions.
 * @param {Object} globalFilters - The global filter criteria.
 * @param {string} [globalFilters.customerName] - Filter for customer name.
 * @param {string} [globalFilters.fromDate] - Filter for transactions on or after this date.
 * @param {string} [globalFilters.toDate] - Filter for transactions on or before this date.
 * @returns {Array<Object>} The filtered transactions with an additional rewardPoints property.
 */
export const getFilteredTransactions = (transactions, globalFilters) => {
  try {
    const filteredTransactions = transactions.filter((transaction) => {
      const date = new Date(transaction.purchaseDate);

      // Check if the transaction customerName contains the filter string.
      if (
        globalFilters.customerName &&
        !transaction.customerName
          .toLowerCase()
          .includes(globalFilters.customerName.toLowerCase())
      ) {
        return false;
      }

      // If fromDate is provided, exclude transactions before this date.
      if (globalFilters.fromDate && date < new Date(globalFilters.fromDate)) {
        return false;
      }

      // If toDate is provided, exclude transactions after this date.
      if (globalFilters.toDate && date > new Date(globalFilters.toDate)) {
        return false;
      }
      return true;
    });

    return filteredTransactions.map((transaction) => ({
      ...transaction,
      rewardPoints: calculateRewardPoints(transaction.price),
    }));
  } catch (error) {
    console.error("Error in getFilteredTransactions:", error);
    throw new Error(error);
  }
};

/**
 * @function getMonthlyRewards
 * @description Aggregates transactions into monthly rewards.
 * @param {Array} transactions - The array of transaction.
 * @param {Object} [globalFilters={}] - Optional global filter criteria.
 * @returns {Array} An array of objects where each object represents monthly rewards for a customer.
 * the object contains: customerId, customerName, month, year, and rewardPoints.
 */
export const getMonthlyRewards = (transactions, globalFilters = {}) => {
  try {
    // Apply filtering based on global filters.
    const filteredTransactions = getFilteredTransactions(
      transactions,
      globalFilters
    );

    // Define an array of month names.
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Reduce filtered transactions into monthly rewards.
    const monthlyRewards = filteredTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.purchaseDate);
      // Skip if the transaction has an invalid date.
      if (isNaN(date.getTime())) {
        console.warn(
          `Invalid date for transaction id ${transaction.id}: ${transaction.purchaseDate}`
        );
        return acc;
      }
      // Extract month (as a string) and year from the transaction date.
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      // Create key for grouping by customer, year, and month.
      const key = `${transaction.customerId}_${year}_${month}`;
      // Use the already computed rewardPoints from getFilteredTransactions.
      const points = transaction.rewardPoints;

      if (!acc[key]) {
        acc[key] = {
          customerId: transaction.customerId,
          customerName: transaction.customerName,
          month,
          year,
          rewardPoints: points,
        };
      } else {
        acc[key].rewardPoints += points;
      }
      return acc;
    }, {});

    //Convert the aggregated rewards object to an array and sort by customerId, year, and month (using the index in monthNames).
    return Object.values(monthlyRewards).sort(
      (a, b) =>
        a.customerId - b.customerId ||
        a.year - b.year ||
        monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
    );
  } catch (error) {
    console.error("Error in getMonthlyRewards:", error);
    throw new Error(error);
  }
};

/**
 * @function getTotalRewards
 * @description Aggregates total reward points per customer from the filtered transactions.
 * @param {Array} transactions - The array of transactions.
 * @param {Object} globalFilters - Optional global filter criteria.
 * @returns {Array} An array of objects where each object represents the total rewards for a customer.
 * the object contains: customerName and rewardPoints.
 */
export const getTotalRewards = (transactions, globalFilters = {}) => {
  try {
    // Apply filtering based on global filters.
    const filteredTransactions = getFilteredTransactions(
      transactions,
      globalFilters
    );

    // Sum up total reward points by customer.
    const totals = filteredTransactions.reduce((acc, transaction) => {
      const points = transaction.rewardPoints;
      if (!acc[transaction.customerId]) {
        acc[transaction.customerId] = {
          customerName: transaction.customerName,
          rewardPoints: points,
        };
      } else {
        acc[transaction.customerId].rewardPoints += points;
      }
      return acc;
    }, {});

    // Return the totals as an array, sorted by customer name.
    return Object.values(totals).sort((a, b) =>
      a.customerName.localeCompare(b.customerName)
    );
  } catch (error) {
    console.error("Error in getTotalRewards:", error);
    throw new Error(error);
  }
};
