import React from "react";
import CustomButton from "../../../../ui/CustomButton";

const BarcodeImage = ({ popPageFromPageStack, pushPageToPageStack, PAGES }) => {
  return (
    <div>
      BarcodeImage
      <CustomButton variant="outlined" onClick={() => popPageFromPageStack()}>
        Back
      </CustomButton>
    </div>
  );
};

export default BarcodeImage;
