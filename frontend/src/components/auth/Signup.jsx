import React, { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/utils/firebase'
import AuthLayout from './AuthLayout'
import PremiumMascot from './PremiumMascot'
import OtpInput from './OtpInput'
import {
    Loader2, Eye, EyeOff, User, Mail, Phone,
    Lock, Camera, CheckCircle2, ArrowRight,
    GraduationCap, Briefcase, Shield, RefreshCw
} from 'lucide-react'

// ── Password strength ──────────────────────────────────────────────────────────
const getPasswordStrength = (pwd) => {
    if (!pwd) return null
    let score = 0
    if (pwd.length >= 6) score++
    if (pwd.length >= 10) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    if (score <= 1) return { label: 'Weak', color: 'bg-red-400', width: '20%', text: 'text-red-500' }
    if (score <= 2) return { label: 'Fair', color: 'bg-amber-400', width: '50%', text: 'text-amber-500' }
    if (score <= 3) return { label: 'Good', color: 'bg-blue-400', width: '70%', text: 'text-blue-500' }
    return { label: 'Strong', color: 'bg-green-500', width: '100%', text: 'text-green-600' }
}

// ── Google SVG ─────────────────────────────────────────────────────────────────
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
)

// ── Field wrapper ──────────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, error, children }) => (
    <div className="space-y-1.5">
        <Label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
            {Icon && <Icon size={11} className="text-primary" />}
            {label}
        </Label>
        {children}
        <AnimatePresence>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-red-500 font-medium"
                >
                    {error}
                </motion.p>
            )}
        </AnimatePresence>
    </div>
)

// ── Step dots ──────────────────────────────────────────────────────────────────
const StepDots = ({ current }) => (
    <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2].map(s => (
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
                {s < 2 && <div className="w-6 h-px bg-gray-200" />}
            </div>
        ))}
    </div>
)

