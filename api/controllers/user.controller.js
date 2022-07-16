const {
  AuthenticationUserException,
  UserCreateException,
} = require("../models/User/user.exception");
const User = require("../models/User/user.model");

const createUser = async ({ name, username, password, description }) => {
  const us = await User.findOne({ username });
  if (!us) {
    const newUser = await User({ name, username, password, description });
    await newUser.save();
    return {
      name: newUser.name,
      username: newUser.username,
      description: newUser.description,
    };
  } else {
    throw new UserCreateException(
      "El usuario que intenta crear ya existe, intente con otro porfavor"
    );
  }
};

const login = async (username, password) => {
  const us = await User.findOne({ username, password });
  if (!us) throw new AuthenticationUserException();
  return {
    _id: us._doc._id,
    username: us._doc.username,
  };
};

const allUsers = async () => {
  const users = await User.find();
  return users;
};

module.exports = {
  createUser,
  login,
  allUsers,
};
