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
import { Loader2, Eye, EyeOff } from 'lucide-react' // Re-added Eye, EyeOff
import { motion } from 'framer-motion'
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";
import AuthLayout from './AuthLayout'
import PremiumMascot from './PremiumMascot'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [authError, setAuthError] = useState(false); // To trigger shake

    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
        if (authError) setAuthError(false);
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
            setAuthError(true); // Trigger Shield Shake
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    const googleLoginHandler = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Call Backend
            const res = await axios.post(`${USER_API_END_POINT}/google`, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: "student"
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            setAuthError(true);
            toast.error(error.response?.data?.message || "Google Login Failed");
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
        <AuthLayout activeField={activeField}>
            <PremiumMascot
                currentField={activeField}
                showPassword={showPassword}
                textLength={activeField === 'email' ? input.email.length : 0}
            />
            <div className='mb-8'>
                <h1 className='text-3xl font-extrabold text-indigo-900 mb-2'>Welcome Back</h1>
                <p className='text-gray-500 font-medium'>Please login to your account</p>
            </div>

            <form onSubmit={submitHandler} className='space-y-4'>

                <div className='space-y-2'>
                    <Label className="text-gray-700 font-semibold">Email Address</Label>
                    <Input
                        type="email"
                        value={input.email}
                        name="email"
                        onChange={changeEventHandler}
                        onFocus={() => setActiveField('email')}
                        onBlur={() => setActiveField(null)}
                        placeholder="name@example.com"
                        className="h-12 bg-white border-gray-200 focus:border-primary focus:ring-primary rounded-xl"
                    />
                </div>

                <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                        <Label className="text-gray-700 font-semibold">Password</Label>
                        <Link to="/forgot-password" className='text-sm text-primary hover:text-indigo-700 font-medium hover:underline'>
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative flex items-center">
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            onFocus={() => setActiveField('password')}
                            onBlur={() => setActiveField(null)}
                            placeholder="••••••••"
                            className="h-12 bg-white border-gray-200 focus:border-primary focus:ring-primary rounded-xl"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-gray-400 hover:text-primary transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div className='flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100'>
                    <RadioGroup className="flex items-center gap-4 w-full justify-around">
                        <div className="flex items-center space-x-2">
                            <Input
                                type="radio"
                                name="role"
                                value="student"
                                checked={input.role === 'student'}
                                onChange={changeEventHandler}
                                onFocus={() => setActiveField('role')}
                                className="cursor-pointer text-primary w-5 h-5 border-gray-300 focus:ring-primary"
                            />
                            <Label className="text-gray-700 font-medium cursor-pointer">Student</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Input
                                type="radio"
                                name="role"
                                value="recruiter"
                                checked={input.role === 'recruiter'}
                                onChange={changeEventHandler}
                                onFocus={() => setActiveField('role')}
                                className="cursor-pointer text-primary w-5 h-5 border-gray-300 focus:ring-primary"
                            />
                            <Label className="text-gray-700 font-medium cursor-pointer">Recruiter</Label>
                        </div>
                    </RadioGroup>
                </div>

                <Button type="submit" className="w-full h-12 text-md font-bold bg-primary hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1">
                    {loading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : "Login to Account"}
                </Button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-400 font-bold tracking-wider">Or continue with</span>
                    </div>
                </div>

                {/* Google Button */}
                <Button type="button" onClick={googleLoginHandler} variant="outline" className="w-full h-12 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-3 transition-all hover:border-gray-300 group">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign in with Google
                </Button>

                <div className='text-center mt-6'>
                    <span className='text-gray-500 font-medium'>Don't have an account? </span>
                    <Link to="/signup" className='text-primary font-bold hover:underline transition-all'>Register Now</Link>
                </div>

            </form>
        </AuthLayout>
    )
}

export default Login