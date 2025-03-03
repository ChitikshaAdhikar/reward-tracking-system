import {
  calculateRewardPoints,
  getMonthlyRewards,
  getTotalRewards,
  getFilteredTransactions,
} from "../utils/rewardsCalculator";

describe("calculateRewardPoints", () => {
  it("returns 0 if price <= 50", () => {
    expect(calculateRewardPoints(50)).toBe(0);
    expect(calculateRewardPoints(30)).toBe(0);
  });

  it("returns price - 50 if price is between 50 and 100", () => {
    expect(calculateRewardPoints(75)).toBe(25);
    expect(calculateRewardPoints(100)).toBe(50);
  });

  it("returns 50 plus twice the amount over 100 if price > 100", () => {
    // For price of 120: 50 + (120 - 100)*2 = 90
    expect(calculateRewardPoints(120)).toBe(90);
    // For price of 150: 50 + (150 - 100)*2 = 150
    expect(calculateRewardPoints(150)).toBe(150);
  });

  it("return 0 if price is negative", () => {
    expect(calculateRewardPoints(-20)).toBe(0);
  });

  it("return 0 if price is string", () => {
    expect(calculateRewardPoints("abc")).toBe(0);
  });
});

describe("getMonthlyRewards", () => {
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
  it("Sum up rewards per customer on a monthly basis", () => {
    // Expected output:
    // Joe in February: 90 + 30 + 250 = 370 reward points.
    // Chandler in February: 15 reward points.
    const monthlyRewards = getMonthlyRewards(transactions);

    expect(monthlyRewards).toHaveLength(2);

    const joeFeb = monthlyRewards.filter(
      (transaction) =>
        transaction.customerId === 1 &&
        transaction.year === 2023 &&
        transaction.month === "February"
    )[0];
    expect(joeFeb).toBeDefined();
    expect(joeFeb.rewardPoints).toBe(370);

    const chandlerFeb = monthlyRewards.filter(
      (transaction) =>
        transaction.customerId === 2 &&
        transaction.year === 2023 &&
        transaction.month === "February"
    )[0];
    expect(chandlerFeb).toBeDefined();
    expect(chandlerFeb.rewardPoints).toBe(15);
  });

  it("returns an empty array if transactions is empty", () => {
    expect(getMonthlyRewards([])).toEqual([]);
  });

  it("handles transactions with invalid dates", () => {
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

  it("aggregates monthly rewards without filters", () => {
    const result = getMonthlyRewards(transactions);
    // Expect two groups: Joe and Chandler in feb.
    expect(result).toHaveLength(2);
  });

  it("applies filters before aggregating", () => {
    const filters = {
      customerName: "Joe",
      fromDate: "2023-02-09",
      toDate: "2023-04-28",
    };
    const result = getMonthlyRewards(transactions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].customerName).toBe("Joe");
    expect(result[0].month).toBe("February");
  });
});

describe("getTotalRewards", () => {
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

  it("Sum up total rewards per customer", () => {
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

  it("return empty array if transaction is empty", () => {
    expect(getTotalRewards([])).toEqual([]);
  });

  it("handles transactions with string price", () => {
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
    expect(totalRewards[0].rewardPoints).toBe(0);
  });
  it("aggregates total rewards without filters", () => {
    const result = getTotalRewards(transactions);
    expect(result).toHaveLength(2);
    const monica = result.find((r) => r.customerName === "Monica");
    const ross = result.find((r) => r.customerName === "Ross");
    expect(monica.rewardPoints).toBeGreaterThan(0);
    expect(ross.rewardPoints).toBeGreaterThan(0);
  });

  it("applies filters before aggregating totals", () => {
    const filters = {
      customerName: "Monica",
      fromDate: "2023-01-09",
      toDate: "2023-02-28",
    };
    const result = getTotalRewards(transactions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].customerName).toBe("Monica");
  });
});

describe("getFilteredTransactions", () => {
  const transactions = [
    {
      id: 1,
      customerName: "Leonard",
      purchaseDate: "2023-01-15",
      price: 120.88,
    },
    { id: 2, customerName: "Rajesh", purchaseDate: "2023-02-10", price: 80.97 },
    {
      id: 3,
      customerName: "Sheldon",
      purchaseDate: "2023-03-05",
      price: 55.76,
    },
  ];

  it("filters by customerName", () => {
    const filters = { customerName: "Leonard", fromDate: "", toDate: "" };
    const result = getFilteredTransactions(transactions, filters);
    expect(result).toHaveLength(1);
    result.forEach((tx) => {
      expect(tx.customerName).toBe("Leonard");
    });
  });

  it("filters by date range", () => {
    const filters = {
      customerName: "",
      fromDate: "2023-02-01",
      toDate: "2023-03-04",
    };
    const result = getFilteredTransactions(transactions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("filters by customerName and date range", () => {
    const filters = {
      customerName: "Rajesh",
      fromDate: "2023-02-09",
      toDate: "2023-03-31",
    };
    const result = getFilteredTransactions(transactions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });
});
