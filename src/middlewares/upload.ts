import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";
import { HttpError } from "../helpers";

const tempDir = path.resolve("temp");

const storage = multer.diskStorage({
  destination: tempDir,
  filename: function (req: any, file, cb) {
    const { _id } = req.user;
    const newName = `${_id}-${file.originalname}`;
    cb(null, newName);
  },
});

// set limit for files
const limits = {
  fileSize: 2 * 1024 * 1024, // 2 Mb
};

// Only JPEG, PNG, and GIF images are allowed
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  // Check if the file MIME type is in the accepted image types
  const acceptedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  if (acceptedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new HttpError(400, "Unsupported file type") as any, false); // Reject the file
  }
};

const upload = multer({ storage, limits, fileFilter });

export default upload;
