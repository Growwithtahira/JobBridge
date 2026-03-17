import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Briefcase, Building2, Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import logo from '@/assets/Logo.png';
const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='bg-white/70 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 h-20 flex items-center transition-all duration-300 shadow-sm'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-full w-full px-4 sm:px-6 lg:px-8'>

                {/* --- LOGO SECTION --- */}

                <div className='flex items-center gap-3 cursor-pointer group shrink-0' onClick={() => navigate("/")}>

                    {/* 2. src me quotes "" hata kar curly braces {} me logo variable pass karein */}
                    <img
                        src={logo}
                        alt="JobBridge Logo"
                        className='w-10 h-10 sm:w-12 sm:h-12 object-contain group-hover:scale-110 transition-transform duration-300'
                    />

                    <h1 className='text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-1'>
                        Job<span className='text-primary'>Bridge</span>.
                    </h1>
                </div>

                {/* --- MENU LINKS --- */}
                <div className='flex items-center gap-8'>
                    <ul className='hidden md:flex font-medium items-center gap-8 text-gray-600'>
                        {
                            user && user.role === 'recruiter' ? (
                                // --- RECRUITER LINKS ---
                                <>
                                    <li className='hover:text-primary transition-all cursor-pointer hover:-translate-y-1 duration-300 font-semibold'>
                                        <Link to="/admin/companies">Companies</Link>
                                    </li>
                                    <li className='hover:text-primary transition-all cursor-pointer hover:-translate-y-1 duration-300 font-semibold'>
                                        <Link to="/admin/jobs">View Jobs</Link>
                                    </li>
                                </>
                            ) : (
                                // --- STUDENT LINKS ---
                                <>
                                    <li className='hover:text-primary transition-all cursor-pointer hover:-translate-y-1 duration-300 font-semibold'>
                                        <Link to="/">Home</Link>
                                    </li>
                                    <li className='hover:text-primary transition-all cursor-pointer hover:-translate-y-1 duration-300 font-semibold'>
                                        <Link to="/jobs">Find Jobs</Link>
                                    </li>
                                    <li className='hover:text-primary transition-all cursor-pointer hover:-translate-y-1 duration-300 font-semibold'>
                                        <Link to="/browse">Browse</Link>
                                    </li>
                                </>
                            )
                        }
                    </ul>

                    {/* --- LOGIN / SIGNUP / PROFILE BUTTONS --- */}
                    {
                        !user ? (
                            <div className='hidden md:flex items-center gap-4'>
                                <Link to="/login">
                                    <Button variant="ghost" className="text-gray-600 hover:text-primary hover:bg-purple-50 rounded-full px-6 transition-all font-semibold">Login</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-primary hover:bg-violet-700 text-white font-bold rounded-full px-6 py-2 shadow-lg hover:shadow-violet-200 hover:scale-105 transition-all duration-300">Signup</Button>
                                </Link>
                            </div>
                        ) : (
                            // --- PROFILE DROPDOWN ---
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer border-2 border-primary/20 hover:border-primary transition-all duration-300 h-10 w-10 ring-2 ring-transparent">
                                        <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 border-purple-100 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl mr-4 text-gray-800 p-5 mt-2">
                                    <div className='flex gap-4 space-y-2 mb-4'>
                                        <Avatar className="cursor-pointer border border-purple-100 w-12 h-12 shadow-sm">
                                            <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} />
                                        </Avatar>
                                        <div>
                                            <h4 className='font-bold text-lg text-gray-900 leading-none'>{user?.fullname}</h4>
                                            <p className='text-sm text-gray-500 mt-1'>{user?.profile?.bio || "No bio added"}</p>
                                        </div>
                                    </div>
                                    <div className='h-[1px] bg-gray-100 mb-4'></div>
                                    <div className='flex flex-col space-y-3'>
                                        {
                                            user && user.role === 'student' && (
                                                <div className='group flex items-center gap-3 cursor-pointer text-gray-600 hover:text-primary transition-colors p-2 hover:bg-purple-50 rounded-lg font-medium'>
                                                    <User2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                    <Link to="/profile"><span>View Profile</span></Link>
                                                </div>
                                            )
                                        }
                                        <div onClick={logoutHandler} className='group flex items-center gap-3 cursor-pointer text-gray-600 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg font-medium'>
                                            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span>Log out</span>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>
                {/* --- MOBILE MENU TOGGLE --- */}
                <div className='md:hidden'>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className='text-gray-700 hover:text-primary transition-colors focus:outline-none'>
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* --- MOBILE MENU DRAWER --- */}
            {mobileMenuOpen && (
                <div className='md:hidden bg-white/95 absolute top-20 left-0 w-full border-b border-gray-200 p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-5 z-40 backdrop-blur-xl'>
                    <ul className='flex flex-col gap-5 font-medium text-gray-700 text-center text-lg'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li onClick={() => setMobileMenuOpen(false)}>
                                        <Link to="/admin/companies" className='block py-2 hover:text-primary transition-colors'>Companies</Link>
                                    </li>
                                    <li onClick={() => setMobileMenuOpen(false)}>
                                        <Link to="/admin/jobs" className='block py-2 hover:text-primary transition-colors'>View Jobs</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li onClick={() => setMobileMenuOpen(false)}>
                                        <Link to="/" className='block py-2 hover:text-primary transition-colors'>Home</Link>
                                    </li>
                                    <li onClick={() => setMobileMenuOpen(false)}>
                                        <Link to="/jobs" className='block py-2 hover:text-primary transition-colors'>Find Jobs</Link>
                                    </li>
                                    <li onClick={() => setMobileMenuOpen(false)}>
                                        <Link to="/browse" className='block py-2 hover:text-primary transition-colors'>Browse</Link>
                                    </li>
                                </>
                            )
                        }
                    </ul>
                    {
                        !user ? (
                            <div className='flex flex-col gap-4 mt-2'>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-primary py-6 text-lg rounded-xl font-semibold">Login</Button>
                                </Link>
                                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full bg-primary hover:bg-violet-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg">Signup</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className='pt-4 border-t border-gray-100'>
                                <div className='flex items-center gap-4 mb-6 justify-center bg-purple-50 p-4 rounded-xl border border-purple-100'>
                                    <Avatar className="h-12 w-12 border border-primary/30 shadow-sm">
                                        <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} />
                                    </Avatar>
                                    <div className='text-left'>
                                        <p className='text-base font-bold text-gray-900'>{user?.fullname}</p>
                                        <p className='text-xs text-gray-500 truncate w-40'>{user?.email}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    {
                                        user && user.role === 'student' && (
                                            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className='bg-white border border-gray-100 py-4 rounded-xl text-center text-gray-700 hover:bg-gray-50 hover:text-primary block transition-colors font-medium shadow-sm'>
                                                View Profile
                                            </Link>
                                        )
                                    }
                                    <button onClick={() => { logoutHandler(); setMobileMenuOpen(false); }} className='bg-red-50 text-red-500 py-4 rounded-xl hover:bg-red-100 w-full transition-colors font-medium border border-red-100'>
                                        Log out
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </div>
            )}
        </div>
    )
}

export default Navbar