import express from "express";
import { login, logout, register, updateProfile, forgotPassword, resetPassword, googleLogin, verifyOtp } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
// 👇 Yahan singleUpload ke sath multiUpload ko bhi import kiya hai
import { singleUpload, multiUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/verify-otp").post(verifyOtp);
router.route("/login").post(login);
router.route("/logout").get(logout);

// 👇 NAYA CHANGE: Yahan singleUpload ko hata kar multiUpload laga diya hai
router.route("/profile/update").post(isAuthenticated, multiUpload, updateProfile);

router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.post("/google", googleLogin);

export default router;