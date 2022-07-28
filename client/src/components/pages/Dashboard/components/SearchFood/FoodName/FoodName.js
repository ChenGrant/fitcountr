import React, { useContext, useState } from "react";
import {
  PopPageContext,
  PushPageContext,
  SetTopPageContext,
} from "../SearchFood";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import CustomButton from "../../../../../ui/CustomButton";
import { PAGES } from "../../../../../../utils";

const FoodName = () => {
  const pushPage = useContext(PushPageContext);
  const popPage = useContext(PopPageContext);
  const setTopPage = useContext(SetTopPageContext);

  const [foodName, setFoodName] = useState("");

  const handleSearchFoodName = (foodName) => {
    // setTopPage({ name: PAGES.FOOD_NAME, foodName });
    // pushPage({ name: PAGES.NUTRITIONAL_DATA, foodName });
  };

  return (
    <>
      <Box m={5}>
        <IconButton color="primary" onClick={popPage}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={5}
      >
        <Typography variant="h4">Enter a Food Name</Typography>
        <Typography>
          Search up a product's nutritional data via its name
        </Typography>
        <Box
          width="90%"
          maxWidth="500px"
          display="flex"
          flexDirection="column"
          gap={5}
        >
          <FormControl variant="outlined">
            <InputLabel>Food Name</InputLabel>
            <OutlinedInput
              label={"Food Name"}
              type="input"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;
                handleSearchFoodName(foodName);
              }}
              variant="outlined"
              placeholder="Ex: chicken breast, raw"
              startAdornment={<SearchIcon sx={{ color: "black", pr: 1 }} />}
            />
          </FormControl>
          <CustomButton
            variant="contained"
            onClick={() => handleSearchFoodName(foodName)}
          >
            Search
          </CustomButton>
        </Box>
      </Box>
    </>
  );
};

export default FoodName;
