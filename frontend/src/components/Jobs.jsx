import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

  // src/components/Jobs.jsx ke andar

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
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
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