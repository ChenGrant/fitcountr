import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import CustomButton from "../../../mui/CustomButton";
import DailyStatCard from "./DailyStatCard";
import useScreenSize from "../../../hooks/useScreenSize";
import { v4 as uuidv4 } from "uuid";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useTheme } from "@emotion/react";

const statsForTheDay = [
  {
    stat: "calories",
    goal: 3000,
    current: 1900,
  },
  {
    stat: "weight",
    goal: 65.0,
    current: 15.6,
  },
  {
    stat: "steps",
    goal: 10000,
    current: 12330,
  },
  {
    stat: "sleep",
    goal: 10000,
    current: 12330,
  },
];

const Dashboard = () => {
  const auth = getAuth();
  const { user } = useSelector((state) => state);
  const navigate = useNavigate();
  const theme = useTheme();
  const { desktop, tablet, phone } = useScreenSize();
  if (!user.isLoggedIn) return <Navigate to="/" />;
  return (
    <Box p={4} fullWidth display="flex" flexDirection="column" gap={4}>
      <Box
        fullWidth
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Box
          display="grid"
          sx={{ placeItems: "center" }}
          height="60px"
          width="60px"
        >
          <IconButton>
            <NotificationsIcon
              sx={{
                color: theme.palette.primary.main,
                height: "30px",
                width: "30px",
                transition: "all 0.15s ease-in-out",
                "&:hover": {
                  transform: "scale(1.2)",
                },
              }}
            />
          </IconButton>
        </Box>
        <Box
          display="grid"
          sx={{ placeItems: "center" }}
          height="60px"
          width="60px"
        >
          <Avatar
            src="https://www.ssrl-uark.com/wp-content/uploads/2014/06/no-profile-image.png"
            sx={{
              cursor: "pointer",
              height: "35px",
              width: "35px",
              transition: "all 0.15s ease-in-out",
              "&:hover": {
                transform: "scale(1.2)",
              },
            }}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection={desktop ? "row" : "column"}
        gap={3}
        alignItems="center"
        justifyContent="center"
        fullWidth
      >
        {statsForTheDay.map((stat) => (
          <DailyStatCard key={uuidv4()} {...stat} />
        ))}
      </Box>
      <br />
      <br />
      <br />
      <CustomButton
        variant="contained"
        onClick={async () => {
          await signOut(auth);
          navigate("/");
        }}
      >
        Logout
      </CustomButton>
      <Typography>Hi {user.user.email}</Typography>
    </Box>
  );
};

export default Dashboard;
