import React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

const NavigationHeader = ({ currentTab, onSelectTab }) => {
  const handleChange = (event, newTab) => {
    onSelectTab(newTab);
  };

  return (
    <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
      <AppBar position="static" sx={{ bgcolor: "#0a8292" }}>
        <Tabs
          value={currentTab}
          onChange={handleChange}
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
