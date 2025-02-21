import React from "react";
import { render, screen } from "@testing-library/react";
import TotalRewards from "../components/TotalRewards";

describe("TotalRewards Component", () => {
  const transactions = [
    { id: 1, customerId: 1, customerName: "Ross", purchaseDate: "2023-01-15", price: 120.65 },
    { id: 2, customerId: 1, customerName: "Ross", purchaseDate: "2023-01-20", price: 80.34 },
    { id: 3, customerId: 2, customerName: "Monica", purchaseDate: "2023-02-10", price: 55.76 },
    { id: 4, customerId: 1, customerName: "Ross", purchaseDate: "2023-02-25", price: 200.12 },
  ];
  const globalFilters = { customerName: "", fromDate: "", toDate: "" };

  it("renders table columns for total rewards", () => {
    render(<TotalRewards transactions={transactions} globalFilters={globalFilters} />);
    expect(screen.getByText(/Customer Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Reward Points/i)).toBeInTheDocument();
  });

  it("renders no rows when transactions array is empty", () => {
    render(<TotalRewards transactions={[]} globalFilters={globalFilters} />);
    expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
  });

  // When global filters exclude all transactions.
  it("renders no rows when filters exclude all transactions", () => {
    const filters = { customerName: "Rajesh", fromDate: "", toDate: "" };
    render(<TotalRewards transactions={transactions} globalFilters={filters} />);
    expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
  });
});
