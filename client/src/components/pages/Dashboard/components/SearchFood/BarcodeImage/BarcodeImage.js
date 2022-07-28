import React, { useContext, useState } from "react";
import CustomButton from "../../../../../ui/CustomButton";
import Dropzone from "react-dropzone";
import { Box } from "@mui/system";
import { Card, CircularProgress, IconButton, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import ImageIcon from "@mui/icons-material/Image";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { scanBarcodeImage } from "../../../../../../utils/fetchRequestUtils";
import BarcodeConfirmPopup from "./BarcodeConfirmPopup";
import { PopPageContext, SetTopPageContext } from "../SearchFood";
import BarcodeImageErrorPopup from "./BarcodeImageErrorPopup";
import { PAGES } from "../../../../../../utils";
import useScreenSize from "../../../../../../hooks/useScreenSize";

const BarcodeImage = ({ initialFile }) => {
  const theme = useTheme();
  const { desktop } = useScreenSize();
  const setTopPage = useContext(SetTopPageContext);
  const popPage = useContext(PopPageContext);
  const [enteredDragZone, setEnteredDragZone] = useState(false);
  const [file, setFile] = useState(initialFile);
  const [fileError, setFileError] = useState(false);
  const [barcodeNumber, setBarcodeNumber] = useState(false);
  const [scanningBarcode, setScanningBarcode] = useState(false);
  const [barcodeConfirmPopupIsOpen, setBarcodeConfirmPopupIsOpen] =
    useState(false);
  const [barcodeErrorPopupIsOpen, setBarcodeErrorPopupIsOpen] = useState(false);

  const handleFileDrop = (acceptedFiles) => {
    setEnteredDragZone(false);
    setFileError(false);
    if (acceptedFiles.length === 0) {
      setFile();
      setFileError(true);
      return;
    }
    setEnteredDragZone(false);
    setFile(acceptedFiles[0]);
  };

  const handleScan = async (file) => {
    const barcodeData = await scanBarcodeImage(file);
    // const barcodeData = {
    //   BarcodeType: "UPC_A",
    //   RawText: "605388716637",
    //   Successful: true,
    // };

    if (!barcodeData.Successful) return setBarcodeErrorPopupIsOpen(true);

    setTopPage({ name: PAGES.BARCODE_IMAGE, file });
    setBarcodeConfirmPopupIsOpen(true);
    setBarcodeNumber(barcodeData.RawText);
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
        gap={desktop ? 10 : 5}
        px={desktop ? 5 : 2}
        pb={5}
      >
        <Typography variant="h4" textAlign="center">
          Upload a Barcode Image
        </Typography>
        <Box width="100%" maxWidth="1200px" bgcolor>
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
                  p: desktop ? 6 : 3,
                  borderRadius: desktop ? "50px" : "30px",
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
                  px={1}
                >
                  <ImageIcon sx={{ fontSize: "100px" }} color="primary" />
                  <Typography
                    variant="h6"
                    mt={2}
                    gutterBottom
                    textAlign="center"
                  >
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
                        <Typography>Uploaded File: {file.name}</Typography>
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
        {scanningBarcode ? (
          <CircularProgress color="primary" thickness={4} size={50} />
        ) : (
          <CustomButton
            sx={{
              width: "100%",
              maxWidth: "400px",
              visibility: (!file || fileError) && "hidden",
            }}
            variant="contained"
            onClick={async () => {
              setScanningBarcode(true);
              await handleScan(file);
              setScanningBarcode(false);
            }}
          >
            Scan
          </CustomButton>
        )}
      </Box>
      <BarcodeConfirmPopup
        barcodeNumber={barcodeNumber}
        barcodeConfirmPopupIsOpen={barcodeConfirmPopupIsOpen}
        setBarcodeConfirmPopupIsOpen={setBarcodeConfirmPopupIsOpen}
      />
      <BarcodeImageErrorPopup
        barcodeErrorPopupIsOpen={barcodeErrorPopupIsOpen}
        setBarcodeErrorPopupIsOpen={setBarcodeErrorPopupIsOpen}
      />
    </>
  );
};

export default BarcodeImage;
