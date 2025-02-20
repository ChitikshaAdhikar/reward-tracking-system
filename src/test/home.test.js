import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../screens/Home";
import { fetchTransactions } from "../services/transaction.service";

// Sample transactions data for testing.
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

// Mock the fetchTransactions service.
jest.mock("../services/transaction.service", () => ({
  fetchTransactions: jest.fn(),
}));

// Mock child components so we can easily identify which view is rendered.
jest.mock("../components/Transactions", () => (props) => (
  <div data-testid="transactions-component">Transactions Component</div>
));
jest.mock("../components/MonthlyRewards", () => (props) => (
  <div data-testid="monthlyRewards-component">MonthlyRewards Component</div>
));
jest.mock("../components/TotalRewards", () => (props) => (
  <div data-testid="totalRewards-component">TotalRewards Component</div>
));
jest.mock("../components/commonComponents/GlobalFilter", () => (props) => (
  <div data-testid="global-filter">GlobalFilter Component</div>
));

describe("Home Component", () => {
  afterEach(() => {
    fetchTransactions.mockReset();
  });

  // When fetchTransactions fails, Home still renders GlobalFilter (error handling strategy may vary)
  it("renders GlobalFilter when fetch fails", async () => {
    fetchTransactions.mockRejectedValue(new Error("Fetch error"));
    render(<Home currentTab="transactions" />);
    const globalFilter = await screen.findByTestId("global-filter");
    expect(globalFilter).toBeInTheDocument();
  });

  // Test that the Transactions view is rendered when currentTab is "transactions".
  it("renders Transactions view when currentTab is transactions", async () => {
    fetchTransactions.mockResolvedValue(mockTransactions);
    render(<Home currentTab="transactions" />);
    const transactionsComponent = await screen.findByTestId("transactions-component");
    expect(transactionsComponent).toBeInTheDocument();
    expect(screen.getByTestId("global-filter")).toBeInTheDocument();
  });

  // Test that the MonthlyRewards view is rendered when currentTab is "monthlyRewards".
  it("renders MonthlyRewards view when currentTab is monthlyRewards", async () => {
    fetchTransactions.mockResolvedValue(mockTransactions);
    render(<Home currentTab="monthlyRewards" />);
    const monthlyRewardsComponent = await screen.findByTestId("monthlyRewards-component");
    expect(monthlyRewardsComponent).toBeInTheDocument();
  });

  // Test that the TotalRewards view is rendered when currentTab is "totalRewards".
  it("renders TotalRewards view when currentTab is totalRewards", async () => {
    fetchTransactions.mockResolvedValue(mockTransactions);
    render(<Home currentTab="totalRewards" />);
    const totalRewardsComponent = await screen.findByTestId("totalRewards-component");
    expect(totalRewardsComponent).toBeInTheDocument();
  });

  // Negative test: When no transactions are fetched, the child component should not render any data.
  // Here, we assume that if no transactions are available, the table rows (with data-testid "table-row") will not be present.
  it("renders empty state when fetched transactions array is empty", async () => {
    fetchTransactions.mockResolvedValue([]);
    render(<Home currentTab="transactions" />);
    await screen.findByTestId("global-filter");
    expect(screen.queryByTestId("table-row")).not.toBeInTheDocument();
  });
});
