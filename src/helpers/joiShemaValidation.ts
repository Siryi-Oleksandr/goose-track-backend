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

export { joiTasksSchema };
