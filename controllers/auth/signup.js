const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");

const { User } = require("../../models/index.js");

const { HttpError, sendEmail } = require("../../helpers/index.js");

const { BASE_URL } = process.env;

const signup = async (req, res) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarUrl = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    verificationToken,
    subscription,
    avatarUrl,
  });
  const verifyEmail = {
    to: email,
    subject: "Сonfirm your registration",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to confirm your registration</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    // name: newUser.name,
    subscription: newUser.subscription,
    email: newUser.email,
    avatarUrl: newUser.avatarUrl,
  });
};

module.exports = signup;
