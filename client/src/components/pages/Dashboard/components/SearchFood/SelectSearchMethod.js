import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext } from "react";
import CustomCard from "../../../../ui/CustomCard";
import { v4 as uuidv4 } from "uuid";
import { PushPageContext } from "./SearchFood";
import { PAGES } from "../../../../../utils";

// ------------------------------------ CONSTANTS ------------------------------------
const SEARCH_METHODS = [
  {
    label: "Barcode Image",
    imageSrc: "https://pngimg.com/uploads/barcode/barcode_PNG10.png",
    page: PAGES.BARCODE_IMAGE,
  },
  {
    label: "Barcode Number",
    imageSrc:
      "https://firebasestorage.googleapis.com/v0/b/fitcountr-staging.appspot.com/o/assets%2Fsearch_food%2Fbarcode_number.png?alt=media&token=bb3bf4e3-3f20-415e-9657-6516132d0d3d",
  },
  {
    label: "Food Name",
    imageSrc:
      "https://firebasestorage.googleapis.com/v0/b/fitcountr-staging.appspot.com/o/assets%2Fsearch_food%2Fsearch_bar.png?alt=media&token=eb9999bd-df00-4454-afc9-9ab0e8b9c9b6",
  },
];

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const SelectSearchMethod = () => {
  const pushPage = useContext(PushPageContext);

  return (
    <Box
      px={4}
      height="100vh"
      display="flex"
      flexDirection="column"
      gap={10}
      alignItems="center"
      justifyContent="center"
    >
      <Box flex={1} display="flex" alignItems="flex-end">
        <Typography variant="h1" textAlign="center">
          Choose a search method
        </Typography>
      </Box>
      <Box flex={2}>
        <Box display="flex" gap={4}>
          {SEARCH_METHODS.map(({ label, imageSrc, page }) => {
            return (
              <CustomCard
                key={uuidv4()}
                sx={{ cursor: "pointer" }}
                onClick={() => page && pushPage(page)}
              >
                <Box
                  flex={1}
                  maxWidth="300px"
                  height="170px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={2}
                >
                  <Box>
                    <Typography variant="h6" textAlign="center">
                      <b>{label}</b>
                    </Typography>
                  </Box>
                  <Box
                    width="100%"
                    flex={1}
                    display="grid"
                    sx={{ placeItems: "center" }}
                  >
                    <Box
                      component="img"
                      width="100%"
                      alt={label}
                      src={imageSrc}
                    />
                  </Box>
                </Box>
              </CustomCard>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default SelectSearchMethod;
