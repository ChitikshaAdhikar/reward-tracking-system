import React, { useState, useEffect } from "react";
import Transactions from "../components/Transactions";
import MonthlyRewards from "../components/MonthlyRewards";
import TotalRewards from "../components/TotalRewards";
import GlobalFilter from "../components/commonComponents/GlobalFilter";
import { fetchTransactions } from "../services/transaction.service";
import Loader from "../components/commonComponents/Loader";

const formatDate = (date) => date.toISOString().split("T")[0];

/**
 * @file Home.js
 * @description Main container component that fetches transactions, manages global filter state, and renders the appropriate view
 * (Transactions, MonthlyRewards, or TotalRewards) based on the current tab.
 * @component Home
 * @param {Object} props - Component properties.
 * @param {string} props.currentTab - The current tab to display ("transactions", "monthlyRewards", or "totalRewards").
 * @returns {JSX.Element} The rendered Home component.
 */

const Home = ({ currentTab }) => {
  // Compute default dates: 'toDate' is today, 'fromDate' is 3 months ago.
  const today = new Date();
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 3);

  // Global filter state for customer name and date range, initialized with default dates.
  const [globalFilters, setGlobalFilters] = useState({
    customerName: "",
    fromDate: formatDate(fourMonthsAgo),
    toDate: formatDate(today),
  });

  // Common filter configuration mapping filter keys to transaction fields.
  const filterConfig = {
    customerName: { field: "customerName", op: "includes" },
    fromDate: { field: "purchaseDate", op: "gte" },
    toDate: { field: "purchaseDate", op: "lte" },
  };

  //Updates the global filter state when the Apply button is clicked.
  const handleApplyFilters = (filters) => {
    setGlobalFilters(filters);
  };

  // Resets the global filter state when the Reset button is clicked.
  const handleResetFilters = (filters) => {
    setGlobalFilters(filters);
  };

  // Local state to store fetched transactions and track loading and error states.
  const [state, setState] = useState({
    transactions: [],
    loading: true,
    error: null,
  });

  // Fetch transactions data when the component mounts.
  useEffect(() => {
    fetchTransactions()
      .then((data) => {
        setState({
          transactions: data,
          error: null,
        });
      })
      .catch((err) => {
        setState((prev) => ({
          ...prev,
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
  // Renders the appropriate view based on the currentTab prop.
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
    <>
      {state.loading ? (
        <Loader />
      ) : (
        <div>
          <GlobalFilter
            initialFilters={globalFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
          {renderView()}
        </div>
      )}
    </>
  );
};

export default Home;
