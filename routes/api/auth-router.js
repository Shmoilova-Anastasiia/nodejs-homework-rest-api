const express = require("express");

const {
  signin,
  signup,
  getCurrent,
  signout,
  updateSubscription,
} = require("../../controllers/auth/index.js");

const usersSchemas = require("../../schema/users-schema.js");

const { validateBody } = require("../../decorators/index.js");

const { authenticate } = require("../../middlewares/index.js");

const authRouter = express.Router();

authRouter.post("/signup", validateBody(usersSchemas.userSignupSchema), signup);

authRouter.post("/signin", validateBody(usersSchemas.userSigninSchema), signin);

authRouter.get("/current", authenticate, getCurrent);

authRouter.post("/signout", authenticate, signout);

authRouter.patch(
  "/users",
  authenticate,
  validateBody(usersSchemas.updateSubscriptionSchema),
  updateSubscription
);

module.exports = authRouter;