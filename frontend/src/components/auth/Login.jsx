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
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                
                // --- ROLE BASED REDIRECT FIX ---
                if (res.data.user.role === 'recruiter') {
                    navigate("/admin/companies");
                } else {
                    navigate("/");
                }
                
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    // Agar user already logged in hai toh redirect karo
    useEffect(() => {
        if (user) {
            if (user.role === 'recruiter') {
                navigate("/admin/companies");
            } else {
                navigate("/");
            }
        }
    }, []);

    return (
        <div className='bg-black min-h-screen text-white'> {/* Poora page Black */}
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                {/* --- LOGIN BOX (Dark Gray Border) --- */}
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-800 rounded-md p-8 my-10 bg-gray-900 shadow-lg'>
                    <h1 className='font-bold text-xl mb-5 text-white'>Login</h1>
                    
                    <div className='my-2'>
                        <Label className="text-gray-300">Email</Label>
                        {/* INPUT FIX: Dark Bg, White Text */}
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="patel@gmail.com"
                            className="bg-gray-800 text-white border-gray-700 focus-visible:ring-yellow-500 placeholder-gray-500"
                        />
                    </div>

                    <div className='my-2'>
                        <Label className="text-gray-300">Password</Label>
                        {/* INPUT FIX: Dark Bg, White Text */}
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                            className="bg-gray-800 text-white border-gray-700 focus-visible:ring-yellow-500 placeholder-gray-500"
                        />
                    </div>

                    <div className='flex items-center justify-between'>
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer text-yellow-500 w-4 h-4 bg-gray-800 border-gray-600"
                                />
                                <Label className="text-gray-300">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer text-yellow-500 w-4 h-4 bg-gray-800 border-gray-600"
                                />
                                <Label className="text-gray-300">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {
                        loading 
                        ? <Button className="w-full my-4 bg-yellow-500 hover:bg-yellow-600 text-black"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> 
                        : <Button type="submit" className="w-full my-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-[0_0_10px_rgba(250,204,21,0.5)]">Login</Button>
                    }
                    
                    <span className='text-sm text-gray-400'>Don't have an account? <Link to="/signup" className='text-yellow-500 hover:underline'>Signup</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Login