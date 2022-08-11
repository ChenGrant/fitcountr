import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "./utils";
import store from "./redux/store";
import { Provider as ReduxProvider } from "react-redux";
import AuthenticatedRoutes from "./setup/routes/AuthenticatedRoutes";
import Home from "./pages/home";
import EmailVerification from "./pages/emailVerification";
import PasswordReset from "./pages/passwordReset";
import SearchFood from "./pages/searchFood";
import Progress from "./pages/progress/";
import Dashboard from "./pages/dashboard";
import UnavailableResource from "./components/ui/UnavailableResource";
import FontsInitializer from "./setup/fonts/FontsInitializer";
import FirebaseClientInitializer from "./setup/firebaseClient/FirebaseClientInitializer";
import FirebaseUserListener from "./setup/firebaseUser/FirebaseUserListener";
import AppSetupLoader from "./setup/app/AppSetupLoader";

const App = () => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <FontsInitializer>
          <FirebaseClientInitializer>
            <FirebaseUserListener>
              <AppSetupLoader>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/passwordReset" element={<PasswordReset />} />
                    <Route
                      path="/emailVerification/:email"
                      element={<EmailVerification />}
                    />
                    {/* Authenticated Routes */}
                    <Route element={<AuthenticatedRoutes />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/searchFood" element={<SearchFood />} />
                      <Route path="/progress" element={<Progress />} />
                    </Route>
                    <Route path="*" element={<UnavailableResource />} />
                  </Routes>
                </BrowserRouter>
              </AppSetupLoader>
            </FirebaseUserListener>
          </FirebaseClientInitializer>
        </FontsInitializer>
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default App;
