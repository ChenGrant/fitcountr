import { Avatar, Typography, Box } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import FormikControl from "../../../components/formik/FormikControl";
import CustomButton from "../../../components/ui/CustomButton";
import CustomCard from "../../../components/ui/CustomCard";
import moment from "moment";
import {
  capitalizeFirstCharacterLowercaseRest,
  MAX_AGE,
  MAX_HEIGHT,
  //MEASUREMENT_SYSTEMS,
  MIN_HEIGHT,
  SEXES,
  sortArray,
  UNITS,
} from "../../../utils";
import useScreenSize from "../../../hooks/useScreenSize";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfilePictureIsLoading } from "../../../redux";
import { fetchProfileData } from "../../../utils/requestUtils";

// ---------------------------------------- FORMIK ----------------------------------------
const sexSelectOptions = sortArray(SEXES, (sex1, sex2) =>
  sex1.localeCompare(sex2)
).map((sex) => ({
  label: capitalizeFirstCharacterLowercaseRest(sex),
  value: sex,
}));

// const measurementSystemSelectOptions = sortArray(
//   MEASUREMENT_SYSTEMS,
//   (measurementSystem1, measurementSystem2) =>
//     measurementSystem1.localeCompare(measurementSystem2)
// ).map((measurementSystem) => ({
//   label: capitalizeFirstCharacterLowercaseRest(measurementSystem),
//   value: measurementSystem,
// }));

const initialValues = {
  sex: "",
  height: "",
  birthday: "",
  //measurementSystem: "",
};

const validationSchema = Yup.object({
  sex: Yup.string().trim().required("Required").oneOf(SEXES),
  height: Yup.number()
    .typeError("Height must be a number")
    .required("Required")
    .test(
      "minHeight",
      `Height must be greater than ${MIN_HEIGHT.value} ${MIN_HEIGHT.unit.abbreviation}`,
      (height) => height > MIN_HEIGHT.value
    )
    .test(
      "maxHeight",
      `Height must be less than ${MAX_HEIGHT.value} ${MAX_HEIGHT.unit.abbreviation}`,
      (height) => height < MAX_HEIGHT.value
    ),
  birthday: Yup.string()
    .trim()
    .required("Required")
    .test(
      "validDateFormat",
      "Date must be in the form DD/MM/YYYY",
      (birthday) => {
        try {
          if (birthday.length !== "DD/MM/YYYY".length) return false;
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
    .test("validDateString", "Invalid date", (birthday) =>
      moment(birthday, "DD/MM/YYYY", true).isValid()
    )
    .test(
      "dateHasPassed",
      "Date must be in the past",
      (birthday) => moment(birthday, "DD/MM/YYYY").toDate() < new Date()
    )
    .test(
      "dateIsWithinRange",
      `Date must be within ${MAX_AGE.value} ${MAX_AGE.unit.pluralName} of today`,
      (birthday) =>
        moment().diff(moment(birthday, "DD/MM/YYYY"), "years") < MAX_AGE.value
    ),
  // measurementSystem: Yup.string()
  //   .trim()
  //   .required("Required")
  //   .oneOf(MEASUREMENT_SYSTEMS),
});

const onSubmit = (values) => {
  console.log("bet");
  console.log(values);
};

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const Profile = () => {
  const { desktop, tablet, phone } = useScreenSize();
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [postingData, setPostingData] = useState(false);

  const handleProfileDataUpdate = async ({ sex, height, birthday }) => {
    const postData = {
      sex,
      height: {
        value: height,
        unit: UNITS.CENTIMETER.abbreviation,
      },
      birthday: moment(birthday, "DD/MM/YYYY").toDate(),
    };
    console.log(postData);
  };

  useEffect(() => {
    (async () => {
      const fetchedProfileData = await fetchProfileData(user);
      console.log(fetchedProfileData);
    })();
  }, [user]);

  // ------------------------------------- RENDER -------------------------------------
  return (
    <Box
      p={5}
      px={!phone ? 4 : 2}
      display="flex"
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
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (formValues, formik) => {
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
                  <Avatar
                    src={user.profilePicture.URL}
                    onLoad={() =>
                      user.profilePicture.isLoading &&
                      dispatch(setUserProfilePictureIsLoading(false))
                    }
                    sx={{
                      height: desktop ? 225 : tablet ? 200 : 150,
                      width: desktop ? 225 : tablet ? 200 : 150,
                      cursor: "pointer",
                    }}
                    onClick={() => console.log("bet")}
                  />
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={desktop ? 1 : 2}
                  flex={1}
                  width={!desktop && "100%"}
                  mt={!desktop && 5}
                >
                  {/* Sex */}
                  <Box flex={1}>
                    <FormikControl
                      control="select"
                      label="Sex"
                      name="sex"
                      options={sexSelectOptions}
                    />
                  </Box>
                  {/* Height */}
                  <Box flex={1}>
                    <FormikControl
                      control="input"
                      type="number"
                      label="Height (cm)"
                      name="height"
                      step="0.5"
                      onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                    />
                  </Box>
                  {/* Birthday */}
                  <Box flex={1}>
                    <FormikControl
                      control="input"
                      label={"Birthday (DD/MM/YYYY)"}
                      name="birthday"
                    />
                  </Box>
                  {/* Measurement System */}
                  {/* <Box flex={1}>
                    <FormikControl
                      control="select"
                      label="Measurement System"
                      name="measurementSystem"
                      options={measurementSystemSelectOptions}
                    />
                  </Box> */}
                  <CustomButton variant="contained" type="submit">
                    Save Changes
                  </CustomButton>
                </Box>
              </Box>
            </Form>
          </Formik>
        </CustomCard>
      </Box>
    </Box>
  );
};

export default Profile;
