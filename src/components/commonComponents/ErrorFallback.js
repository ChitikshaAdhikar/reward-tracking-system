/**
 * @file ErrorFallback.js
 * @description A fallback UI component that displays an error message when an error is caught by an ErrorBoundary.
 */

import React from "react";
import { Card, CardContent, Box } from "@mui/material";

/**
 * @file ErrorFallback.js
 * @description A fallback UI component that displays an error message when an error is caught by an ErrorBoundary.
 * @component ErrorFallback
 * @param {Object} props - Component props.
 * @param {Error} props.error - The error object caught by the ErrorBoundary.
 * @returns {JSX.Element} The rendered error fallback UI.
 */
const ErrorFallback = ({ error }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", p: 2 }}>
        <CardContent>
          <h2 style={{ color: "#d32f2f", marginBottom: "16px" }}>Oops!</h2>
          <p style={{ color: "#555", marginBottom: "16px" }}>
            Something went wrong. Please try again later.
            {error.message}
          </p>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ErrorFallback;
