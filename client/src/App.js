import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppInitializer from "./features/AppInitializer";
import Home from "./features/Home";
import EmailVerification from "./features/EmailVerification";
import PasswordReset from "./features/PasswordReset";
import SearchFood from "./features/SearchFood";
import Progress from "./features/Progress/";
import Dashboard from "./features/Dashboard";
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
