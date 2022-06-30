const User = require("../models/User");
const { objectIsEmpty } = require("../utils/utils");

const EMAIL_ALREADY_IN_USE = "Email already in use";

//---------------------------------- UTILS ----------------------------------
const emailInUse = async (email) =>
  (await User.countDocuments({ email: email })) !== 0;

// ------------------------------- CONTROLLERS -------------------------------
const createUser = async (req, res) => {
  const { user, signInMethod } = req.body;
  const { uid, email } = user;

  if (signInMethod === "emailPassword") {
    if (await emailInUse(email))
      return res.json({ formErrors: { email: EMAIL_ALREADY_IN_USE } });

    await User.create({ uid: uid, email: email });
    return res.json(req.body);
  }

  if (signInMethod === "gmail") {
    if (!(await emailInUse(email))) {
      await User.create({ uid: uid, email: email });
      return res.json(req.body);
    }

    return res.json({ userAlreadyCreated: true });
  }
};

module.exports = { createUser };
