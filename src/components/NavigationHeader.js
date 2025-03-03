import React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

/**
 * @file NavigationHeader.js
 * @description Renders the navigation bar for switching between views (Transactions, Monthly Rewards, Total Rewards).
 * @component NavigationHeader
 * @param {Object} props - Component properties.
 * @param {string} props.currentTab - The currently selected tab value.
 * @param {Function} props.onSelectTab - Callback function to update the selected tab.
 * @returns {JSX.Element} The rendered navigation header.
 */
const NavigationHeader = ({ currentTab, onSelectTab }) => {
  const handleTabChange = (_event, newTab) => {
    onSelectTab(newTab);
  };

  return (
    <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
      <AppBar position="static" sx={{ bgcolor: "#0a8292" }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant={"scrollable"}
          scrollButtons={"auto"}
          indicatorColor="secondary"
          textColor="inherit"
        >
          <Tab label="Transactions" value="transactions" />
          <Tab label="Monthly Rewards" value="monthlyRewards" />
          <Tab label="Total Rewards" value="totalRewards" />
        </Tabs>
      </AppBar>
    </Box>
  );
};

NavigationHeader.propTypes = {
  currentTab: PropTypes.string.isRequired,
  onSelectTab: PropTypes.func.isRequired,
};

export default NavigationHeader;
