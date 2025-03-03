import { fetchTransactions } from "../services/fetchTransactions";

describe("fetchTransactions", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns transactions when fetch is successful", async () => {
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

  it("Return empty transaction when response is not ok", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    });

    await expect(fetchTransactions()).resolves.toEqual([]);
  });
});
