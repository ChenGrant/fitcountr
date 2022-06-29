const User = require("../models/User");
const { objectIsEmpty } = require("../utils/utils");

//---------------------------------- UTILS ----------------------------------
const EmailInUse = async (email) =>
  (await User.countDocuments({ email: email })) !== 0;

// ------------------------------- CONTROLLERS -------------------------------
const createUser = async (req, res) => {
  const { user, signup } = req.body;
  const { uid, email } = user;

  // validate form from server side
  if (signup.method === "emailAndPassword") {
    const validateSignupForm = (email, password, confirmPassword) => {
      // do same form validation that client side does
      return {};
    };
    const errors = validateSignupForm();
    if (!objectIsEmpty(errors)) return res.json(errors);
  }

  if (await EmailInUse(email)) {
    return res.json({ email: "Email already in use" });
  }

  const newUser = await User.create({ uid: uid, email: email });

  return res.json({ uid: newUser.uid, email: newUser.email });
};

module.exports = { createUser };
