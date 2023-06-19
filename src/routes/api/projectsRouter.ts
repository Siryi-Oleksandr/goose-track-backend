import express from "express";
import {
  getProjects,
  addProject,
  getProjectById,
  removeProject,
} from "../../controllers/projectControllers";
import { isValidId, isValidBody } from "../../middlewares";
import { joiProjectsSchema } from "../../helpers";

const router = express.Router();

router.get("/", getProjects);
router.get("/:projectId", isValidId, getProjectById);
router.post("/", isValidBody(joiProjectsSchema), addProject);
router.delete("/:projectId", isValidId, removeProject);

export default router;
