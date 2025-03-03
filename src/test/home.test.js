import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../screens/Home";
import { fetchTransactions } from "../services/fetchTransactions";

const mockTransactions = [
  {
    id: 1,
    customerId: 1,
    customerName: "Ross",
    purchaseDate: "2023-01-15",
    price: 120.65,
  },
  {
    id: 2,
    customerId: 1,
    customerName: "Ross",
    purchaseDate: "2023-01-20",
    price: 80.34,
  },
  {
    id: 3,
    customerId: 2,
    customerName: "Monica",
    purchaseDate: "2023-02-10",
    price: 55.76,
  },
  {
    id: 4,
    customerId: 1,
    customerName: "Ross",
    purchaseDate: "2023-02-25",
    price: 200.12,
  },
];


jest.mock("../services/fetchTransactions", () => ({
  fetchTransactions: jest.fn(),
}));

jest.mock("../components/Transactions", () => (props) => (
  <div data-testid="transactions-component">Transactions Component</div>
));
jest.mock("../components/MonthlyRewards", () => (props) => (
  <div data-testid="monthlyRewards-component">MonthlyRewards Component</div>
));
jest.mock("../components/TotalRewards", () => (props) => (
  <div data-testid="totalRewards-component">TotalRewards Component</div>
));
jest.mock("../components/common/GlobalFilter", () => (props) => (
  <div data-testid="global-filter">GlobalFilter Component</div>
));

describe("Home Component", () => {
  afterEach(() => {
    fetchTransactions.mockReset();
  });

  it("renders Transactions view when currentTab is transactions", async () => {
    fetchTransactions.mockResolvedValue(mockTransactions);
    render(<Home currentTab="transactions" />);
    const transactionsComponent = await screen.findByTestId(
      "transactions-component"
    );
    expect(transactionsComponent).toBeInTheDocument();
    expect(screen.getByTestId("global-filter")).toBeInTheDocument();
  });

  it("renders MonthlyRewards view when currentTab is monthlyRewards", async () => {
    fetchTransactions.mockResolvedValue(mockTransactions);
    render(<Home currentTab="monthlyRewards" />);
    const monthlyRewardsComponent = await screen.findByTestId(
      "monthlyRewards-component"
    );
    expect(monthlyRewardsComponent).toBeInTheDocument();
  });

  it("renders TotalRewards view when currentTab is totalRewards", async () => {
    fetchTransactions.mockResolvedValue(mockTransactions);
    render(<Home currentTab="totalRewards" />);
    const totalRewardsComponent = await screen.findByTestId(
      "totalRewards-component"
    );
    expect(totalRewardsComponent).toBeInTheDocument();
  });
 it("renders empty state when fetched transactions array is empty", async () => {
    fetchTransactions.mockResolvedValue([]);
    render(<Home currentTab="transactions" />);
    await screen.findByTestId("global-filter");
    expect(screen.queryByTestId("table-row")).not.toBeInTheDocument();
  });
});
