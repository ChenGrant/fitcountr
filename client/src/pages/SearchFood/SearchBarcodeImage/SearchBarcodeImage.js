import React, { useContext, useReducer, useState } from "react";
import CustomButton from "../../../components/ui/CustomButton";
import Dropzone from "react-dropzone";
import { Box } from "@mui/system";
import { Card, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import ImageIcon from "@mui/icons-material/Image";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchBarcodeImageConfirmPopup from "./SearchBarcodeImageConfirmPopup";
import { SetCurrentPageContext } from "../SearchFood";
import SearchBarcodeImageErrorPopup from "./SearchBarcodeImageErrorPopup";
import { SEARCH_FOOD_PAGES, scanBarcodeImage } from "../../../utils";
import useScreenSize from "../../../hooks/useScreenSize";
import BackArrow from "../../../components/ui/BackArrow";

// -------------------------------- CONSTANTS --------------------------------
const FILE_ACTIONS = {
  ENTER_DRAG_ZONE: "ENTER_DRAG_ZONE",
  EXIT_DRAG_ZONE: "EXIT_DRAG_ZONE",
  SET_FILE_DATA: "SET_FILE_DATA",
  SET_ERROR: "SET_ERROR",
};

const fileReducer = (state, action) => {
  switch (action.type) {
    case FILE_ACTIONS.ENTER_DRAG_ZONE:
      return { ...state, isInDragZone: true };
    case FILE_ACTIONS.EXIT_DRAG_ZONE:
      return { ...state, isInDragZone: false };
    case FILE_ACTIONS.SET_FILE_DATA:
      return { ...state, data: action.payload, error: false };
    case FILE_ACTIONS.SET_ERROR:
      return { ...state, data: null, error: action.payload };
    default:
      return state;
  }
};

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const SearchBarcodeImage = ({ initialBarcodeImageFile }) => {
  const theme = useTheme();
  const { desktop } = useScreenSize();
  const setCurrentPage = useContext(SetCurrentPageContext);
  const [file, dispatch] = useReducer(fileReducer, {
    isInDragZone: false,
    data: initialBarcodeImageFile ?? null,
    error: false,
  });
  const [barcodeNumber, setBarcodeNumber] = useState();
  const [scanningBarcode, setScanningBarcode] = useState(false);
  const [barcodeConfirmPopupIsOpen, setBarcodeConfirmPopupIsOpen] =
    useState(false);
  const [barcodeErrorPopupIsOpen, setBarcodeErrorPopupIsOpen] = useState(false);

  // ----------------------------------- FUNCTIONS -----------------------------------
  const handleFileDrop = (acceptedFiles) => {
    dispatch({ type: FILE_ACTIONS.EXIT_DRAG_ZONE });
    dispatch({ type: FILE_ACTIONS.SET_ERROR, payload: false });

    if (acceptedFiles.length === 0) {
      dispatch({ type: FILE_ACTIONS.SET_FILE_DATA, payload: null });
      dispatch({ type: FILE_ACTIONS.SET_ERROR, payload: true });
      return;
    }

    dispatch({ type: FILE_ACTIONS.SET_FILE_DATA, payload: acceptedFiles[0] });
  };

  const handleScan = async (file) => {
    const barcodeData = await scanBarcodeImage(file);

    if (!barcodeData.Successful) return setBarcodeErrorPopupIsOpen(true);

    setCurrentPage({
      name: SEARCH_FOOD_PAGES.SEARCH_BARCODE_IMAGE,
      barcodeImageFile: file,
    });
    setBarcodeConfirmPopupIsOpen(true);
    setBarcodeNumber(barcodeData.RawText);
  };

  // ------------------------------------- RENDER -------------------------------------
  console.log(file)
  return (
    <>
      <BackArrow />
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
            onDragEnter={() => dispatch({ type: FILE_ACTIONS.ENTER_DRAG_ZONE })}
            onDragLeave={() => dispatch({ type: FILE_ACTIONS.EXIT_DRAG_ZONE })}
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
                  bgcolor={file.isInDragZone && theme.palette.primary.light}
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
                    visibility={file.data || file.error ? "visible" : "hidden"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                    height="50px"
                  >
                    {file.data && (
                      <>
                        <CheckCircleIcon sx={{ color: "green" }} />
                        <Typography>Uploaded File: {file.data.name}</Typography>
                      </>
                    )}
                    {file.error && (
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
              visibility: (!file.data || file.error) && "hidden",
            }}
            variant="contained"
            onClick={async () => {
              setScanningBarcode(true);
              await handleScan(file.data);
              setScanningBarcode(false);
            }}
          >
            Scan
          </CustomButton>
        )}
      </Box>
      <SearchBarcodeImageConfirmPopup
        barcodeNumber={barcodeNumber}
        barcodeConfirmPopupIsOpen={barcodeConfirmPopupIsOpen}
        setBarcodeConfirmPopupIsOpen={setBarcodeConfirmPopupIsOpen}
      />
      <SearchBarcodeImageErrorPopup
        barcodeErrorPopupIsOpen={barcodeErrorPopupIsOpen}
        setBarcodeErrorPopupIsOpen={setBarcodeErrorPopupIsOpen}
      />
    </>
  );
};

export default SearchBarcodeImage;
