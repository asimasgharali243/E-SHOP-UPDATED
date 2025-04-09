import Joi from "joi";

export const registerValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().min(6).max(30).required(),
    lastName: Joi.string().min(6).max(30).required(),
    userName: Joi.string().min(6).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
  });
  return schema.validate(data);
};

export const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
