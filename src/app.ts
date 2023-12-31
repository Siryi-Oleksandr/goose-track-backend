import express, { NextFunction, Request, Response } from "express";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import tasksRouter from "./routes/tasksRouter";
import usersRouter from "./routes/usersRouter";
import reviewsRouter from "./routes/reviewsRouter";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// *** middlewares:
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// *** main routers:
app.use("/", usersRouter);
app.use("/tasks", tasksRouter);
app.use("/reviews", reviewsRouter);
// swaggerRouter
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// *** error handlers:
app.use((_req: any, res: Response) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /",
    data: "Not found such route",
  });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({
    message,
  });
});

export default app;
