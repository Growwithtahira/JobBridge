import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.map(skill => skill) || "",
        file: user?.profile?.resume || ""
    });

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file: file })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);

        if (user.role === 'student') {
            formData.append("skills", input.skills);
            if (input.file) {
                formData.append("file", input.file);
            }
        }

        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                {/* Main Modal - Premium Light Theme */}
                <DialogContent className="sm:max-w-[425px] bg-white text-gray-900 border-gray-100 shadow-2xl" onInteractOutside={() => setOpen(false)}>

                    <DialogHeader>
                        <DialogTitle className="text-gray-900 font-bold text-xl">Update Profile</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={submitHandler}>
                        <div className='grid gap-4 py-4'>
                            {/* --- Common Fields --- */}

                            {/* Name Input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="fullname" className="text-right text-gray-600 font-medium">Name</Label>
                                <Input
                                    id="fullname" name="fullname"
                                    value={input.fullname} onChange={changeEventHandler}
                                    className="col-span-3 bg-white text-gray-800 border-gray-200 focus-visible:ring-violet-500"
                                />
                            </div>

                            {/* Email Input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right text-gray-600 font-medium">Email</Label>
                                <Input
                                    id="email" name="email"
                                    value={input.email} onChange={changeEventHandler}
                                    className="col-span-3 bg-white text-gray-800 border-gray-200 focus-visible:ring-violet-500"
                                />
                            </div>

                            {/* Phone Input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="phoneNumber" className="text-right text-gray-600 font-medium">Number</Label>
                                <Input
                                    id="phoneNumber" name="phoneNumber"
                                    value={input.phoneNumber} onChange={changeEventHandler}
                                    className="col-span-3 bg-white text-gray-800 border-gray-200 focus-visible:ring-violet-500"
                                />
                            </div>

                            {/* Bio Input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="bio" className="text-right text-gray-600 font-medium">Bio</Label>
                                <Input
                                    id="bio" name="bio"
                                    value={input.bio} onChange={changeEventHandler}
                                    className="col-span-3 bg-white text-gray-800 border-gray-200 focus-visible:ring-violet-500"
                                />
                            </div>

                            {/* --- Student Specific Fields --- */}
                            {
                                user.role === 'student' && (
                                    <>
                                        <div className='grid grid-cols-4 items-center gap-4'>
                                            <Label htmlFor="skills" className="text-right text-gray-600 font-medium">Skills</Label>
                                            <Input
                                                id="skills" name="skills"
                                                value={input.skills} onChange={changeEventHandler}
                                                className="col-span-3 bg-white text-gray-800 border-gray-200 focus-visible:ring-violet-500"
                                                placeholder="React, Node, HTML"
                                            />
                                        </div>
                                        <div className='grid grid-cols-4 items-center gap-4'>
                                            <Label htmlFor="file" className="text-right text-gray-600 font-medium">Resume</Label>
                                            <Input
                                                id="file" name="file" type="file" accept="application/pdf"
                                                onChange={fileChangeHandler}
                                                className="col-span-3 bg-white text-gray-800 border-gray-200 cursor-pointer file:text-primary file:bg-purple-50 hover:file:bg-purple-100"
                                            />
                                        </div>
                                    </>
                                )
                            }
                        </div>
                        <DialogFooter>
                            {
                                loading
                                    ? <Button className="w-full my-4 bg-primary hover:bg-violet-700 text-white"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Updating... </Button>
                                    : <Button type="submit" className="w-full my-4 bg-primary hover:bg-violet-700 text-white font-bold shadow-md hover:shadow-lg transition-all">Update</Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog