// transaction.service.test.js
import { fetchTransactions } from "../services/transaction.service";

describe("fetchTransactions", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("returns transactions when fetch is successful", async () => {
    const mockData = {
      transactions: [
        {
          id: 1,
          customerName: "Joe",
          purchaseDate: "2023-01-01",
          price: 100,
        },
      ],
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const result = await fetchTransactions();
    expect(result).toEqual(mockData.transactions);
  });

  test("throws an error when response is not ok", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    });

    await expect(fetchTransactions()).rejects.toThrow(
      "Failed to fetch transactions"
    );
  });
});
