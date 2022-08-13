import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "./utils";
import store from "./redux/store";
import { Provider as ReduxProvider } from "react-redux";
import AuthenticatedRoutes from "./setup/routes/AuthenticatedRoutes";
import Home from "./pages/Home";
import EmailVerification from "./pages/EmailVerification";
import PasswordReset from "./pages/PasswordReset";
import SearchFood from "./pages/SearchFood";
import Progress from "./pages/Progress/";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import FontsInitializer from "./setup/fonts/FontsInitializer";
import FirebaseClientInitializer from "./setup/firebaseClient/FirebaseClientInitializer";
import FirebaseUserListener from "./setup/firebaseUser/FirebaseUserListener";
import AppSetupLoader from "./setup/app/AppSetupLoader";
import { ROUTE_PATHS } from "./setup/routes/routeUtils";
import UnavailableResource from "./components/miscellaneous/UnavailableResource";

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
                    <Route path={ROUTE_PATHS.HOME} element={<Home />} />
                    <Route
                      path={ROUTE_PATHS.PASSWORD_RESET}
                      element={<PasswordReset />}
                    />
                    <Route
                      path={`${ROUTE_PATHS.EMAIL_VERIFICATION}/:email`}
                      element={<EmailVerification />}
                    />
                    {/* Authenticated Routes */}
                    <Route element={<AuthenticatedRoutes />}>
                      <Route path={ROUTE_PATHS.PROFILE} element={<Profile />} />
                      <Route
                        path={ROUTE_PATHS.DASHBOARD}
                        element={<Dashboard />}
                      />
                      <Route
                        path={ROUTE_PATHS.SEARCH_FOOD}
                        element={<SearchFood />}
                      />
                      <Route
                        path={ROUTE_PATHS.PROGRESS}
                        element={<Progress />}
                      />
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
