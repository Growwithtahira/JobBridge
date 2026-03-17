import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion'; // 👈 AnimatePresence import kiya
import { Filter, X } from 'lucide-react';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        if (searchedQuery) {
            const filteredData = allJobs.filter((job) => {
                const query = searchedQuery.toLowerCase();
                const title = job?.title?.toLowerCase() || "";
                const description = job?.description?.toLowerCase() || "";
                const location = job?.location?.toLowerCase() || "";

                // Salary ko safely extract karna (Removing commas, spaces, and ₹)
                const rawSalary = job?.salary?.toString().toLowerCase().replace(/[₹,\s]/g, '') || "";

                // Pehle check karte hain agar numbers hain, toh unhe nikal lo
                const salaryNumbers = rawSalary.match(/\d+/g);
                const startingSalary = salaryNumbers ? parseInt(salaryNumbers[0]) : 0;

                // --- 1. Salary Logic (Fixed for Strings like "15000" or "300000 LPA") ---
                // Note: Agar LPA me hai (jaise 3,00,000) toh wo 25k+ me aayega
                if (query.includes("0 - 10k") && startingSalary > 0 && startingSalary <= 10000) return true;
                if (query.includes("10k - 25k") && startingSalary > 10000 && startingSalary <= 25000) return true;
                if (query.includes("25k+") && startingSalary > 25000) return true;

                // --- 2. Slash (/) Split Logic ---
                const queryWords = query.split("/").map(word => word.trim());

                const matches = queryWords.some(word =>
                    title.includes(word) ||
                    description.includes(word) ||
                    location.includes(word) ||
                    (word === "office" && title.includes("admin")) ||
                    (word === "field" && title.includes("sales")) ||
                    (word === "part-time" && job?.jobType?.toLowerCase().includes("part")) ||
                    (word === "internship" && job?.jobType?.toLowerCase().includes("intern"))
                );

                return matches;
            });
            setFilterJobs(filteredData);
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
                            className='flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-xl text-primary font-bold border border-purple-100 hover:bg-purple-100 transition-colors w-full justify-center shadow-sm'
                        >
                            <Filter size={20} />
                            Filter Jobs
                        </button>
                    </div>

                    {/* Mobile Filter Drawer (Slide-over) with AnimatePresence */}
                    <AnimatePresence>
                        {isFilterOpen && (
                            <div className="fixed inset-0 z-50 flex md:hidden">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                                    onClick={() => setIsFilterOpen(false)}
                                ></motion.div>

                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "-100%" }}
                                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                    className="relative bg-white w-[80%] max-w-sm h-full shadow-2xl p-5 overflow-y-auto z-10"
                                >
                                    <div className='flex items-center justify-between mb-5 pb-3 border-b'>
                                        <h2 className='text-xl font-bold text-gray-900'>Filters</h2>
                                        <button onClick={() => setIsFilterOpen(false)} className='p-2 hover:bg-gray-100 rounded-full bg-gray-50 text-gray-600'>
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <FilterCard />
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Job Cards Grid */}
                    {
                        filterJobs.length <= 0 ? (
                            <div className="flex-1 flex justify-center items-center h-[50vh]">
                                <span className="text-gray-500 text-lg font-medium">No jobs found matching your filters.</span>
                            </div>
                        ) : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5 md:pl-4 hide-scrollbar'>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {/* List items ke liye bhi AnimatePresence chahiye */}
                                    <AnimatePresence>
                                        {
                                            filterJobs.map((job) => (
                                                <motion.div
                                                    layout // Smoothly adjusts position when items are removed
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ duration: 0.2 }}
                                                    key={job?._id}>
                                                    <Job job={job} />
                                                </motion.div>
                                            ))
                                        }
                                    </AnimatePresence>
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