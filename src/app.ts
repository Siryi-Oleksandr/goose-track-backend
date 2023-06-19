import express, { Response } from "express";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import projectsRouter from "./routes/api/projectsRouter";
import usersRouter from "./routes/api/usersRouter";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// *** middlewares:
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// *** main routers:
app.use("/api/users", usersRouter);
app.use("/api/projects", projectsRouter);

// *** error handlers:
app.use((_req: any, res: Response) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api",
    data: "Not found",
  });
});

app.use((err: any, _req: any, res: Response, _next: any) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({
    message,
  });
});

export default app;
