import React from "react";
import { render, screen } from "@testing-library/react";
import Transactions from "../components/Transactions";

describe("Transactions Component", () => {
  const transactions = [
    { transactionId: 1, customerId: 1, customerName: "Ross", purchaseDate: "2023-01-15", price: 120.65 },
    { transactionId: 2, customerId: 1, customerName: "Ross", purchaseDate: "2023-01-20", price: 80.34 },
    { transactionId: 3, customerId: 2, customerName: "Monica", purchaseDate: "2023-02-10", price: 55.76 },
    { transactionId: 4, customerId: 1, customerName: "Ross", purchaseDate: "2023-02-25", price: 200.12 },
  ];
  const globalFilters = { customerName: "", fromDate: "", toDate: "" };

  test("renders table headers", () => {
    render(<Transactions transactions={transactions} globalFilters={globalFilters} />);
    expect(screen.getByText(/Transaction Id/i)).toBeInTheDocument();
    expect(screen.getByText(/Customer Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Purchase Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Product/i)).toBeInTheDocument();
    expect(screen.getByText(/Price/i)).toBeInTheDocument();
    expect(screen.getByText(/Reward Points/i)).toBeInTheDocument();
  });
   test("renders no rows when transactions array is empty", () => {
      render(<Transactions transactions={[]} globalFilters={globalFilters} />);
      expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
    });
  
    // When global filters exclude all transactions.
    test("renders no rows when filters exclude all transactions", () => {
      const filters = { customerName: "Rajesh", fromDate: "", toDate: "" };
      render(<Transactions transactions={transactions} globalFilters={filters} />);
      expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
    });

});
