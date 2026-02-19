import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const companyArray = [];

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        setInput({ ...input, companyId: selectedCompany._id });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-white via-indigo-50 to-purple-50'>
            <Navbar />
            <div className='flex items-center justify-center w-full py-10 px-4'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl w-full bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl text-gray-800'>

                    <div className='mb-6 text-center md:text-left'>
                        <h2 className='text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600'>Post a New Job</h2>
                        <p className='text-gray-500 mt-1'>Fill in the details to find your next great hire.</p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* 1. Title */}
                        <div className='space-y-2'>
                            <Label className="text-gray-700 font-semibold">Job Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl"
                                placeholder="e.g. Senior React Developer"
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
                                placeholder="Brief job description..."
                            />
                        </div>

                        {/* 3. Requirements */}
                        <div className='space-y-2'>
                            <Label className="text-gray-700 font-semibold">Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl"
                                placeholder="React, Node.js, MongoDB..."
                            />
                        </div>

                        {/* 4. Salary */}
                        <div className='space-y-2'>
                            <Label className="text-gray-700 font-semibold">Salary (LPA)</Label>
                            <Input
                                type="number"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl"
                                placeholder="e.g. 12"
                            />
                        </div>

                        {/* 5. Location */}
                        <div className='space-y-2'>
                            <Label className="text-gray-700 font-semibold">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl"
                                placeholder="e.g. Bangalore, Remote"
                            />
                        </div>

                        {/* 6. Job Type */}
                        <div className='space-y-2'>
                            <Label className="text-gray-700 font-semibold">Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl"
                                placeholder="e.g. Full-time, Internship"
                            />
                        </div>

                        {/* 7. Experience */}
                        <div className='space-y-2'>
                            <Label className="text-gray-700 font-semibold">Experience Level</Label>
                            <Input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                className="bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl"
                                placeholder="e.g. 2-5 Years"
                            />
                        </div>

                        {/* 8. Position */}
                        <div className='space-y-2'>
                            <Label className="text-gray-700 font-semibold">No of Positions</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl"
                                placeholder="e.g. 5"
                            />
                        </div>

                        {/* 9. Select Company */}
                        {
                            companies.length > 0 && (
                                <div className='space-y-2'>
                                    <Label className="text-gray-700 font-semibold">Select Company</Label>
                                    <Select onValueChange={selectChangeHandler}>
                                        <SelectTrigger className="w-full bg-white/50 border-gray-200 focus:ring-violet-500 rounded-xl text-gray-800">
                                            <SelectValue placeholder="Select a Company" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-gray-200 text-gray-800 shadow-xl rounded-xl">
                                            <SelectGroup>
                                                {
                                                    companies.map((company) => {
                                                        return (
                                                            <SelectItem key={company._id} value={company?.name?.toLowerCase()} className="cursor-pointer hover:bg-violet-50 focus:bg-violet-50 focus:text-violet-700">
                                                                {company.name}
                                                            </SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        }
                    </div>

                    {/* Submit Button */}
                    {
                        loading
                            ? <Button className="w-full mt-8 h-12 bg-violet-600 text-white rounded-xl shadow-lg"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button>
                            : <Button type="submit" className="w-full mt-8 h-12 font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl shadow-lg transition-transform transform hover:-translate-y-1">Post New Job</Button>
                    }

                    {
                        companies.length === 0 && <p className='text-xs text-red-500 font-bold text-center mt-3'>*Please register a company first, before posting a job</p>
                    }
                </form>
            </div>
        </div>
    )
}

export default PostJob