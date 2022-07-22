const fs = require("fs");
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
      console.log(err)
      return res.status(500).send(err);
    }

    res.send("File uploaded!");
  });
};

module.exports = { postBarcode };
