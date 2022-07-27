import { LinearProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext } from "react";
import CustomCard from "../../../../ui/CustomCard";
import { v4 as uuidv4 } from "uuid";
import { PushPageContext } from "./SearchFood";
import { PAGES } from "../../../../../utils";
import useAsset from "../../../../../hooks/useAsset";

// ------------------------------------ CONSTANTS ------------------------------------
const SEARCH_METHODS = [
  {
    label: "Barcode Image",
    imageName: "barcodeImage",
    page: PAGES.BARCODE_IMAGE,
  },
  {
    label: "Barcode Number",
    imageName: "barcodeNumber",
    page: PAGES.BARCODE_NUMBER,
  },
  {
    label: "Food Name",
    imageName: "foodName",
  },
];

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const SelectSearchMethod = () => {
  const pushPage = useContext(PushPageContext);

  const [assets, assetsDispatchers, loadingAssets] = useAsset({
    barcodeImage: { name: "search_barcode_image" },
    barcodeNumber: { name: "search_barcode_number" },
    foodName: { name: "search_food_name" },
  });

  const pageIsLoading = loadingAssets;

  return (
    <>
      {pageIsLoading && (
        <Box
          width="100%"
          height="100vh"
          display="grid"
          sx={{ placeItems: "center" }}
        >
          <Box bgcolor="red" width="50%">
            <LinearProgress />
          </Box>
        </Box>
      )}
      <Box
        px={4}
        height="100vh"
        display={pageIsLoading ? "none" : "flex"}
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
            {SEARCH_METHODS.map(({ label, imageName, page }) => {
              return (
                <CustomCard
                  key={uuidv4()}
                  sx={{ cursor: "pointer" }}
                  onClick={() => page && pushPage({ name: page })}
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
                        src={assets[imageName].src}
                        onLoad={() =>
                          assets[imageName].isLoading &&
                          assetsDispatchers[imageName].setLoading(false)
                        }
                      />
                    </Box>
                  </Box>
                </CustomCard>
              );
            })}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SelectSearchMethod;
