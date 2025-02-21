import React, { useState } from "react";
import NavigationHeader from "./components/NavigationHeader";
import Home from "./screens/Home";
import ErrorFallback from "./components/commonComponents/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";

/**
 * @file App.js
 * @description Main application component that sets up the overall layout, including the NavigationHeader,
 * global error handling via an ErrorBoundary, and renders the appropriate view in the Home component based on
 * the current tab selection.
 * @component App
 * @returns {JSX.Element} The rendered App component.
 */
const App = () => {
  // State for tracking the currently selected tab. Default value is "transactions"
  const [currentTab, setCurrentTab] = useState("transactions");

  return (
    <div style={{ minHeight: "100vh" }}>
      <NavigationHeader currentTab={currentTab} onSelectTab={setCurrentTab} />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Home currentTab={currentTab} />
      </ErrorBoundary>
    </div>
  );
};

export default App;
