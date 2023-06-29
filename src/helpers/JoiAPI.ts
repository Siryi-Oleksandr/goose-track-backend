import Joi from "joi";

class JoiAPI {
  private categoryType = ["to-do", "in-progress", "done"];
  private priorityType = ["low", "medium", "high"];

  private emailRegexp: RegExp =
    /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
  private dateRegexp: RegExp =
    /[1-9][0-9][0-9]{2}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])/;
  private timeRegexp: RegExp = /^([01]\d|2[0-3]):[0-5]\d$/;
  private phoneRegexp: RegExp =
    /^(\d{2})\s\((\d{3})\)\s(\d{3})\s(\d{2})\s(\d{2})$/;
  private skypeNumberRegexp: RegExp = /^\+[1-9]\d{0,2}[.-]?\d{1,14}$/;
  private birthdayRegexp: RegExp = /^\d{2}\/\d{2}\/\d{4}$/;

  //* Class methods

  public registerSchema = Joi.object({
    name: Joi.string().min(2).max(35).required().messages({
      "any.required": "Missing required 'name' field",
      "string.min": "The length of 'name' must be between 2 and 35 characters",
      "string.max": "The length of 'name' must be between 2 and 35 characters",
    }),

    email: Joi.string()
      .pattern(new RegExp(this.emailRegexp))
      .required()
      .messages({ "any.required": "Email is required" }),

    password: Joi.string().min(6).required().messages({
      "any.required": "Password is required",
      "string.min": "The length of 'password' must be min 6 characters",
    }),
  });

  public loginSchema = Joi.object({
    email: Joi.string()
      .pattern(new RegExp(this.emailRegexp))
      .required()
      .messages({ "any.required": "Email is required" }),

    password: Joi.string().min(6).required().messages({
      "any.required": "Password is required",
      "string.min": "The length of 'password' must be min 6 characters",
    }),
  });

  public refreshSchema = Joi.object({
    refreshToken: Joi.string()
      .required()
      .messages({ "any.required": "refreshToken is required" }),
  });

  public tasksSchema = Joi.object({
    title: Joi.string().min(3).max(250).required().messages({
      "any.required": "Missing required 'title' field",
      "string.min":
        "The length of 'title' must be between 3 and 250 characters",
      "string.max":
        "The length of 'title' must be between 3 and 250 characters",
    }),

    start: Joi.string()
      .pattern(new RegExp(this.timeRegexp))
      .required()
      .messages({ "any.required": "Missing required 'start time' field" }),

    end: Joi.string()
      .pattern(new RegExp(this.timeRegexp))
      .required()
      .messages({ "any.required": "Missing required 'end time' field" }),

    priority: Joi.string()
      .valid(...this.priorityType)
      .required()
      .messages({ "any.required": "Missing required 'priority' field" }),

    date: Joi.string()
      .pattern(new RegExp(this.dateRegexp))
      .required()
      .messages({ "any.required": "Missing required 'date' field" }),

    category: Joi.string()
      .valid(...this.categoryType)
      .required()
      .messages({ "any.required": "Missing required 'category' field" }),
  });

  public reviewsSchema = Joi.object({
    text: Joi.string().min(2).max(300).required().messages({
      "any.required": "Missing required 'text' field",
      "string.min": "The length of 'text' must be between 2 and 300 characters",
      "string.max": "The length of 'text' must be between 2 and 300 characters",
    }),

    rating: Joi.number().min(1).max(5).messages({
      "number.min": "Number of 'rating' must be between 1 and 5",
      "number.max": "Number of 'rating' must be between 1 and 5",
    }),

    // date: Joi.string()
    //   .required()
    //   .messages({ "any.required": "Missing required 'end time' field" }),
  });

  public updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(35).required().messages({
      "any.required": "Missing required 'name' field",
      "string.min": "The length of 'name' must be between 2 and 35 characters",
      "string.max": "The length of 'name' must be between 2 and 35 characters",
    }),

    email: Joi.string()
      .pattern(new RegExp(this.emailRegexp))
      .required()
      .messages({ "any.required": "Email is required" }),

    phone: Joi.string()
      .allow("")
      .pattern(new RegExp(this.phoneRegexp))
      .messages({
        "string.pattern.base":
          "The phone number format is incorrect. Please enter in the format 'XX (XXX) XXX XX XX'",
      }),

    skype: Joi.string()
      .allow("")
      .pattern(new RegExp(this.skypeNumberRegexp))
      .messages({
        "string.pattern.base":
          "The skype number format is incorrect. Please enter in the format +XX-XXX-XXX-XX-XX",
      }),

    birthday: Joi.string()
      .allow("")
      .pattern(new RegExp(this.birthdayRegexp))
      .messages({
        "string.pattern.base":
          "The birthday format is incorrect. Please enter in the format 25/08/2002",
      }),
  });

  public taskCategorySchema = Joi.object({
    category: Joi.string()
      .valid(...this.categoryType)
      .required()
      .messages({ "any.required": "Missing required 'category' field" }),
  });

  public userPasswordSchema = Joi.object({
    password: Joi.string().min(6).required().messages({
      "any.required": "Password is required",
      "string.min": "The length of 'password' must be min 6 characters",
    }),

    newPassword: Joi.string().min(6).required().messages({
      "any.required": "New password is required",
      "string.min": "The length of 'new password' must be min 6 characters",
    }),
  });
}

const joiAPI = new JoiAPI();

export { joiAPI };
