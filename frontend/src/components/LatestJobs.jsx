import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className='max-w-7xl mx-auto my-10 md:my-20 px-4'>
            {/* Heading updated to White & Yellow */}
            <motion.h1
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className='text-4xl font-bold text-gray-900 mb-8'
            >
                <span className='text-gradient'>Latest & Top </span> Job Openings
            </motion.h1>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-10'
            >
                {
                    allJobs.length <= 0 ? <span className='text-gray-400'>No Job Available</span> : allJobs.slice(0, 6).map((job) => <LatestJobCards key={job._id} job={job} />)
                }
            </motion.div>
        </div>
    )
}

export default LatestJobs