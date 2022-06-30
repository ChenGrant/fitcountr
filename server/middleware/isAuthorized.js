const User = require("../models/User");

const PUBLIC = "PUBLIC";
const PRIVATE = "PRIVATE";
const ADMIN = "ADMIN";

const isAdmin = async (uid) => {
  const user = await User.findOne({ uid: uid });
  return user && user.isAdmin;
};

const isAuthorized = (privacyStatus = PUBLIC) => {
  return async (req, res, next) => {
    const { uid } = req.body.user;

    if (await isAdmin(uid)) return next();

    if (privacyStatus === PRIVATE && req.headerAuthUid === uid) return next();

    if (privacyStatus === PUBLIC) return next();

    return res.send({ message: "Could not authorize" }).status(403);
  };
};

module.exports = { isAuthorized, ADMIN, PRIVATE, PUBLIC };
