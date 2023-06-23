import Joi from "joi";

// enum priorityList {
//   "low",
//   "medium",
//   "high",
// }

// enum categoryList {
//   "to-do",
//   "in-progress",
//   "done",
// }

const emailRegex: RegExp =
  /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

const joiTasksSchema = Joi.object({
  title: Joi.string().min(3).max(250).required().messages({
    "any.required": "Missing required 'title' field",
    "string.min": "The length of 'title' must be between 3 and 250 characters",
    "string.max": "The length of 'title' must be between 3 and 250 characters",
  }),

  start: Joi.string()
    .required()
    .messages({ "any.required": "Missing required 'start time' field" }),

  end: Joi.string()
    .required()
    .messages({ "any.required": "Missing required 'end time' field" }),

  priority: Joi.string()
    // .valid(priorityList)
    .required()
    .messages({ "any.required": "Missing required 'priority' field" }),

  date: Joi.string()
    .required()
    .messages({ "any.required": "Missing required 'end time' field" }),

  category: Joi.string()
    // .valid(categoryList)
    .required()
    .messages({ "any.required": "Missing required 'category' field" }),
});

const joiRegisterSchema = Joi.object({
  name: Joi.string().min(2).max(35).required().messages({
    "any.required": "Missing required 'name' field",
    "string.min": "The length of 'name' must be between 2 and 35 characters",
    "string.max": "The length of 'name' must be between 2 and 35 characters",
  }),

  email: Joi.string()
    .pattern(new RegExp(emailRegex))
    .required()
    .messages({ "any.required": "Email is required" }),

  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
    "string.min": "The length of 'password' must be min 6 characters",
  }),
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
});

const joiReviewsSchema = Joi.object({
  text: Joi.string().min(2).max(3500).required().messages({
    "any.required": "Missing required 'text' field",
    "string.min": "The length of 'text' must be between 2 and 3500 characters",
    "string.max": "The length of 'text' must be between 2 and 3500 characters",
  }),

  rating: Joi.number().min(1).max(5).messages({
    "number.min": "Number of 'rating' must be between 1 and 5",
    "number.max": "Number of 'rating' must be between 1 and 5",
  }),

  // date: Joi.string()
  //   .required()
  //   .messages({ "any.required": "Missing required 'end time' field" }),
});

export { joiTasksSchema, joiRegisterSchema, joiLoginSchema, joiReviewsSchema };
