import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, deleteJob, updateJob } from "../controllers/job.controller.js";

const router = express.Router();  // ← pehle define karo

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(getJobById);
router.route("/update/:id").put(isAuthenticated, updateJob);
router.delete('/delete/:id', isAuthenticated, deleteJob);  // ← sirf ek baar

export default router;

