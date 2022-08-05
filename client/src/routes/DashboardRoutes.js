import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../components/pages/Dashboard/components/Home/Home";
import LargeScreenNavigationBar from "../components/pages/Dashboard/components/NavigationBar/LargeScreenNavigationBar";
import UnavailableResource from "../components/pages/UnavailableResource/UnavailableResource";
import useScreenSize from "../hooks/useScreenSize";
import SmallScreenNavigationBar from "../components/pages/Dashboard/components/NavigationBar/SmallScreenNavigationBar";
import SearchFood from "../components/pages/Dashboard/components/SearchFood/SearchFood";

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
      </Route>
      <Route path="*" element={<UnavailableResource />} />
    </Routes>
  );
};

export default DashboardRoutes;
