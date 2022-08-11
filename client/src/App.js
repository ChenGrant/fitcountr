import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppInitializer from "./components/wrappers/AppInitializer";
import Home from "./pages/Home/Home";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import UnavailableResource from "./pages/UnavailableResource/UnavailableResource";
import PasswordReset from "./pages/PasswordReset/PasswordReset";
import SearchFood from "./pages/SearchFood/SearchFood";
import Progress from "./pages/Progress/Progress";
import Dashboard from "./pages/Dashboard/Dashboard";
import AuthenticatedRoutes from "./routes/AuthenticatedRoutes";

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
