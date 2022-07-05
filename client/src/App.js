import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import theme from "./mui/Theme";
import { ThemeProvider } from "@mui/material";
import FirebaseClientInitializer from "./components/FirebaseClientInitializer";
import { Provider } from "react-redux";
import store from "./redux/store";
import Home from "./components/pages/Home/Home";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import UnavailableResource from "./components/pages/UnavailableResource/UnavailableResource";
import EmailVerification from "./components/pages/EmailVerification/EmailVerification";
import FontsLoader from "./components/FontsLoader";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <FirebaseClientInitializer>
          <FontsLoader>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/emailverification/:email"
                  element={<EmailVerification />}
                />
                <Route path="*" element={<UnavailableResource />} />
              </Routes>
            </Router>
          </FontsLoader>
        </FirebaseClientInitializer>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
