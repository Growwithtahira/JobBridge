import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, SearchX, RefreshCw } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

// ---------------------------------------------------------------------------
// Salary helpers
// ---------------------------------------------------------------------------
const extractStartingSalary = (salary) => {
    if (!salary) return 0
    const raw = salary.toString().replace(/[₹,\s]/g, '')
    const nums = raw.match(/\d+/g)
    return nums ? parseInt(nums[0]) : 0
}

const matchesSalaryToken = (token, job) => {
    const s = extractStartingSalary(job?.salary)
    if (token === '__salary_0_10k') return s > 0 && s <= 10000
    if (token === '__salary_10k_25k') return s > 10000 && s <= 25000
    if (token === '__salary_25k_plus') return s > 25000
    return false
}

// ---------------------------------------------------------------------------
// Core matching engine
//
// payload shape (parsed JSON from FilterCard):
// {
//   "Location":       ["remote", "hybrid", ...],
//   "Job Role":       ["data entry", "office", ...],
//   "Monthly Salary": ["__salary_0_10k"],
//   "Job Type":       ["full-time", ...]
// }
//
// A job must satisfy ALL active categories (AND between categories).
// Within a category, ANY keyword match is sufficient (OR within category).
// ---------------------------------------------------------------------------
const jobMatchesPayload = (job, payload) => {
    const searchableText = [
        job?.title,
        job?.description,
        job?.location,
        job?.company?.name,
        job?.jobType,
        job?.requirements?.join(' '),
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

    for (const [, keywords] of Object.entries(payload)) {
        // Within this category: at least one keyword must match
        const categoryMatch = keywords.some(kw => {
            if (kw.startsWith('__salary_')) return matchesSalaryToken(kw, job)
            return searchableText.includes(kw.toLowerCase())
        })
        if (!categoryMatch) return false // AND logic between categories
    }
    return true
}

// ---------------------------------------------------------------------------
// No Jobs Found illustration component
// ---------------------------------------------------------------------------
const NoJobsFound = ({ onClear }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col items-center justify-center h-[65vh] gap-6 px-6 text-center"
    >
        {/* Animated icon */}
        <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            className="relative"
        >
            <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center shadow-inner">
                <SearchX size={44} className="text-purple-300" />
            </div>
            <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-400 font-bold text-sm shadow"
            >
                0
            </motion.div>
        </motion.div>

        <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">No Jobs Found</h2>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                We couldn't find any jobs matching your current filters.
                Try adjusting or clearing some filters to see more results.
            </p>
        </div>

        <button
            onClick={onClear}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-purple-200 transition-all hover:scale-105 active:scale-95"
        >
            <RefreshCw size={16} />
            Clear Filters & Show All
        </button>
    </motion.div>
)

// ---------------------------------------------------------------------------
// Active filter chips strip
// ---------------------------------------------------------------------------
const ActiveFilterChips = ({ payload, onClear }) => {
    const chips = Object.entries(payload).flatMap(([cat, kws]) =>
        kws
            .filter(k => !k.startsWith('__salary_'))
            .map(k => ({ cat, label: k }))
    )
    // Add salary labels
    Object.entries(payload).forEach(([, kws]) => {
        if (kws.includes('__salary_0_10k')) chips.push({ cat: 'Salary', label: '0 – 10k' })
        if (kws.includes('__salary_10k_25k')) chips.push({ cat: 'Salary', label: '10k – 25k' })
        if (kws.includes('__salary_25k_plus')) chips.push({ cat: 'Salary', label: '25k+' })
    })

    if (chips.length === 0) return null
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {chips.map((chip, i) => (
                <span
                    key={i}
                    className="flex items-center gap-1 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full capitalize"
                >
                    {chip.label}
                </span>
            ))}
            <button
                onClick={onClear}
                className="flex items-center gap-1 bg-red-50 border border-red-100 text-red-500 text-xs font-semibold px-3 py-1 rounded-full hover:bg-red-100 transition-colors"
            >
                <X size={11} /> Clear All
            </button>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Jobs page
// ---------------------------------------------------------------------------
const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job)
    const dispatch = useDispatch()
    const [filterJobs, setFilterJobs] = useState(allJobs)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [activePayload, setActivePayload] = useState({})

    useEffect(() => {
        if (!searchedQuery) {
            setFilterJobs(allJobs)
            setActivePayload({})
            return
        }

        // Try parsing structured JSON payload from FilterCard
        let payload = {}
        try {
            payload = JSON.parse(searchedQuery)
        } catch {
            // Fallback: plain text search (legacy / direct navbar search)
            const q = searchedQuery.toLowerCase()
            const results = allJobs.filter(job => {
                const text = [job?.title, job?.description, job?.location, job?.jobType]
                    .filter(Boolean).join(' ').toLowerCase()
                return text.includes(q)
            })
            setFilterJobs(results)
            setActivePayload({})
            return
        }

        if (Object.keys(payload).length === 0) {
            setFilterJobs(allJobs)
            setActivePayload({})
            return
        }

        setActivePayload(payload)
        setFilterJobs(allJobs.filter(job => jobMatchesPayload(job, payload)))
    }, [allJobs, searchedQuery])

    const clearAllFilters = () => dispatch(setSearchedQuery(""))

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto mt-5 px-4">
                <div className="flex flex-col md:flex-row gap-5">

                    {/* ── Sidebar Filter (desktop) ── */}
                    <div className="hidden md:block w-[22%] flex-shrink-0">
                        <FilterCard />
                    </div>

                    {/* ── Mobile Filter Toggle Button ── */}
                    <div className="md:hidden flex items-center gap-2 mb-2 w-full">
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="flex items-center gap-2 bg-purple-50 px-4 py-2.5 rounded-xl text-purple-700 font-bold border border-purple-100 hover:bg-purple-100 transition-colors w-full justify-center shadow-sm"
                        >
                            <Filter size={18} />
                            Filter Jobs
                            {Object.keys(activePayload).length > 0 && (
                                <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                                    {Object.values(activePayload).flat().length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* ── Mobile Filter Drawer ── */}
                    <AnimatePresence>
                        {isFilterOpen && (
                            <div className="fixed inset-0 z-50 flex md:hidden">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                                    onClick={() => setIsFilterOpen(false)}
                                />
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "-100%" }}
                                    transition={{ type: "spring", damping: 28, stiffness: 220 }}
                                    className="relative bg-white w-[82%] max-w-sm h-full shadow-2xl overflow-y-auto z-10"
                                >
                                    <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white z-10">
                                        <h2 className="text-lg font-bold text-gray-900">Filter Jobs</h2>
                                        <button
                                            onClick={() => setIsFilterOpen(false)}
                                            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <FilterCard />
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* ── Main content ── */}
                    <div className="flex-1 min-w-0">

                        {/* Active filter chips */}
                        <ActiveFilterChips payload={activePayload} onClear={clearAllFilters} />

                        {/* Results count */}
                        {filterJobs.length > 0 && (
                            <p className="text-sm text-gray-500 mb-3 font-medium">
                                Showing{' '}
                                <span className="text-purple-700 font-bold">{filterJobs.length}</span>
                                {' '}job{filterJobs.length !== 1 ? 's' : ''}
                                {Object.keys(activePayload).length > 0 ? ' matching your filters' : ''}
                            </p>
                        )}

                        {/* Grid or empty state */}
                        {filterJobs.length === 0 ? (
                            <NoJobsFound onClear={clearAllFilters} />
                        ) : (
                            <div className="h-[88vh] overflow-y-auto pb-5 hide-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <AnimatePresence>
                                        {filterJobs.map((job) => (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.88 }}
                                                transition={{ duration: 0.22 }}
                                                key={job?._id}
                                            >
                                                <Job job={job} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jobs