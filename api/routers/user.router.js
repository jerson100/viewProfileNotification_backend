const express = require("express");
const UserController = require("../controllers/User.controller");
const VisitedProfileController = require("../controllers/visitedProfile.controller");
const requestValidation = require("../middlewares/requestValidation");
const schemaValidation = require("../middlewares/schemaValidation");
const doesTheUserExist = require("../middlewares/usersExist");
const { UserCreationSchema } = require("../models/User/User.validation");
const {
  GetVisitedProfileSchema,
  CreateVisitedProfileSchema,
} = require("../models/VisitedProfile/visitedProfile.validation");

const UserRouter = express.Router();

UserRouter.post(
  "/",
  schemaValidation(UserCreationSchema, "body"),
  requestValidation(async (req, res) => {
    const newUser = await UserController.createUser({ ...req.body });
    res.json({
      data: newUser,
    });
  })
);

UserRouter.post(
  "/:idUser/visitedprofile/:idVisitedUser",
  schemaValidation(CreateVisitedProfileSchema, "params"),
  doesTheUserExist(),
  requestValidation(async (req, res, next) => {
    const { idUser, idVisietdUser } = req.params;
    const visitedUs = await VisitedProfileController.createVisitedProfile(
      idUser,
      idVisietdUser
    );
    res.json({
      data: visitedUs,
    });
  })
);

UserRouter.get(
  "/:idUser/visitedprofile",
  schemaValidation(GetVisitedProfileSchema, "params"),
  doesTheUserExist(),
  requestValidation(async (req, res) => {
    const { idUser } = req.params;
    const users = await VisitedProfileController.getUsersWhoVisitedMyProfile(
      idUser
    );
    res.json({ data: users });
  })
);

module.exports = UserRouter;
