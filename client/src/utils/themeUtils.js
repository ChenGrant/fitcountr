import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: "Montserrat,sans-serif",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  palette: {
    primary: {
      light: "#ffb580",
      main: "#FF6B00", // orange
      dark: "#CC5600",
      veryDark: "#B34B00",
    },
  },
  breakpoints: {
    values: {
      xs: 0, //phone
      sm: 480, // tablet
      md: 1055, // monitor
      lg: 1200,
      xl: 1536,
    },
  },
});

// ---------------------------- theme.breakpoints.up("md") ----------------------------
theme.typography.h1[theme.breakpoints.up("md")] = {
  fontSize: "56px",
  fontWeight: 700,
};

theme.typography.h4[theme.breakpoints.up("md")] = {
  fontSize: "30px",
  fontWeight: 600,
};

theme.typography.h6[theme.breakpoints.up("md")] = {
  fontSize: "23px",
  fontWeight: 500,
};

theme.typography.body1[theme.breakpoints.up("md")] = { fontSize: "16px" };

theme.typography.button[theme.breakpoints.up("md")] = { fontSize: "25px" };

// --------------------------- theme.breakpoints.only("sm") ---------------------------
theme.typography.h1[theme.breakpoints.only("sm")] = {
  fontSize: "44px",
  fontWeight: 700,
};

theme.typography.h4[theme.breakpoints.only("sm")] = {
  fontSize: "30px",
  fontWeight: 600,
};

theme.typography.h6[theme.breakpoints.only("sm")] = {
  fontSize: "23px",
  fontWeight: 500,
};

theme.typography.body1[theme.breakpoints.only("sm")] = { fontSize: "16px" };

theme.typography.button[theme.breakpoints.only("sm")] = { fontSize: "22px" };

// --------------------------- theme.breakpoints.only("xs") ---------------------------
theme.typography.h1[theme.breakpoints.only("xs")] = {
  fontSize: "32px",
  fontWeight: 700,
};

theme.typography.h4[theme.breakpoints.only("xs")] = {
  fontSize: "24px",
  fontWeight: 600,
};

theme.typography.h6[theme.breakpoints.only("xs")] = {
  fontSize: "20px",
  fontWeight: 500,
};

theme.typography.body1[theme.breakpoints.only("xs")] = { fontSize: "16px" };

theme.typography.button[theme.breakpoints.only("xs")] = { fontSize: "18px" };
