import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion';

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, rotate: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => navigate(`/description/${job._id}`)}
            className='p-4 sm:p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-gray-100 cursor-pointer 
            hover:border-orange-400/50 hover:shadow-xl hover:bg-white/80
            transition-all duration-300 ease-in-out group flex flex-col justify-between h-full relative overflow-hidden'
        >
            {/* Glow Effect on Hover - Subtle warm glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-100/30 to-transparent -translate-x-full group-hover:animate-shimmer z-0" />

            <div className='relative z-10 flex-col sm:flex-row flex sm:items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3'>
                {/* Company & Location */}
                <div className='flex items-center justify-between mb-2 sm:mb-3 w-full sm:w-auto'>
                    <div className='bg-gray-50 p-1.5 sm:p-2 rounded-lg border border-gray-100 shadow-sm'>
                        {/* Placeholder Logo if no image */}
                        <h1 className='font-bold text-base sm:text-lg text-gray-900 group-hover:text-primary transition-colors'>{job?.company?.name?.charAt(0) || "C"}</h1>
                    </div>
                    <span className='text-[10px] sm:text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full border border-gray-200 mt-0'>India</span>
                </div>

                {/* Title & Description */}
                <div className='mb-2 sm:mb-4'>
                    <h1 className='font-bold text-lg sm:text-xl text-gray-900 mb-1 sm:mb-2 truncate group-hover:text-primary transition-colors'>{job?.title}</h1>
                    <p className='text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3 leading-relaxed'>{job?.description}</p>
                </div>
            </div>

            {/* Badges - Premium Gen Z Style */}
            <div className='relative z-10 flex flex-wrap items-center gap-1.5 sm:gap-2 mt-auto pt-1 sm:pt-2'>
                <Badge className={'badge-premium whitespace-normal text-center text-[10px] sm:text-xs px-2 sm:px-4 py-1 sm:py-1.5'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'badge-premium whitespace-normal text-center text-[10px] sm:text-xs px-2 sm:px-4 py-1 sm:py-1.5'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'badge-premium whitespace-normal text-center text-[10px] sm:text-xs px-2 sm:px-4 py-1 sm:py-1.5'} variant="ghost">₹{job?.salary}LPA</Badge>
            </div>

        </motion.div>
    )
}

export default LatestJobCards