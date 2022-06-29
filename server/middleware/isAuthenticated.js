const admin = require("firebase-admin");
const auth = admin.auth();

const isAuthenticated = async (req, res, next) => {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    return res.send({ message: "No token provided" }).status(401);
  }

  if (headerToken.split(" ")[0] !== "Bearer") {
    return res.send({ message: "Invalid token" }).status(401);
  }

  const idToken = headerToken.split(" ")[1];

  if (idToken === undefined) {
    return res.send({ message: "Invalid token" }).status(401);
  }

  try {
    const user = await auth.verifyIdToken(idToken);
    req.headerAuthUid = user.uid;
    next();
  } catch (error) {
    return res.send({ message: "Could not authenticate" }).status(401);
  }
};

module.exports = isAuthenticated;
