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
    const [loading, setLoading]= useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company)=> company.name.toLowerCase() === value);
        setInput({...input, companyId:selectedCompany._id});
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input,{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res.data.success){
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
            <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-700 bg-gray-900 shadow-lg rounded-md text-white'>
    <div className='grid grid-cols-2 gap-2'>
        {/* 1. Title */}
        <div>
            <Label className="text-white">Title</Label>
            <Input
                type="string"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-yellow-500 my-1 bg-gray-800 text-white border-gray-700"
            />
        </div>
        
        {/* 2. Description */}
        <div>
            <Label className="text-white">Description</Label>
            <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-yellow-500 my-1 bg-gray-800 text-white border-gray-700"
            />
        </div>

        {/* 3. Requirements */}
        <div>
            <Label className="text-white">Requirements</Label>
            <Input
                type="string"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-yellow-500 my-1 bg-gray-800 text-white border-gray-700"
            />
        </div>

        {/* 4. Salary */}
        <div>
            <Label className="text-white">Salary</Label>
            <Input
                type="number"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-yellow-500 my-1 bg-gray-800 text-white border-gray-700"
            />
        </div>

        {/* 5. Location */}
        <div>
            <Label className="text-white">Location</Label>
            <Input
                type="string"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-yellow-500 my-1 bg-gray-800 text-white border-gray-700"
            />
        </div>

        {/* 6. Job Type */}
        <div>
            <Label className="text-white">Job Type</Label>
            <Input
                type="string"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-yellow-500 my-1 bg-gray-800 text-white border-gray-700"
            />
        </div>

        {/* 7. Experience */}
        <div>
            <Label className="text-white">Experience Level</Label>
            <Input
                type="string"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-yellow-500 my-1 bg-gray-800 text-white border-gray-700"
            />
        </div>

        {/* 8. Position */}
        <div>
            <Label className="text-white">No of Position</Label>
            <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-yellow-500 my-1 bg-gray-800 text-white border-gray-700"
            />
        </div>

        {/* 9. Select Company */}
        {
            companies.length > 0 && (
                <Select onValueChange={selectChangeHandler}>
                    <SelectTrigger className="w-[180px] bg-gray-800 text-white border-gray-700 focus:ring-yellow-500">
                        <SelectValue placeholder="Select a Company" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                        <SelectGroup>
                            {
                                companies.map((company) => {
                                    return (
                                        <SelectItem key={company._id} value={company?.name?.toLowerCase()} className="cursor-pointer focus:bg-gray-700 focus:text-white">
                                            {company.name}
                                        </SelectItem>
                                    )
                                })
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            )
        }
    </div> 
    
    {/* Submit Button */}
    {
        loading 
        ? <Button className="w-full my-4 bg-yellow-400 text-black"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> 
        : <Button type="submit" className="w-full my-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Post New Job</Button>
    }
    
    {
        companies.length === 0 && <p className='text-xs text-red-400 font-bold text-center my-3'>*Please register a company first, before posting a job</p>
    }
</form>
            </div>
        </div>
    )
}

export default PostJob