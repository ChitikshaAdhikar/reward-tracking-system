/**
 * @file rewardsCalculator.js
 * @description Contains functions for calculating reward points and aggregating rewards.
 */
/* Calculates reward points based on the transaction price.
   The logic is as follows:
    - No points for amounts <= 50.
    - For amounts between 51 and 100, points equal (amount - 50).
    - For amounts above 100, points equal 50 and 2 points for every dollar over 100.
*/
export const calculateRewardPoints = (price) => {
  // Floor the price to ignore fractional dollars.
  const amount = Math.floor(price);
  if (amount <= 50) return 0;
  if (amount <= 100) return amount - 50;
  // For amount > 100, 50 points for the first 100 dollars + double points for the remainder.
  return 50 + (amount - 100) * 2;
};

// Filters an array of transactions based on the provided globalFilters. Additionally, calculates and attaches rewardPoints for each filtered transaction.
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
    return [];
  }
};

// Sum up transactions into monthly rewards.
export const getMonthlyRewards = (transactions, globalFilters = {}) => {
  try {
    // Apply filtering based on global filters.
    const filteredTransactions = getFilteredTransactions(
      transactions,
      globalFilters
    );

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
      // Extract month and year from the transaction date.
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      // Create key for grouping by customer, year and month.
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

    //Convert the aggregated rewards object to an array and sort by customerId, year, and month.
    return Object.values(monthlyRewards).sort(
      (a, b) =>
        a.customerId - b.customerId || a.year - b.year || a.month - b.month
    );
  } catch (error) {
    console.error("Error in getMonthlyRewards:", error);
    return [];
  }
};

// Sum up total rewards for each customer from the filtered transactions.
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
    return [];
  }
};
