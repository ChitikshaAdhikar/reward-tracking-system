import React from "react";
import { render, screen } from "@testing-library/react";
import ErrorFallback from "../components/common/ErrorFallback";

describe("ErrorFallback Component", () => {
  it("renders the error message and fallback UI correctly", () => {
    const testError = new Error("Test error message");
    render(<ErrorFallback error={testError} />);

    expect(screen.getByText(/Oops!/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Something went wrong\. Please try again later\./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Test error message/i)).toBeInTheDocument();
  });
});
