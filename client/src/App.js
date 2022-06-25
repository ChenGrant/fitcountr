import React from "react";
import theme from "./mui/Theme";
import { ThemeProvider } from "@mui/material";
import Login from "./pages/Login";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Login />
    </ThemeProvider>
  );
};

export default App;
