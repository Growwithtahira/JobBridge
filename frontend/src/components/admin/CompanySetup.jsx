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
    const {singleCompany} = useSelector(store=>store.company);
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
    },[singleCompany]);

    return (
        <div>
            <Navbar />
            <div className='max-w-xl mx-auto my-10'>
                <form onSubmit={submitHandler}>
                    <div className='flex items-center gap-5 p-8'>
                      <Button onClick={() => navigate("/admin/companies")} variant="outline" className="flex items-center gap-2 text-white border-gray-700 bg-gray-800 hover:bg-gray-700">
    <ArrowLeft />
    <span>Back</span>
</Button>
                        <h1 className='font-bold text-xl'>Company Setup</h1>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
    {/* 1. Company Name */}
    <div>
        <Label className="text-white">Company Name</Label>
        <Input
            type="text"
            name="name"
            value={input.name}
            onChange={changeEventHandler}
            className="bg-gray-800 text-white border-gray-700 focus-visible:ring-yellow-500"
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
            className="bg-gray-800 text-white border-gray-700 focus-visible:ring-yellow-500"
        />
    </div>

    {/* 3. Website (Fix: Name & Value changed) */}
    <div>
        <Label className="text-white">Website</Label>
        <Input
            type="text"
            name="website"
            value={input.website}
            onChange={changeEventHandler}
            className="bg-gray-800 text-white border-gray-700 focus-visible:ring-yellow-500"
        />
    </div>

    {/* 4. Location (Fix: Name & Value changed) */}
    <div>
        <Label className="text-white">Location</Label>
        <Input
            type="text"
            name="location"
            value={input.location}
            onChange={changeEventHandler}
            className="bg-gray-800 text-white border-gray-700 focus-visible:ring-yellow-500"
        />
    </div>

    {/* 5. Logo (Fix: Restore File Input) */}
    <div>
        <Label className="text-white">Logo</Label>
        <Input
            type="file"
            accept="image/*"
            onChange={changeFileHandler}
            className="bg-gray-800 text-white border-gray-700 file:text-white file:bg-gray-700"
        />
    </div>
</div>

{/* Update Button ko bhi Yellow Theme do */}
{
    loading 
    ? <Button className="w-full my-4 bg-yellow-400 text-black"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> 
    : <Button type="submit" className="w-full my-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Update</Button>
}
                </form>
            </div>

        </div>
    )
}

export default CompanySetup