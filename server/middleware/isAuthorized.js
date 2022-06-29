const PUBLIC = "PUBLIC";
const PRIVATE = "PRIVATE";
const ADMIN = "ADMIN";

const isAdmin = (uid) => {
  // check db if uid is admin
  return false;
};

const isAuthorized = (privacyStatus = PUBLIC) => {
  return (req, res, next) => {
    const { uid } = req.body;

    if (isAdmin(uid)) return next();

    if (privacyStatus === PRIVATE && req.headerAuthUid === uid) return next();

    if (privacyStatus === PUBLIC) return next();

    return res.send({ message: "Could not authorize" }).status(403);
  };
};

module.exports = { isAuthorized, ADMIN, PRIVATE, PUBLIC };
