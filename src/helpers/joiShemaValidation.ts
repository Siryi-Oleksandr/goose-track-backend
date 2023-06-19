import Joi from "joi";

const emailRegex: RegExp =
  /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
enum subscriptionList {
  "free",
  "pro",
  "premium",
}

const joiProjectsSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "any.required": "Missing required 'name' field",
    "string.min": "The length of 'name' must be between 3 and 100 characters",
    "string.max": "The length of 'name' must be between 3 and 100 characters",
  }),

  codeURL: Joi.string()
    .required()
    .messages({ "any.required": "Missing required 'project code' field" }),

  livePageURL: Joi.string(),

  description: Joi.string().messages({
    "string.min": "The length of 'name' must be between 30 characters",
  }),

  titleURL: Joi.string(),

  favorite: Joi.boolean(),
});

const joiUpdateStatusProjectSchema = Joi.object({
  favorite: Joi.boolean()
    .required()
    .messages({ "any.required": "missing field favorite" }),
});

const joiSignUpSchema = Joi.object({
  name: Joi.string().min(3).max(35).required().messages({
    "any.required": "Missing required 'name' field",
    "string.min": "The length of 'name' must be between 3 and 35 characters",
    "string.max": "The length of 'name' must be between 3 and 35 characters",
  }),

  email: Joi.string()
    .pattern(new RegExp(emailRegex))
    .required()
    .messages({ "any.required": "Email is required" }),

  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
    "string.min": "The length of 'password' must be min 6 characters",
  }),

  // subscription: Joi.string()
  //   .valid(...subscriptionList)
  //   .default(subscriptionList[0]),
});

const joiLoginSchema = Joi.object({
  email: Joi.string()
    .pattern(new RegExp(emailRegex))
    .required()
    .messages({ "any.required": "Email is required" }),

  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
    "string.min": "The length of 'password' must be min 6 characters",
  }),

  // token: Joi.string(),
});

const joiUpdateSubscriptionUser = Joi.object({
  subscription: Joi.string().valid(subscriptionList).required().messages({
    "any.required": "Subscription field is required",
  }),
});

export {
  joiProjectsSchema,
  joiUpdateStatusProjectSchema,
  joiSignUpSchema,
  joiLoginSchema,
  joiUpdateSubscriptionUser,
};
