import React from "react";
import { render, screen } from "@testing-library/react";
import MonthlyRewards from "../components/MonthlyRewards";

// Mock GenericTable.
jest.mock("../utils/GenericTable", () => (props) => (
  <div data-testid="generic-table">
    {props.data && props.data.map((row, index) => (
      <div key={index} data-testid="table-row">
       {row.customerId} - {row.customerName} - {row.month} - {row.year} - {row.rewardPoints}
      </div>
    ))}
  </div>
));

describe("MonthlyRewards Component", () => {
  // Sample transactions
  const transactions = [
    { id: 1, customerId: 1, customerName: "Ross", purchaseDate: "2023-01-15", price: 120.65 },
    { id: 2, customerId: 1, customerName: "Ross", purchaseDate: "2023-01-20", price: 80.34 },
    { id: 3, customerId: 2, customerName: "Monica", purchaseDate: "2023-02-10", price: 55.76 },
    { id: 4, customerId: 1, customerName: "Ross", purchaseDate: "2023-02-25", price: 200.12 },
  ];

  // Global filters with no filtering applied
  const globalFilters = { customerName: "", fromDate: "", toDate: "" };

  // When transactions exist, monthly reward rows should be rendered.
  it("renders table rows with total monthly rewards", () => {
    render(<MonthlyRewards transactions={transactions} globalFilters={globalFilters} />);
    
    const rows = screen.getAllByTestId("table-row");
    expect(rows).toHaveLength(3);

  
    expect(screen.getByText(/1 - Ross - 1 - 2023/i)).toBeInTheDocument();
    expect(screen.getByText(/1 - Ross - 2 - 2023/i)).toBeInTheDocument();
    expect(screen.getByText(/2 - Monica - 2 - 2023/i)).toBeInTheDocument();
  });

  //When transactions array is empty no rows should be rendered.
  it("renders no rows when transactions array is empty", () => {
    render(<MonthlyRewards transactions={[]} globalFilters={globalFilters} />);
    expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
  });

  // When global filters exclude all transactions.
  it("renders no rows when global filters exclude all transactions", () => {
    // Set a filter that doesn't match any transaction.
    const filters = { customerName: "Rajesh", fromDate: "", toDate: "" };
    render(<MonthlyRewards transactions={transactions} globalFilters={filters} />);
    expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
  });
});
