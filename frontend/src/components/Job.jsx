import React, { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bookmark, BookmarkCheck, MapPin, Clock,
    Briefcase, DollarSign, Users, ArrowUpRight, Zap
} from 'lucide-react'

// ── Time helper ────────────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
    if (!dateStr) return 'Recently'
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60_000)
    const hours = Math.floor(diff / 3_600_000)
    const days = Math.floor(diff / 86_400_000)
    if (mins < 60) return mins <= 1 ? 'Just now' : `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

const isNew = (dateStr) => {
    if (!dateStr) return false
    return Date.now() - new Date(dateStr).getTime() < 48 * 3_600_000 // < 48h
}

// ── Badge color map ────────────────────────────────────────────────────────────
const JOB_TYPE_COLORS = {
    'full-time': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
    'part-time': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
    'internship': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
    'freelance': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100' },
    'remote': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100' },
}

const getTypeStyle = (type = '') => {
    return JOB_TYPE_COLORS[type.toLowerCase()] || { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' }
}

// ── Job card ───────────────────────────────────────────────────────────────────
const Job = ({ job }) => {
    const navigate = useNavigate()
    const [saved, setSaved] = useState(false)
    const fresh = isNew(job?.createdAt)
    const typeStyle = getTypeStyle(job?.jobType)

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative bg-white rounded-2xl border border-gray-100 shadow-sm
                hover:shadow-[0_12px_40px_-8px_rgba(106,56,194,0.14)]
                hover:border-purple-100 transition-all duration-300
                flex flex-col h-full overflow-hidden group cursor-pointer"
            onClick={() => navigate(`/description/${job?._id}`)}
        >
            {/* ── Top accent line (visible on hover) ── */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                style={{ background: 'linear-gradient(90deg, #6A38C2, #8B5CF6, #a78bfa)' }}
                initial={{ scaleX: 0, originX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.35 }}
            />

            <div className="p-5 flex flex-col h-full">

                {/* ── Header row ────────────────────────────────────────────── */}
                <div className="flex items-center justify-between mb-4">
                    {/* Time + NEW badge */}
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                            <Clock size={11} />
                            {timeAgo(job?.createdAt)}
                        </span>
                        <AnimatePresence>
                            {fresh && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-0.5 text-[9px] font-black bg-primary text-white px-2 py-0.5 rounded-full"
                                >
                                    <Zap size={8} /> NEW
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bookmark button */}
                    <motion.button
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={(e) => { e.stopPropagation(); setSaved(s => !s) }}
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200
                            ${saved
                                ? 'bg-purple-50 border-purple-200 text-primary'
                                : 'bg-white border-gray-100 text-gray-300 hover:border-purple-200 hover:text-primary'}`}
                    >
                        {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                    </motion.button>
                </div>

                {/* ── Company row ───────────────────────────────────────────── */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-1.5 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 group-hover:border-purple-100 transition-colors">
                        <Avatar className="h-9 w-9 rounded-lg">
                            <AvatarImage src={job?.company?.logo} className="rounded-lg object-cover" />
                            <AvatarFallback className="rounded-lg bg-purple-50 text-primary font-black text-sm">
                                {job?.company?.name?.[0]?.toUpperCase() || 'C'}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-sm text-gray-900 truncate group-hover:text-primary transition-colors leading-tight">
                            {job?.company?.name}
                        </p>
                        <p className="flex items-center gap-1 text-[11px] text-gray-400 font-medium mt-0.5">
                            <MapPin size={10} className="flex-shrink-0" />
                            <span className="truncate">{job?.location || 'India'}</span>
                        </p>
                    </div>
                </div>

                {/* ── Job title + desc ──────────────────────────────────────── */}
                <div className="mb-4 flex-1">
                    <h2 className="font-extrabold text-gray-900 text-base leading-tight mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                        {job?.title}
                    </h2>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                        {job?.description}
                    </p>
                </div>

                {/* ── Info chips ────────────────────────────────────────────── */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {/* Job type */}
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
                        {job?.jobType}
                    </span>
                    {/* Salary */}
                    <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                        <DollarSign size={9} /> ₹{job?.salary} LPA
                    </span>
                    {/* Positions */}
                    <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        <Users size={9} /> {job?.position} {job?.position === 1 ? 'Post' : 'Posts'}
                    </span>
                </div>

                {/* ── Divider ───────────────────────────────────────────────── */}
                <div className="border-t border-gray-50 pt-4 mt-auto">
                    <div className="flex items-center gap-2">
                        {/* Details button */}
                        <Button
                            variant="outline"
                            onClick={(e) => { e.stopPropagation(); navigate(`/description/${job?._id}`) }}
                            className="flex-1 h-9 text-xs font-bold border-gray-200 text-gray-600
                                hover:border-primary hover:text-primary hover:bg-purple-50
                                rounded-xl transition-all"
                        >
                            View Details
                        </Button>

                        {/* Quick apply */}
                        <motion.div
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            className="flex-1"
                            onClick={e => e.stopPropagation()}
                        >
                            <Button
                                onClick={() => navigate(`/description/${job?._id}`)}
                                className="w-full h-9 text-xs font-bold bg-primary hover:bg-violet-700
                                    text-white rounded-xl shadow-sm shadow-purple-200
                                    hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                            >
                                Apply Now <ArrowUpRight size={12} />
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default Job