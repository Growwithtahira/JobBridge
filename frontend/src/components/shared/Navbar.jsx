import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Briefcase, Building2 } from 'lucide-react' // Added Icons for Recruiter
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        <div className='bg-black/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 h-16 flex items-center transition-all duration-300'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-full w-full px-4 sm:px-6 lg:px-8'>

                {/* --- LOGO SECTION --- */}
                <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate("/")}>
                    <div className='w-9 h-9 bg-yellow-500 rounded-lg flex items-center justify-center text-black font-bold text-xl shadow-[0_0_10px_rgba(250,204,21,0.5)]'>J</div>
                    <h1 className='text-2xl font-bold text-white tracking-tight'>
                        Job<span className='text-yellow-500'>Bridge</span>
                    </h1>
                </div>

                {/* --- MENU LINKS (Logic + Color Fixed) --- */}
                <div className='flex items-center gap-8'>
                    <ul className='hidden md:flex font-medium items-center gap-8 text-gray-300'>
                        {
                            user && user.role === 'recruiter' ? (
                                // --- RECRUITER LINKS (Admin Panel) ---
                                <>
                                    <li className='hover:text-yellow-500 transition-colors cursor-pointer'>
                                        <Link to="/admin/companies">Companies</Link>
                                    </li>
                                    <li className='hover:text-yellow-500 transition-colors cursor-pointer'>
                                        <Link to="/admin/jobs">View Jobs</Link>
                                    </li>
                                </>
                            ) : (
                                // --- STUDENT LINKS ---
                                <>
                                    <li className='hover:text-yellow-500 transition-colors cursor-pointer'>
                                        <Link to="/">Home</Link>
                                    </li>
                                    <li className='hover:text-yellow-500 transition-colors cursor-pointer'>
                                        <Link to="/jobs">Find Jobs</Link>
                                    </li>
                                    <li className='hover:text-yellow-500 transition-colors cursor-pointer'>
                                        <Link to="/browse">Browse</Link>
                                    </li>
                                </>
                            )
                        }
                    </ul>

                    {/* --- LOGIN / SIGNUP / PROFILE BUTTONS --- */}
                    {
                        !user ? (
                            <div className='flex items-center gap-3'>
                                <Link to="/login">
                                    <Button variant="outline" className="border-gray-600 text-white hover:border-yellow-500 hover:text-black hover:bg-yellow-500 rounded-full px-6 bg-transparent">Login</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full px-6 shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:shadow-[0_0_20px_rgba(250,204,21,0.6)] transition-all">Signup</Button>
                                </Link>
                            </div>
                        ) : (
                            // --- PROFILE DROPDOWN (Dark Mode Fixed) ---
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer border-2 border-gray-600 hover:border-yellow-500 transition-all">
                                        <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 border-gray-800 bg-gray-900 shadow-2xl rounded-xl mr-4 text-white p-4">
                                    <div className='flex gap-4 space-y-2'>
                                        <Avatar className="cursor-pointer border border-gray-600">
                                            <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} />
                                        </Avatar>
                                        <div>
                                            <h4 className='font-bold text-lg text-white'>{user?.fullname}</h4>
                                            <p className='text-sm text-gray-400'>{user?.profile?.bio || "No bio added"}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col mt-4 space-y-2'>
                                        {
                                            user && user.role === 'student' && (
                                                <div className='flex items-center gap-3 cursor-pointer text-gray-300 hover:text-yellow-500 transition-colors'>
                                                    <User2 className="w-5 h-5" />
                                                    <Link to="/profile"><span className='font-medium'>View Profile</span></Link>
                                                </div>
                                            )
                                        }
                                        <div onClick={logoutHandler} className='flex items-center gap-3 cursor-pointer text-gray-300 hover:text-red-500 transition-colors'>
                                            <LogOut className="w-5 h-5" />
                                            <span className='font-medium'>Log out</span>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar