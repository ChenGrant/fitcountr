import { Box, CircularProgress } from "@mui/material";
import React from "react";
import { objectsAreEqual } from "../../../utils";
import CustomButton from "../../../components/ui/CustomButton";
import { FormikContext, useFormikContext } from "formik";

const ProfileSaveButton = ({ postingData, initialFormValues }) => {
  const formik = useFormikContext(FormikContext);

  return (
    <Box height="56px" display="grid" sx={{ placeItems: "center" }}>
      {postingData ? (
        <CircularProgress />
      ) : (
        <CustomButton
          disabled={objectsAreEqual(formik.values, initialFormValues)}
          variant="contained"
          type="submit"
          sx={{ width: "100%" }}
        >
          Save Changes
        </CustomButton>
      )}
    </Box>
  );
};

export default ProfileSaveButton;
