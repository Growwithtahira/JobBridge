import React, { useEffect, useState, useRef } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, X, Briefcase, MapPin, TrendingUp,
    Sparkles, ChevronDown, LayoutGrid, List,
    Clock, Building2, Zap, SlidersHorizontal, ArrowRight
} from 'lucide-react'
const isJsonPayload = (str) => {
    try { const p = JSON.parse(str); return typeof p === 'object' && p !== null }
    catch { return false }
}
// ─── Animation variants ────────────────────────────────────────────────────────
const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } }
}
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.18 } }
}

// ─── Sort options ──────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'az', label: 'A → Z (Title)' },
    { value: 'za', label: 'Z → A (Title)' },
]

// ─── Quick filter chips ────────────────────────────────────────────────────────
const QUICK_FILTERS = [
    { label: 'All', value: '', icon: <Sparkles size={12} /> },
    { label: 'Full-Time', value: 'full time', icon: <Briefcase size={12} /> },
    { label: 'Part-Time', value: 'part time', icon: <Clock size={12} /> },
    { label: 'Internship', value: 'internship', icon: <Zap size={12} /> },
    { label: 'Remote', value: 'remote', icon: <MapPin size={12} /> },
]

// ─── Sort helper ───────────────────────────────────────────────────────────────
const sortJobs = (jobs, mode) => {
    const arr = [...jobs]
    if (mode === 'oldest') return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    if (mode === 'newest') return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (mode === 'az') return arr.sort((a, b) => a.title?.localeCompare(b.title))
    if (mode === 'za') return arr.sort((a, b) => b.title?.localeCompare(a.title))
    return arr
}

// ─── Stat pill ─────────────────────────────────────────────────────────────────
const StatPill = ({ icon, value, label }) => (
    <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-4 py-2.5 shadow-sm">
        <span className="text-purple-600">{icon}</span>
        <div>
            <div className="text-sm font-bold text-gray-900 leading-none">{value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
        </div>
    </div>
)

// ─── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = ({ query, onClear }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="col-span-full flex flex-col items-center justify-center py-24 px-6 text-center bg-white rounded-3xl border border-dashed border-purple-100 shadow-sm"
    >
        <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center mb-6"
        >
            <Search size={36} className="text-purple-300" strokeWidth={1.5} />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Jobs Found</h2>
        <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-7">
            {query
                ? <>No results for <span className="font-semibold text-gray-700">"{query}"</span>. Try different keywords or clear your search.</>
                : 'No jobs available right now. Check back soon!'}
        </p>

        {query && (
            <button
                onClick={onClear}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md shadow-purple-200 transition-all hover:scale-105 active:scale-95"
            >
                <X size={14} /> Clear Search
            </button>
        )}
    </motion.div>
)

