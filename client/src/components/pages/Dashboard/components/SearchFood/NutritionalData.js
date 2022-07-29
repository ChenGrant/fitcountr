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

const NutritionalData = ({ barcodeNumber }) => {
  const theme = useTheme();
  const popPage = useContext(PopPageContext);
  const [fetchingNutritionalData, setFetchingNutritionalData] = useState(true);
  const [nutritionalData, setNutritionalData] = useState();

  useEffect(() => {
    (async () => {
      const fetchedNutrition = await fetchNutritionFromBarcodeNumber(
        barcodeNumber
      );
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
      {!nutritionalData ? (
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
              Could not find nutritional data associated with the barcode number{" "}
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
    </>
  );
};

export default NutritionalData;
