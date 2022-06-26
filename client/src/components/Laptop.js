import { Box } from "@mui/system";
import React from "react";
import styles from "./Laptop.module.css";

const Laptop = ({imageURL, ...rest}) => {
  return (
    <Box {...rest}>
      <div className={styles.macbook}>
        <div className={styles.screen}>
          <div
            className={styles.viewport}
            style={{
              backgroundImage: `url(${imageURL})`,
            }}
          ></div>
        </div>
        <div className={styles.base}></div>
        <div className={styles.notch}></div>
      </div>
    </Box>
  );
};

export default Laptop;
