const joi = require("joi");

const UserCreationSchema = joi.object({
  name: joi.string().min(2).max(20).required(),
  username: joi.string().required(),
  password: joi.string().min(9).max(25).required(),
  description: joi.string().max(300),
});

module.exports = {
  UserCreationSchema,
};
