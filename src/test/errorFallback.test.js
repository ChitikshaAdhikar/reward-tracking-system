// ErrorFallback.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import ErrorFallback from "../components/commonComponents/ErrorFallback";

describe("ErrorFallback Component", () => {
  it("renders the error message and fallback UI correctly", () => {
    const testError = new Error("Test error message");
    render(<ErrorFallback error={testError} />);

    // Check that the fallback title is rendered.
    expect(screen.getByText(/Oops!/i)).toBeInTheDocument();
    
    expect(
      screen.getByText(/Something went wrong\. Please try again later\./i)
    ).toBeInTheDocument();
    // Check that the error message from the error object is rendered.
    expect(screen.getByText(/Test error message/i)).toBeInTheDocument();
  });
});
