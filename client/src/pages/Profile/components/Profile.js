import { Avatar, Badge, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CustomCard from "../../../components/ui/CustomCard";
import CustomButton from "../../../components/ui/CustomButton";

const Profile = () => {
  return (
    <Box
      p={5}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={5}
    >
      <Box>
        <Typography variant="h1">Profile</Typography>
      </Box>
      <Box>
        <CustomCard sx={{ p: 5 }}>
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
            <Box display="flex" flexDirection="column" gap={5}>
              <TextField label={"Birthday"} />
              <Box display="flex" gap={5}>
                <TextField label={"Sex"} fullWidth />
                <TextField label={"Height"} fullWidth />
              </Box>
              <Box display="flex" gap={5}>
                <TextField label={"Timezone"} fullWidth />
                <TextField label={"Measurement System"} fullWidth />
              </Box>
              <CustomButton variant="contained" disabled>
                Save Changes
              </CustomButton>
            </Box>
          </Box>
        </CustomCard>
      </Box>
    </Box>
  );
};

export default Profile;
// <div>
//       <Typography>In App Name</Typography>
//       <Typography>pfp</Typography>
//       <Typography>height</Typography>
//       <Typography>weight</Typography>
//       <Typography>sex</Typography>
//       <Typography>bday</Typography>
//       <Typography>Time zone</Typography>
//       <Typography>units</Typography>
//       <Typography>email address for notification</Typography>
//       <Typography>Change password</Typography>
//     </div>
