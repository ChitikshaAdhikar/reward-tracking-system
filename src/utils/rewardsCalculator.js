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
 * @param {Array} transactions - The array of transactions.
 * @param {Object} globalFilters - The global filter criteria.
 * @param {string} [globalFilters.customerName] - Filter for customer name.
 * @param {string} [globalFilters.fromDate] - Filter for transactions on or after this date.
 * @param {string} [globalFilters.toDate] - Filter for transactions on or before this date.
 * @returns {Array<Object>} The filtered transactions.
 */
export const getFilteredTransactions = (transactions, globalFilters) => {
  try {
    return transactions.filter((transaction) => {
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
  } catch (error) {
    console.error("Error in getFilteredTransactions:", error);
    throw new Error(error);
  }
};

/**
 * @function attachedRewardPoints
 * @description Maps an array of transactions and attaches calculated reward points to each transaction.
 * @param {Array} transactions - The array of transactions.
 * @returns {Array<Object>} The transactions with an additional rewardPoints property.
 */
export const attachedRewardPoints = (transactions) => {
  try {
    return transactions.map((transaction) => ({
      ...transaction,
      rewardPoints: calculateRewardPoints(transaction.price),
    }));
  } catch (error) {
    console.error("Error in attachedRewardPoints:", error);
    throw new Error(error);
  }
};

/**
 * @function getTransactionsWithRewards
 * @description Filters transactions based on global filters and attaches reward points to each transaction.
 * @param {Array} transactions - The array of transactions.
 * @param {Object} [globalFilters={}] - Optional global filter criteria.
 * @returns {Array<Object>} The filtered transactions with an additional rewardPoints property.
 */
export const getTransactionsWithRewards = (
  transactions,
  globalFilters = {}
) => {
  try {
    const filteredTransactions = getFilteredTransactions(
      transactions,
      globalFilters
    );
    return attachedRewardPoints(filteredTransactions);
  } catch (error) {
    console.error("Error in getTransactionsWithRewards:", error);
    throw new Error(error);
  }
};

/**
 * @function getMonthString
 * @description Converts a month index (0-11) to its corresponding month name.
 * @param {number} monthIndex - The month index.
 * @returns {string} The name of the month.
 */
export const getMonthString = (monthIndex) => {
  const monthMap = new Map([
    [0, "January"],
    [1, "February"],
    [2, "March"],
    [3, "April"],
    [4, "May"],
    [5, "June"],
    [6, "July"],
    [7, "August"],
    [8, "September"],
    [9, "October"],
    [10, "November"],
    [11, "December"],
  ]);
  return monthMap.get(monthIndex);
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
    // filter transactions and attach reward points.
    const transactionsWithRewards = getTransactionsWithRewards(
      transactions,
      globalFilters
    );

    // Reduce transactions into monthly rewards.
    const monthlyRewards = transactionsWithRewards.reduce(
      (acc, transaction) => {
        const date = new Date(transaction.purchaseDate);
        // Skip if the transaction has an invalid date.
        if (isNaN(date.getTime())) {
          console.warn(
            `Invalid date for transaction id ${transaction.id}: ${transaction.purchaseDate}`
          );
          return acc;
        }
        // Use getMonthString to get the month name.
        const monthIndex = date.getMonth();
        const month = getMonthString(monthIndex);
        const year = date.getFullYear();

        // Create key for grouping by customer, year, and month.
        const key = `${transaction.customerId}_${year}_${month}`;
        // Use the already computed rewardPoints.
        const points = transaction.rewardPoints;

        if (!acc[key]) {
          acc[key] = {
            customerId: transaction.customerId,
            customerName: transaction.customerName,
            month,
            monthIndex,
            year,
            rewardPoints: points,
          };
        } else {
          acc[key].rewardPoints += points;
        }
        return acc;
      },
      {}
    );

    //Convert the aggregated rewards object to an array and sort by customerId, year, and monthIndex.
    return Object.values(monthlyRewards).sort(
      (a, b) =>
        a.customerId - b.customerId ||
        a.year - b.year ||
        a.monthIndex - b.monthIndex
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
    //Filter transactions and attach reward points.
    const transactionsWithRewards = getTransactionsWithRewards(
      transactions,
      globalFilters
    );

    // Sum up total reward points by customer.
    const totals = transactionsWithRewards.reduce((acc, transaction) => {
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
