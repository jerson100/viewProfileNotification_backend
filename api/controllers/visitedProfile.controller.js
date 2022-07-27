const VisitedProfile = require("../models/VisitedProfile/visitedProfile.model");
const UserController = require("./user.controller");
const {
  Types: { ObjectId },
} = require("mongoose");

const createVisitedProfile = async (idUser, username) => {
  const visitedUser = await UserController.findUserByUsername(username);
  const newVisitedUser = await VisitedProfile({
    idUser,
    idVisitedUser: visitedUser._doc._id,
  });
  await newVisitedUser.save();
  return {
    _id: newVisitedUser._doc._id,
    idUser: newVisitedUser._doc.idUser,
    createdAt: newVisitedUser._doc.createdAt,
    visitedUser: {
      _id: visitedUser._doc._id,
      username: visitedUser._doc.username,
      name: visitedUser._doc.name,
    },
  };
};

const getUsersWhoVisitedMyProfile = async (idVisitedUser) => {
  const users = await VisitedProfile.aggregate([
    {
      $match: {
        idVisitedUser: new ObjectId(idVisitedUser),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "idUser",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
      },
    },
    {
      $project: {
        _id: 1,
        idUser: 1,
        createdAt: 1,
        visitedUser: {
          _id: "$user._id",
          name: "$user.name",
          username: "$user.username",
        },
      },
    },
  ]);
  return users;
};

module.exports = {
  getUsersWhoVisitedMyProfile,
  createVisitedProfile,
};
