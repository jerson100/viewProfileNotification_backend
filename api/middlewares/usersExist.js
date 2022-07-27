const UserController = require("../controllers/user.controller");
const { UserNotFound } = require("../models/User/user.exception");

const doesTheUserExist = (property = "params") => {
  return async (req, res, next) => {
    const { idUser } = req[property];
    const user = await UserController.findUser(idUser);
    if (!user) next(UserNotFound());
    next();
  };
};

module.exports = doesTheUserExist;
