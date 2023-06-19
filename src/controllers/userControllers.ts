import { Response } from "express";

// ******************* API:  /users  ******************

//* POST /users/signup
const signup = async (_req: any, res: Response) => {
  res.status(201).json("created successfully");
};

// * exports
export { signup };
