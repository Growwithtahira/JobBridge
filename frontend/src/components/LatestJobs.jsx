import React, { useMemo, useState } from 'react'
import LatestJobCards from './LatestJobCards'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Briefcase, RefreshCw, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ── Animation variants ─────────────────────────────────────────────────────────
const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } }
}
const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, scale: 0.94, transition: { duration: 0.2 } }
}

// ── Age label helper ───────────────────────────────────────────────────────────
const getAgeLabel = (dateStr) => {
    if (!dateStr) return null
    const diff = Date.now() - new Date(dateStr).getTime()
    const hours = Math.floor(diff / 3_600_000)
    const days = Math.floor(diff / 86_400_000)
    if (hours < 1) return { text: 'Just now', hot: true }
    if (hours < 24) return { text: `${hours}h ago`, hot: true }
    if (days === 1) return { text: 'Yesterday', hot: false }
    if (days <= 6) return { text: `${days}d ago`, hot: false }
    return null
}

// ── Skeleton loader card ───────────────────────────────────────────────────────
const SkeletonCard = ({ i }) => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.06 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3"
    >
        <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gray-100 animate-pulse" />
            <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded-full w-3/4 animate-pulse" />
                <div className="h-2.5 bg-gray-100 rounded-full w-1/2 animate-pulse" />
            </div>
        </div>
        <div className="space-y-2 pt-1">
            <div className="h-2.5 bg-gray-100 rounded-full w-full animate-pulse" />
            <div className="h-2.5 bg-gray-100 rounded-full w-5/6 animate-pulse" />
        </div>
        <div className="flex gap-2 pt-1">
            <div className="h-6 w-16 bg-purple-50 rounded-full animate-pulse" />
            <div className="h-6 w-20 bg-purple-50 rounded-full animate-pulse" />
        </div>
    </motion.div>
)

// ── Placeholder card (fills empty slots so grid always has 6) ─────────────────
const PLACEHOLDER_DATA = [
    { title: "Software Developer", company: "Tech Company", location: "Bareilly", type: "Full-Time" },
    { title: "Graphic Designer", company: "Creative Studio", location: "Remote", type: "Full-Time" },
    { title: "Sales Executive", company: "Growth Corp", location: "Civil Lines", type: "Full-Time" },
    { title: "Data Entry Operator", company: "Office Hub", location: "D.D. Puram", type: "Part-Time" },
    { title: "Digital Marketer", company: "Media Agency", location: "Remote", type: "Freelance" },
    { title: "Customer Support", company: "Service Hub", location: "Bareilly", type: "Full-Time" },
]

const PlaceholderCard = ({ index }) => {
    const p = PLACEHOLDER_DATA[index % PLACEHOLDER_DATA.length]
    return (
        <motion.div
            variants={cardVariants}
            className="relative bg-white rounded-2xl border border-dashed border-purple-100 shadow-sm p-5 overflow-hidden group cursor-default"
        >
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1.5px] flex flex-col items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl">
                <Briefcase size={22} className="text-purple-300 mb-1.5" strokeWidth={1.5} />
                <p className="text-xs font-bold text-purple-400">Opening Soon</p>
            </div>

            {/* Blurred preview */}
            <div className="filter blur-[1.5px] select-none pointer-events-none">
                <div className="flex items-start gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center font-bold text-primary text-lg flex-shrink-0">
                        {p.company[0]}
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium">{p.company}</p>
                        <p className="text-sm font-bold text-gray-700">{p.title}</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    <span className="text-[11px] font-semibold bg-purple-50 text-purple-500 px-2.5 py-1 rounded-full">{p.type}</span>
                    <span className="text-[11px] font-semibold bg-gray-50 text-gray-400 px-2.5 py-1 rounded-full">📍 {p.location}</span>
                </div>
            </div>
        </motion.div>
    )
}

