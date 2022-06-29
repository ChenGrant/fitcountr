import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import theme from "./mui/Theme";
import { ThemeProvider } from "@mui/material";
import FirebaseClientInitializer from "./components/FirebaseClientInitializer";
import { Provider } from "react-redux";
import store from "./redux/store";
import Home from "./components/pages/Home";
import Dashboard from "./components/pages/Dashboard";
import UnavailableResource from "./components/pages/UnavailableResource";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <FirebaseClientInitializer>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<UnavailableResource />} />
            </Routes>
          </Router>
        </FirebaseClientInitializer>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
