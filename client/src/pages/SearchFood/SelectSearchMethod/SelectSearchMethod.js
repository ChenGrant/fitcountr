import { LinearProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext } from "react";
import CustomCard from "../../../components/ui/CustomCard";
import { v4 as uuidv4 } from "uuid";
import { AddPageContext } from "../SearchFood";
import { SEARCH_FOOD_PAGES } from "../../../utils";
import useAsset from "../../../hooks/useAsset";
import useScreenSize from "../../../hooks/useScreenSize";

// ------------------------------------ CONSTANTS ------------------------------------
const SEARCH_METHODS = [
  {
    searchMethodName: "Barcode Image",
    imageName: "barcodeImage",
    apiImageName: "search_barcode_image",
    pageName: SEARCH_FOOD_PAGES.BARCODE_IMAGE,
  },
  {
    searchMethodName: "Barcode Number",
    imageName: "barcodeNumber",
    apiImageName: "search_barcode_number",
    pageName: SEARCH_FOOD_PAGES.BARCODE_NUMBER,
  },
  {
    searchMethodName: "Food Name",
    imageName: "foodName",
    apiImageName: "search_food_name",
    pageName: SEARCH_FOOD_PAGES.FOOD_NAME,
  },
];

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const SelectSearchMethod = () => {
  const addPage = useContext(AddPageContext);
  const { desktop } = useScreenSize();
  const [assets, assetsDispatchers, loadingAssets] = useAsset(
    Object.fromEntries(
      SEARCH_METHODS.map(({ imageName, apiImageName }) => [
        imageName,
        { name: apiImageName },
      ])
    )
  );

  const pageIsLoading = loadingAssets;

  // ------------------------------------ RENDER -------------------------------------
  return (
    <>
      {/* render LinearProgress component if page is loading */}
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
        py={!desktop && 10}
        height={desktop ? "100vh" : "auto"}
        display={pageIsLoading ? "none" : "flex"}
        flexDirection="column"
        gap={10}
        alignItems="center"
        justifyContent="center"
      >
        {/* Header */}
        <Box flex={desktop && 1} display="flex" alignItems="flex-end">
          <Typography variant="h1" textAlign="center">
            Choose a search method
          </Typography>
        </Box>
        {/* Search Methods */}
        <Box flex={desktop && 2}>
          <Box
            display="flex"
            flexDirection={desktop ? "row" : "column"}
            gap={5}
          >
            {SEARCH_METHODS.map(({ searchMethodName, imageName, pageName }) => {
              return (
                <CustomCard
                  key={uuidv4()}
                  sx={{ cursor: "pointer" }}
                  onClick={() => pageName && addPage({ name: pageName })}
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
                        <b>{searchMethodName}</b>
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
                        alt={searchMethodName}
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
