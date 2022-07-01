const User = require("../models/User");

//---------------------------------- UTILS ----------------------------------
const emailInUse = async (email) =>
  (await User.countDocuments({ email: email })) !== 0;

// ------------------------------- CONTROLLERS -------------------------------
const createUser = async (req, res) => {
  try {
    const { user, signInMethod, constants } = req.body;
    const {
      EMAIL_ALREADY_IN_USE,
      GMAIL_SIGN_IN_METHOD,
      EMAIL_PASSWORD_SIGN_IN_METHOD,
    } = constants;
    const { uid, email } = user;

    if (signInMethod === EMAIL_PASSWORD_SIGN_IN_METHOD) {
      if (await emailInUse(email))
        return res.json({ formErrors: { email: EMAIL_ALREADY_IN_USE } });
      await User.create({ uid, email });
      return res.json(req.body);
    }

    if (signInMethod === GMAIL_SIGN_IN_METHOD) {
      if (!(await emailInUse(email))) await User.create({ uid, email });
      return res.json(req.body);
    }
  } catch (err) {
    return res.json({ message: "Could not create user" });
  }
};

module.exports = { createUser };
