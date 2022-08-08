import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppInitializer from "./components/wrappers/AppInitializer";
import DashboardRoutes from "./routes/DashboardRoutes";
import Home from "./pages/Home/Home";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import UnavailableResource from "./pages/UnavailableResource/UnavailableResource";
import PasswordReset from "./pages/PasswordReset/PasswordReset";

const App = () => {
  return (
    <AppInitializer>
      <Router>
        <Routes>
          {/* Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/emailVerification/:email"
            element={<EmailVerification />}
          />
          <Route path="/passwordReset" element={<PasswordReset />} />
          <Route path="/dashboard/*" element={<DashboardRoutes />} />
          <Route path="*" element={<UnavailableResource />} />
        </Routes>
      </Router>
    </AppInitializer>
  );
};

export default App;
