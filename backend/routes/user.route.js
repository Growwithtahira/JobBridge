import express from "express";
import {
    login, logout, register, updateProfile,
    forgotPassword, resetPassword, googleLogin,
    verifyOtp, verifyResetOtp
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload, multiUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/verify-otp").post(verifyOtp);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, multiUpload, updateProfile);
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-reset-otp").post(verifyResetOtp);
router.route("/reset-password").post(resetPassword);
router.post("/google", googleLogin);

export default router;