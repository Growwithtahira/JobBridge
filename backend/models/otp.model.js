import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    userData: {
        type: Object, // Store all user registration details temporarily
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Data will be deleted automatically after 5 minutes (300 seconds)
    }
});

export const Otp = mongoose.model('Otp', otpSchema);
