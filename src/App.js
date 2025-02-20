/**
 * @file App.js
 * @description Main application component that renders the NavigationHeader and Home components.
 */

import React, { useState } from "react";
import NavigationHeader from "./components/NavigationHeader";
import Home from "./components/Home";


const App = () => {
  const [currentTab, setCurrentTab] = useState("transactions");

  return (
    <div style={{ minHeight: "100vh" }}>
      <NavigationHeader currentTab={currentTab} onSelectTab={setCurrentTab} />
      <Home currentTab={currentTab} />
    </div>
  );
};
export default App;
