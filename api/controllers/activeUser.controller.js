const ActiveUser = require("../models/ActiveUser/activeUser.model");
const {
  Types: { ObjectId },
} = require("mongoose");

const createActiveUser = async (us) => {
  const newUser = await ActiveUser({ ...us });
  await newUser.save();
  return newUser;
};

const getActiveUsers = async (idUser) => {
  return await ActiveUser.aggregate([
    {
      $match: {
        idUser: {
          $ne: new ObjectId(idUser),
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "idUser",
        foreignField: "_id",
        as: "users",
      },
    },
    {
      $project: {
        _id: 1,
        device: 1,
        room: 1,
        user: {
          $arrayElemAt: [
            {
              $map: {
                input: "$users",
                as: "i",
                in: {
                  _id: "$$i._id",
                  username: "$$i.username",
                },
              },
            },
            0,
          ],
        },
      },
    },
  ]);
};

const deleteByRoomActiveUser = async (room) => {
  const deletedActiveUser = await ActiveUser.findOneAndDelete({
    room: room,
  }).populate("idUser", "_id name username");
  return {
    _id: deletedActiveUser._doc._id,
    user: { ...deletedActiveUser._doc.idUser._doc },
    room: room,
  };
};

module.exports = {
  getActiveUsers,
  createActiveUser,
  deleteByRoomActiveUser,
};
