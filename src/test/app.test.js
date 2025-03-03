import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("../components/NavigationHeader", () => (props) => (
  <div data-testid="navigation-header">NavigationHeader</div>
));
jest.mock("../screens/Home", () => (props) => (
  <div data-testid="home-component">Home Component: {props.currentTab}</div>
));
jest.mock("../components/common/ErrorFallback", () => (props) => (
  <div data-testid="error-fallback">Error Fallback</div>
));

describe("App Component", () => {
  it("renders NavigationHeader and Home components", () => {
    const App = require("../App").default;
    render(<App />);
    expect(screen.getByTestId("navigation-header")).toBeInTheDocument();
    expect(screen.getByTestId("home-component")).toBeInTheDocument();
    expect(screen.getByText(/transactions/i)).toBeInTheDocument();
  });
});
