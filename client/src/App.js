import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./features/Home/Home";
import EmailVerification from "./features/EmailVerification/EmailVerification";
import PasswordReset from "./features/PasswordReset/PasswordReset";
import SearchFood from "./features/SearchFood/SearchFood";
import Progress from "./features/Progress/Progress";
import Dashboard from "./features/Dashboard/Dashboard";
import AuthenticatedRoutes from "./routes/AuthenticatedRoutes";
import UnavailableResource from "./components/ui/UnavailableResource";
import AppInitializer from "./features/AppInitializer/AppInitializer";

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
