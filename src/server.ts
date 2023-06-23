import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import mongoose from "mongoose";
// import swaggerUi from "swagger-ui-express";

const { DB_HOST = "", PORT = 3001 } = process.env;
console.log(`DB_host --> ${DB_HOST}`);
mongoose
  .connect(
    "mongodb+srv://goose-track:3JSULWxGkPXU6SvO@goosetrack.2srmvxg.mongodb.net/db-tasks?retryWrites=true&w=majority"
  )
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
