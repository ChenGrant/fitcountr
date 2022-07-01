const admin = require("firebase-admin");
const auth = admin.auth();

const isAuthenticated = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization
    const user = await auth.verifyIdToken(idToken);
    req.headerAuthUid = user.uid;
    next();
  } catch (error) {
    return res.send({ message: "Could not authenticate" }).status(401);
  }
};

module.exports = isAuthenticated;
