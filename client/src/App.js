import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppInitializer from "./features/appInitializer";
import Home from "./features/home";
import EmailVerification from "./features/emailVerification";
import PasswordReset from "./features/passwordReset";
import SearchFood from "./features/searchFood";
import Progress from "./features/progress/";
import Dashboard from "./features/dashboard";
import AuthenticatedRoutes from "./features/routing/";
import UnavailableResource from "./components/ui/UnavailableResource";

const App = () => {
  return (
    <AppInitializer>
      <Router>
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
      </Router>
    </AppInitializer>
  );
};

export default App;
