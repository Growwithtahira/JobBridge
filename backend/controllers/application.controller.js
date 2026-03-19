import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// Student job apply karega
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({ message: "Job id is required.", success: false });
        };

        // Check if the user has already applied
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job.", success: false });
        }

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }

        // Create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({ message: "Job applied successfully.", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Student apni saari applied jobs dekhega
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'company',
                    options: { sort: { createdAt: -1 } },
                }
            });

        if (!application || application.length === 0) {
            return res.status(404).json({ message: "No Applications found.", success: false });
        };

        return res.status(200).json({ application, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// Admin (Recruiter) applicants dekhega - IDOR FIX ✅
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id; // Logged-in recruiter ID

        // 1. Job find karo aur check karo ki created_by recruiter hi hai ya nahi
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: { path: 'applicant' }
        });

        if (!job) {
            return res.status(404).json({ message: 'Job not found.', success: false });
        };

        // IDOR PROTECTION: Only the person who created the job can see applicants
        if (job.created_by.toString() !== userId) {
            return res.status(403).json({
                message: "Unauthorized! Aap sirf apni jobs ke applicants dekh sakte hain.",
                success: false
            });
        }

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// Update Status (Accepted/Rejected) - IDOR FIX ✅
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        const userId = req.id;

        if (!status) {
            return res.status(400).json({ message: 'Status is required', success: false });
        };

        // 1. Application dhundho aur uski Job details bhi nikalo (created_by check karne ke liye)
        const application = await Application.findById(applicationId).populate('job');

        if (!application) {
            return res.status(404).json({ message: "Application not found.", success: false });
        };

        // IDOR PROTECTION: Check if the recruiter updating the status actually owns the job
        if (application.job.created_by.toString() !== userId) {
            return res.status(403).json({
                message: "Unauthorized! Aap kisi aur ki job ke applications manage nahi kar sakte.",
                success: false
            });
        }

        // 2. Update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({ message: "Status updated successfully.", success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}