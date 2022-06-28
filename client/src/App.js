import React from "react";
import theme from "./mui/Theme";
import { ThemeProvider } from "@mui/material";
import Home from "./components/pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/pages/SignUp";
import Dashboard from "./components/pages/Dashboard";
import UnavailablePage from "./components/pages/UnavailablePage";
import FirebaseClientProvider from "./components/FirebaseClientProvider";
import { Provider } from "react-redux";
import store from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <FirebaseClientProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<UnavailablePage />} />
            </Routes>
          </Router>
        </FirebaseClientProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
