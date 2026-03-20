import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Job } from "../models/job.model.js"; // ← top pe import add karo

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({ message: "Company name is required.", success: false });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({ message: "You can't register same company.", success: false });
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId });
        if (!companies || companies.length === 0) {
            return res.status(404).json({ message: "Companies not found.", success: false });
        }
        return res.status(200).json({ companies, success: true });
    } catch (error) {
        console.log(error);
    }
}

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({ message: "Company not found.", success: false });
        }

        // IDOR FIX: Check if the logged-in user owns this company
        if (company.userId.toString() !== req.id) {
            return res.status(403).json({
                message: "Unauthorized access to this company.",
                success: false
            });
        }

        return res.status(200).json({ company, success: true });
    } catch (error) {
        console.log(error);
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const companyId = req.params.id;

        // IDOR FIX: First check if company exists and belongs to the user
        let company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found.", success: false });
        }

        if (company.userId.toString() !== req.id) {
            return res.status(403).json({
                message: "You are not authorized to update this company.",
                success: false
            });
        }

        let logo;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        const updateData = { name, description, website, location, ...(logo && { logo }) };

        const updatedCompany = await Company.findByIdAndUpdate(companyId, updateData, { new: true });

        return res.status(200).json({
            message: "Company information updated.",
            company: updatedCompany,
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}

export const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id)

        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" })
        }

        if (company.userId.toString() !== req.id) {
            return res.status(403).json({ success: false, message: "Not authorized" })
        }

        // ✅ Pehle company ki saari jobs delete karo
        await Job.deleteMany({ company: req.params.id })

        // ✅ Phir company delete karo
        await Company.findByIdAndDelete(req.params.id)

        return res.status(200).json({
            success: true,
            message: "Company and all its jobs deleted successfully"
        })
    } catch (error) {
        console.log("Delete Company Error:", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}