// ── Main Signup ────────────────────────────────────────────────────────────────
const Signup = () => {
    const [input, setInput] = useState({
        fullname: '', email: '', phoneNumber: '',
        password: '', role: 'student', file: null
    })
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [activeField, setActiveField] = useState(null)
    const [step, setStep] = useState(1)
    const [otp, setOtp] = useState('')
    const [previewPhoto, setPreviewPhoto] = useState(null)
    const [resendTimer, setResendTimer] = useState(0)

    const { loading, user } = useSelector(store => store.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const strength = getPasswordStrength(input.password)

    useEffect(() => { if (user) navigate('/') }, [user, navigate])

    useEffect(() => {
        if (resendTimer <= 0) return
        const t = setInterval(() => setResendTimer(s => s - 1), 1000)
        return () => clearInterval(t)
    }, [resendTimer])

    const onChange = (e) => {
        setInput(p => ({ ...p, [e.target.name]: e.target.value }))
        if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }))
    }

    const onFile = (e) => {
        const f = e.target.files?.[0]
        if (!f) return
        setInput(p => ({ ...p, file: f }))
        const reader = new FileReader()
        reader.onloadend = () => setPreviewPhoto(reader.result)
        reader.readAsDataURL(f)
    }

    const validate = () => {
        const e = {}
        if (!input.fullname.trim()) e.fullname = 'Full name is required'
        if (!/\S+@\S+\.\S+/.test(input.email)) e.email = 'Enter a valid email'
        if (input.phoneNumber.length < 10) e.phoneNumber = 'Enter a valid 10-digit number'
        if (input.password.length < 6) e.password = 'Password must be at least 6 characters'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        if (!validate()) return
        const fd = new FormData()
        Object.entries(input).forEach(([k, v]) => { if (v && k !== 'file') fd.append(k, v) })
        if (input.file) fd.append('file', input.file)
        try {
            dispatch(setLoading(true))
            const res = await axios.post(`${USER_API_END_POINT}/register`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            })
            if (res.data.success) {
                setStep(2)
                setResendTimer(60)
                toast.success(res.data.message)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong')
        } finally {
            dispatch(setLoading(false))
        }
    }

    const verifyOtp = async (e) => {
        e.preventDefault()
        if (otp.length !== 6) { toast.error('Please enter the complete 6-digit OTP'); return }
        try {
            dispatch(setLoading(true))
            const res = await axios.post(`${USER_API_END_POINT}/verify-otp`, { email: input.email, otp }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                toast.success(res.data.message)
                navigate('/')
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid OTP')
        } finally {
            dispatch(setLoading(false))
        }
    }

    const resendOtp = async () => {
        if (resendTimer > 0) return
        try {
            await axios.post(`${USER_API_END_POINT}/resend-otp`, { email: input.email }, { withCredentials: true })
            setResendTimer(60)
            setOtp('')
            toast.success('OTP resent!')
        } catch (err) {
            toast.error('Failed to resend OTP')
        }
    }

    const googleSignup = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const gu = result.user
            const res = await axios.post(`${USER_API_END_POINT}/google`, {
                uid: gu.uid, email: gu.email,
                displayName: gu.displayName,
                photoURL: gu.photoURL,
                role: input.role || 'student'
            }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                toast.success(res.data.message)
                navigate('/')
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Google Signup Failed')
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <AuthLayout activeField={activeField}>
            <PremiumMascot
                currentField={activeField}
                showPassword={showPassword}
                textLength={
                    activeField === 'fullname' ? input.fullname.length :
                        activeField === 'email' ? input.email.length :
                            activeField === 'phoneNumber' ? input.phoneNumber.length : 0
                }
            />

            <StepDots current={step} />

            <AnimatePresence mode="wait">

                {/* ── STEP 1: Registration ───────────────────────────────── */}
                {step === 1 && (
                    <motion.div key="step1"
                        initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
                                Create Account
                            </h1>
                            <p className="text-gray-400 text-sm font-medium">
                                Join thousands of job seekers in Bareilly
                            </p>
                        </div>

                        <div className="flex gap-3 mb-5">
                            {[
                                { value: 'student', label: 'Job Seeker', icon: GraduationCap },
                                { value: 'recruiter', label: 'Recruiter', icon: Briefcase },
                            ].map(r => {
                                const Icon = r.icon
                                const active = input.role === r.value
                                return (
                                    <motion.button key={r.value} type="button"
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => setInput(p => ({ ...p, role: r.value }))}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all
                                            ${active
                                                ? 'border-primary bg-purple-50 text-primary shadow-sm shadow-purple-100'
                                                : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'}`}
                                    >
                                        <Icon size={15} />
                                        {r.label}
                                        {active && (
                                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                                <CheckCircle2 size={10} className="text-white" />
                                            </motion.span>
                                        )}
                                    </motion.button>
                                )
                            })}
                        </div>

                        <form onSubmit={submitHandler} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Full Name" icon={User} error={errors.fullname}>
                                    <Input name="fullname" value={input.fullname} onChange={onChange}
                                        onFocus={() => setActiveField('fullname')} onBlur={() => setActiveField(null)}
                                        autoComplete="off" placeholder="Your full name"
                                        className={`h-11 rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm ${errors.fullname ? 'border-red-300' : ''}`} />
                                </Field>
                                <Field label="Phone" icon={Phone} error={errors.phoneNumber}>
                                    <Input name="phoneNumber" value={input.phoneNumber} onChange={onChange}
                                        onFocus={() => setActiveField('phoneNumber')} onBlur={() => setActiveField(null)}
                                        autoComplete="off" placeholder="+91 XXXXX XXXXX" type="tel"
                                        className={`h-11 rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm ${errors.phoneNumber ? 'border-red-300' : ''}`} />
                                </Field>
                            </div>

                            <Field label="Email Address" icon={Mail} error={errors.email}>
                                <Input name="email" value={input.email} type="email" onChange={onChange}
                                    onFocus={() => setActiveField('email')} onBlur={() => setActiveField(null)}
                                    autoComplete="off" placeholder="you@email.com"
                                    className={`h-11 rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm ${errors.email ? 'border-red-300' : ''}`} />
                            </Field>

                            <Field label="Password" icon={Lock} error={errors.password}>
                                <div className="relative">
                                    <Input name="password" value={input.password}
                                        type={showPassword ? 'text' : 'password'} onChange={onChange}
                                        onFocus={() => setActiveField('password')} onBlur={() => setActiveField(null)}
                                        autoComplete="new-password" placeholder="Min 6 characters"
                                        className={`h-11 rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm pr-11 ${errors.password ? 'border-red-300' : ''}`} />
                                    <button type="button" onClick={() => setShowPassword(s => !s)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {input.password && strength && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-[10px] text-gray-400">Password strength</p>
                                            <p className={`text-[10px] font-bold ${strength.text}`}>{strength.label}</p>
                                        </div>
                                        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div className={`h-full rounded-full ${strength.color}`}
                                                initial={{ width: 0 }} animate={{ width: strength.width }}
                                                transition={{ duration: 0.4 }} />
                                        </div>
                                    </motion.div>
                                )}
                            </Field>

                            <div className="flex items-center gap-4 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex-shrink-0">
                                    {previewPhoto
                                        ? <img src={previewPhoto} className="w-11 h-11 rounded-xl object-cover border-2 border-purple-100" alt="preview" />
                                        : <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                                            <Camera size={18} className="text-purple-300" />
                                        </div>
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-600 mb-0.5">Profile Photo</p>
                                    <p className="text-[10px] text-gray-400">Optional · JPG, PNG up to 2MB</p>
                                </div>
                                <label className="cursor-pointer flex-shrink-0">
                                    <span className="text-xs font-bold text-primary bg-purple-50 hover:bg-purple-100 border border-purple-100 px-3 py-1.5 rounded-lg transition-colors">
                                        Browse
                                    </span>
                                    <input type="file" accept="image/*" onChange={onFile} className="hidden" />
                                </label>
                            </div>

                            <Button type="submit" disabled={loading}
                                className="w-full h-12 font-bold bg-primary hover:bg-violet-700 text-white rounded-xl shadow-md shadow-purple-200 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm">
                                {loading
                                    ? <><Loader2 size={16} className="animate-spin" /> Creating Account…</>
                                    : <>Create Account <ArrowRight size={15} /></>}
                            </Button>

                            <div className="relative my-1">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-100" />
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase">
                                    <span className="bg-white px-3 text-gray-400 font-bold tracking-widest">Or sign up with</span>
                                </div>
                            </div>

                            <Button type="button" variant="outline" onClick={googleSignup}
                                className="w-full h-11 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-3 transition-all hover:border-gray-300 hover:shadow-sm text-sm">
                                <GoogleIcon /> Continue with Google
                            </Button>

                            <p className="text-center text-sm text-gray-400 font-medium pt-1">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
                            </p>
                        </form>
                    </motion.div>
                )}

                {/* ── STEP 2: OTP Verify ─────────────────────────────────── */}
                {step === 2 && (
                    <motion.div key="step2"
                        initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="mb-8 text-center">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4 border border-purple-100">
                                <Shield size={28} className="text-primary" strokeWidth={1.5} />
                            </motion.div>
                            <h1 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">Verify Email</h1>
                            <p className="text-gray-400 text-sm">We sent a 6-digit code to</p>
                            <p className="text-sm font-bold text-gray-800 mt-0.5">{input.email}</p>
                        </div>

                        <form onSubmit={verifyOtp} className="space-y-6">
                            <div>
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center block mb-4">
                                    Enter OTP
                                </Label>
                                <OtpInput value={otp} onChange={setOtp} />
                            </div>

                            <Button type="submit" disabled={loading || otp.length !== 6}
                                className="w-full h-12 font-bold bg-primary hover:bg-violet-700 text-white rounded-xl shadow-md shadow-purple-200 hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-sm">
                                {loading
                                    ? <><Loader2 size={16} className="animate-spin" /> Verifying…</>
                                    : <><CheckCircle2 size={15} /> Verify & Continue</>}
                            </Button>

                            <div className="text-center space-y-2">
                                <p className="text-xs text-gray-400">Didn't receive the code?</p>
                                <button type="button" onClick={resendOtp} disabled={resendTimer > 0}
                                    className={`flex items-center gap-1.5 mx-auto text-xs font-bold transition-colors
                                        ${resendTimer > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:text-violet-700 hover:underline'}`}>
                                    <RefreshCw size={12} />
                                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                                </button>
                            </div>

                            <button type="button" onClick={() => { setStep(1); setOtp('') }}
                                className="w-full text-xs text-gray-400 hover:text-gray-600 font-semibold transition-colors text-center">
                                ← Change email address
                            </button>
                        </form>
                    </motion.div>
                )}

            </AnimatePresence>
        </AuthLayout>
    )
}

export default Signup