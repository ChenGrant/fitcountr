import {
  Avatar,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import FormikControl from "../../../components/formik/FormikControl";
import CustomButton from "../../../components/ui/CustomButton";
import CustomCard from "../../../components/ui/CustomCard";
import {
  capitalizeFirstCharacterLowercaseRest,
  errorIsRendered,
  FORM_ERROR_HEIGHT,
  sortArray,
  TIME_ZONES,
} from "../../../utils";

const SEXES = ["male", "female"];

const sexSelectOptions = SEXES.map((sex) => ({
  label: capitalizeFirstCharacterLowercaseRest(sex),
  value: sex,
}));

const initialValues = {
  sex: "",
  height: "",
};

const MAX_HEIGHT_CM = 275;
const MIN_HEIGHT_CM = 0;
const validationSchema = Yup.object({
  sex: Yup.string().required("Required").oneOf(SEXES),
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
});

const onSubmit = (values) => {
  console.log("bet");
  console.log(values);
};

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
              console.log(formik);
              return (
                <Form>
                  <Box display="flex">
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
                            errorHeight={FORM_ERROR_HEIGHT}
                          />
                        </Box>
                      </Box>
                      <Box display="flex" gap={4}>
                        <TextField label={"Birthday (DD/MM/YYYY)"} fullWidth />
                        <FormControl fullWidth>
                          <InputLabel id="measurement system">
                            Measurement System
                          </InputLabel>
                          <Select
                            label="Measurement System"
                            labelId="measurement system"
                          >
                            <MenuItem value={"metric"}>Metric</MenuItem>
                            <MenuItem value={"imperial"}>Imperial</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <FormControl fullWidth>
                        <InputLabel id="timezone">Timezone</InputLabel>
                        <Select label="Timezone" labelId="timezone">
                          {sortArray(TIME_ZONES, (item1, item2) =>
                            item1.abbreviation.localeCompare(item2.abbreviation)
                          ).map(({ abbreviation, name }) => (
                            <MenuItem key={abbreviation} value={abbreviation}>
                              {abbreviation}: {name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
