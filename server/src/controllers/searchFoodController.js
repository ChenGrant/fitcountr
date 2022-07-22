const fs = require("fs");
var CloudmersiveBarcodeapiClient = require("cloudmersive-barcodeapi-client");
const defaultClient = CloudmersiveBarcodeapiClient.ApiClient.instance;
const Apikey = defaultClient.authentications["Apikey"];
Apikey.apiKey = "ed1bc5ed-4eca-4352-a9ba-99ce00116bd2";

const postBarcode = (req, res) => {
  const newpath = __dirname + "\\public\\";
  console.log(newpath);
  const file = req.files.file;
  console.log(file);
  let sampleFile = file;
  let uploadPath = newpath + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "true" });
    }

    console.log("made it");

    var apiInstance = new CloudmersiveBarcodeapiClient.BarcodeScanApi();

    var imageFile = Buffer.from(fs.readFileSync(uploadPath).buffer); // File | Image file to perform the operation on.  Common file formats such as PNG, JPEG are supported.

    var callback = function (error, data, response) {
      if (error) {
        console.error(error);
      } else {
        console.log("API called successfully. Returned data: ", data);
      }

      res.json(data);
    };
    apiInstance.barcodeScanImage(imageFile, callback);
  });
};

module.exports = { postBarcode };
