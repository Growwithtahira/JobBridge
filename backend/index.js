import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config({});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration - Production Ready
const corsOptions = {
    // Render par FRONTEND_URL variable mein aapka Vercel link hona chahiye
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Root route for testing backend status
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Backend is running successfully!",
        success: true
    });
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});
