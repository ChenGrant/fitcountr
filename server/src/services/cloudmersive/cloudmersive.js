const config = require("../../config/config");
const CloudmersiveBarcodeapiClient = require("cloudmersive-barcodeapi-client");

CloudmersiveBarcodeapiClient.ApiClient.instance.authentications[
  "Apikey"
].apiKey = config.BARCODE_API_KEY;

const apiInstance = new CloudmersiveBarcodeapiClient.BarcodeScanApi();

const scanBarcodeImageAsync = (imageFileBuffer) =>
  new Promise((res, rej) => {
    apiInstance.barcodeScanImage(imageFileBuffer, (error, data) => {
      if (error) {
        rej(error);
        return;
      }
      res(data);
    });
  });

module.exports = {
  scanBarcodeImageAsync,
};
