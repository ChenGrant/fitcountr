import { Typography } from "@mui/material";
import React, { useContext } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import { useTheme } from "@emotion/react";
import { fetchFoodFromBarcodeNumber } from "../../../utils";
import CustomButton from "../../../components/ui/CustomButton";
import LoadingCircle from "../../../components/ui/LoadingCircle";
import { Box } from "@mui/system";
import { RemovePageContext } from "../SearchFood";
import CustomCard from "../../../components/ui/CustomCard";
import useScreenSize from "../../../hooks/useScreenSize";
import { v4 as uuidv4 } from "uuid";
import {
  capitalizeFirstCharacter,
  round,
  sortByNutrient,
  getCleanFoodData,
} from "../../../utils";
import BackArrow from "../../../components/ui/BackArrow";
import useFetch from "../../../hooks/useFetch";

// ------------------------------------ CONSTANTS ------------------------------------
const NUTRIENT_DECIMAL_PLACES = 2;

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const FoodData = ({ initialBarcodeNumber, initialFoodData }) => {
  const { phone } = useScreenSize();
  const theme = useTheme();
  const removePage = useContext(RemovePageContext);
  const [foodData] = useFetch(
    initialBarcodeNumber
      ? async () => await fetchFoodFromBarcodeNumber(initialBarcodeNumber)
      : () => getCleanFoodData(initialFoodData)
  );
  const pageIsLoading = !foodData.hasFetched;

  // // -------------------------------------- RENDER ------------------------------------
  if (pageIsLoading) return <LoadingCircle />;

  console.log(foodData)
  return (
    <>
      <BackArrow />
      <Box sx={{ width: "100%", display: "grid", placeItems: "center" }}>
        {foodData.data ? (
          <CustomCard
            sx={
              phone
                ? { p: 2, width: "calc(100% - 2 * 2 * 8px)" }
                : { maxWidth: "600px" }
            }
          >
            <Typography variant="h4" gutterBottom>
              <b>{foodData.data.name}</b>
            </Typography>
            <Typography gutterBottom>
              <b>
                Serving Size: {foodData.data.servingSize.value}
                {foodData.data.servingSize.unit}
              </b>
            </Typography>
            {sortByNutrient(Object.entries(foodData.data.nutrients)).map(
              ([nutrientName, measurement]) => {
                const { value, unit } = measurement;
                return (
                  <Box
                    key={uuidv4()}
                    display="flex"
                    borderTop="1px solid #D3D3D3"
                    py={1}
                  >
                    <Box flex={1}>
                      <Typography textAlign="left">
                        {capitalizeFirstCharacter(nutrientName)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography textAlign="right">
                        {nutrientName === "calories"
                          ? round(measurement, NUTRIENT_DECIMAL_PLACES)
                          : `${round(value, NUTRIENT_DECIMAL_PLACES)} ${unit}`}
                      </Typography>
                    </Box>
                  </Box>
                );
              }
            )}
          </CustomCard>
        ) : (
          <Box display="grid" sx={{ placeItems: "center" }} px={2}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              width="100%"
              maxWidth="500px"
            >
              <Typography variant="h4" gutterBottom>
                No Nutritional Data Found
              </Typography>
              <ErrorIcon color="primary" sx={{ fontSize: "100px", my: 7 }} />
              <Typography>
                Could not find nutritional data associated with the barcode
                number{" "}
                <b style={{ color: theme.palette.primary.main }}>
                  {initialBarcodeNumber}
                </b>
                .
              </Typography>
              <CustomButton
                variant="contained"
                fullWidth
                sx={{ mt: 5 }}
                onClick={removePage}
              >
                Back
              </CustomButton>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default FoodData;
