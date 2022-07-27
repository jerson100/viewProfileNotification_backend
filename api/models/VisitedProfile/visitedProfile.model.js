const { Schema, model } = require("mongoose");

const VisitedProfileSchema = new Schema(
  {
    idVisitedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    idUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const VisitedProfile = model("VisitedProfile", VisitedProfileSchema);

module.exports = VisitedProfile;
