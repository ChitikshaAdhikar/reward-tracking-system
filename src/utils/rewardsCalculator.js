export const calculateRewardPoints = (price) => {
  const amount = Math.floor(price);
  if (amount <= 50) return 0;
  if (amount <= 100) return amount - 50;
  return 50 + (amount - 100) * 2;
};

export const getMonthlyRewards = (transactions) => {
  const monthlyRewards = transactions.reduce((acc, transaction) => {

    const date = new Date(transaction.purchaseDate);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date for transaction id ${transaction.id}: ${transaction.purchaseDate}`);
      return acc; 
    }
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const key = `${transaction.customerId}_${year}_${month}`;
    const points = calculateRewardPoints(transaction.price);

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

  return Object.values(monthlyRewards).sort(
    (a, b) =>
      a.customerId - b.customerId ||
      a.year - b.year ||
      a.month - b.month
  );
};

export const getTotalRewards = (transactions) => {
  const totals = transactions.reduce((acc, transaction) => {
    const points = calculateRewardPoints(transaction.price);
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
  return Object.values(totals).sort((a, b) => a.customerName.localeCompare(b.customerName));
};
