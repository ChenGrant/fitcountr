import React from "react";
import { Box, Typography } from "@mui/material";
import CustomButton from "../ui/CustomButton";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../setup/routes/routeUtils";

const UnavailableResource = () => {
  const { user } = useSelector((state) => state);
  const navigate = useNavigate();
  return (
    <Box
      fullWidth
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={5}
      bgcolor="white"
      sx={{ zIndex: 99 }}
    >
      <Typography variant="h1" textAlign="center">
        Unavailable Resource
      </Typography>
      {user.auth.isLoggedIn ? (
        <CustomButton
          variant="contained"
          onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}
        >
          Dashboard
        </CustomButton>
      ) : (
        <CustomButton
          variant="contained"
          onClick={() => navigate(ROUTE_PATHS.HOME)}
        >
          Home
        </CustomButton>
      )}
    </Box>
  );
};

export default UnavailableResource;
