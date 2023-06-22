import Joi from "joi";

const categoryType = ["to-do", "in-progress", "done"];
const priorityType = ["low", "medium", "high"];

const emailRegexp: RegExp =
  /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
const dateRegexp: RegExp =
  /[1-9][0-9][0-9]{2}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])/;
const timeRegexp: RegExp = /^([01]\d|2[0-3]):[0-5]\d$/;

const joiTasksSchema = Joi.object({
  title: Joi.string().min(3).max(250).required().messages({
    "any.required": "Missing required 'title' field",
    "string.min": "The length of 'title' must be between 3 and 250 characters",
    "string.max": "The length of 'title' must be between 3 and 250 characters",
  }),

  start: Joi.string()
    .pattern(new RegExp(timeRegexp))
    .required()
    .messages({ "any.required": "Missing required 'start time' field" }),

  end: Joi.string()
    .pattern(new RegExp(timeRegexp))
    .required()
    .messages({ "any.required": "Missing required 'end time' field" }),

  priority: Joi.string()
    .valid(...priorityType)
    .required()
    .messages({ "any.required": "Missing required 'priority' field" }),

  date: Joi.string()
    .pattern(new RegExp(dateRegexp))
    .required()
    .messages({ "any.required": "Missing required 'end time' field" }),

  category: Joi.string()
    .valid(...categoryType)
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
    .pattern(new RegExp(emailRegexp))
    .required()
    .messages({ "any.required": "Email is required" }),

  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
    "string.min": "The length of 'password' must be min 6 characters",
  }),
});

const joiLoginSchema = Joi.object({
  email: Joi.string()
    .pattern(new RegExp(emailRegexp))
    .required()
    .messages({ "any.required": "Email is required" }),

  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
    "string.min": "The length of 'password' must be min 6 characters",
  }),
});

export { joiTasksSchema, joiRegisterSchema, joiLoginSchema };
