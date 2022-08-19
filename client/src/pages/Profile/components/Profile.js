import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, LinearProgress, Typography } from "@mui/material";
import useScreenSize from "../../../hooks/useScreenSize";
import { Form, Formik } from "formik";
import CustomCard from "../../../components/ui/CustomCard";
import ProfilePicture from "./ProfilePicture";
import ProfileInputFields from "./ProfileInputFields";
import ProfileSaveButton from "./ProfileSaveButton";
import { fetchProfileData, postProfileData } from "../../../utils/requestUtils";
import {
  objectIsEmpty,
  SEXES,
  MIN_HEIGHT,
  MAX_HEIGHT,
  MAX_AGE,
  objectsAreEqual,
  UNITS,
} from "../../../utils";
import moment from "moment";
import * as Yup from "yup";
import CustomSnackbar from "../../../components/ui/CustomSnackbar";
import { setUserProfilePictureURL } from "../../../redux";

const DATE_FORMAT = "DD/MM/YYYY";

// -------------------------------------- FORMIK --------------------------------------
const validationSchema = Yup.object({
  sex: Yup.string().trim().oneOf(SEXES),
  height: Yup.number()
    .typeError("Height must be a number")
    .test(
      "minHeight",
      `Height must be greater than ${MIN_HEIGHT.value} ${MIN_HEIGHT.unit.abbreviation}`,
      (height) => !height || height > MIN_HEIGHT.value
    )
    .test(
      "maxHeight",
      `Height must be less than ${MAX_HEIGHT.value} ${MAX_HEIGHT.unit.abbreviation}`,
      (height) => !height || height < MAX_HEIGHT.value
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

// ---------------------------- SNACKBAR REDUCER CONSTANTS ----------------------------
const SNACKBAR_ACTIONS = {
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
  CLOSE: "CLOSE",
};

const INITIAL_SNACKBAR_STATE = {
  open: false,
  severity: "",
  message: "",
};

const snackbarReducer = (state, action) => {
  switch (action.type) {
    case SNACKBAR_ACTIONS.CLOSE:
      return { ...INITIAL_SNACKBAR_STATE };
    case SNACKBAR_ACTIONS.SUCCESS:
      return {
        ...state,
        open: true,
        severity: "success",
        message: "Changes saved",
      };
    case SNACKBAR_ACTIONS.FAILURE:
      return {
        ...state,
        open: true,
        severity: "error",
        message: "Could not save changes",
      };
    default:
      return state;
  }
};

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const Profile = () => {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { desktop, phone } = useScreenSize();
  const [initialFormValues, setInitialFormValues] = useState();
  const [postingData, setPostingData] = useState(false);
  const [snackbar, snackbarDispatch] = useReducer(
    snackbarReducer,
    INITIAL_SNACKBAR_STATE
  );
  const pageIsLoading = !initialFormValues || user.profilePicture.isLoading;

  // ----------------------------------- FUNCTIONS -----------------------------------
  const handleProfileDataUpdate = async (profileData) => {
    try {
      if (objectsAreEqual(initialFormValues, profileData)) return;

      const cleanedProfileData = Object.fromEntries(
        Object.entries(profileData)
          .filter(([key, value]) => {
            switch (key) {
              case "profilePicture":
                return value.file;
              default:
                return value;
            }
          })
          .map(([key, value]) => {
            switch (key) {
              case "profilePicture":
                return [key, value.file];
              case "height":
                return [key, { value, unit: UNITS.CENTIMETER }];
              case "birthday":
                return [key, moment(value, DATE_FORMAT).toDate()];
              default:
                return [key, value];
            }
          })
      );

      const response = await postProfileData(user, cleanedProfileData);

      if (response.error) throw new Error(response);

      snackbarDispatch({ type: SNACKBAR_ACTIONS.SUCCESS });
      setInitialFormValues(profileData);
      dispatch(setUserProfilePictureURL(profileData.profilePicture.URL));
    } catch (err) {
      console.log(err);
      snackbarDispatch({ type: SNACKBAR_ACTIONS.FAILURE });
    }
  };

  // ----------------------------------- USE EFFECT -----------------------------------
  useEffect(() => {
    (async () => {
      const fetchedProfileData = await fetchProfileData(user);

      const initialValues = {
        profilePicture: {
          URL: user.profilePicture.URL,
          file: null,
        },
        sex: "",
        height: "",
        birthday: "",
      };

      if (!objectIsEmpty(fetchedProfileData)) {
        Object.entries(fetchedProfileData).forEach(([key, value]) => {
          switch (key) {
            case "birthday":
              initialValues[key] = moment(value).format(DATE_FORMAT);
              break;
            case "height":
              initialValues[key] = value.value;
              break;
            default:
              initialValues[key] = value;
          }
        });
      }

      setInitialFormValues(initialValues);
    })();
  }, [user]);

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
                  setPostingData(true);
                  await handleProfileDataUpdate(formValues);
                  setPostingData(false);
                }}
              >
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
                      <ProfileSaveButton
                        {...{ postingData, initialFormValues }}
                      />
                    </Box>
                  </Box>
                </Form>
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
