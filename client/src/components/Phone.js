import { Box } from "@mui/system";
import React from "react";
import styles from "./Phone.module.css";

const Phone = () => {
  return (
    <center>
      <div className = {styles["device device-iphone"]}>
        <img src="https://picsum.photos/375/812" />
      </div>
    </center>
  );
};

export default Phone;
