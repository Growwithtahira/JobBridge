import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'

// Suggested Skills Dictionary
const SUGGESTED_SKILLS = {
    Technical: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'HTML', 'CSS', 'Python', 'Java', 'SQL'],
    Marketing: ['SEO', 'Social Media', 'Content Marketing', 'Sales', 'B2B'],
    SoftSkills: ['Communication', 'Leadership', 'Problem Solving', 'Teamwork']
};

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        file: "",
        profilePhoto: ""
    });

    // Skills State
    const [selectedSkills, setSelectedSkills] = useState(user?.profile?.skills || []);
    const [skillInputValue, setSkillInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [previewDP, setPreviewDP] = useState(user?.profile?.profilePhoto || "");

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file: file })
    }

    const profilePhotoChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, profilePhoto: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewDP(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    // --- SKILLS LOGIC START ---
    const addSkill = (skill) => {
        const trimmedSkill = skill.trim();
        if (trimmedSkill && !selectedSkills.includes(trimmedSkill)) {
            setSelectedSkills([...selectedSkills, trimmedSkill]);
        }
        setSkillInputValue("");
        setShowSuggestions(false);
    }

    const removeSkill = (skillToRemove) => {
        setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
    }

    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault(); // Prevents form submission
            addSkill(skillInputValue);
        }
    }
    // --- SKILLS LOGIC END ---

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);

        if (user.role === 'student') {
            // Backend expects a comma-separated string for skills
            formData.append("skills", selectedSkills.join(","));

            if (input.file) {
                formData.append("file", input.file);
            }
        }

        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
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
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white text-gray-900 border-gray-100 shadow-2xl max-h-[90vh] overflow-y-auto" onInteractOutside={() => setOpen(false)}>

                    <DialogHeader>
                        <DialogTitle className="text-gray-900 font-bold text-xl">Update Profile</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={submitHandler}>
                        <div className='grid gap-4 py-4'>

                            {/* --- Profile Photo Section --- */}
                            <div className="flex flex-col items-center gap-3 mb-2">
                                <Avatar className="w-24 h-24 border-2 border-primary/20 shadow-sm">
                                    <AvatarImage src={previewDP} alt="Profile" className="object-cover" />
                                    <AvatarFallback>{user?.fullname?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="flex items-center justify-center w-full">
                                    <Label htmlFor="profilePhoto" className="cursor-pointer bg-purple-50 text-primary hover:bg-purple-100 px-4 py-2 rounded-full text-sm font-semibold transition-colors border border-purple-100">
                                        Change Photo
                                    </Label>
                                    <Input
                                        id="profilePhoto" name="profilePhoto" type="file" accept="image/*"
                                        className="hidden" onChange={profilePhotoChangeHandler}
                                    />
                                </div>
                            </div>

                            {/* --- Common Fields --- */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="fullname" className="text-right text-gray-600 font-medium text-sm">Name</Label>
                                <Input id="fullname" name="fullname" value={input.fullname} onChange={changeEventHandler} className="col-span-3" />
                            </div>

                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right text-gray-600 font-medium text-sm">Email</Label>
                                <Input id="email" name="email" value={input.email} onChange={changeEventHandler} className="col-span-3" />
                            </div>

                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="phoneNumber" className="text-right text-gray-600 font-medium text-sm">Phone</Label>
                                <Input id="phoneNumber" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} className="col-span-3" />
                            </div>

                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="bio" className="text-right text-gray-600 font-medium text-sm">Bio</Label>
                                <Input id="bio" name="bio" value={input.bio} onChange={changeEventHandler} className="col-span-3" />
                            </div>

                            {/* --- Student Specific Fields (Skills & Resume) --- */}
                            {
                                user.role === 'student' && (
                                    <>
                                        {/* Modern Skills Input */}
                                        <div className='grid grid-cols-4 items-start gap-4'>
                                            <Label className="text-right text-gray-600 font-medium text-sm mt-3">Skills</Label>
                                            <div className="col-span-3 flex flex-col gap-2 relative">

                                                {/* Selected Skills Badges */}
                                                <div className="flex flex-wrap gap-2 mb-1">
                                                    {selectedSkills.map((skill, index) => (
                                                        <Badge key={index} className="bg-purple-50 text-primary border border-purple-200 px-2 py-1 flex items-center gap-1 font-medium shadow-sm hover:bg-purple-100 transition-colors">
                                                            {skill}
                                                            <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeSkill(skill)} />
                                                        </Badge>
                                                    ))}
                                                </div>

                                                {/* Skill Input Area */}
                                                <Input
                                                    value={skillInputValue}
                                                    onChange={(e) => setSkillInputValue(e.target.value)}
                                                    onKeyDown={handleSkillKeyDown}
                                                    onFocus={() => setShowSuggestions(true)}
                                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay so click registers
                                                    placeholder="Type a skill and press Enter"
                                                    className="w-full bg-white text-gray-800 border-gray-200 focus-visible:ring-violet-500"
                                                />
                                                <p className="text-xs text-gray-400 -mt-1">Press Enter or comma to add a skill</p>

                                                {/* Skill Suggestions Dropdown */}
                                                {showSuggestions && (
                                                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-3 max-h-48 overflow-y-auto">
                                                        {Object.entries(SUGGESTED_SKILLS).map(([category, skillsList]) => (
                                                            <div key={category} className="mb-3 last:mb-0">
                                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{category}</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {skillsList.filter(s => !selectedSkills.includes(s)).map((skill) => (
                                                                        <span
                                                                            key={skill}
                                                                            onClick={() => addSkill(skill)}
                                                                            className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2 py-1 rounded-md cursor-pointer hover:bg-purple-50 hover:text-primary transition-colors"
                                                                        >
                                                                            + {skill}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Resume Input */}
                                        <div className='grid grid-cols-4 items-center gap-4 mt-2'>
                                            <Label htmlFor="file" className="text-right text-gray-600 font-medium text-sm">Resume</Label>
                                            <Input
                                                id="file" name="file" type="file" accept="application/pdf"
                                                onChange={fileChangeHandler}
                                                className="col-span-3 bg-white text-gray-800 border-gray-200 cursor-pointer file:text-primary file:bg-purple-50 hover:file:bg-purple-100 text-sm"
                                            />
                                        </div>
                                    </>
                                )
                            }
                        </div>
                        <DialogFooter>
                            {
                                loading
                                    ? <Button disabled className="w-full my-4 bg-primary text-white opacity-80"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Updating... </Button>
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