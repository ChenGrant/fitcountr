import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home/Home";
import DashboardRoutes from "./routes/DashboardRoutes";
import UnavailableResource from "./components/pages/UnavailableResource/UnavailableResource";
import EmailVerification from "./components/pages/EmailVerification/EmailVerification";
import AppInitializer from "./components/wrappers/AppInitializer";

const App = () => {
  return (
    <AppInitializer>
      <Router>
        <Routes>
          {/* Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/dashboard/*" element={<DashboardRoutes />} />
          <Route
            path="/emailVerification/:email"
            element={<EmailVerification />}
          />
          <Route path="*" element={<UnavailableResource />} />
        </Routes>
      </Router>
    </AppInitializer>
  );
};

export default App;
