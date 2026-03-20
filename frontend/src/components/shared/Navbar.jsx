import React, { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2, Menu, X, Home, Search, LayoutGrid, Building2, Briefcase, ChevronRight, Bell } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '@/assets/Logo.png'

// ── Nav link with active indicator ────────────────────────────────────────────
const NavLink = ({ to, icon: Icon, label, onClick }) => {
    const location = useLocation()
    const active = location.pathname === to

    return (
        <Link to={to} onClick={onClick}>
            <motion.div
                whileHover={{ y: -1 }}
                className={`relative flex items-center gap-1.5 px-1 py-1 text-sm font-semibold transition-colors duration-200
                    ${active ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}
            >
                {Icon && <Icon size={14} className="flex-shrink-0" />}
                {label}
                {/* Active underline dot */}
                {active && (
                    <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
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
            <motion.div
                whileTap={{ scale: 0.98 }}
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

    // Shadow on scroll
    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 8)
        window.addEventListener('scroll', handler, { passive: true })
        return () => window.removeEventListener('scroll', handler)
    }, [])

    // Close drawer on route change
    useEffect(() => { setMenuOpen(false) }, [location.pathname])

    // Lock body scroll when drawer open
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
            {/* ── Main bar ───────────────────────────────────────────────── */}
            <header
                className={`bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b transition-all duration-300
                    ${scrolled ? 'border-gray-200 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]' : 'border-gray-100 shadow-none'}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2.5 cursor-pointer flex-shrink-0"
                    >
                        <img src={logo} alt="JobBridge" className="w-9 h-9 object-contain" />
                        <span className="text-lg font-extrabold text-gray-900 tracking-tight">
                            Job<span className="text-primary">Bridge</span>
                            <span className="text-primary">.</span>
                        </span>
                    </motion.div>

                    {/* Desktop nav links */}
                    <nav className="hidden md:flex items-center gap-6">
                        {links.map(l => (
                            <NavLink key={l.to} {...l} />
                        ))}
                    </nav>

                    {/* Right section */}
                    <div className="flex items-center gap-2">

                        {!user ? (
                            /* Guest buttons */
                            <div className="hidden md:flex items-center gap-2">
                                <Link to="/login">
                                    <Button
                                        variant="ghost"
                                        className="text-gray-600 hover:text-primary hover:bg-purple-50 rounded-xl px-5 font-semibold text-sm h-9"
                                    >
                                        Log in
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button
                                        className="bg-primary hover:bg-violet-700 text-white font-bold rounded-xl px-5 h-9 text-sm shadow-md shadow-purple-200 hover:shadow-lg transition-all"
                                    >
                                        Sign up
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            /* Profile popover */
                            <div className="hidden md:flex items-center gap-3">

                                {/* Notification bell (cosmetic) */}
                                <motion.button
                                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                                    className="relative w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-primary hover:border-purple-200 transition-colors"
                                >
                                    <Bell size={16} />
                                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                                </motion.button>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl border border-gray-200 bg-white hover:border-purple-200 transition-all group"
                                        >
                                            <Avatar className="h-7 w-7 border border-purple-100">
                                                <AvatarImage src={user?.profile?.profilePhoto || 'https://github.com/shadcn.png'} className="object-cover" />
                                                <AvatarFallback className="bg-purple-50 text-primary font-bold text-xs">
                                                    {user?.fullname?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 max-w-[80px] truncate">
                                                {user?.fullname?.split(' ')[0]}
                                            </span>
                                            <ChevronRight size={13} className="text-gray-400 rotate-90" />
                                        </motion.button>
                                    </PopoverTrigger>

                                    <PopoverContent
                                        align="end"
                                        className="w-72 border-gray-100 bg-white shadow-2xl rounded-2xl p-0 overflow-hidden mt-2"
                                    >
                                        {/* User card */}
                                        <div className="p-4 bg-gradient-to-r from-purple-50 to-white border-b border-gray-50">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-11 w-11 border-2 border-white shadow-sm">
                                                    <AvatarImage src={user?.profile?.profilePhoto || 'https://github.com/shadcn.png'} className="object-cover" />
                                                    <AvatarFallback className="bg-purple-100 text-primary font-bold">
                                                        {user?.fullname?.[0]?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-gray-900 text-sm truncate">{user?.fullname}</p>
                                                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                                    <span className="inline-block mt-1 text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize">
                                                        {user?.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu items */}
                                        <div className="p-2">
                                            {user?.role === 'student' && (
                                                <Link to="/profile">
                                                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:text-primary hover:bg-purple-50 transition-colors text-sm font-medium group">
                                                        <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors flex-shrink-0">
                                                            <User2 size={13} className="group-hover:text-primary transition-colors" />
                                                        </div>
                                                        View Profile
                                                        <ChevronRight size={13} className="ml-auto text-gray-300 group-hover:text-primary" />
                                                    </button>
                                                </Link>
                                            )}

                                            <div className="h-px bg-gray-50 my-1" />

                                            <button
                                                onClick={logoutHandler}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors text-sm font-medium group"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0">
                                                    <LogOut size={13} className="group-hover:text-red-500 transition-colors" />
                                                </div>
                                                Log out
                                            </button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}

                        {/* Mobile hamburger */}
                        <motion.button
                            whileTap={{ scale: 0.93 }}
                            onClick={() => setMenuOpen(o => !o)}
                            className="md:hidden w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:text-primary hover:border-purple-200 transition-colors flex-shrink-0"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {menuOpen
                                    ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={18} /></motion.span>
                                    : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={18} /></motion.span>
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
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMenuOpen(false)}
                        />

                        {/* Drawer panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                            className="fixed top-0 right-0 bottom-0 w-[82%] max-w-sm bg-white z-50 md:hidden flex flex-col shadow-2xl"
                        >
                            {/* Drawer header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <img src={logo} alt="JobBridge" className="w-7 h-7 object-contain" />
                                    <span className="font-extrabold text-gray-900">Job<span className="text-primary">Bridge</span></span>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.93 }}
                                    onClick={() => setMenuOpen(false)}
                                    className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                                >
                                    <X size={16} />
                                </motion.button>
                            </div>

                            {/* Scrollable body */}
                            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">

                                {/* User card (when logged in) */}
                                {user && (
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-100 mb-4">
                                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm flex-shrink-0">
                                            <AvatarImage src={user?.profile?.profilePhoto || 'https://github.com/shadcn.png'} className="object-cover" />
                                            <AvatarFallback className="bg-purple-100 text-primary font-bold">
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

                                {/* Nav links */}
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 mb-2">Navigation</p>
                                {links.map(l => (
                                    <MobileNavItem key={l.to} {...l} onClick={() => setMenuOpen(false)} />
                                ))}

                                {/* Profile link for students */}
                                {user?.role === 'student' && (
                                    <>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 mt-4 mb-2">Account</p>
                                        <MobileNavItem to="/profile" icon={User2} label="My Profile" onClick={() => setMenuOpen(false)} />
                                    </>
                                )}
                            </div>

                            {/* Drawer footer */}
                            <div className="px-4 pb-6 pt-3 border-t border-gray-100 space-y-3">
                                {!user ? (
                                    <>
                                        <Link to="/login" onClick={() => setMenuOpen(false)}>
                                            <Button variant="outline" className="w-full h-11 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-purple-50 hover:border-purple-200 hover:text-primary">
                                                Log in
                                            </Button>
                                        </Link>
                                        <Link to="/signup" onClick={() => setMenuOpen(false)}>
                                            <Button className="w-full h-11 bg-primary hover:bg-violet-700 text-white font-bold rounded-xl text-sm shadow-md shadow-purple-200">
                                                Create Free Account
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => { logoutHandler(); setMenuOpen(false) }}
                                        className="w-full h-11 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-xl text-sm border border-red-100 transition-colors"
                                    >
                                        <LogOut size={15} /> Log out
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