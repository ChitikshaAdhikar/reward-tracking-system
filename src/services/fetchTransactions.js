import Logger from "../utils/logger";
/**
 * @file fetchTransactions.js
 * @description Fetches transaction data from a local JSON file.
 * @function fetchTransactions
 * @returns {Promise<Array>} A promise that resolves to an array of transaction objects.
 */

const logger = new Logger("info");
export const fetchTransactions = async () => {
  try {
    const response = await fetch("../transactionData.json");
    if (!response.ok) {
      logger.error("Failed to fetch transactions");
      return [];
    }
    const data = await response.json();

    return data.transactions;
  } catch (error) {
    logger.error(error);
    return [];
  }
};
