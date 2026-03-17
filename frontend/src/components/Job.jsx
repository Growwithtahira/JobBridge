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
        <div className='p-4 sm:p-6 rounded-2xl shadow-sm bg-white border border-gray-100 cursor-pointer 
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
            <div className='flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4'>
                <div className="p-1.5 sm:p-2 shrink-0 rounded-xl bg-white border border-gray-100 shadow-sm">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </div>
                <div>
                    <h1 className='font-bold text-base sm:text-lg text-gray-900 leading-tight mb-0.5 group-hover:text-primary transition-colors'>{job?.company?.name}</h1>
                    <p className='text-[10px] sm:text-xs text-gray-500 font-medium'>📍 {job?.location || "India"}</p>
                </div>
            </div>

            {/* Details */}
            <div className='mb-3 sm:mb-4'>
                <h1 className='font-bold text-lg sm:text-xl text-gray-900 mb-1 sm:mb-2 truncate'>
                    {job?.title}
                </h1>
                <p className='text-xs sm:text-sm text-gray-500 line-clamp-1 sm:line-clamp-2 leading-relaxed'>
                    {job?.description}
                </p>
            </div>

            {/* Badges (Premium Gen Z) */}
            <div className='flex items-center gap-1.5 sm:gap-2 flex-wrap mb-4 sm:mb-6'>
                <Badge className={'badge-premium text-[10px] sm:text-xs px-2 sm:px-4 py-1 sm:py-1.5'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'badge-premium text-[10px] sm:text-xs px-2 sm:px-4 py-1 sm:py-1.5'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'badge-premium text-[10px] sm:text-xs px-2 sm:px-4 py-1 sm:py-1.5'} variant="ghost">₹{job?.salary}LPA</Badge>
            </div>

            {/* Buttons */}
            <div className='flex flex-row items-center gap-2 sm:gap-4 mt-auto pt-3 sm:pt-4 border-t border-gray-50'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline"
                    className="flex-1 h-8 sm:h-10 text-xs sm:text-sm border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary hover:bg-purple-50 transition-all font-semibold rounded-lg px-2 sm:px-4">
                    Details
                </Button>
                <Button className="flex-1 h-8 sm:h-10 text-xs sm:text-sm bg-primary hover:bg-violet-700 text-white font-bold shadow-md hover:shadow-lg rounded-lg transition-all px-2 sm:px-4">
                    Save Later
                </Button>
            </div>
        </div>
    )
}

export default Job