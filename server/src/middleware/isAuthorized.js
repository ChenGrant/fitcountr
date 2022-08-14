const User = require("../models/User");

const ADMIN = "ADMIN";
const PRIVATE = "PRIVATE";
const PUBLIC = "PUBLIC";

const isAuthorized = (privacyStatus = PUBLIC) => {
  return async (req, res, next) => {
    try {
      const { userUID } = req.body.user;

      if (await User.isAdmin(userUID)) return next();

      if (privacyStatus === PRIVATE && req.headerAuthUserUID === userUID)
        return next();

      if (privacyStatus === PUBLIC) return next();

      throw new Error("Not authorized");
    } catch (err) {
      console.log(err);
      return res
        .json({ error: { message: "Could not authorize" } })
        .status(403);
    }
  };
};

module.exports = { isAuthorized, ADMIN, PRIVATE, PUBLIC };
