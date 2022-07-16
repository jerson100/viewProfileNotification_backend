const { Schema, model } = require("mongoose");

const ActiveUserSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  room: String,
  device: String,
});

const ActiveUser = model("ActiveUser", ActiveUserSchema);

module.exports = ActiveUser;
