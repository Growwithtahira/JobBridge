import { User } from "../models/user.model.js";
import { Otp } from "../models/otp.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }

        const file = req.file;
        let profilePhoto = "";
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhoto = cloudResponse.secure_url;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.deleteMany({ email });

        await Otp.create({
            email,
            otp,
            userData: {
                fullname,
                email,
                phoneNumber,
                password: hashedPassword,
                role,
                profile: {
                    profilePhoto: profilePhoto,
                }
            }
        });

        const emailSent = await sendEmail({
            email,
            subject: "JobBridge Registration OTP",
            message: `Your OTP for JobBridge registration is: ${otp}. It is valid for 5 minutes.`
        });

        if (!emailSent) {
            await Otp.deleteOne({ email, otp });
            return res.status(500).json({
                message: "Failed to send OTP email. Please try again.",
                success: false
            });
        }

        return res.status(200).json({
            message: "OTP sent successfully. Please check your email.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required.",
                success: false
            });
        }

        const otpRecord = await Otp.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({
                message: "Invalid or expired OTP.",
                success: false
            });
        }

        const userData = otpRecord.userData;

        const userExists = await User.findOne({ email });
        if (userExists) {
            await Otp.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({
                message: "User already registered.",
                success: false
            });
        }

        const newUser = await User.create(userData);

        await Otp.deleteOne({ _id: otpRecord._id });

        const tokenData = {
            userId: newUser._id
        }
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        const userResponse = {
            _id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            role: newUser.role,
            profile: newUser.profile
        }

        return res.status(201).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true }).json({
            message: "Account created successfully.",
            user: userResponse,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: 'none', secure: true }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        const resumeFile = req.files && req.files['file'] ? req.files['file'][0] : null;
        const dpFile = req.files && req.files['profilePhoto'] ? req.files['profilePhoto'][0] : null;

        let cloudResponseForResume;
        let cloudResponseForDP;

        if (resumeFile) {
            const fileUri = getDataUri(resumeFile);
            cloudResponseForResume = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "raw",
                folder: "jobbridge_resumes"
            });
        }

        if (dpFile) {
            const fileUri = getDataUri(dpFile);
            cloudResponseForDP = await cloudinary.uploader.upload(fileUri.content, {
                folder: "jobbridge_dps"
            });
        }

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        if (cloudResponseForResume) {
            user.profile.resume = cloudResponseForResume.secure_url;
            user.profile.resumeOriginalName = resumeFile.originalname;
        }

        if (cloudResponseForDP) {
            user.profile.profilePhoto = cloudResponseForDP.secure_url;
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log("Update Profile Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found with this email",
                success: false
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // ✅ OTP + expiry dono save karo
        user.resetPasswordToken = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min
        user.isResetVerified = false; // ← reset flag clear karo
        await user.save();

        const emailSent = await sendEmail({
            email,
            subject: "JobBridge Password Reset OTP",
            message: `Your OTP for JobBridge password reset is: ${otp}. Valid for 10 minutes.`
        });

        if (!emailSent) {
            return res.status(500).json({
                message: "Failed to send email. Please try again.",
                success: false
            });
        }

        return res.status(200).json({
            message: `OTP sent to ${email}`,
            success: true,
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

// ✅ NEW — Yeh function pehle exist nahi karta tha, isliye OTP verify hi nahi hota tha
export const verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required.",
                success: false
            });
        }

        // ✅ 6 digit check
        if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                message: "OTP must be exactly 6 digits.",
                success: false
            });
        }

        const user = await User.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() } // ✅ Expiry check
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired OTP. Please request a new one.",
                success: false
            });
        }

        // ✅ Mark karo ki OTP verify ho gaya — ab reset allowed hai
        user.isResetVerified = true;
        await user.save();

        return res.status(200).json({
            message: "OTP verified successfully!",
            success: true
        });

    } catch (error) {
        console.error("verifyResetOtp Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters.",
                success: false
            });
        }

        const user = await User.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired OTP.",
                success: false
            });
        }

        // ✅ isResetVerified check — bina OTP verify kiye direct API call block
        if (!user.isResetVerified) {
            return res.status(403).json({
                message: "OTP not verified. Please verify OTP first.",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // ✅ Sab fields clear karo
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.isResetVerified = false;
        await user.save();

        return res.status(200).json({
            message: "Password reset successfully. Please login.",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const googleLogin = async (req, res) => {
    try {
        const { uid, email, displayName, photoURL, role } = req.body;

        if (!uid || !email) {
            return res.status(400).json({ message: "Google Auth Data Missing", success: false });
        }

        let user = await User.findOne({ email });

        if (!user) {
            if (!role) {
                return res.status(400).json({ message: "Role is required for new registration. Please Signup first.", success: false });
            }
            user = await User.create({
                fullname: displayName,
                email,
                phoneNumber: 0,
                password: "",
                role,
                profile: {
                    profilePhoto: photoURL
                },
                googleId: uid
            });
        }

        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        });

    } catch (error) {
        console.error("Google Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false, error: error.message });
    }
}
