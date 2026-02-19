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
            className='p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-gray-100 cursor-pointer 
            hover:border-orange-400/50 hover:shadow-xl hover:bg-white/80
            transition-all duration-300 ease-in-out group flex flex-col justify-between h-full relative overflow-hidden'
        >
            {/* Glow Effect on Hover - Subtle warm glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-100/30 to-transparent -translate-x-full group-hover:animate-shimmer z-0" />

            <div className='relative z-10'>
                {/* Company & Location */}
                <div className='flex items-center justify-between mb-3'>
                    <div className='bg-gray-50 p-2 rounded-lg border border-gray-100 shadow-sm'>
                        {/* Placeholder Logo if no image */}
                        <h1 className='font-bold text-lg text-gray-900 group-hover:text-primary transition-colors'>{job?.company?.name?.charAt(0) || "C"}</h1>
                    </div>
                    <span className='text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full border border-gray-200'>India</span>
                </div>

                {/* Title & Description */}
                <div className='mb-4'>
                    <h1 className='font-bold text-xl text-gray-900 mb-2 truncate group-hover:text-primary transition-colors'>{job?.title}</h1>
                    <p className='text-sm text-gray-600 line-clamp-3 leading-relaxed'>{job?.description}</p>
                </div>
            </div>

            {/* Badges - Premium Gen Z Style */}
            <div className='relative z-10 flex items-center gap-2 mt-auto flex-wrap'>
                <Badge className={'badge-premium'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'badge-premium'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'badge-premium'} variant="ghost">₹{job?.salary}LPA</Badge>
            </div>

        </motion.div>
    )
}

export default LatestJobCards