import { Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { fetchNutritionFromBarcodeNumber } from "../../../../../../utils/fetchRequestUtils";
import LoadingCircle from "../../../../../ui/LoadingCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useTheme } from "@emotion/react";
import CustomButton from "../../../../../ui/CustomButton";
import { Box } from "@mui/system";
import { RemovePageContext } from "./../SearchFood";
import CustomCard from "../../../../../ui/CustomCard";
import useScreenSize from "../../../../../../hooks/useScreenSize";
import { v4 as uuidv4 } from "uuid";
import { capitalizeFirstCharacter, round } from "../../../../../../utils";
import BackArrow from "../BackArrow";

const DECIMAL_PLACES = 2;

const USDA_NUTRIENT_SET = new Set([
  "Protein",
  "Carbohydrate, by difference",
  "Energy",
  "Total lipid (fat)",
  "Sugars",
  "Sodium, Na",
]);

const NUTRIENT_PRIORITY = [
  "calories",
  "proteins",
  "carbohydrates",
  "fat",
  "sugars",
  "sodium",
];

const sortByNutrition = (nutritionalData) =>
  nutritionalData.sort(([nutrientName1], [nutrientName2]) => {
    if (
      NUTRIENT_PRIORITY.includes(nutrientName1) &&
      NUTRIENT_PRIORITY.includes(nutrientName2)
    )
      return (
        NUTRIENT_PRIORITY.indexOf(nutrientName1) -
        NUTRIENT_PRIORITY.indexOf(nutrientName2)
      );
    else if (NUTRIENT_PRIORITY.includes(nutrientName1)) return -1;
    else if (NUTRIENT_PRIORITY.includes(nutrientName2)) return 1;
    return nutrientName1 - nutrientName2;
  });

const NutritionalData = ({ barcodeNumber, food }) => {
  const { phone } = useScreenSize();
  const theme = useTheme();
  const removePage = useContext(RemovePageContext);
  const [fetchingNutritionalData, setFetchingNutritionalData] = useState(true);
  const [nutritionalData, setNutritionalData] = useState();

  useEffect(() => {
    if (nutritionalData !== undefined) setFetchingNutritionalData(false);
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
      "serving size": {
        value: 100,
        unit: "g",
      },
      nutrition: {},
    };

    food.foodNutrients
      .filter(({ nutrientName }) => USDA_NUTRIENT_SET.has(nutrientName))
      .forEach(({ nutrientName, value, unitName }) => {
        if (nutrientName === "Energy") {
          cleanData["nutrition"]["calories"] = value;
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

        cleanData["nutrition"][propertyName.toLowerCase()] = {
          value,
          unit: unitName.toLowerCase(),
        };
      });
    setNutritionalData(cleanData);
  }, [food]);

  if (fetchingNutritionalData) return <LoadingCircle />;

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
                Serving Size: {nutritionalData["serving size"].value}
                {nutritionalData["serving size"].unit}
              </b>
            </Typography>
            {sortByNutrition(Object.entries(nutritionalData.nutrition)).map(
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
                          ? round(measurement, DECIMAL_PLACES)
                          : `${round(value, DECIMAL_PLACES)} ${unit}`}
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
