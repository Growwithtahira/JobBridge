import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import {
    MapPin, Clock, DollarSign, Users,
    ArrowUpRight, Bookmark, BookmarkCheck, Zap
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

const isNew = (dateStr) =>
    dateStr ? Date.now() - new Date(dateStr).getTime() < 48 * 3_600_000 : false

// ── Job type color map ─────────────────────────────────────────────────────────
const TYPE_COLORS = {
    'full-time': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
    'part-time': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
    'internship': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
    'freelance': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100' },
    'remote': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100' },
}
const getTypeStyle = (type = '') =>
    TYPE_COLORS[type.toLowerCase()] ?? { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' }

// ── Card ───────────────────────────────────────────────────────────────────────
const LatestJobCards = ({ job }) => {
    const navigate = useNavigate()
    const [saved, setSaved] = useState(false)
    const fresh = isNew(job?.createdAt)
    const typeStyle = getTypeStyle(job?.jobType)

    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onClick={() => navigate(`/description/${job?._id}`)}
            className="relative bg-white rounded-2xl border border-gray-100 shadow-sm
                hover:shadow-[0_14px_44px_-8px_rgba(106,56,194,0.15)]
                hover:border-purple-100 transition-all duration-300 cursor-pointer
                flex flex-col h-full overflow-hidden group"
        >
            {/* Top accent — sweeps in on hover */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl origin-left"
                style={{ background: 'linear-gradient(90deg, #6A38C2, #8B5CF6, #a78bfa)' }}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.32 }}
            />

            <div className="p-5 flex flex-col h-full">

                {/* ── Row 1: time + bookmark ─────────────────────────────────── */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                            <Clock size={10} /> {timeAgo(job?.createdAt)}
                        </span>
                        <AnimatePresence>
                            {fresh && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-0.5 text-[9px] font-black bg-primary text-white px-2 py-0.5 rounded-full"
                                >
                                    <Zap size={8} /> NEW
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); setSaved(s => !s) }}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all
                            ${saved
                                ? 'bg-purple-50 border-purple-200 text-primary'
                                : 'bg-white border-gray-100 text-gray-300 hover:border-purple-200 hover:text-primary'}`}
                    >
                        {saved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                    </motion.button>
                </div>

                {/* ── Row 2: company logo + name + location ─────────────────── */}
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

                {/* ── Row 3: title + description ────────────────────────────── */}
                <div className="mb-4 flex-1">
                    <h2 className="font-extrabold text-gray-900 text-base leading-tight mb-1.5
                        line-clamp-1 group-hover:text-primary transition-colors">
                        {job?.title}
                    </h2>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                        {job?.description}
                    </p>
                </div>

                {/* ── Row 4: info chips ─────────────────────────────────────── */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border
                        ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
                        {job?.jobType}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1
                        rounded-full bg-green-50 text-green-700 border border-green-100">
                        <DollarSign size={9} />₹{job?.salary} LPA
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1
                        rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        <Users size={9} />{job?.position} {job?.position === 1 ? 'Post' : 'Posts'}
                    </span>
                </div>

                {/* ── Row 5: CTA ────────────────────────────────────────────── */}
                <div className="pt-3 border-t border-gray-50 mt-auto">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={(e) => { e.stopPropagation(); navigate(`/description/${job?._id}`) }}
                        className="w-full h-9 rounded-xl bg-primary hover:bg-violet-700 text-white
                            text-xs font-bold flex items-center justify-center gap-1.5
                            shadow-sm shadow-purple-200 hover:shadow-md transition-all relative overflow-hidden"
                    >
                        {/* Shimmer */}
                        <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 pointer-events-none"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                        />
                        View & Apply <ArrowUpRight size={13} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

export default LatestJobCards