import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({ job }) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    return (
        <div className='p-6 rounded-2xl shadow-sm bg-white border border-gray-100 cursor-pointer 
                    hover:shadow-[0_10px_40px_rgba(106,13,173,0.1)] hover:border-purple-200 hover:-translate-y-1
                    transition-all duration-300 ease-in-out transform flex flex-col justify-between h-full group'>

            {/* Header */}
            <div className='flex items-center justify-between mb-4'>
                <p className='text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100'>
                    {daysAgoFunction(job?.createdAt) === 0 ? "Just Now" : `${daysAgoFunction(job?.createdAt)} days ago`}
                </p>
                <Button variant="outline" className="rounded-full w-9 h-9 border-gray-200 bg-white text-gray-400 hover:bg-purple-50 hover:text-primary hover:border-purple-100 transition-colors" size="icon">
                    <Bookmark size={16} />
                </Button>
            </div>

            {/* Company Info */}
            <div className='flex items-center gap-4 mb-4'>
                <div className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </div>
                <div>
                    <h1 className='font-bold text-lg text-gray-900 leading-none mb-1 group-hover:text-primary transition-colors'>{job?.company?.name}</h1>
                    <p className='text-xs text-gray-500 font-medium'>📍 {job?.location || "India"}</p>
                </div>
            </div>

            {/* Details */}
            <div className='mb-4'>
                <h1 className='font-bold text-xl text-gray-900 mb-2 truncate'>
                    {job?.title}
                </h1>
                <p className='text-sm text-gray-500 line-clamp-2 leading-relaxed'>
                    {job?.description}
                </p>
            </div>

            {/* Badges (Premium Gen Z) */}
            <div className='flex items-center gap-2 flex-wrap mb-6'>
                <Badge className={'badge-premium'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'badge-premium'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'badge-premium'} variant="ghost">₹{job?.salary}LPA</Badge>
            </div>

            {/* Buttons */}
            <div className='flex items-center gap-4 mt-auto'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline"
                    className="flex-1 border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary hover:bg-purple-50 transition-all font-semibold rounded-lg">
                    Details
                </Button>
                <Button className="bg-primary hover:bg-violet-700 text-white font-bold shadow-md hover:shadow-lg rounded-lg transition-all">
                    Save For Later
                </Button>
            </div>
        </div>
    )
}

export default Job