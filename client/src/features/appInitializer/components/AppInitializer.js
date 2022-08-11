import React from "react";
import { ThemeProvider } from "@mui/material";
import { theme } from "../../../utils";
import { Provider as ReduxProvider } from "react-redux";
import store from "../../../redux/store";
import FirebaseClientInitializer from "./FirebaseClientInitializer";
import FirebaseUserListener from "./FirebaseUserListener";
import FontsLoader from "./FontsLoader";
import LoadingInitializer from "./LoadingInitializer";

const AppInitializer = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <FontsLoader>
          <FirebaseClientInitializer>
            <FirebaseUserListener>
              <LoadingInitializer>{children}</LoadingInitializer>
            </FirebaseUserListener>
          </FirebaseClientInitializer>
        </FontsLoader>
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default AppInitializer;
