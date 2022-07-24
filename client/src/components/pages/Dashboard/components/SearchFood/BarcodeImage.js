import React, { useState } from "react";
import CustomButton from "../../../../ui/CustomButton";
import Dropzone from "react-dropzone";
import { Box } from "@mui/system";
import { Card, IconButton, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import ImageIcon from "@mui/icons-material/Image";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BarcodeImage = ({ popPage, pushPage, PAGES }) => {
  const theme = useTheme();
  const [enteredDragZone, setEnteredDragZone] = useState(false);
  const [file, setFile] = useState();
  const [fileError, setFileError] = useState(false);

  const handleFileDrop = (acceptedFiles) => {
    setEnteredDragZone(false);
    setFileError(false);
    if (acceptedFiles.length === 0) {
      setFile();
      setFileError(true);
      return;
    }
    setEnteredDragZone(false);
    setFile(acceptedFiles);
  };

  return (
    <>
      <Box m={5}>
        <IconButton color="primary" onClick={() => popPage()}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={10}
      >
        <Typography variant="h4">Upload a Barcode Image</Typography>
        <Box width="80%" bgcolor>
          <Dropzone
            onDrop={handleFileDrop}
            onDragEnter={() => setEnteredDragZone(true)}
            onDragLeave={() => setEnteredDragZone(false)}
            maxFiles={1}
            accept={{ "image/png": [".png", ".jpg", ".jpeg"] }}
          >
            {({ getRootProps, getInputProps }) => (
              <Card
                sx={{
                  boxShadow: 4,
                  p: 6,
                  borderRadius: "50px",
                }}
              >
                <input {...getInputProps()} />
                <Box
                  height="300px"
                  borderRadius="20px"
                  border={`2px dashed ${theme.palette.primary.main}`}
                  bgcolor={enteredDragZone && theme.palette.primary.light}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    cursor: "pointer",
                  }}
                  {...getRootProps()}
                >
                  <ImageIcon sx={{ fontSize: "100px" }} color="primary" />
                  <Typography variant="h6" mt={2} gutterBottom>
                    Drop your image here, or{" "}
                    <Box component="span" fontWeight={600} color="primary.main">
                      browse
                    </Box>
                  </Typography>
                  <Box
                    visibility={file || fileError ? "visible" : "hidden"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                    height="50px"
                  >
                    {file && (
                      <>
                        <CheckCircleIcon sx={{ color: "green" }} />
                        <Typography>Uploaded File: {file[0].name}</Typography>
                      </>
                    )}
                    {fileError && (
                      <>
                        <ErrorIcon sx={{ color: "red" }} />
                        <Typography>Could not accept that file</Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Card>
            )}
          </Dropzone>
        </Box>
        <CustomButton
          sx={{ px: 20, visibility: (!file || fileError) && "hidden" }}
          variant="contained"
          onClick={() => console.log("scan")}
        >
          Scan
        </CustomButton>
      </Box>
    </>
  );
};

export default BarcodeImage;
