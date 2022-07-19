import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import LargeNavigationBar from "./components/NavigationBar/LargeNavigationBar";
import UnavailableResource from "../UnavailableResource/UnavailableResource";
import useScreenSize from "../../../hooks/useScreenSize";
import SmallNavigationBar from "./components/NavigationBar/SmallNavigationBar";
import Profile from "./components/Profile";

const Dashboard = () => {
  const { desktop } = useScreenSize();

  return (
    <Routes>
      <Route
        element={desktop ? <LargeNavigationBar /> : <SmallNavigationBar />}
      >
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<UnavailableResource />} />
    </Routes>
  );
};

export default Dashboard;
