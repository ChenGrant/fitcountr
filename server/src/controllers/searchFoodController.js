const { scanBarcodeImageAsync } = require("../services/cloudmersive/cloudmersive");

const scanBarcode = async (req, res) => {
  const { barcodeImageFile } = req.files;
  const response = await scanBarcodeImageAsync(barcodeImageFile.data)
  return res.json(response);
};

module.exports = { scanBarcode };
