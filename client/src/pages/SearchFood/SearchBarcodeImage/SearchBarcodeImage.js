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
const BARCODE_ACTIONS = {
  ENTER_DRAG_ZONE: "ENTER_DRAG_ZONE",
  EXIT_DRAG_ZONE: "EXIT_DRAG_ZONE",
  SET_FILE: "SET_FILE",
  SET_FILE_ERROR: "SET_FILE_ERROR",
  SET_NUMBER: "SET_NUMBER",
  START_SCANNING: "START_SCANNING",
  END_SCANNING: "END_SCANNING",
};

const fileReducer = (state, action) => {
  switch (action.type) {
    case BARCODE_ACTIONS.ENTER_DRAG_ZONE:
      return { ...state, isInDragZone: true };
    case BARCODE_ACTIONS.EXIT_DRAG_ZONE:
      return { ...state, isInDragZone: false };
    case BARCODE_ACTIONS.SET_FILE:
      return { ...state, file: action.payload, fileError: false };
    case BARCODE_ACTIONS.SET_FILE_ERROR:
      return { ...state, file: null, fileError: action.payload };
    case BARCODE_ACTIONS.SET_NUMBER:
      return { ...state, number: action.payload, numberError: false };
    case BARCODE_ACTIONS.START_SCANNING:
      return { ...state, scanning: true };
    case BARCODE_ACTIONS.END_SCANNING:
      return { ...state, scanning: false };
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
  const [barcode, dispatch] = useReducer(fileReducer, {
    isInDragZone: false,
    file: initialBarcodeImageFile ?? null,
    fileError: false,
    number: null,
    scanning: false,
  });
  const [barcodeConfirmPopupIsOpen, setBarcodeConfirmPopupIsOpen] =
    useState(false);
  const [barcodeErrorPopupIsOpen, setBarcodeErrorPopupIsOpen] = useState(false);

  // ----------------------------------- FUNCTIONS -----------------------------------
  const handleFileDrop = (acceptedFiles) => {
    dispatch({ type: BARCODE_ACTIONS.EXIT_DRAG_ZONE });
    dispatch({ type: BARCODE_ACTIONS.SET_FILE_ERROR, payload: false });

    if (acceptedFiles.length === 0) {
      dispatch({ type: BARCODE_ACTIONS.SET_FILE, payload: null });
      dispatch({ type: BARCODE_ACTIONS.SET_FILE_ERROR, payload: true });
      return;
    }

    dispatch({ type: BARCODE_ACTIONS.SET_FILE, payload: acceptedFiles[0] });
  };

  const handleScan = async (file) => {
    const barcodeData = await scanBarcodeImage(file);

    if (!barcodeData.Successful) return setBarcodeErrorPopupIsOpen(true);

    setCurrentPage({
      name: SEARCH_FOOD_PAGES.SEARCH_BARCODE_IMAGE,
      barcodeImageFile: file,
    });
    setBarcodeConfirmPopupIsOpen(true);
    dispatch({
      type: BARCODE_ACTIONS.SET_NUMBER,
      payload: barcodeData.RawText,
    });
  };

  // ------------------------------------- RENDER -------------------------------------
  console.log(barcode);
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
            onDragEnter={() =>
              dispatch({ type: BARCODE_ACTIONS.ENTER_DRAG_ZONE })
            }
            onDragLeave={() =>
              dispatch({ type: BARCODE_ACTIONS.EXIT_DRAG_ZONE })
            }
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
                  bgcolor={barcode.isInDragZone && theme.palette.primary.light}
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
                    visibility={
                      barcode.file || barcode.fileError ? "visible" : "hidden"
                    }
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                    height="50px"
                  >
                    {barcode.file && (
                      <>
                        <CheckCircleIcon sx={{ color: "green" }} />
                        <Typography>
                          Uploaded File: {barcode.file.name}
                        </Typography>
                      </>
                    )}
                    {barcode.fileError && (
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
        {barcode.scanning ? (
          <CircularProgress color="primary" thickness={4} size={50} />
        ) : (
          <CustomButton
            sx={{
              width: "100%",
              maxWidth: "400px",
              visibility: (!barcode.file || barcode.fileError) && "hidden",
            }}
            variant="contained"
            onClick={async () => {
              dispatch({ type: BARCODE_ACTIONS.START_SCANNING });
              await handleScan(barcode.file);
              dispatch({ type: BARCODE_ACTIONS.END_SCANNING });
            }}
          >
            Scan
          </CustomButton>
        )}
      </Box>
      <SearchBarcodeImageConfirmPopup
        barcodeNumber={barcode.number}
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
