import { Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { fetchNutritionFromBarcodeNumber } from "../../../../../../utils/";
import LoadingCircle from "../../../../../ui/LoadingCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useTheme } from "@emotion/react";
import CustomButton from "../../../../../ui/CustomButton";
import { Box } from "@mui/system";
import { RemovePageContext } from "../SearchFood";
import CustomCard from "../../../../../ui/CustomCard";
import useScreenSize from "../../../../../../hooks/useScreenSize";
import { v4 as uuidv4 } from "uuid";
import {
  capitalizeFirstCharacter,
  round,
  sortByNutrient,
  USDA_NUTRIENT_SET,
} from "../../../../../../utils";
import BackArrow from "../BackArrow";

// ------------------------------------ CONSTANTS ------------------------------------
const NUTRIENT_DECIMAL_PLACES = 2;

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const NutritionalData = ({ barcodeNumber, food }) => {
  const { phone } = useScreenSize();
  const theme = useTheme();
  const removePage = useContext(RemovePageContext);
  const [fetchingNutritionalData, setFetchingNutritionalData] = useState(true);
  const [nutritionalData, setNutritionalData] = useState();

  // ------------------------------------ USE EFFECT ----------------------------------
  useEffect(() => {
    nutritionalData !== undefined && setFetchingNutritionalData(false);
  }, [nutritionalData]);

  useEffect(() => {
    if (!barcodeNumber) return;

    (async () => {
      const fetchedNutrition = await fetchNutritionFromBarcodeNumber(
        barcodeNumber
      );
      !fetchedNutrition.error
        ? setNutritionalData(fetchedNutrition)
        : setFetchingNutritionalData(false);
    })();
  }, [barcodeNumber]);

  useEffect(() => {
    if (!food) return;

    const cleanData = {
      name: food.description,
      servingSize: {
        value: 100,
        unit: "g",
      },
      nutrients: {},
    };

    food.foodNutrients
      .filter(({ nutrientName }) => USDA_NUTRIENT_SET.has(nutrientName))
      .forEach(({ nutrientName, value, unitName }) => {
        if (nutrientName === "Energy") {
          cleanData.nutrients["calories"] = value;
          return;
        }

        const propertyName = (() => {
          switch (nutrientName) {
            case "Carbohydrate, by difference":
              return "carbohydrates";

            case "Protein":
              return "proteins";

            case "Total lipid (fat)":
              return "fat";

            case "Sodium, Na":
              return "sodium";

            default:
              return nutrientName;
          }
        })();

        cleanData.nutrients[propertyName.toLowerCase()] = {
          value,
          unit: unitName.toLowerCase(),
        };
      });
    setNutritionalData(cleanData);
  }, [food]);

  // -------------------------------------- RENDER ------------------------------------
  if (fetchingNutritionalData) return <LoadingCircle />;

  console.log(nutritionalData);

  return (
    <>
      <BackArrow />
      <Box sx={{ width: "100%", display: "grid", placeItems: "center" }}>
        {nutritionalData ? (
          <CustomCard
            sx={
              phone
                ? { p: 2, width: "calc(100% - 2 * 2 * 8px)" }
                : { maxWidth: "600px" }
            }
          >
            <Typography variant="h4" gutterBottom>
              <b>{nutritionalData.name}</b>
            </Typography>
            <Typography gutterBottom>
              <b>
                Serving Size: {nutritionalData.servingSize.value}
                {nutritionalData.servingSize.unit}
              </b>
            </Typography>
            {sortByNutrient(Object.entries(nutritionalData.nutrients)).map(
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
                  {barcodeNumber}
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

export default NutritionalData;
