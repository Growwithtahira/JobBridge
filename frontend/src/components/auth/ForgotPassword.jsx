import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2, Mail, Lock, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, { email });
            if (res.data.success) {
                toast.success(res.data.message);
                setStep(2);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    }

    // Step 3: Reset Password (skipping Step 2 validation call for simplicity, logic handled in Step 3)
    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/reset-password`, { email, otp, newPassword });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-white via-indigo-50 to-purple-50 flex flex-col'>
            <Navbar />
            <div className='flex-1 flex items-center justify-center p-4'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl overflow-hidden p-8'
                >
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600'>
                            {step === 1 ? "Forgot Password?" : step === 2 ? "Enter OTP" : "Reset Password"}
                        </h1>
                        <p className='text-gray-500 mt-2 text-sm'>
                            {step === 1 ? "Enter your email to receive a verification code." :
                                step === 2 ? `Code sent to ${email}. Check your inbox!` :
                                    "Create a strong new password."}
                        </p>
                    </div>

                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className='space-y-4'>
                            <div className='space-y-2'>
                                <Label>Email Address</Label>
                                <div className='relative'>
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email ID"
                                        className="pl-10 h-12 bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl"
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full h-12 bg-primary hover:bg-violet-700 text-white rounded-xl font-bold shadow-lg shadow-violet-200 transition-all">
                                {loading ? <Loader2 className='animate-spin' /> : <span className='flex items-center gap-2'>Send OTP <ArrowRight size={18} /></span>}
                            </Button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className='space-y-4'>
                            <div className='space-y-2'>
                                <Label>Verification Code (OTP)</Label>
                                <div className='relative'>
                                    <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="e.g. 123456"
                                        className="pl-10 h-12 bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl tracking-widest text-lg font-bold text-center"
                                        required
                                    />
                                </div>
                            </div>
                            <Button onClick={() => setStep(3)} className="w-full h-12 bg-primary hover:bg-violet-700 text-white rounded-xl font-bold shadow-lg shadow-violet-200 transition-all">
                                Verify OTP
                            </Button>
                            <button onClick={() => setStep(1)} className='text-primary text-sm font-medium hover:underline w-full text-center'>Wrong Email?</button>
                        </div>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className='space-y-4'>
                            <div className='space-y-2'>
                                <Label>New Password</Label>
                                <div className='relative'>
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-10 h-12 bg-white/50 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-xl"
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 transition-all">
                                {loading ? <Loader2 className='animate-spin' /> : <span className='flex items-center gap-2'>Reset Password <CheckCircle2 size={18} /></span>}
                            </Button>
                        </form>
                    )}

                    <div className='mt-6 text-center'>
                        <Link to="/login" className='text-gray-500 text-sm hover:text-primary transition-colors'>Back to Login</Link>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;
