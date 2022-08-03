import { Typography, IconButton } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { fetchNutritionFromBarcodeNumber } from "../../../../../utils/fetchRequestUtils";
import LoadingCircle from "../../../../ui/LoadingCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useTheme } from "@emotion/react";
import CustomButton from "../../../../ui/CustomButton";
import { Box } from "@mui/system";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { PopPageContext } from "./SearchFood";
import CustomCard from "../../../../ui/CustomCard";
import useScreenSize from "../../../../../hooks/useScreenSize";
import { v4 as uuidv4 } from "uuid";

const NutritionalData = (props) => {
  const { barcodeNumber, food } = props;
  const { phone } = useScreenSize();
  console.log(props);
  const theme = useTheme();
  const popPage = useContext(PopPageContext);
  const [fetchingNutritionalData, setFetchingNutritionalData] = useState(true);
  const [nutritionalData, setNutritionalData] = useState();

  useEffect(() => {
    (async () => {
      if (!barcodeNumber) return setFetchingNutritionalData(false);
      const fetchedNutrition = await fetchNutritionFromBarcodeNumber(
        barcodeNumber
      );
      console.log(fetchedNutrition);
      !fetchedNutrition.error && setNutritionalData(fetchedNutrition);
      setFetchingNutritionalData(false);
    })();
  }, [barcodeNumber]);

  if (fetchingNutritionalData) return <LoadingCircle />;

  return (
    <>
      <Box m={5}>
        <IconButton color="primary" onClick={popPage}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Box sx={{ width: "100%", display: "grid", placeItems: "center" }}>
        {food ? (
          <CustomCard
            sx={
              phone
                ? { p: 2, width: "calc(100% - 2 * 2 * 8px)" }
                : { maxWidth: "600px" }
            }
          >
            <Typography variant="h4" gutterBottom>
              <b>{food.description}</b>
            </Typography>
            <Typography gutterBottom>
              <b>Serving Size: 100g</b>
            </Typography>
            {food.foodNutrients.map(({ nutrientName, value, unitName }) => (
              <Box
                key={uuidv4()}
                display="flex"
                borderTop="1px solid #D3D3D3"
                py={1}
              >
                <Box flex={1}>
                  <Typography textAlign="left">{nutrientName}</Typography>
                </Box>
                <Box>
                  <Typography textAlign="right">
                    {value} {unitName}
                  </Typography>
                </Box>
              </Box>
            ))}
          </CustomCard>
        ) : !nutritionalData ? (
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
                onClick={popPage}
              >
                Back
              </CustomButton>
            </Box>
          </Box>
        ) : (
          <Typography>Data</Typography>
        )}
      </Box>
    </>
  );
};

export default NutritionalData;
