import { Avatar, Typography, Box } from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import FormikControl from "../../../components/formik/FormikControl";
import CustomButton from "../../../components/ui/CustomButton";
import CustomCard from "../../../components/ui/CustomCard";
import moment from "moment";
import {
  capitalizeFirstCharacterLowercaseRest,
  errorIsRendered,
  FORM_ERROR_HEIGHT,
  sortArray,
} from "../../../utils";

const MAX_HEIGHT_CM = 275;

const MIN_HEIGHT_CM = 0;

const MAX_AGE = 130;

const SEXES = ["MALE", "FEMALE"];

const MEASUREMENT_SYSTEMS = ["METRIC", "IMPERIAL"];

const sexSelectOptions = sortArray(SEXES, (sex1, sex2) =>
  sex1.localeCompare(sex2)
).map((sex) => ({
  label: capitalizeFirstCharacterLowercaseRest(sex),
  value: sex,
}));

const measurementSystemSelectOptions = sortArray(
  MEASUREMENT_SYSTEMS,
  (measurementSystem1, measurementSystem2) =>
    measurementSystem1.localeCompare(measurementSystem2)
).map((measurementSystem) => ({
  label: capitalizeFirstCharacterLowercaseRest(measurementSystem),
  value: measurementSystem,
}));

const initialValues = {
  sex: "",
  height: "",
  birthday: "",
  measurementSystem: "",
};

const validationSchema = Yup.object({
  sex: Yup.string().trim().required("Required").oneOf(SEXES),
  height: Yup.number()
    .typeError("Height must be a number")
    .required("Required")
    .test(
      "minHeight",
      `Height must be greater than ${MIN_HEIGHT_CM} cm`,
      (height) => height > MIN_HEIGHT_CM
    )
    .test(
      "maxHeight",
      `Height must be less than ${MAX_HEIGHT_CM} cm`,
      (height) => height < MAX_HEIGHT_CM
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
      `Date must be within ${MAX_AGE} years of today`,
      (birthday) =>
        moment().diff(moment(birthday, "DD/MM/YYYY"), "years") < MAX_AGE
    ),
  measurementSystem: Yup.string()
    .trim()
    .required("Required")
    .oneOf(MEASUREMENT_SYSTEMS),
});

const onSubmit = (values) => {
  console.log("bet");
  console.log(values);
};

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const Profile = () => {
  return (
    <Box
      p={5}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      pt="15vh"
      gap={5}
    >
      <Box>
        <Typography variant="h1">Profile</Typography>
      </Box>
      <Box>
        <CustomCard sx={{ p: 5 }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => {
              return (
                <Form>
                  <Box display="flex" alignItems="center">
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      mx={5}
                      mr={10}
                    >
                      <Avatar
                        src="https://scontent.fyzd1-2.fna.fbcdn.net/v/t39.30808-6/286520406_4018635011694341_2902533533304022077_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=HSFRkbtGEfwAX-KNgfF&_nc_oc=AQlR9KHJrG8cEBH8_CPLPJF8tss0JtpVG9TClt7TaNtAoMN5TdQnBC4UaqX3_iamafmSoZ-zxiF67GieO-LMbMYl&_nc_ht=scontent.fyzd1-2.fna&oh=00_AT9G30fnfO243CbAu2wUm5qwuoaaucXjzN7iFnbcIUVGEQ&oe=62FC7F73"
                        sx={{ height: 250, width: 250, cursor: "pointer" }}
                        onClick={() => console.log("bet")}
                      />
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={1}
                      width="700px"
                    >
                      <Box display="flex" gap={4}>
                        {/* Sex */}
                        <Box
                          mb={
                            !errorIsRendered("sex", formik) && FORM_ERROR_HEIGHT
                          }
                          flex={1}
                        >
                          <FormikControl
                            control="select"
                            label="Sex"
                            name="sex"
                            options={sexSelectOptions}
                            errorHeight={FORM_ERROR_HEIGHT}
                          />
                        </Box>
                        {/* Height */}
                        <Box
                          flex={1}
                          mb={
                            !errorIsRendered("height", formik) &&
                            FORM_ERROR_HEIGHT
                          }
                        >
                          <FormikControl
                            control="input"
                            type="number"
                            label="Height (cm)"
                            name="height"
                            step="0.5"
                            onKeyDown={(e) =>
                              e.key === "Enter" && e.preventDefault()
                            }
                            errorHeight={FORM_ERROR_HEIGHT}
                          />
                        </Box>
                      </Box>
                      <Box display="flex" gap={4}>
                        {/* Birthday */}
                        <Box
                          flex={1}
                          mb={
                            !errorIsRendered("birthday", formik) &&
                            FORM_ERROR_HEIGHT
                          }
                        >
                          <FormikControl
                            control="input"
                            label={"Birthday (DD/MM/YYYY)"}
                            name="birthday"
                          />
                        </Box>
                        {/* Measurement System */}
                        <Box
                          flex={1}
                          mb={
                            !errorIsRendered("measurementSystem", formik) &&
                            FORM_ERROR_HEIGHT
                          }
                        >
                          <FormikControl
                            control="select"
                            label="Measurement System"
                            name="measurementSystem"
                            options={measurementSystemSelectOptions}
                            errorHeight={FORM_ERROR_HEIGHT}
                          />
                        </Box>
                      </Box>
                      <CustomButton variant="contained" type="submit">
                        Save Changes
                      </CustomButton>
                    </Box>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </CustomCard>
      </Box>
    </Box>
  );
};

export default Profile;
