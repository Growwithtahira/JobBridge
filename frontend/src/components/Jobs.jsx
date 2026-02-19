import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        if (searchedQuery) {
            const filterJobs = allJobs.filter((job) => {
                const query = searchedQuery.toLowerCase();
                const title = job?.title?.toLowerCase() || "";
                const description = job?.description?.toLowerCase() || "";
                const location = job?.location?.toLowerCase() || "";
                const salary = parseInt(job?.salary) || 0; // Salary ko number banaya

                // --- 1. Salary Logic (Special Case) ---
                if (query.includes("0 - 10k") && salary > 0 && salary <= 10000) return true;
                if (query.includes("10k - 25k") && salary > 10000 && salary <= 25000) return true;
                if (query.includes("25k+") && salary > 25000) return true;

                // --- 2. Slash (/) Split Logic (Main Fix) ---
                // Example: Filter hai "Teaching / Tutor"
                // Hum isse todenge: ["teaching", "tutor"]
                const queryWords = query.split("/").map(word => word.trim());

                // Ab check karo ki Title, Description ya Location mein inme se KOI EK bhi word hai?
                const matches = queryWords.some(word =>
                    title.includes(word) ||
                    description.includes(word) ||
                    location.includes(word) ||
                    // Thoda aur smart check for variations
                    (word === "office" && title.includes("admin")) ||
                    (word === "field" && title.includes("sales"))
                );

                return matches;
            });
            setFilterJobs(filterJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5 px-4'>
                <div className='flex flex-col md:flex-row gap-5'>

                    {/* Sidebar Filter - Hidden on Mobile */}
                    <div className='hidden md:block w-[20%]'>
                        <FilterCard />
                    </div>

                    {/* Mobile Filter Toggle Button */}
                    <div className='md:hidden flex items-center gap-2 mb-4 w-full'>
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-200 transition-colors w-full justify-center'
                        >
                            <Filter size={20} />
                            Filter Jobs
                        </button>
                    </div>

                    {/* Mobile Filter Drawer (Slide-over) */}
                    {isFilterOpen && (
                        <div className="fixed inset-0 z-50 flex md:hidden">
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                                onClick={() => setIsFilterOpen(false)}
                            ></div>

                            {/* Drawer Content */}
                            <motion.div
                                initial={{ x: -300 }}
                                animate={{ x: 0 }}
                                exit={{ x: -300 }}
                                className="relative bg-white w-3/4 max-w-sm h-full shadow-2xl p-5 overflow-y-auto"
                            >
                                <div className='flex items-center justify-between mb-5'>
                                    <h2 className='text-xl font-bold text-gray-900'>Filters</h2>
                                    <button onClick={() => setIsFilterOpen(false)} className='p-2 hover:bg-gray-100 rounded-full'>
                                        <X size={24} />
                                    </button>
                                </div>
                                <FilterCard />
                            </motion.div>
                        </div>
                    )}

                    {/* Job Cards Grid */}
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5 md:pl-4'>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs