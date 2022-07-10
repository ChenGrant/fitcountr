import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import theme from "./mui/Theme";
import { ThemeProvider as MUIThemeProvider } from "@mui/material";
import FirebaseClientInitializer from "./components/wrappers/FirebaseClientInitializer";
import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/store";
import Home from "./components/pages/Home/Home";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import UnavailableResource from "./components/pages/UnavailableResource/UnavailableResource";
import EmailVerification from "./components/pages/EmailVerification/EmailVerification";
import FontsLoader from "./components/wrappers/FontsLoader";
import FirebaseAuthListener from "./components/wrappers/FirebaseAuthListener";

const App = () => {
  console.log('start')
  return (
    <ReduxProvider store={store}>
      <MUIThemeProvider theme={theme}>
        <FontsLoader>
          <FirebaseClientInitializer>
            <FirebaseAuthListener>
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
            </FirebaseAuthListener>
          </FirebaseClientInitializer>
        </FontsLoader>
      </MUIThemeProvider>
    </ReduxProvider>
  );
};

export default App;
