import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="bg-black min-h-screen">
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto px-4'>
                {/* Form container: Mobile pe full width, Desktop pe 1/2 */}
                <form onSubmit={submitHandler} className='w-full md:w-1/2 border border-gray-200 rounded-xl p-8 my-10 bg-grey shadow-lg'>
                    <h1 className='font-bold text-2xl mb-5 text-black'>Create Account</h1>
                    
                    <div className='my-4'>
                        <Label className="text-white-700 font-semibold">Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="Enter your full name"
                            className="text-black bg-gray-50 border-gray-300 focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    <div className='my-4'>
                        <Label className="text-white-700 font-semibold">Email Address</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="Enter your email address"
                            className="text-black bg-gray-50 border-gray-300 focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    <div className='my-4'>
                        <Label className="text-white-700 font-semibold">Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="Enter your phone number"
                            className="text-black bg-gray-50 border-gray-300 focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    <div className='my-4'>
                        <Label className="text-white-700 font-semibold">Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                            className="text-black bg-gray-50 border-gray-300 focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 my-6'>
                        <RadioGroup className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4"
                                />
                                <Label className="text-white font-medium cursor-pointer">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4"
                                />
                                <Label className="text-white font-medium cursor-pointer">Recruiter</Label>
                            </div>
                        </RadioGroup>

                        <div className='flex flex-col gap-2 w-full md:w-auto'>
                            <Label className="text-white font-semibold">Profile Photo</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer text-black bg-gray-50 border-gray-300 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200"
                            />
                        </div>
                    </div>

                    {
                        loading ? (
                            <Button className="w-full my-4 bg-yellow-500 text-black font-bold flex items-center justify-center">
                                <Loader2 className='mr-2 h-5 w-5 animate-spin' /> 
                                Please wait...
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg py-6 transition-all">
                                Signup
                            </Button>
                        )
                    }
                    
                    <div className='text-center mt-4'>
                        <span className='text-light lightgray-600'>Already have an account? </span>
                        <Link to="/login" className='text-yellow-600 font-bold hover:underline'>Login</Link>
                    </div>
                </form>
            </div>
            {/* Watermark for your brand */}
            <p className="text-center text-gray-400 text-xs pb-5">Powered by @growwithtahira</p>
        </div>
    )
}

export default Signup;