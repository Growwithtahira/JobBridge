import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({job}) => {
    const navigate = useNavigate();
    // const jobId = "lsekdhjgdsnfvsdkjf";

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }
    
    return (
    <div className='p-6 rounded-xl shadow-lg bg-[#111827] border border-gray-800 cursor-pointer 
                    hover:shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:border-yellow-500/50 hover:-translate-y-1
                    transition-all duration-300 ease-in-out transform flex flex-col justify-between h-full group'>
        
        {/* Header */}
        <div className='flex items-center justify-between mb-4'>
            <p className='text-xs font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded-full border border-gray-700'>
                {daysAgoFunction(job?.createdAt) === 0 ? "Just Now" : `${daysAgoFunction(job?.createdAt)} days ago`}
            </p>
            <Button variant="outline" className="rounded-full w-9 h-9 border-gray-700 bg-transparent text-gray-400 hover:bg-gray-800 hover:text-primary transition-colors" size="icon">
                <Bookmark size={16} />
            </Button>
        </div>

        {/* Company Info */}
        <div className='flex items-center gap-4 mb-4'>
            <div className="p-2 rounded-lg bg-white border border-gray-700"> {/* Logo background white hi rakha taaki logo dikhe */}
                <Avatar className="h-10 w-10">
                    <AvatarImage src={job?.company?.logo} />
                </Avatar>
            </div>
            <div>
                <h1 className='font-bold text-lg text-white leading-none mb-1 group-hover:text-primary transition-colors'>{job?.company?.name}</h1>
                <p className='text-xs text-gray-400 font-medium'>📍 {job?.location || "India"}</p>
            </div>
        </div>

        {/* Details */}
        <div className='mb-4'>
            <h1 className='font-bold text-xl text-gray-200 mb-2 truncate'>
                {job?.title}
            </h1>
            <p className='text-sm text-gray-500 line-clamp-2'>
                {job?.description}
            </p>
        </div>

        {/* Badges (Dark Backgrounds) */}
        <div className='flex items-center gap-2 flex-wrap mb-6'>
            <Badge className={'text-blue-400 bg-gray-800 border border-gray-700 px-3 py-1'} variant="ghost">{job?.position} Positions</Badge>
            <Badge className={'text-red-400 bg-gray-800 border border-gray-700 px-3 py-1'} variant="ghost">{job?.jobType}</Badge>
            <Badge className={'text-yellow-400 bg-gray-800 border border-gray-700 px-3 py-1'} variant="ghost">₹{job?.salary}</Badge>
        </div>

        {/* Buttons */}
        <div className='flex items-center gap-4 mt-auto'>
            <Button onClick={()=> navigate(`/description/${job?._id}`)} variant="outline"
                className="flex-1 border-gray-600 bg-transparent text-white hover:border-primary hover:text-black hover:bg-primary transition-all font-medium">
                Details
            </Button>
            <Button className="bg-primary hover:bg-yellow-500 text-black font-bold shadow-lg hover:shadow-yellow-400/20">
                Save
            </Button>
        </div>
    </div>
)
}

export default Job