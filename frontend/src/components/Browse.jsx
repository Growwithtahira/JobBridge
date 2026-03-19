import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { motion, AnimatePresence } from 'framer-motion';

const Browse = () => {
    useGetAllJobs(); // Saari jobs fetch ho rahi hain
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const dispatch = useDispatch();

    // Cleanup: Jab user browse page se jaye toh search clear ho jaye
    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, [dispatch]);

    // Filtering Logic: Jab bhi allJobs ya searchedQuery change ho
    useEffect(() => {
        if (searchedQuery) {
            const filtered = allJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase());
            });
            setFilterJobs(filtered);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className='min-h-screen bg-gray-50/50'>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                {/* Header Section */}
                <div className='flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4'>
                    <div>
                        <h1 className='font-extrabold text-3xl text-gray-900'>
                            Search Results
                            <span className='text-primary ml-2'>({filterJobs.length})</span>
                        </h1>
                        <p className='text-gray-500 mt-1'>
                            {searchedQuery ? `Showing results for "${searchedQuery}"` : "Discover your next career move"}
                        </p>
                    </div>
                </div>

                {/* Jobs Grid */}
                {filterJobs.length <= 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300'
                    >
                        <img src="/no-jobs.svg" alt="No Jobs" className='w-40 h-40 opacity-50 mb-4' />
                        <h2 className='text-2xl font-bold text-gray-700'>No Jobs Found</h2>
                        <p className='text-gray-500'>Try adjusting your search or filters.</p>
                    </motion.div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        <AnimatePresence>
                            {filterJobs.map((job) => (
                                <motion.div
                                    key={job._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Job job={job} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Browse;