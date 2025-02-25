/**
 * @file transaction.service.js
 * @description Fetches transaction data from a local JSON file.
 * @function fetchTransactions
 * @returns {Promise<Array>} A promise that resolves to an array of transaction objects.
 * @throws {Error} Throws an error if the fetch operation fails or if there is a network issue.
 */

export const fetchTransactions = async () => {
  try {
    const response = await fetch("../transactionData.json");
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }
    const data = await response.json();

    return data.transactions;
  } catch (error) {
    throw new Error(error);
  }
};
