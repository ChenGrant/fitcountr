import { Avatar } from "@mui/material";
import { FormikContext, useFormikContext } from "formik";
import React, { useRef } from "react";
import useScreenSize from "../../../hooks/useScreenSize";

const ProfilePicture = () => {
  const { desktop, tablet } = useScreenSize();
  const formik = useFormikContext(FormikContext);
  const fileRef = useRef();

  const handleFileInputChange = (e) => {
    if (e.target.files.length === 0) return;
    const newFile = e.target.files[0];
    const newURL = URL.createObjectURL(newFile);
    formik.setFieldValue("profilePicture.file", newFile);
    formik.setFieldValue("profilePicture.URL", newURL);
  };

  const profilePictureDimension = desktop ? 225 : tablet ? 200 : 150;

  return (
    <>
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileRef}
        onChange={handleFileInputChange}
      />
      <Avatar
        src={formik.values.profilePicture.URL}
        sx={{
          width: profilePictureDimension,
          height: profilePictureDimension,
          cursor: "pointer",
        }}
        onClick={() => fileRef.current.click()}
      />
    </>
  );
};

export default ProfilePicture;
