const express = require("express");
const UserController = require("../controllers/User.controller");
const requestValidation = require("../middlewares/requestValidation");
const schemaValidation = require("../middlewares/schemaValidation");
const { UserCreationSchema } = require("../models/User/User.validation");

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

module.exports = UserRouter;
