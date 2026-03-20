import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
    Loader2, Mail, Lock, KeyRound, ArrowRight,
    CheckCircle2, Eye, EyeOff, RefreshCw, ShieldCheck, AlertCircle
} from 'lucide-react';
import OtpInput from './OtpInput'
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';



// ── Step dots ──────────────────────────────────────────────────────────────────
const StepDots = ({ current }) => (
    <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
                <motion.div
                    animate={s === current
                        ? { width: 24, background: '#6A38C2' }
                        : s < current
                            ? { width: 10, background: '#10b981' }
                            : { width: 10, background: '#e5e7eb' }}
                    className="h-2 rounded-full"
                    transition={{ duration: 0.3 }}
                />
                {s < 3 && <div className="w-4 h-px bg-gray-200" />}
            </div>
        ))}
    </div>
)

// ── Password strength ──────────────────────────────────────────────────────────
const getStrength = (pwd) => {
    if (!pwd) return null
    let s = 0
    if (pwd.length >= 6) s++
    if (pwd.length >= 10) s++
    if (/[A-Z]/.test(pwd)) s++
    if (/[0-9]/.test(pwd)) s++
    if (/[^A-Za-z0-9]/.test(pwd)) s++
    if (s <= 1) return { label: 'Weak', color: 'bg-red-400', text: 'text-red-500', width: '20%' }
    if (s <= 2) return { label: 'Fair', color: 'bg-amber-400', text: 'text-amber-500', width: '50%' }
    if (s <= 3) return { label: 'Good', color: 'bg-blue-400', text: 'text-blue-500', width: '70%' }
    return { label: 'Strong', color: 'bg-green-500', text: 'text-green-600', width: '100%' }
}