// ─── Main Browse component ─────────────────────────────────────────────────────
const Browse = () => {
    useGetAllJobs()
    const { allJobs, searchedQuery } = useSelector(store => store.job)
    const dispatch = useDispatch()

    const [localQuery, setLocalQuery] = useState(
        searchedQuery && !isJsonPayload(searchedQuery) ? searchedQuery : ''
    )
    const [filterJobs, setFilterJobs] = useState(allJobs)
    const [quickFilter, setQuickFilter] = useState('')
    const [sortMode, setSortMode] = useState('newest')
    const [viewMode, setViewMode] = useState('grid')
    const [sortOpen, setSortOpen] = useState(false)
    const sortRef = useRef(null)



    // Cleanup on unmount
    useEffect(() => () => dispatch(setSearchedQuery('')), [dispatch])

    // Close sort dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    // Debounce local input → redux (300ms)
    useEffect(() => {
        if (searchedQuery && isJsonPayload(searchedQuery)) {
            setLocalQuery('')
        }
    }, [searchedQuery])
    useEffect(() => {
        const t = setTimeout(() => dispatch(setSearchedQuery(localQuery)), 300)
        return () => clearTimeout(t)
    }, [localQuery, dispatch])

    // Filter + sort
    useEffect(() => {
        let jobs = allJobs

        // Filter logic — normalize karo
        if (quickFilter) {
            const q = quickFilter.toLowerCase().trim()
            jobs = jobs.filter(job => {
                const type = job.jobType?.toLowerCase().trim() || ''
                return type.includes(q) ||
                    job.location?.toLowerCase().trim().includes(q) ||
                    job.title?.toLowerCase().includes(q) ||
                    job.description?.toLowerCase().includes(q)
            })
        }

        if (searchedQuery) {
            const q = searchedQuery.toLowerCase().trim()
            jobs = jobs.filter(job =>
                job.title?.toLowerCase().includes(q) ||
                job.description?.toLowerCase().includes(q) ||
                job.location?.toLowerCase().includes(q) ||
                job.company?.name?.toLowerCase().includes(q) ||
                job.jobType?.toLowerCase().trim().includes(q)
            )
        }

        setFilterJobs(sortJobs(jobs, sortMode))
    }, [allJobs, searchedQuery, quickFilter, sortMode])

    const clearSearch = () => {
        setLocalQuery('')
        dispatch(setSearchedQuery(''))
        setQuickFilter('')
    }

    const uniqueLocations = [...new Set(allJobs.map(j => j.location).filter(Boolean))].length
    const uniqueCompanies = [...new Set(allJobs.map(j => j.company?.name).filter(Boolean))].length
    const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortMode)?.label

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            {/* ── Hero Header ─────────────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 pt-10 pb-8">

                    {/* Label */}
                    <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-100 text-purple-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
                    >
                        <TrendingUp size={11} /> Live Job Board
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.38, delay: 0.05 }}
                        className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-1"
                    >
                        {searchedQuery
                            ? (() => {
                                try {
                                    const p = JSON.parse(searchedQuery)
                                    return typeof p === 'object'
                                        ? <>Filtered <span className="text-purple-600">Results</span></>
                                        : <>Results for <span className="text-purple-600">"{searchedQuery}"</span></>
                                } catch {
                                    return <>Results for <span className="text-purple-600">"{searchedQuery}"</span></>
                                }
                            })()
                            : <>Browse <span className="text-purple-600">Opportunities</span></>
                        }
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.36, delay: 0.09 }}
                        className="text-gray-500 text-sm mb-6"
                    >
                        {filterJobs.length > 0
                            ? `${filterJobs.length} job${filterJobs.length !== 1 ? 's' : ''} found — discover your next career move`
                            : 'No matching jobs right now'}
                    </motion.p>

                    {/* Stat pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.36, delay: 0.13 }}
                        className="flex flex-wrap gap-3 mb-7"
                    >
                        <StatPill icon={<Briefcase size={14} />} value={allJobs.length} label="Total Jobs" />
                        <StatPill icon={<Building2 size={14} />} value={uniqueCompanies} label="Companies" />
                        <StatPill icon={<MapPin size={14} />} value={uniqueLocations} label="Locations" />
                    </motion.div>

                    {/* Search bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.38, delay: 0.16 }}
                        className="relative max-w-2xl"
                    >
                        <div className="flex items-center bg-white border-2 border-gray-200 focus-within:border-purple-400 rounded-2xl shadow-sm transition-all duration-200 overflow-hidden">
                            <Search size={17} className="ml-4 text-gray-400 flex-shrink-0" />
                            <input
                                type="text"
                                value={localQuery}
                                onChange={e => setLocalQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && dispatch(setSearchedQuery(localQuery))}
                                placeholder="Job title, company, location…"
                                className="flex-1 px-3 py-3.5 text-sm text-gray-700 placeholder-gray-300 bg-transparent outline-none"
                            />
                            <AnimatePresence>
                                {localQuery && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.7 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.7 }}
                                        onClick={clearSearch}
                                        className="mr-2 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                                    >
                                        <X size={14} />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                            <button
                                onClick={() => dispatch(setSearchedQuery(localQuery))}
                                className="m-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-purple-200"
                            >
                                Search <ArrowRight size={14} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Toolbar + Grid ───────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 py-6">

                {/* Toolbar */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.2 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5"
                >
                    {/* Quick filter chips */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                        {QUICK_FILTERS.map(f => (
                            <button
                                key={f.value}
                                onClick={() => setQuickFilter(f.value)}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all duration-150
                                    ${quickFilter === f.value
                                        ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-100'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-purple-200 hover:text-purple-600'
                                    }`}
                            >
                                {f.icon} {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Right: sort + view toggle */}
                    <div className="flex items-center gap-2 flex-shrink-0">

                        {/* Sort dropdown */}
                        <div ref={sortRef} className="relative">
                            <button
                                onClick={() => setSortOpen(o => !o)}
                                className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:border-purple-300 hover:text-purple-600 px-3.5 py-2 rounded-xl transition-colors"
                            >
                                <SlidersHorizontal size={13} />
                                {currentSortLabel}
                                <ChevronDown size={12} className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {sortOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 overflow-hidden"
                                    >
                                        {SORT_OPTIONS.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => { setSortMode(opt.value); setSortOpen(false) }}
                                                className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors
                                                    ${sortMode === opt.value
                                                        ? 'bg-purple-50 text-purple-700 font-semibold'
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Grid / List toggle */}
                        <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-purple-600'}`}
                            >
                                <LayoutGrid size={15} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-purple-600'}`}
                            >
                                <List size={15} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Active filter badges */}
                <AnimatePresence>
                    {(searchedQuery || quickFilter) && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                            className="flex flex-wrap items-center gap-2 mb-5"
                        >
                            <span className="text-xs text-gray-400 font-medium">Active filters:</span>
                            {searchedQuery && (
                                <span className="flex items-center gap-1.5 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                                    "{searchedQuery}"
                                    <button
                                        onClick={() => { setLocalQuery(''); dispatch(setSearchedQuery('')) }}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <X size={11} />
                                    </button>
                                </span>
                            )}
                            {quickFilter && (
                                <span className="flex items-center gap-1.5 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full capitalize">
                                    {quickFilter}
                                    <button onClick={() => setQuickFilter('')} className="hover:text-red-500 transition-colors">
                                        <X size={11} />
                                    </button>
                                </span>
                            )}
                            <button
                                onClick={clearSearch}
                                className="text-xs text-red-400 hover:text-red-600 font-semibold hover:underline transition-colors"
                            >
                                Clear All
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results count */}
                {filterJobs.length > 0 && (
                    <p className="text-sm text-gray-500 font-medium mb-4">
                        Showing <span className="text-purple-600 font-bold">{filterJobs.length}</span> job{filterJobs.length !== 1 ? 's' : ''}
                    </p>
                )}

                {/* Job cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className={viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-16'
                        : 'flex flex-col gap-4 pb-16'
                    }
                >
                    <AnimatePresence mode="popLayout">
                        {filterJobs.length === 0
                            ? <EmptyState query={searchedQuery} onClear={clearSearch} />
                            : filterJobs.map((job) => (
                                <motion.div
                                    key={job._id}
                                    variants={cardVariants}
                                    layout
                                    exit="exit"
                                >
                                    <Job job={job} />
                                </motion.div>
                            ))
                        }
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    )
}

export default Browse