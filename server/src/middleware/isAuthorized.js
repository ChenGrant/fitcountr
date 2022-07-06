const User = require("../models/User");

const ADMIN = "ADMIN";
const PRIVATE = "PRIVATE";
const PUBLIC = "PUBLIC";

const isAuthorized = (privacyStatus = PUBLIC) => {
  return async (req, res, next) => {
    try {
      const { uid } = req.body.user;

      if (await User.isAdmin(uid)) return next();

      if (privacyStatus === PRIVATE && req.headerAuthUid === uid) return next();

      if (privacyStatus === PUBLIC) return next();

      throw new Error("Not authorized");
    } catch (err) {
      return res.send({ message: "Could not authorize" }).status(403);
    }
  };
};

module.exports = { isAuthorized, ADMIN, PRIVATE, PUBLIC };