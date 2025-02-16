import React, { useState, useEffect } from "react";
import Transactions from "./components/Transactions";
import MonthlyRewards from "./components/MonthlyRewards";
import TotalRewards from "./components/TotalRewards";
import NavigationHeader from "./components/NavigationHeader";
import { fetchTransactions } from "./services/transaction.service";
import { getMonthlyRewards, getTotalRewards } from "./utils/rewardsCalculator";
import { CircularProgress, Box, Typography } from "@mui/material";

const App = () => {
  const [state, setState] = useState({
    transactions: [],
    monthlyRewards: [],
    totalRewards: [],
    loading: true,
    error: null,
  });

  const [currentTab, setCurrentTab] = useState("transactions");

  useEffect(() => {
    fetchTransactions()
      .then((data) => {
        const monthlyRewards = getMonthlyRewards(data);
        const totalRewards = getTotalRewards(data);
        setState({
          transactions: data,
          monthlyRewards,
          totalRewards,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        setState((prev) => ({ ...prev, loading: false, error: err.message }));
      });
  }, []);

  const renderView = () => {
    switch (currentTab) {
      case "transactions":
        return <Transactions transactions={state.transactions} />;
      case "monthlyRewards":
        return <MonthlyRewards monthlyRewards={state.monthlyRewards} />;
      case "totalRewards":
        return <TotalRewards totalRewards={state.totalRewards} />;
      default:
        return null;
    }
  };

  if (state.loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <CircularProgress/>
      </Box>
    );
  }

  if (state.error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          Error: {state.error}
        </Typography>
      </Box>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <NavigationHeader currentTab={currentTab} onSelectTab={setCurrentTab} />
      {renderView()}
    </div>
  );
};

export default App;
