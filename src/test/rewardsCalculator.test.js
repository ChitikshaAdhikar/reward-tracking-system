import {
  calculateRewardPoints,
  getMonthlyRewards,
  getTotalRewards,
} from "../utils/rewardsCalculator";

describe("calculateRewardPoints", () => {
  test("returns 0 if price <= 50", () => {
    expect(calculateRewardPoints(50)).toBe(0);
    expect(calculateRewardPoints(30)).toBe(0);
  });

  test("returns price - 50 if price is between 50 and 100", () => {
    expect(calculateRewardPoints(75)).toBe(25);
    expect(calculateRewardPoints(100)).toBe(50);
  });

  test("returns 50 plus twice the amount over 100 if price > 100", () => {
    // For price of 120: 50 + (120 - 100)*2 = 90
    expect(calculateRewardPoints(120)).toBe(90);
    // For price of 150: 50 + (150 - 100)*2 = 150
    expect(calculateRewardPoints(150)).toBe(150);
  });

  test("return 0 if price is negative", () => {
    expect(calculateRewardPoints(-20)).toBe(0);
  });

  test("return 0 if price is string", () => {
    expect(isNaN(calculateRewardPoints("abc"))).toBe(true);
  });
});

describe("getMonthlyRewards", () => {
  test("Sum up rewards per customer on a monthly basis", () => {
    const transactions = [
      {
        customerId: 1,
        customerName: "Joe",
        purchaseDate: "2023-02-23",
        price: 120, // Reward = 90
      },
      {
        customerId: 1,
        customerName: "Joe",
        purchaseDate: "2023-02-20",
        price: 80, // Reward = 30
      },
      {
        customerId: 2,
        customerName: "Chandler",
        purchaseDate: "2023-02-05",
        price: 65, // Reward = 15
      },
      {
        customerId: 1,
        customerName: "Joe",
        purchaseDate: "2023-02-10",
        price: 200, // Reward = 250
      },
    ];

    // Expected output:
    // Joe in February: 90 + 30 + 250 = 370 reward points.
    // Chandler in February: 15 reward points.
    const monthlyRewards = getMonthlyRewards(transactions);
    expect(monthlyRewards).toHaveLength(2);

    const joeFeb = monthlyRewards.filter(
      (transaction) =>
        transaction.customerId === 1 &&
        transaction.year === 2023 &&
        transaction.month === 2
    )[0];
    expect(joeFeb).toBeDefined();
    expect(joeFeb.rewardPoints).toBe(370);

    const chandlerFeb = monthlyRewards.filter(
      (transaction) =>
        transaction.customerId === 2 &&
        transaction.year === 2023 &&
        transaction.month === 2
    )[0];
    expect(chandlerFeb).toBeDefined();
    expect(chandlerFeb.rewardPoints).toBe(15);
  });

  test("returns an empty array if transactions is empty", () => {
    expect(getMonthlyRewards([])).toEqual([]);
  });

  test("handles transactions with invalid dates", () => {
    const transactions = [
      {
        customerId: 1,
        customerName: "Joe",
        purchaseDate: "Testing date",
        price: 120,
      },
    ];

    const monthlyRewards = getMonthlyRewards(transactions);
    expect(monthlyRewards).toHaveLength(0);
  });
});

describe("getTotalRewards", () => {
  test("Sum up total rewards per customer", () => {
    const transactions = [
      {
        customerId: 1,
        customerName: "Ross",
        purchaseDate: "2023-04-16",
        price: 120, // Reward = 90
      },
      {
        customerId: 1,
        customerName: "Ross",
        purchaseDate: "2023-04-20",
        price: 80, // Reward = 30
      },
      {
        customerId: 2,
        customerName: "Monica",
        purchaseDate: "2023-01-10",
        price: 200, // Reward = 250
      },
      {
        customerId: 1,
        customerName: "Ross",
        purchaseDate: "2023-06-05",
        price: 150, // Reward = 150
      },
    ];

    // Expected output:
    // Ross: 90 + 30 + 150 = 270 reward points.
    // Monica: 250 reward points.
    const totalRewards = getTotalRewards(transactions);
    expect(totalRewards).toHaveLength(2);

    const rossTotal = totalRewards.filter(
      (transaction) => transaction.customerName === "Ross"
    )[0];
    expect(rossTotal).toBeDefined();
    expect(rossTotal.rewardPoints).toBe(270);

    const monicaTotal = totalRewards.filter(
      (transaction) => transaction.customerName === "Monica"
    )[0];
    expect(monicaTotal).toBeDefined();
    expect(monicaTotal.rewardPoints).toBe(250);
  });


  test("return empty array if transaction is empty", () => {
    expect(getTotalRewards([])).toEqual([]);
  });

  test("handles transactions with string price", () => {
    const transactions = [
      {
        customerId: 1,
        customerName: "Phebe",
        purchaseDate: "2023-04-16",
        price: "NaN", 
      },
    ];
    const totalRewards = getTotalRewards(transactions);
    expect(totalRewards).toHaveLength(1);
    expect(isNaN(totalRewards[0].rewardPoints)).toBe(true);
  });
});
