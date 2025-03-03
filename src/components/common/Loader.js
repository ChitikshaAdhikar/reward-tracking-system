import React from "react";
import { CircularProgress, Box } from "@mui/material";

/**
 * @file Loader.js
 * @description Renders a full-screen loader centered both vertically and horizontally.
 * @component Loader
 * @returns {JSX.Element} The rendered Loader component.
 */
const Loader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
