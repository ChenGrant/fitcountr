const admin = require("firebase-admin");
const auth = admin.auth();

const authenticate = async (request, response, next) => {
  const headerToken = request.headers.authorization;
  if (!headerToken) {
    return response.send({ message: "No token provided" }).status(401);
  }

  if (headerToken.split(" ")[0] !== "Bearer") {
    return response.send({ message: "Invalid token" }).status(401);
  }

  const token = headerToken.split(" ")[1];

  if (token === undefined) {
    return response.send({ message: "Invalid token" }).status(401);
  }

  try {
    const user = await auth.verifyIdToken(token);
    request.IdToken = token;
    request.user = user;
    console.log("AUTHENTICATED");
    next();
  } catch (error) {
    console.log(error.message);
    response.send({ message: "Could not authenticate" }).status(403);
  }
};

module.exports = authenticate;
