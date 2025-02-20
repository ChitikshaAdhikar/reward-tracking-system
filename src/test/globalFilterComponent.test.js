import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GlobalFilter from "../utils/GlobalFilter";

describe("GlobalFilter Component", () => {
  const initialFilters = { customerName: "", fromDate: "", toDate: "" };
  const onApply = jest.fn();
  const onReset = jest.fn();

  afterEach(() => {
    onApply.mockClear();
    onReset.mockClear();
  });

  test("renders filter input fields and buttons", () => {
    render(
      <GlobalFilter
        initialFilters={initialFilters}
        onApply={onApply}
        onReset={onReset}
      />
    );
    expect(screen.getByLabelText(/Customer Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/From Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/To Date/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Apply/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reset/i })).toBeInTheDocument();
  });

  test("calls onApply with updated filters when Apply button is clicked", () => {
    render(
      <GlobalFilter
        initialFilters={initialFilters}
        onApply={onApply}
        onReset={onReset}
      />
    );
    const customerInput = screen.getByLabelText(/Customer Name/i);
    fireEvent.change(customerInput, { target: { value: "Ross" } });

    const toDate = screen.getByLabelText(/To Date/i);
    fireEvent.change(toDate, { target: { value: "2025-01-01" } });

    fireEvent.click(screen.getByRole("button", { name: /Apply/i }));
    expect(onApply).toHaveBeenCalledWith({
      customerName: "Ross",
      fromDate: "",
      toDate: "2025-01-01",
    });
  });

  test("calls onReset with empty filters when Reset button is clicked", () => {
    render(
      <GlobalFilter
        initialFilters={{
          customerName: "Ross",
          fromDate: "2023-01-01",
          toDate: "2023-12-31",
        }}
        onApply={onApply}
        onReset={onReset}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Reset/i }));
    expect(onReset).toHaveBeenCalledWith({
      customerName: "",
      fromDate: "",
      toDate: "",
    });
  });
});
