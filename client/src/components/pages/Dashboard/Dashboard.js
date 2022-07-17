import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import NavigationBar from "./components/NavigationBar";
import UnavailableResource from "../UnavailableResource/UnavailableResource";

const Dashboard = () => {
  return (
    <Routes>
      <Route element={<NavigationBar />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="*" element={<UnavailableResource />} />
    </Routes>
  );
};

export default Dashboard;
