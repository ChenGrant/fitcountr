import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import LargeScreenNavigationBar from "./components/NavigationBar/LargeScreenNavigationBar";
import UnavailableResource from "../UnavailableResource/UnavailableResource";
import useScreenSize from "../../../hooks/useScreenSize";
import SmallScreenNavigationBar from "./components/NavigationBar/SmallScreenNavigationBar";
import SearchFood from "./components/SearchFood/SearchFood";

const Dashboard = () => {
  const { desktop } = useScreenSize();

  return (
    <Routes>
      <Route
        element={
          desktop ? <LargeScreenNavigationBar /> : <SmallScreenNavigationBar />
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/searchFood" element={<SearchFood />} />
      </Route>
      <Route path="*" element={<UnavailableResource />} />
    </Routes>
  );
};

export default Dashboard;
