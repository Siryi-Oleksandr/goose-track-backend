import { Response, Request, NextFunction } from "express";

interface Controller {
  (req: Request, res: Response): Promise<void>;
}

const controllerWrapper = (controller: Controller) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (error) {
      next(error);
    }
  };
};

export default controllerWrapper;
