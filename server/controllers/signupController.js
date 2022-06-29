const User = require("../models/User");
const { objectIsEmpty } = require("../utils/utils");

//---------------------------------- UTILS ----------------------------------
const EmailInUse = async (email) => {
  const numUsersWithSameEmail = await User.countDocuments({ email: email });
  return numUsersWithSameEmail !== 0;
};

// ------------------------------- CONTROLLERS -------------------------------
const createUser = async (req, res) => {
  const { user, signup } = req.body;
  const { uid, email } = user;

  let errors = {};

  // validate form from server side
  if (signup.method === "emailAndPassword") {
    const validateSignupForm = (email, password, confirmPassword) => {};
    errors = { ...errors, ...validateSignupForm() };
  }

  if (await EmailInUse(email)) {
    errors = { ...errors, email: "Email already in use" };
  }

  if (!objectIsEmpty(errors))
    return res.json(errors);

  const newUser = await User.create({ uid: uid, email: email });

  return res.json({ uid: newUser.uid, email: newUser.email });
};

module.exports = { createUser };
