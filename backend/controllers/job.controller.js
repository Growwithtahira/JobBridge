import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";

export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experienceLevel, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || experienceLevel === undefined || !position || !companyId) {
            return res.status(400).json({ message: "Something is missing.", success: false });
        };

        // IDOR FIX: Check if the company belongs to the logged-in recruiter
        const company = await Company.findOne({ _id: companyId, userId: userId });
        if (!company) {
            return res.status(403).json({
                message: "You can only post jobs for companies you have registered.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel,
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

// Student side - Get all jobs (Public)
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({ path: "company" }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({ message: "Jobs not found.", success: false });
        };
        return res.status(200).json({ jobs, success: true });
    } catch (error) {
        console.log(error);
    }
}

// Job detail by ID
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({ path: "applications" });
        if (!job) {
            return res.status(404).json({ message: "Job not found.", success: false });
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}

// Admin (Recruiter) side - Only show jobs created by this admin
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company'
        }).sort({ createdAt: -1 });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ message: "No jobs found.", success: false });
        };
        return res.status(200).json({ jobs, success: true });
    } catch (error) {
        console.log(error);
    }
}
