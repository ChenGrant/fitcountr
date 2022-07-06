import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import theme from "./mui/Theme";
import { ThemeProvider as MUIThemeProvider } from "@mui/material";
import FirebaseClientInitializer from "./components/FirebaseClientInitializer";
import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/store";
import Home from "./components/pages/Home/Home";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import UnavailableResource from "./components/pages/UnavailableResource/UnavailableResource";
import EmailVerification from "./components/pages/EmailVerification/EmailVerification";
import FontsLoader from "./components/FontsLoader";

const App = () => {
  return (
    <ReduxProvider store={store}>
      <MUIThemeProvider theme={theme}>
        <FontsLoader>
          <FirebaseClientInitializer>
            <Router>
              <Routes>
                {/* Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/emailVerification/:email"
                  element={<EmailVerification />}
                />
                <Route path="*" element={<UnavailableResource />} />
              </Routes>
            </Router>
          </FirebaseClientInitializer>
        </FontsLoader>
      </MUIThemeProvider>
    </ReduxProvider>
  );
};

export default App;
