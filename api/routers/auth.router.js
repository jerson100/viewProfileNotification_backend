const express = require("express");
const requestValidation = require("../middlewares/requestValidation");
const UserController = require("../controllers/user.controller");
const AuthRouter = express.Router();

AuthRouter.post(
  "/login",
  requestValidation(async (req, res) => {
    const { username, password } = req.body;
    const user = await UserController.login(username, password);
    console.log("se autentico el usuario");
    res.status(200).json({
      data: user,
    });
  })
);

module.exports = AuthRouter;
