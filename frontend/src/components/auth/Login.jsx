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
import {
    Loader2, Eye, EyeOff, Mail, Lock,
    ArrowRight, GraduationCap, Briefcase,
    CheckCircle2, AlertCircle
} from 'lucide-react'

// ── Google SVG ────────────────────────────────────────────────────────────────
const GoogleIcon = () => (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
)

// ── Field wrapper ──────────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, error, rightSlot, children }) => (
    <div className="space-y-1.5">
        <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                {Icon && <Icon size={11} className="text-primary" />}
                {label}
            </Label>
            {rightSlot}
        </div>
        {children}
        <AnimatePresence>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-1 text-xs text-red-500 font-medium"
                >
                    <AlertCircle size={11} /> {error}
                </motion.p>
            )}
        </AnimatePresence>
    </div>
)

// ── Main Login ─────────────────────────────────────────────────────────────────
const Login = () => {
    const [input, setInput] = useState({
        email: '',
        password: '',
        role: 'student',
    })
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [activeField, setActiveField] = useState(null)
    const [shake, setShake] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const { loading, user } = useSelector(store => store.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate(user.role === 'recruiter' ? '/admin/companies' : '/')
        }
    }, [user, navigate])

    const onChange = (e) => {
        setInput(p => ({ ...p, [e.target.name]: e.target.value }))
        if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }))
    }

    // Client-side validation
    const validate = () => {
        const e = {}
        if (!/\S+@\S+\.\S+/.test(input.email)) e.email = 'Enter a valid email address'
        if (input.password.length < 6) e.password = 'Password must be at least 6 characters'
        if (!input.role) e.role = 'Please select your role'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const triggerShake = () => {
        setShake(true)
        setTimeout(() => setShake(false), 600)
    }

    // Submit
    const submitHandler = async (e) => {
        e.preventDefault()
        if (!validate()) { triggerShake(); return }
        try {
            dispatch(setLoading(true))
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                toast.success(res.data.message)
                navigate(res.data.user.role === 'recruiter' ? '/admin/companies' : '/')
            }
        } catch (err) {
            triggerShake()
            toast.error(err.response?.data?.message || 'Invalid email or password')
            setErrors({ password: 'Incorrect email or password' })
        } finally {
            dispatch(setLoading(false))
        }
    }

    // Google login
    const googleLogin = async () => {
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
                navigate(res.data.user.role === 'recruiter' ? '/admin/companies' : '/')
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Google Login Failed')
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <AuthLayout activeField={activeField}>
            <PremiumMascot
                currentField={activeField}
                showPassword={showPassword}
                textLength={activeField === 'email' ? input.email.length : 0}
            />

            {/* ── Header ───────────────────────────────────────────────────── */}
            <motion.div
                animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-7 text-center"
            >
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
                    Welcome Back
                </h1>
                <p className="text-gray-400 text-sm font-medium">
                    Log in to continue your job search
                </p>
            </motion.div>

            {/* ── Role selector ─────────────────────────────────────────────── */}
            <div className="flex gap-3 mb-6">
                {[
                    { value: 'student', label: 'Job Seeker', icon: GraduationCap },
                    { value: 'recruiter', label: 'Recruiter', icon: Briefcase },
                ].map(r => {
                    const Icon = r.icon
                    const active = input.role === r.value
                    return (
                        <motion.button
                            key={r.value}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                                setInput(p => ({ ...p, role: r.value }))
                                if (errors.role) setErrors(p => ({ ...p, role: '' }))
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all
                                ${active
                                    ? 'border-primary bg-purple-50 text-primary shadow-sm shadow-purple-100'
                                    : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'}`}
                        >
                            <Icon size={15} />
                            {r.label}
                            {active && (
                                <motion.span
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                    className="w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                                >
                                    <CheckCircle2 size={10} className="text-white" />
                                </motion.span>
                            )}
                        </motion.button>
                    )
                })}
            </div>
            <AnimatePresence>
                {errors.role && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-1 text-xs text-red-500 font-medium -mt-4 mb-3"
                    >
                        <AlertCircle size={11} /> {errors.role}
                    </motion.p>
                )}
            </AnimatePresence>

            {/* ── Form ─────────────────────────────────────────────────────── */}
            <form onSubmit={submitHandler} className="space-y-4">

                {/* Email */}
                <Field
                    label="Email Address"
                    icon={Mail}
                    error={errors.email}
                >
                    <Input
                        name="email" value={input.email} type="email"
                        onChange={onChange}
                        onFocus={() => setActiveField('email')}
                        onBlur={() => setActiveField(null)}
                        placeholder="you@email.com"
                        className={`h-11 rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm
                            ${errors.email ? 'border-red-300 focus-visible:ring-red-300' : ''}`}
                    />
                </Field>

                {/* Password */}
                <Field
                    label="Password"
                    icon={Lock}
                    error={errors.password}
                    rightSlot={
                        <Link
                            to="/forgot-password"
                            className="text-[11px] font-bold text-primary hover:text-violet-700 hover:underline transition-colors"
                        >
                            Forgot password?
                        </Link>
                    }
                >
                    <div className="relative">
                        <Input
                            name="password" value={input.password}
                            type={showPassword ? 'text' : 'password'}
                            onChange={onChange}
                            onFocus={() => setActiveField('password')}
                            onBlur={() => setActiveField(null)}
                            placeholder="Your password"
                            className={`h-11 rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm pr-11
                                ${errors.password ? 'border-red-300 focus-visible:ring-red-300' : ''}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(s => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </Field>

                {/* Remember me */}
                <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                        onClick={() => setRememberMe(s => !s)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0
                            ${rememberMe ? 'bg-primary border-primary' : 'border-gray-300 group-hover:border-purple-300'}`}
                    >
                        {rememberMe && (
                            <motion.svg
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8"
                            >
                                <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </motion.svg>
                        )}
                    </div>
                    <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                        Remember me for 30 days
                    </span>
                </label>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 font-bold bg-primary hover:bg-violet-700 text-white rounded-xl
                        shadow-md shadow-purple-200 hover:shadow-lg transition-all
                        hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm
                        disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                    {loading ? (
                        <><Loader2 size={16} className="animate-spin" /> Logging in…</>
                    ) : (
                        <>Log In <ArrowRight size={15} /></>
                    )}
                </Button>

                {/* Divider */}
                <div className="relative my-1">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-100" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-white px-3 text-gray-400 font-bold tracking-widest">Or continue with</span>
                    </div>
                </div>

                {/* Google */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={googleLogin}
                    className="w-full h-11 border-gray-200 bg-white hover:bg-gray-50 text-gray-700
                        font-bold rounded-xl flex items-center justify-center gap-3 transition-all
                        hover:border-gray-300 hover:shadow-sm text-sm"
                >
                    <GoogleIcon /> Continue with Google
                </Button>

                {/* Signup link */}
                <p className="text-center text-sm text-gray-400 font-medium pt-1">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary font-bold hover:underline">
                        Create one free
                    </Link>
                </p>
            </form>
        </AuthLayout>
    )
}

export default Login