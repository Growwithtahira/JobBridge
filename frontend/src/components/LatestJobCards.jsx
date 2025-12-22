import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
        <div onClick={()=> navigate(`/description/${job._id}`)} className='p-6 rounded-xl shadow-lg bg-[#111827] border border-gray-800 cursor-pointer hover:shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:border-yellow-500/50 hover:-translate-y-1 transition-all duration-300 ease-in-out transform group'>
            
            {/* Company & Location */}
            <div className='flex items-center justify-between mb-2'>
                <h1 className='font-bold text-lg text-white group-hover:text-[#FACC15] transition-colors'>{job?.company?.name}</h1>
                <p className='text-sm text-gray-400'>India</p>
            </div>

            {/* Title & Description */}
            <div>
                <h1 className='font-bold text-xl text-gray-200 my-2 truncate'>{job?.title}</h1>
                <p className='text-sm text-gray-500 line-clamp-2'>{job?.description}</p>
            </div>
            
            {/* Badges (Dark Mode Friendly) */}
            <div className='flex items-center gap-2 mt-4 flex-wrap'>
                <Badge className={'text-blue-400 bg-gray-800 border border-gray-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-red-400 bg-gray-800 border border-gray-700 font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#FACC15] bg-gray-800 border border-gray-700 font-bold'} variant="ghost">₹{job?.salary}</Badge>
            </div>

        </div>
    )
}

export default LatestJobCards