// ── Main Component ─────────────────────────────────────────────────────────────
const ForgotPassword = () => {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [otp, setOtp] = useState('')
    const [otpError, setOtpError] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPwd, setConfirmPwd] = useState('')
    const [showPwd, setShowPwd] = useState(false)
    const [resendTimer, setResendTimer] = useState(0)
    const [otpVerified, setOtpVerified] = useState(false)  // ← guard for step 3
    const navigate = useNavigate()
    const strength = getStrength(newPassword)

    // Resend countdown
    useEffect(() => {
        if (resendTimer <= 0) return
        const t = setInterval(() => setResendTimer(s => s - 1), 1000)
        return () => clearInterval(t)
    }, [resendTimer])

    // ── Step 1: Send OTP ───────────────────────────────────────────────────────
    const handleSendOtp = async (e) => {
        e.preventDefault()
        if (!email.trim()) { setEmailError('Email is required'); return }
        if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Enter a valid email address'); return }
        setEmailError('')
        try {
            setLoading(true)
            const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, { email })
            if (res.data.success) {
                toast.success(res.data.message || 'OTP sent to your email!')
                setOtp('')
                setOtpVerified(false)
                setResendTimer(60)
                setStep(2)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    // ── Step 2: Verify OTP (ACTUAL API CALL) ──────────────────────────────────
    const handleVerifyOtp = async (e) => {
        e.preventDefault()

        // Frontend guards
        if (!otp || otp.trim().length === 0) {
            setOtpError('Please enter the OTP'); return
        }
        if (otp.length !== 6) {
            setOtpError('OTP must be exactly 6 digits'); return
        }
        if (!/^\d{6}$/.test(otp)) {
            setOtpError('OTP must contain only numbers'); return
        }
        setOtpError('')

        try {
            setLoading(true)
            // ✅ ACTUAL API CALL — OTP backend pe verify hoga
            const res = await axios.post(`${USER_API_END_POINT}/verify-reset-otp`, {
                email,
                otp
            })
            if (res.data.success) {
                setOtpVerified(true)  // ← mark as verified
                toast.success('OTP verified successfully!')
                setStep(3)           // ← sirf tabhi Step 3 pe jao
            }
        } catch (err) {
            // Backend se aaya error dikhao (expired, invalid, etc.)
            setOtpError(err.response?.data?.message || 'Invalid or expired OTP')
            toast.error(err.response?.data?.message || 'Invalid OTP')
        } finally {
            setLoading(false)
        }
    }

    // ── Resend OTP ─────────────────────────────────────────────────────────────
    const handleResend = async () => {
        if (resendTimer > 0) return
        try {
            setLoading(true)
            const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, { email })
            if (res.data.success) {
                setOtp('')
                setOtpError('')
                setResendTimer(60)
                toast.success('New OTP sent!')
            }
        } catch (err) {
            toast.error('Failed to resend OTP')
        } finally {
            setLoading(false)
        }
    }

    // ── Step 3: Reset Password ─────────────────────────────────────────────────
    const handleResetPassword = async (e) => {
        e.preventDefault()

        // ✅ Guard — Step 3 direct access block karo
        if (!otpVerified) {
            toast.error('Please verify your OTP first')
            setStep(2)
            return
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters'); return
        }
        if (newPassword !== confirmPwd) {
            toast.error('Passwords do not match'); return
        }

        try {
            setLoading(true)
            const res = await axios.post(`${USER_API_END_POINT}/reset-password`, {
                email,
                otp,          // backend pe ek baar aur verify hoga
                newPassword
            })
            if (res.data.success) {
                toast.success(res.data.message || 'Password reset successfully!')
                navigate('/login')
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reset password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden"
                >
                    {/* Top accent */}
                    <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #6A38C2, #8B5CF6, #a78bfa)' }} />

                    <div className="p-8">
                        {/* Step dots */}
                        <StepDots current={step} />

                        {/* Header */}
                        <div className="text-center mb-7">
                            <motion.div
                                key={step}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mx-auto mb-4"
                            >
                                {step === 1 && <Mail size={26} className="text-primary" strokeWidth={1.5} />}
                                {step === 2 && <KeyRound size={26} className="text-primary" strokeWidth={1.5} />}
                                {step === 3 && <Lock size={26} className="text-primary" strokeWidth={1.5} />}
                            </motion.div>
                            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                {step === 1 ? 'Forgot Password?' : step === 2 ? 'Verify OTP' : 'New Password'}
                            </h1>
                            <p className="text-gray-400 text-sm mt-1 font-medium">
                                {step === 1 && 'Enter your email to receive a verification code'}
                                {step === 2 && <>Code sent to <span className="font-bold text-gray-700">{email}</span></>}
                                {step === 3 && 'Create a strong new password'}
                            </p>
                        </div>

                        {/* ── STEP 1: Email ──────────────────────────────────── */}
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.form key="step1"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
                                    onSubmit={handleSendOtp} className="space-y-4"
                                >
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                            <Mail size={11} className="text-primary" /> Email Address
                                        </Label>
                                        <Input
                                            type="email" value={email}
                                            onChange={e => { setEmail(e.target.value); setEmailError('') }}
                                            placeholder="you@email.com"
                                            className={`h-11 rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm ${emailError ? 'border-red-300' : ''}`}
                                        />
                                        {emailError && (
                                            <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
                                                <AlertCircle size={11} /> {emailError}
                                            </p>
                                        )}
                                    </div>
                                    <Button type="submit" disabled={loading}
                                        className="w-full h-12 font-bold bg-primary hover:bg-violet-700 text-white rounded-xl shadow-md shadow-purple-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm">
                                        {loading
                                            ? <><Loader2 size={16} className="animate-spin" /> Sending OTP…</>
                                            : <>Send OTP <ArrowRight size={15} /></>}
                                    </Button>
                                </motion.form>
                            )}

                            {/* ── STEP 2: OTP Verify ──────────────────────────── */}
                            {step === 2 && (
                                <motion.form key="step2"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
                                    onSubmit={handleVerifyOtp} className="space-y-5"
                                >
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center block">
                                            Enter 6-digit OTP
                                        </Label>
                                        {/* ✅ Individual digit boxes */}
                                        <OtpInput value={otp} onChange={(val) => { setOtp(val); setOtpError('') }} />
                                        <AnimatePresence>
                                            {otpError && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                    className="flex items-center justify-center gap-1.5 text-xs text-red-500 font-semibold text-center"
                                                >
                                                    <AlertCircle size={12} /> {otpError}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* ✅ Verify button — API call hogi */}
                                    <Button type="submit"
                                        disabled={loading || otp.length !== 6}
                                        className="w-full h-12 font-bold bg-primary hover:bg-violet-700 text-white rounded-xl shadow-md shadow-purple-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading
                                            ? <><Loader2 size={16} className="animate-spin" /> Verifying…</>
                                            : <><ShieldCheck size={15} /> Verify OTP</>}
                                    </Button>

                                    {/* Resend */}
                                    <div className="text-center space-y-2">
                                        <p className="text-xs text-gray-400">Didn't receive the code?</p>
                                        <button type="button" onClick={handleResend} disabled={resendTimer > 0}
                                            className={`flex items-center gap-1.5 mx-auto text-xs font-bold transition-colors
                                                ${resendTimer > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:text-violet-700'}`}>
                                            <RefreshCw size={12} />
                                            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                                        </button>
                                    </div>

                                    <button type="button" onClick={() => { setStep(1); setOtp(''); setOtpError('') }}
                                        className="w-full text-xs text-gray-400 hover:text-gray-600 font-semibold transition-colors">
                                        ← Wrong email? Change it
                                    </button>
                                </motion.form>
                            )}

                            {/* ── STEP 3: New Password ─────────────────────────── */}
                            {step === 3 && (
                                <motion.form key="step3"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
                                    onSubmit={handleResetPassword} className="space-y-4"
                                >
                                    {/* ✅ Verified badge */}
                                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl">
                                        <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />
                                        <p className="text-xs font-semibold text-green-700">OTP verified successfully</p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                            <Lock size={11} className="text-primary" /> New Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                type={showPwd ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                placeholder="Min 6 characters"
                                                className="h-11 rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm pr-11"
                                            />
                                            <button type="button" onClick={() => setShowPwd(s => !s)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                                                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {/* Strength bar */}
                                        {newPassword && strength && (
                                            <div className="mt-1.5">
                                                <div className="flex justify-between mb-1">
                                                    <p className="text-[10px] text-gray-400">Strength</p>
                                                    <p className={`text-[10px] font-bold ${strength.text}`}>{strength.label}</p>
                                                </div>
                                                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <motion.div className={`h-full rounded-full ${strength.color}`}
                                                        initial={{ width: 0 }} animate={{ width: strength.width }}
                                                        transition={{ duration: 0.4 }} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                            <Lock size={11} className="text-primary" /> Confirm Password
                                        </Label>
                                        <Input
                                            type="password" value={confirmPwd}
                                            onChange={e => setConfirmPwd(e.target.value)}
                                            placeholder="Re-enter password"
                                            className={`h-11 rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm
                                                ${confirmPwd && confirmPwd !== newPassword ? 'border-red-300' : ''}
                                                ${confirmPwd && confirmPwd === newPassword ? 'border-green-300' : ''}`}
                                        />
                                        {confirmPwd && confirmPwd !== newPassword && (
                                            <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
                                                <AlertCircle size={11} /> Passwords do not match
                                            </p>
                                        )}
                                    </div>

                                    <Button type="submit" disabled={loading || newPassword.length < 6 || newPassword !== confirmPwd}
                                        className="w-full h-12 font-bold bg-primary hover:bg-violet-700 text-white rounded-xl shadow-md shadow-purple-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loading
                                            ? <><Loader2 size={16} className="animate-spin" /> Resetting…</>
                                            : <><CheckCircle2 size={15} /> Reset Password</>}
                                    </Button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        <div className="mt-6 text-center">
                            <Link to="/login" className="text-xs text-gray-400 hover:text-primary font-semibold transition-colors">
                                ← Back to Login
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default ForgotPassword
