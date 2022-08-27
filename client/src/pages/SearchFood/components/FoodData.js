import { Typography } from "@mui/material";
import React, { useReducer, useState } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import { useTheme } from "@emotion/react";
import { fetchFoodFromBarcodeNumber, postFood } from "../../../utils";
import CustomButton from "../../../components/ui/CustomButton";
import { Box } from "@mui/system";
import CustomCard from "../../../components/ui/CustomCard";
import useScreenSize from "../../../hooks/useScreenSize";
import {
  capitalizeFirstCharacter,
  round,
  sortByNutrient,
  cleanFoodsFetchedFromQuery,
  cleanFoodsFetchedFromBarcodeNumber,
} from "../../../utils";
import BackArrow from "../../../components/ui/BackArrow";
import useFetch from "../../../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import { addUserFood, removeSearchFoodPage } from "../../../redux";
import LoadingCircle from "../../../components/miscellaneous/LoadingCircle";
import PostDataButton from "../../../components/ui/PostDataButton";
import CustomSnackbar, {
  INITIAL_SNACKBAR_STATE,
  snackbarReducer,
  SNACKBAR_ACTIONS,
} from "../../../components/ui/CustomSnackbar";

const BARCODE_SEARCH_METHOD = "BARCODE_SEARCH_METHOD";
const FOOD_NAME_SEARCH_METHOD = "FOOD_NAME_SEARCH_METHOD";
// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const FoodData = ({ initialBarcodeNumber, initialFoodData }) => {
  const { desktop } = useScreenSize();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useSelector((state) => state);
  const [foodData] = useFetch(
    initialBarcodeNumber
      ? async () =>
          cleanFoodsFetchedFromBarcodeNumber(
            await fetchFoodFromBarcodeNumber(initialBarcodeNumber)
          )
      : () => cleanFoodsFetchedFromQuery(initialFoodData)
  );
  const [isPostingFood, setIsPostingFood] = useState(false);
  const [snackbar, snackbarDispatch] = useReducer(
    snackbarReducer,
    INITIAL_SNACKBAR_STATE
  );
  const pageIsLoading = !foodData.hasFetched;

  const addFoodToProgress = async () => {
    setIsPostingFood(true);
    const { name, nutrients, servingSize } = foodData.data;

    const response = await postFood(user, {
      name,
      nutrients,
      servingSize,
      searchMethod: initialBarcodeNumber
        ? BARCODE_SEARCH_METHOD
        : FOOD_NAME_SEARCH_METHOD,
      barcodeNumber: initialBarcodeNumber || undefined,
    });

    snackbarDispatch({
      type: response.error
        ? SNACKBAR_ACTIONS.FAILURE
        : SNACKBAR_ACTIONS.SUCCESS,
      payload: {
        message: response.error
          ? "Could not add food to progress"
          : response.message,
      },
    });

    if (!response.error) {
      const { id, name, nutrients, servingSize } = response.food;
      dispatch(
        addUserFood({
          [id]: {
            name,
            nutrients,
            servingSize,
          },
        })
      );
    }
    
    setIsPostingFood(false);
  };
  // // -------------------------------------- RENDER ------------------------------------
  if (pageIsLoading) return <LoadingCircle />;

  return (
    <>
      <BackArrow onClick={() => dispatch(removeSearchFoodPage())} />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        {foodData.data ? (
          <CustomCard
            sx={{
              maxWidth: "600px",
              ...(!desktop && {
                p: 2,
                width: "calc(100% - 2 * 4 * 8px)",
                maxWidth: "600px",
              }),
            }}
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
                    key={nutrientName}
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
                        {`${round(value, 2)} ${unit ?? ""}`}
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
                onClick={() => dispatch(removeSearchFoodPage())}
              >
                Back
              </CustomButton>
            </Box>
          </Box>
        )}
        <Box
          sx={{
            width: "100%",
            maxWidth: "calc(600px + 2 * 5 * 8px)",
            ...(!desktop && {
              width: "calc(100% - 2 * 2 * 8px)",
              maxWidth: "calc(600px + 2 * 2 * 8px)",
            }),
          }}
        >
          <PostDataButton
            isPostingData={isPostingFood}
            onClick={addFoodToProgress}
            variant="contained"
            sx={{ width: "100%" }}
          >
            Add Food To Progress
          </PostDataButton>
        </Box>
      </Box>
      <CustomSnackbar
        {...{
          ...snackbar,
          onClose: () => snackbarDispatch({ type: SNACKBAR_ACTIONS.CLOSE }),
        }}
      />
    </>
  );
};

export default FoodData;
