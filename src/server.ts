import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import mongoose from "mongoose";
// import swaggerUi from "swagger-ui-express";

const { DB_HOST = "", PORT = 3001 } = process.env;

mongoose
  .connect(DB_HOST)
  .then((): void => {
    console.log("Database connection successful");
    app.listen(PORT, (): void => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error: any): never => {
    console.log(error.message);
    process.exit(1); // close all package
  });
