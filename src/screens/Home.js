import React, { useState, useEffect } from "react";
import Transactions from "../components/Transactions";
import MonthlyRewards from "../components/MonthlyRewards";
import TotalRewards from "../components/TotalRewards";
import GlobalFilter from "../components/common/GlobalFilter";
import { fetchTransactions } from "../services/fetchTransactions";
import Loader from "../components/common/Loader";
import PropTypes from "prop-types";

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

  const [globalFilters, setGlobalFilters] = useState({
    customerName: "",
    fromDate: formatDate(fourMonthsAgo),
    toDate: formatDate(today),
  });

  const [transactionDetails, setTransactionDetails] = useState({
    transactions: [],
    loading: true,
    error: null,
  });

  const filterConfig = {
    customerName: { field: "customerName", op: "includes" },
    fromDate: { field: "purchaseDate", op: "gte" },
    toDate: { field: "purchaseDate", op: "lte" },
  };

  const handleApplyFilters = (filters) => {
    setGlobalFilters(filters);
  };

  const handleResetFilters = (filters) => {
    setGlobalFilters(filters);
  };

  useEffect(() => {
    fetchTransactions()
      .then((data) => {
        setTransactionDetails({
          transactions: data,
          error: null,
        });
      })
      .catch((err) => {
        setTransactionDetails((prev) => ({
          ...prev,
          error: err.message,
        }));
      })
      .finally(() => {
        setTransactionDetails((prev) => ({
          ...prev,
          loading: false,
        }));
      });
  }, []);
  const renderView = () => {
    switch (currentTab) {
      case "transactions":
        return (
          <Transactions
            transactions={transactionDetails.transactions}
            globalFilters={globalFilters}
            filterConfig={filterConfig}
          />
        );
      case "monthlyRewards":
        return (
          <MonthlyRewards
            transactions={transactionDetails.transactions}
            globalFilters={globalFilters}
            filterConfig={filterConfig}
          />
        );
      case "totalRewards":
        return (
          <TotalRewards
            transactions={transactionDetails.transactions}
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
      {transactionDetails.loading ? (
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
    </div>
  );
};
Home.propTypes = {
  currentTab: PropTypes.string,
};

export default Home;
