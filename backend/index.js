import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import path from "path";

dotenv.config({});

const app = express();
const __dirname = path.resolve();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'https://jobbridge-v15s.onrender.com',
    credentials: true
}
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// --- DEPLOYMENT CODE FIX START ---

// 1. Point correctly to the frontend/dist folder
// We remove "../" because __dirname is usually the root project folder
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 2. Serve the index.html file for any other requests
app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// --- DEPLOYMENT CODE FIX END ---

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});