import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const Profile = () => {
    // Sirf students ke liye applied jobs fetch karo
    useGetAppliedJobs(); 
    
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    // Resume check: Agar user ke paas resume file hai toh true
    const isResume = user?.profile?.resume ? true : false; 

    return (
        <div>
            <Navbar />
<div className='max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl my-5 p-8 text-white'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            {/* FIX: User ki apni photo dikhao, nahi toh default */}
                            <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    {/* Edit Button - Is click se UpdateProfileDialog khulega */}
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button>
                    
                </div>
                
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>

                <div className='my-5'>
                    <h1>Skills</h1>
                    <div className='flex items-center gap-1'>
                        {
                            user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => <Badge key={index}>{item}</Badge>) : <span>NA</span>
                        }
                    </div>
                </div>

                <div className='grid w-full max-w-sm items-center gap-1.5'>
                   <Label className="text-md font-bold text-white">Resume</Label>
                    {
                        isResume ? <a target='blank' href={user?.profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>{user?.profile?.resumeOriginalName}</a> : <span>NA</span>
                    }
                </div>
            </div>

            {/* LOGIC FIX: Yeh table sirf STUDENT ko dikhna chahiye */}
            {
                user?.role !== 'recruiter' && (
                  <div className='max-w-4xl mx-auto bg-gray-900 border-gray-800 rounded-2xl text-white'>
    <h1 className='font-bold text-lg my-5 text-white'>Applied Jobs</h1>
    {/* Table text might need fix, but start with container */}
    <AppliedJobTable />
</div>
                )
            }

            {/* Yeh component skills update karega */}
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile