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
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const isResume = user?.profile?.resume ? true : false;

    return (
        <div className='bg-gray-50 min-h-screen pb-10 transition-colors duration-300'>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-100 rounded-2xl my-5 p-8 text-gray-800 shadow-sm mx-4 md:mx-auto hover:shadow-md transition-shadow'>
                <div className='flex flex-col md:flex-row justify-between gap-4'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24 border-2 border-purple-100 shadow-sm">
                            <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-bold text-2xl text-gray-900'>{user?.fullname}</h1>
                            <p className='text-gray-500 font-medium'>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right border-gray-200 hover:bg-purple-50 hover:text-primary transition-colors" variant="outline"><Pen className="w-4 h-4 mr-2" /> Edit Profile</Button>
                </div>

                <div className='my-5 text-gray-600'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail className='w-4 h-4 text-gray-400' />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact className='w-4 h-4 text-gray-400' />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>

                <div className='my-5'>
                    <h1 className='font-bold text-lg mb-2 text-gray-900'>Skills</h1>
                    <div className='flex items-center gap-2 flex-wrap'>
                        {
                            user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => <Badge key={index} className="bg-purple-50 text-primary border-purple-100 hover:bg-purple-100 transition-colors" variant="outline">{item}</Badge>) : <span className='text-gray-400'>NA</span>
                        }
                    </div>
                </div>

                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold text-gray-900">Resume</Label>
                    {
                        isResume ? <a target='blank' href={user?.profile?.resume} className='text-primary w-full hover:underline cursor-pointer font-medium hover:text-violet-700 transition-colors'>{user?.profile?.resumeOriginalName}</a> : <span className='text-gray-400'>NA</span>
                    }
                </div>
            </div>

            {
                user?.role !== 'recruiter' && (
                    <div className='max-w-4xl mx-auto bg-white border border-gray-100 rounded-2xl text-gray-800 p-6 shadow-sm mx-4 md:mx-auto mt-6'>
                        <h1 className='font-bold text-xl my-4 text-gray-900'>Applied Jobs</h1>
                        <div className='overflow-x-auto rounded-lg border border-gray-100'>
                            <AppliedJobTable />
                        </div>
                    </div>
                )
            }

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile