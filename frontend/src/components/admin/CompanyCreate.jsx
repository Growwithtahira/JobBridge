import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const dispatch = useDispatch();
    const registerNewCompany = async () => {
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.log(error);
        }
    }
    return (
        <div className='min-h-screen bg-gradient-to-br from-white via-indigo-50 to-purple-50'>
            <Navbar />
            <div className='max-w-4xl mx-auto py-10 px-4'>
                <div className='bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8'>
                    <div className='mb-8'>
                        <h1 className='font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600'>Your Company Name</h1>
                        <p className='text-gray-500 mt-2'>What would you like to give your company name? You can change this later.</p>
                    </div>

                    <Label className="text-gray-700 font-semibold">Company Name</Label>
                    <Input
                        type="text"
                        className="my-3 bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl h-11"
                        placeholder="JobHunt, Microsoft etc."
                        onChange={(e) => setCompanyName(e.target.value)}
                    />

                    <div className='flex flex-col sm:flex-row items-center gap-4 mt-8'>
                        <Button variant="outline" onClick={() => navigate("/admin/companies")} className="w-full sm:w-auto rounded-xl border-gray-300 hover:bg-gray-100 h-11 px-8">Cancel</Button>
                        <Button onClick={registerNewCompany} className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl shadow-lg h-11 px-8">Continue</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate