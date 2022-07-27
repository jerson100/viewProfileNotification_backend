const joi = require("joi");

const GetVisitedProfileSchema = joi.object({
  idUser: joi.string().regex(/^[a-fA-F0-9]{24}$/),
});

const CreateVisitedProfileSchema = joi.object({
  idUser: joi.string().regex(/^[a-fA-F0-9]{24}$/),
  idVisitedUser: joi.string().regex(/^[a-fA-F0-9]{24}$/),
});

module.exports = {
  GetVisitedProfileSchema,
  CreateVisitedProfileSchema,
};
