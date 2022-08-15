// ------------------------------------- getAsset -------------------------------------
const getProfilePicture = (req, res) => {
  try {
    console.log(req.headers)
    return res.json({ name: "grant" });
  } catch (err) {
    console.log(err);
    res
      .json({ error: { message: "Could not retrieve profile picture" } })
      .status(404);
  }
};

module.exports = { getProfilePicture };
