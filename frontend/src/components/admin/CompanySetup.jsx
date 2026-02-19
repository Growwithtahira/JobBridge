import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setInput({
            name: singleCompany.name || "",
            description: singleCompany.description || "",
            website: singleCompany.website || "",
            location: singleCompany.location || "",
            file: singleCompany.file || null
        })
    }, [singleCompany]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-white via-indigo-50 to-purple-50'>
            <Navbar />
            <div className='max-w-xl mx-auto py-10 px-4'>
                <form onSubmit={submitHandler} className='bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl overflow-hidden p-8'>
                    <div className='flex items-center gap-5 mb-8'>
                        <Button onClick={() => navigate("/admin/companies")} variant="outline" className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-100 rounded-xl">
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className='font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600'>Company Setup</h1>
                    </div>

                    <div className='space-y-4'>
                        {/* 1. Company Name */}
                        <div className='space-y-2'>
                            <Label className="text-gray-700 font-semibold">Company Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                                className="bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl"
                                placeholder="e.g. JobBridge"
                            />
                        </div>

                        {/* 2. Description */}
                        <div className='space-y-2'>
                            <Label className="text-gray-700 font-semibold">Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl"
                                placeholder="e.g. A platform for job seekers..."
                            />
                        </div>

                        {/* 3. Website */}
                        <div className='space-y-2'>
                            <Label className="text-gray-700 font-semibold">Website</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                                className="bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl"
                                placeholder="e.g. https://jobbridge.com"
                            />
                        </div>

                        {/* 4. Location */}
                        <div className='space-y-2'>
                            <Label className="text-gray-700 font-semibold">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl"
                                placeholder="e.g. New Delhi, India"
                            />
                        </div>

                        {/* 5. Logo */}
                        <div className='space-y-2'>
                            <Label className="text-gray-700 font-semibold">Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                                className="bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    {
                        loading
                            ? <Button className="w-full mt-8 h-12 bg-violet-600 text-white rounded-xl shadow-lg"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button>
                            : <Button type="submit" className="w-full mt-8 h-12 font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl shadow-lg transition-transform transform hover:-translate-y-1">Update Company</Button>
                    }
                </form>
            </div>
        </div>
    )
}

export default CompanySetup