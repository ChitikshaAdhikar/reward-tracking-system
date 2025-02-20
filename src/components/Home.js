import React, { useState, useEffect } from "react";
import Transactions from "../components/Transactions";
import MonthlyRewards from "../components/MonthlyRewards";
import TotalRewards from "../components/TotalRewards";
import GlobalFilter from "../utils/GlobalFilter";
import { fetchTransactions } from "../services/transaction.service";
import { CircularProgress, Box, Typography } from "@mui/material";

const Home = ({ currentTab }) => {
  // Global filter state for customer name and date range
  const [globalFilters, setGlobalFilters] = useState({
    customerName: "",
    fromDate: "",
    toDate: "",
  });

  // Common filter configuration
  const filterConfig = {
    customerName: { field: "customerName", op: "includes" },
    fromDate: { field: "purchaseDate", op: "gte" },
    toDate: { field: "purchaseDate", op: "lte" },
  };

  // Handler to update global filters when the user clicks the Apply button
  const handleApplyFilters = (filters) => {
    setGlobalFilters(filters);
  };

  // Handler to reset global filters when the user clicks the Reset button
  const handleResetFilters = (filters) => {
    setGlobalFilters(filters);
  };

  // Local state to store fetched transactions along with loading and error states
  const [state, setState] = useState({
    transactions: [],
    loading: true,
    error: null,
  });

  // Fetch transactions data when the component mounts
  useEffect(() => {
    fetchTransactions()
      .then((data) => {
        setState({
          transactions: data,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
        }));
      })
      .finally(() => {
        setState((prev) => ({
          ...prev,
          loading: false,
        }));
      });
  }, []);

  // If data is loading, display a loading spinner
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
        <CircularProgress />
      </Box>
    );
  }

  // If there is an error, display an error message
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

  // Choose the view to render based on the currentTab prop.
  const renderView = () => {
    switch (currentTab) {
      case "transactions":
        return (
          <Transactions
            transactions={state.transactions}
            globalFilters={globalFilters}
            filterConfig={filterConfig}
          />
        );
      case "monthlyRewards":
        return (
          <MonthlyRewards
            transactions={state.transactions}
            globalFilters={globalFilters}
            filterConfig={filterConfig}
          />
        );
      case "totalRewards":
        return (
          <TotalRewards
            transactions={state.transactions}
            globalFilters={globalFilters}
            filterConfig={filterConfig}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <GlobalFilter
        initialFilters={globalFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
      {renderView()}
    </div>
  );
};

export default Home;
