import React from "react";
import useScreenSize from "../hooks/useScreenSize";
import { Routes, Route } from "react-router-dom";
import LargeScreenNavigationBar from "../components/layouts/navigationBar/LargeScreenNavigationBar";
import SmallScreenNavigationBar from "../components/layouts/navigationBar/SmallScreenNavigationBar";
import Dashboard from "../pages/Dashboard/Dashboard";
import SearchFood from "../pages/SearchFood/SearchFood";
import UnavailableResource from "../pages/UnavailableResource/UnavailableResource";
import Progress from "../pages/Progress/Progress";

const DashboardRoutes = () => {
  const { desktop } = useScreenSize();

  return (
    <Routes>
      <Route
        element={
          desktop ? <LargeScreenNavigationBar /> : <SmallScreenNavigationBar />
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/searchFood" element={<SearchFood />} />
        <Route path="/progress" element={<Progress />} />
      </Route>
      <Route path="*" element={<UnavailableResource />} />
    </Routes>
  );
};

export default DashboardRoutes;
