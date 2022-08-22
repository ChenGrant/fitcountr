import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, LinearProgress, Typography } from "@mui/material";
import useScreenSize from "../../../hooks/useScreenSize";
import { Form, Formik } from "formik";
import CustomCard from "../../../components/ui/CustomCard";
import ProfilePicture from "./ProfilePicture";
import ProfileInputFields from "./ProfileInputFields";
import {
  SEXES,
  MIN_HEIGHT,
  MAX_HEIGHT,
  MAX_AGE,
  DATE_FORMAT,
  objectsAreEqual,
  postProfileData,
} from "../../../utils";
import moment from "moment";
import * as Yup from "yup";
import CustomSnackbar, {
  INITIAL_SNACKBAR_STATE,
  snackbarReducer,
  SNACKBAR_ACTIONS,
} from "../../../components/ui/CustomSnackbar";
import { setUserProfile, setUserProfilePictureURL } from "../../../redux";
import {
  getFormValuesFromProfile,
  getProfileDataFromFormValues,
} from "../utils";
import PostDataButton from "../../../components/ui/PostDataButton";

// -------------------------------------- FORMIK --------------------------------------
const validationSchema = Yup.object({
  sex: Yup.string().trim().oneOf(SEXES),
  height: Yup.number()
    .nullable()
    .typeError("Height must be a number")
    .test(
      "minHeight",
      `Height must be greater than ${MIN_HEIGHT.value} ${MIN_HEIGHT.unit.symbol}`,
      (height) => height == null || height > MIN_HEIGHT.value
    )
    .test(
      "maxHeight",
      `Height must be less than ${MAX_HEIGHT.value} ${MAX_HEIGHT.unit.symbol}`,
      (height) => height == null || height < MAX_HEIGHT.value
    ),
  birthday: Yup.string()
    .trim()
    .test(
      "validDateFormat",
      `Date must be in the form ${DATE_FORMAT}`,
      (birthday) => {
        try {
          if (!birthday) return true;
          if (birthday.length !== DATE_FORMAT.length) return false;
          if (birthday.charAt(2) !== "/" || birthday.charAt(5) !== "/")
            return false;
          const day = birthday.substring(0, 2);
          const month = birthday.substring(3, 5);
          const year = birthday.substring(6);
          return !isNaN(day) && !isNaN(month) && !isNaN(year);
        } catch (err) {
          return false;
        }
      }
    )
    .test(
      "validDateString",
      "Invalid date",
      (birthday) => !birthday || moment(birthday, DATE_FORMAT, true).isValid()
    )
    .test(
      "dateHasPassed",
      "Date must be in the past",
      (birthday) =>
        !birthday || moment(birthday, DATE_FORMAT).toDate() < new Date()
    )
    .test(
      "dateIsWithinRange",
      `Date must be within ${MAX_AGE.value} ${MAX_AGE.unit.pluralName} of today`,
      (birthday) =>
        !birthday ||
        moment().diff(moment(birthday, DATE_FORMAT), "years") < MAX_AGE.value
    ),
});

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const Profile = () => {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { desktop, phone } = useScreenSize();
  const [initialFormValues, setInitialFormValues] = useState();
  const [isPostingData, setIsPostingData] = useState(false);
  const [snackbar, snackbarDispatch] = useReducer(
    snackbarReducer,
    INITIAL_SNACKBAR_STATE
  );
  const pageIsLoading = !initialFormValues || user.profilePicture.isLoading;

  // ----------------------------------- FUNCTIONS -----------------------------------
  const handleProfileDataUpdate = async (formValues) => {
    try {
      const profileData = getProfileDataFromFormValues(
        formValues,
        initialFormValues
      );

      const response = await postProfileData(user, profileData);

      if (response.error) throw new Error(response);

      snackbarDispatch({
        type: SNACKBAR_ACTIONS.SUCCESS,
        payload: { message: "Changes saved" },
      });
      setInitialFormValues(formValues);
      dispatch(setUserProfilePictureURL(formValues.profilePicture.URL));
      dispatch(setUserProfile(profileData));
    } catch (err) {
      console.log(err);
      snackbarDispatch({
        type: SNACKBAR_ACTIONS.FAILURE,
        payload: { message: "Could not save changes" },
      });
    }
  };

  // ----------------------------------- USE EFFECT -----------------------------------
  useEffect(() => {
    if (initialFormValues) return;
    setInitialFormValues(getFormValuesFromProfile(user));
  }, [user, initialFormValues]);

  // ------------------------------------- RENDER -------------------------------------
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
        p={5}
        px={!phone ? 4 : 2}
        display={pageIsLoading ? "none" : "flex"}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        pt={desktop ? "15vh" : "8vh"}
        gap={5}
      >
        <Box>
          <Typography variant="h1">Profile</Typography>
        </Box>
        <Box width="100%" maxWidth={"1000px"}>
          <CustomCard
            sx={{
              p: desktop ? 5 : 3,
              width: desktop
                ? "calc(100% - 2 * 5 * 8px)"
                : "calc(100% - 2 * 3 * 8px)",
            }}
          >
            {initialFormValues && (
              <Formik
                enableReinitialize
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                onSubmit={async (formValues) => {
                  setIsPostingData(true);
                  await handleProfileDataUpdate(formValues);
                  setIsPostingData(false);
                }}
              >
                {(formik) => (
                  <Form>
                    <Box
                      display="flex"
                      flexDirection={desktop ? "row" : "column"}
                      alignItems="center"
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        mr={desktop && 5}
                        mt={!desktop && 2}
                      >
                        <ProfilePicture />
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="column"
                        gap={desktop ? 1 : 2}
                        flex={1}
                        width={!desktop && "100%"}
                        mt={!desktop && 5}
                      >
                        <ProfileInputFields />
                        <PostDataButton
                          isPostingData={isPostingData}
                          sx={{ width: "100%" }}
                          type="submit"
                          variant="contained"
                          disabled={objectsAreEqual(
                            formik.values,
                            initialFormValues
                          )}
                        >
                          Save Profile
                        </PostDataButton>
                      </Box>
                    </Box>
                  </Form>
                )}
              </Formik>
            )}
          </CustomCard>
        </Box>
        <CustomSnackbar
          {...{
            ...snackbar,
            onClose: () => snackbarDispatch({ type: SNACKBAR_ACTIONS.CLOSE }),
          }}
        />
      </Box>
    </>
  );
};

export default Profile;
