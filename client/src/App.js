import React, { useEffect, useState } from "react";
import theme from "./mui/Theme";
import { ThemeProvider } from "@mui/material";
import Login from "./pages/Login";
import { initializeFirebaseClient } from "./firebase";
import Loading from "./pages/Loading";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeFirebase = async () => {
      await initializeFirebaseClient();
      setLoading(false);
    };

    initializeFirebase();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {loading ? <Loading /> : <Login />}
    </ThemeProvider>
  );
};

export default App;

//redux: user, firebase configured
