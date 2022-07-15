import { Box } from "@mui/system";
import React from "react";
import { Route, Routes } from "react-router-dom";
import UnavailableResource from "../UnavailableResource/UnavailableResource";
import DashboardHome from "./DashboardHome/DashboardHome";
import DashboardStats from "./DashboardStats/DashboardStats";
import Wrapper from "./Wrapper";

const Dashboard = () => {
  return (
    <Routes>
      <Route element={<Wrapper />}>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/stats" element={<DashboardStats />} />
      </Route>
      <Route path="*" element={<UnavailableResource />} />
    </Routes>
  );
};

export default Dashboard;