// ── Main LatestJobs ────────────────────────────────────────────────────────────
const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job)
    const navigate = useNavigate()
    const [showAll, setShowAll] = useState(false)
    const INITIAL_COUNT = 6

    // Always sort newest first
    const sortedJobs = useMemo(() => (
        [...allJobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ), [allJobs])

    const displayLimit = showAll ? sortedJobs.length : INITIAL_COUNT
    const realJobsToShow = sortedJobs.slice(0, displayLimit)

    // How many placeholder slots needed to fill 6
    const placeholderCount = showAll ? 0 : Math.max(0, INITIAL_COUNT - realJobsToShow.length)

    // Jobs posted in last 24h
    const freshCount = useMemo(() => {
        const cutoff = Date.now() - 86_400_000
        return allJobs.filter(j => new Date(j.createdAt).getTime() > cutoff).length
    }, [allJobs])

    // Swap `false` with your actual loading selector if you have one
    const isLoading = false

    return (
        <div className='max-w-7xl mx-auto my-12 md:my-20 px-4'>

            {/* ── Header ───────────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                viewport={{ once: true }}
                className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10'
            >
                <div>
                    {/* Live pill */}
                    <motion.div
                        animate={{ opacity: [0.75, 1, 0.75] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className='inline-flex items-center gap-2 bg-purple-50 border border-purple-100 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-3'
                    >
                        <span className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse' />
                        {freshCount > 0
                            ? `${freshCount} new job${freshCount > 1 ? 's' : ''} added today`
                            : 'Live Openings'}
                    </motion.div>

                    <h1 className='text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight'>
                        <span className='text-gradient'>Latest & Top</span>{' '}
                        Job Openings
                    </h1>
                    <p className='text-gray-400 text-sm mt-2 font-medium'>
                        Sorted by most recent · always showing the newest first
                    </p>
                </div>

                {/* View all shortcut */}
                {allJobs.length > INITIAL_COUNT && !showAll && (
                    <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/jobs')}
                        className='flex items-center gap-2 text-sm font-bold text-primary bg-purple-50 hover:bg-purple-100 border border-purple-100 px-5 py-2.5 rounded-full transition-colors whitespace-nowrap self-start sm:self-auto'
                    >
                        View all {allJobs.length} jobs <ArrowRight size={14} />
                    </motion.button>
                )}
            </motion.div>

            {/* ── Grid ─────────────────────────────────────────────────────── */}
            {isLoading ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} i={i} />)}
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                >
                    <AnimatePresence mode="popLayout">

                        {/* ── Real job cards ── */}
                        {realJobsToShow.map((job, index) => {
                            const age = getAgeLabel(job.createdAt)
                            return (
                                <motion.div
                                    key={job._id}
                                    variants={cardVariants}
                                    layout
                                    exit="exit"
                                    className='relative'
                                >
                                    {/* Age ribbon */}
                                    {age && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.6 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.07 + 0.25 }}
                                            className={`absolute -top-2 -right-2 z-10 flex items-center gap-1 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md
                                                ${age.hot
                                                    ? 'bg-primary shadow-purple-200'
                                                    : 'bg-gray-500 shadow-gray-100'}`}
                                        >
                                            {age.hot && <Sparkles size={8} />}
                                            {age.text}
                                        </motion.div>
                                    )}
                                    <LatestJobCards job={job} />
                                </motion.div>
                            )
                        })}

                        {/* ── Placeholder cards to pad grid to 6 ── */}
                        {Array.from({ length: placeholderCount }).map((_, i) => (
                            <motion.div key={`ph-${i}`} variants={cardVariants} layout>
                                <PlaceholderCard index={realJobsToShow.length + i} />
                            </motion.div>
                        ))}

                    </AnimatePresence>
                </motion.div>
            )}

            {/* ── Bottom actions ────────────────────────────────────────────── */}
            {allJobs.length > INITIAL_COUNT && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.38, delay: 0.2 }}
                    viewport={{ once: true }}
                    className='flex flex-col sm:flex-row items-center justify-center gap-3 mt-10'
                >
                    {!showAll ? (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                onClick={() => setShowAll(true)}
                                className='flex items-center gap-2 border-2 border-primary text-primary hover:bg-purple-50 font-bold px-7 py-3 rounded-full transition-colors'
                            >
                                <ChevronDown size={16} /> Show More Jobs
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/jobs')}
                                className='flex items-center gap-2 bg-primary hover:bg-violet-700 text-white font-bold px-7 py-3 rounded-full shadow-lg shadow-purple-200 transition-colors'
                            >
                                Browse All {allJobs.length} Jobs <ArrowRight size={16} />
                            </motion.button>
                        </>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                            onClick={() => {
                                setShowAll(false)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            className='flex items-center gap-2 border-2 border-gray-200 text-gray-500 hover:border-primary hover:text-primary font-bold px-7 py-3 rounded-full transition-colors'
                        >
                            <RefreshCw size={15} /> Show Less
                        </motion.button>
                    )}
                </motion.div>
            )}
        </div>
    )
}

export default LatestJobs