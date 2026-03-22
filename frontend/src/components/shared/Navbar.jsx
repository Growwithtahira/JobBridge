import React, { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import {
    LogOut, User2, Menu, X, Home, Search,
    LayoutGrid, Building2, Briefcase, ChevronRight, Bell, Sparkles
} from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '@/assets/logo.svg'

// ── Brand logo mark ───────────────────────────────────────────────────────────
const BrandLogo = ({ size = 'md' }) => {
    const textSize = size === 'sm' ? 'text-base' : 'text-lg'
    return (
        <div className="flex items-center gap-2.5">
            <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-xl" />

                <img src={logo} alt="JobBridge" className={`relative z-10 ${size === 'sm' ? 'w-13 h-13' : 'w-14 h-14'} object-contain drop-shadow-sm`} />

            </div>
            <span className={`${textSize} font-black tracking-tight leading-none`}>
                <span className="text-gray-900">Job</span>
                <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                        Bridge
                    </span>
                    <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full opacity-60" />
                </span>
                <span className="text-violet-400 ml-0.5">.</span>
            </span>
        </div>
    )
}

// ── Nav link ──────────────────────────────────────────────────────────────────
const NavLink = ({ to, icon: Icon, label, onClick }) => {
    const location = useLocation()
    const active = location.pathname === to

    return (
        <Link to={to} onClick={onClick}>
            <motion.div
                whileHover={{ y: -1 }}
                className={`relative flex items-center gap-1.5 px-1 py-1.5 text-sm font-semibold transition-colors duration-200
                    ${active ? 'text-primary' : 'text-gray-500 hover:text-gray-800'}`}
            >
                {Icon && <Icon size={13} className="flex-shrink-0" />}
                {label}
                {active && (
                    <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                )}
            </motion.div>
        </Link>
    )
}

// ── Mobile nav item ───────────────────────────────────────────────────────────
const MobileNavItem = ({ to, icon: Icon, label, onClick }) => {
    const location = useLocation()
    const active = location.pathname === to

    return (
        <Link to={to} onClick={onClick}>
            <motion.div whileTap={{ scale: 0.98 }}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-colors
                    ${active
                        ? 'bg-purple-50 text-primary border border-purple-100'
                        : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                        ${active ? 'bg-primary/10' : 'bg-gray-100'}`}>
                        <Icon size={15} className={active ? 'text-primary' : 'text-gray-500'} />
                    </div>
                    <span className="font-semibold text-sm">{label}</span>
                </div>
                <ChevronRight size={14} className={active ? 'text-primary' : 'text-gray-300'} />
            </motion.div>
        </Link>
    )
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
const Navbar = () => {
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 8)
        window.addEventListener('scroll', handler, { passive: true })
        return () => window.removeEventListener('scroll', handler)
    }, [])

    useEffect(() => { setMenuOpen(false) }, [location.pathname])

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [menuOpen])

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true })
            if (res.data.success) {
                dispatch(setUser(null))
                navigate('/')
                toast.success(res.data.message)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Logout failed')
        }
    }

    const studentLinks = [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/jobs', icon: Search, label: 'Find Jobs' },
        { to: '/browse', icon: LayoutGrid, label: 'Browse' },
    ]
    const recruiterLinks = [
        { to: '/admin/companies', icon: Building2, label: 'Companies' },
        { to: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
    ]
    const links = user?.role === 'recruiter' ? recruiterLinks : studentLinks

    return (
        <>
            <header className={`sticky top-0 z-50 transition-all duration-300
                ${scrolled
                    ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200/80 shadow-[0_4px_32px_-8px_rgba(106,56,194,0.12)]'
                    : 'bg-white/70 backdrop-blur-lg border-b border-gray-100/60'}`}
            >
                {/* Subtle top gradient line */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

                    {/* ── Logo ───────────────────────────────────────────── */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/')}
                        className="cursor-pointer flex-shrink-0"
                    >
                        <BrandLogo size="md" />
                    </motion.div>

                    {/* ── Desktop nav ────────────────────────────────────── */}
                    <nav className="hidden md:flex items-center gap-5">
                        {links.map(l => <NavLink key={l.to} {...l} />)}
                    </nav>

                    {/* ── Right section ──────────────────────────────────── */}
                    <div className="flex items-center gap-2">

                        {!user ? (
                            <div className="hidden md:flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="ghost"
                                        className="text-gray-600 hover:text-primary hover:bg-purple-50/80 rounded-xl px-5 font-semibold text-sm h-9 transition-all">
                                        Log in
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl px-5 h-9 text-sm shadow-lg shadow-purple-300/40 hover:shadow-purple-400/50 transition-all border-0">
                                            <Sparkles size={13} className="mr-1.5 opacity-80" />
                                            Sign up free
                                        </Button>
                                    </motion.div>
                                </Link>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-2.5">

                                {/* Bell */}
                                <motion.button
                                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                                    className="relative w-9 h-9 rounded-xl border border-gray-200/80 bg-white/80 flex items-center justify-center text-gray-400 hover:text-primary hover:border-purple-200 hover:bg-purple-50/60 transition-all shadow-sm"
                                >
                                    <Bell size={15} />
                                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                                </motion.button>

                                {/* Profile pill */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-xl border border-gray-200/80 bg-white/80 hover:border-purple-200 hover:bg-purple-50/40 transition-all shadow-sm group"
                                        >
                                            <Avatar className="h-7 w-7 border-2 border-white shadow-sm ring-1 ring-purple-100">
                                                <AvatarImage src={user?.profile?.profilePhoto || 'https://github.com/shadcn.png'} className="object-cover" />
                                                <AvatarFallback className="bg-gradient-to-br from-violet-100 to-purple-100 text-primary font-bold text-xs">
                                                    {user?.fullname?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 max-w-[90px] truncate">
                                                {user?.fullname?.split(' ')[0]}
                                            </span>
                                            <ChevronRight size={12} className="text-gray-300 rotate-90 group-hover:text-primary transition-colors" />
                                        </motion.button>
                                    </PopoverTrigger>

                                    <PopoverContent align="end"
                                        className="w-72 border border-gray-100 bg-white/95 backdrop-blur-xl shadow-2xl shadow-purple-200/30 rounded-2xl p-0 overflow-hidden mt-2">

                                        {/* User card */}
                                        <div className="p-4 bg-gradient-to-br from-violet-50 via-purple-50/60 to-white border-b border-gray-100/80">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-12 w-12 border-2 border-white shadow-md ring-2 ring-purple-100/60">
                                                    <AvatarImage src={user?.profile?.profilePhoto || 'https://github.com/shadcn.png'} className="object-cover" />
                                                    <AvatarFallback className="bg-gradient-to-br from-violet-200 to-purple-200 text-primary font-bold text-base">
                                                        {user?.fullname?.[0]?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-gray-900 text-sm truncate">{user?.fullname}</p>
                                                    <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                                                    <span className="inline-block mt-1 text-[10px] font-bold bg-gradient-to-r from-violet-100 to-purple-100 text-primary px-2.5 py-0.5 rounded-full capitalize border border-purple-100">
                                                        {user?.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-2">
                                            {user?.role === 'student' && (
                                                <Link to="/profile">
                                                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:text-primary hover:bg-purple-50 transition-all text-sm font-medium group">
                                                        <div className="w-7 h-7 rounded-lg bg-gray-100/80 group-hover:bg-purple-100 flex items-center justify-center transition-colors flex-shrink-0">
                                                            <User2 size={13} className="group-hover:text-primary transition-colors" />
                                                        </div>
                                                        View Profile
                                                        <ChevronRight size={13} className="ml-auto text-gray-200 group-hover:text-primary transition-colors" />
                                                    </button>
                                                </Link>
                                            )}
                                            <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent my-1.5" />
                                            <button onClick={logoutHandler}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all text-sm font-medium group">
                                                <div className="w-7 h-7 rounded-lg bg-gray-100/80 group-hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0">
                                                    <LogOut size={13} className="group-hover:text-red-500 transition-colors" />
                                                </div>
                                                Log out
                                            </button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}

                        {/* Hamburger */}
                        <motion.button
                            whileTap={{ scale: 0.93 }}
                            onClick={() => setMenuOpen(o => !o)}
                            className="md:hidden w-9 h-9 rounded-xl border border-gray-200/80 bg-white/80 flex items-center justify-center text-gray-600 hover:text-primary hover:border-purple-200 transition-all shadow-sm flex-shrink-0"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {menuOpen
                                    ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={17} /></motion.span>
                                    : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={17} /></motion.span>
                                }
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* ── Mobile drawer ──────────────────────────────────────────────── */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMenuOpen(false)}
                        />

                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                            className="fixed top-0 right-0 bottom-0 w-[82%] max-w-sm bg-white z-50 md:hidden flex flex-col shadow-2xl shadow-purple-900/20"
                        >
                            {/* Drawer header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <BrandLogo size="sm" />
                                <motion.button
                                    whileTap={{ scale: 0.93 }}
                                    onClick={() => setMenuOpen(false)}
                                    className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                                >
                                    <X size={15} />
                                </motion.button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">

                                {/* User card */}
                                {user && (
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-violet-50 to-purple-50/60 rounded-2xl border border-purple-100/80 mb-4">
                                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-1 ring-purple-100 flex-shrink-0">
                                            <AvatarImage src={user?.profile?.profilePhoto || 'https://github.com/shadcn.png'} className="object-cover" />
                                            <AvatarFallback className="bg-gradient-to-br from-violet-200 to-purple-200 text-primary font-bold">
                                                {user?.fullname?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-900 text-sm truncate">{user?.fullname}</p>
                                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                            <span className="inline-block mt-0.5 text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize">
                                                {user?.role}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 mb-2">Navigation</p>
                                {links.map(l => <MobileNavItem key={l.to} {...l} onClick={() => setMenuOpen(false)} />)}

                                {user?.role === 'student' && (
                                    <>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 mt-4 mb-2">Account</p>
                                        <MobileNavItem to="/profile" icon={User2} label="My Profile" onClick={() => setMenuOpen(false)} />
                                    </>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-4 pb-8 pt-3 border-t border-gray-100 space-y-2.5">
                                {!user ? (
                                    <>
                                        <Link to="/login" onClick={() => setMenuOpen(false)}>
                                            <Button variant="outline"
                                                className="w-full h-11 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-purple-50 hover:border-purple-200 hover:text-primary transition-all">
                                                Log in
                                            </Button>
                                        </Link>
                                        <Link to="/signup" onClick={() => setMenuOpen(false)}>
                                            <Button className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-300/40 border-0 flex items-center justify-center gap-2">
                                                <Sparkles size={14} className="opacity-80" />
                                                Create Free Account
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => { logoutHandler(); setMenuOpen(false) }}
                                        className="w-full h-11 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-xl text-sm border border-red-100/80 transition-all"
                                    >
                                        <LogOut size={14} /> Log out
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

export default Navbar