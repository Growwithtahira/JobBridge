import React, { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Search, X, ArrowRight, MapPin, Briefcase, Zap } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ThreeBackground from './ThreeBackground'
import { toast } from 'sonner'

const SUGGESTIONS = [
    "Web Developer", "Data Entry", "Graphic Designer", "Sales Executive",
    "Teacher", "Accountant", "Delivery Boy", "Receptionist", "IT Support",
    "Content Writer", "Social Media Manager", "Mechanic"
]

const QUICK_TAGS = [
    { label: "Remote", icon: "🏠", query: "remote" },
    { label: "Full-Time", icon: "💼", query: "full time" },
    { label: "Internship", icon: "🎓", query: "internship" },
    { label: "Part-Time", icon: "⏰", query: "part time" },
    { label: "IT / Tech", icon: "💻", query: "developer" },
    { label: "Work Local", icon: "📍", query: "bareilly" },
]

const ROLES = ["Developer", "Designer", "Teacher", "Accountant", "Marketer", "Sales Exec"]

const FloatCard = ({ children, className, delay = 0, dy = 14 }) => (
    <motion.div
        animate={{ y: [0, -dy, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
        className={`hidden lg:flex items-center gap-3 p-3.5 bg-white/90 backdrop-blur-md border border-white shadow-xl rounded-2xl z-20 absolute ${className}`}
    >
        {children}
    </motion.div>
)

const HeroSection = () => {
    const [query, setQuery] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [roleIndex, setRoleIndex] = useState(0)
    const [focused, setFocused] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const inputRef = useRef(null)
    const wrapperRef = useRef(null)

    useEffect(() => {
        const t = setInterval(() => setRoleIndex(i => (i + 1) % ROLES.length), 2200)
        return () => clearInterval(t)
    }, [])

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target))
                setShowSuggestions(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const filteredSuggestions = query.trim()
        ? SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()))
        : SUGGESTIONS.slice(0, 6)

    const searchJobHandler = (overrideQuery) => {
        const q = (overrideQuery ?? query).trim()
        if (!q) {
            toast.error("Please enter a job title or keyword!")
            inputRef.current?.focus()
            return
        }
        setShowSuggestions(false)
        dispatch(setSearchedQuery(q))
        navigate("/browse")
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') searchJobHandler()
        if (e.key === 'Escape') setShowSuggestions(false)
    }

    const handleTagClick = (tagQuery) => {
        dispatch(setSearchedQuery(tagQuery))
        navigate("/browse")
    }

    return (
        <div className='relative text-center py-12 sm:py-16 px-4 min-h-[92vh] flex flex-col justify-center overflow-hidden bg-gradient-to-br from-white via-violet-50/60 to-white'>

            <ThreeBackground />

            {/* Floating cards — only on large screens */}
            <FloatCard className="top-24 left-8" delay={0} dy={14}>
                <div className='w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-base flex-shrink-0'>✨</div>
                <div className='text-left'>
                    <p className='text-[10px] text-gray-400 font-medium leading-none mb-0.5'>New listings</p>
                    <p className='text-sm font-bold text-gray-800'>1,000+ Daily</p>
                </div>
            </FloatCard>

            <FloatCard className="bottom-28 right-8" delay={1.2} dy={18}>
                <div className='w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center text-base flex-shrink-0'>🚀</div>
                <div className='text-left'>
                    <p className='text-[10px] text-gray-400 font-medium leading-none mb-0.5'>Top Recruiters</p>
                    <p className='text-sm font-bold text-gray-800'>500+ Active</p>
                </div>
            </FloatCard>

            <FloatCard className="top-1/3 right-10" delay={2.5} dy={10}>
                <div className='w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-base flex-shrink-0'>🎯</div>
                <div className='text-left'>
                    <p className='text-[10px] text-gray-400 font-medium leading-none mb-0.5'>Hire Rate</p>
                    <p className='text-sm font-bold text-gray-800'>94% Match</p>
                </div>
            </FloatCard>

            {/* ── Main Content ──────────────────────────────────────────────── */}
            <div className='flex flex-col items-center gap-5 sm:gap-6 max-w-3xl mx-auto relative z-10 w-full'>

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                >
                    <span className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-purple-100 text-primary font-semibold text-xs shadow-sm tracking-wide'>
                        <span className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse' />
                        No. 1 Job Platform for Freshers · Bareilly
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.1 }}
                    className="space-y-1.5 sm:space-y-2"
                >
                    <p className="text-xs sm:text-sm font-semibold text-gray-400 tracking-widest uppercase">
                        Find your next opportunity
                    </p>

                    <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight'>
                        The Best{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10 px-3 sm:px-4 py-1 rounded-2xl overflow-hidden inline-block"
                                style={{ background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)' }}>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={roleIndex}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                        className="block text-primary font-extrabold"
                                    >
                                        {ROLES[roleIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                        </span>
                        {' '}Jobs
                    </h1>

                    <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-400 tracking-tight'>
                        Near You &{' '}
                        <span className='text-primary font-extrabold'>Work Local</span>
                        <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="inline-block w-0.5 h-5 sm:h-6 md:h-8 bg-primary ml-1 align-middle rounded-sm"
                        />
                    </h2>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    className='text-gray-400 text-sm md:text-base max-w-md mx-auto leading-relaxed px-2'
                >
                    Connecting Bareilly's freshers with top local companies.
                    One click to apply, zero hassle.
                </motion.p>

                {/* ── Search bar ────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.32 }}
                    className='w-full max-w-xl mx-auto px-2 sm:px-0'
                    ref={wrapperRef}
                >
                    {/* ✅ Mobile: stacked layout, Desktop: single row */}
                    <motion.div
                        animate={focused
                            ? { boxShadow: '0 8px 40px rgba(106,56,194,0.2)' }
                            : { boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }
                        }
                        transition={{ duration: 0.2 }}
                        className='relative bg-white border border-gray-200 rounded-2xl sm:rounded-full overflow-visible'
                        style={focused ? { borderColor: '#c4b5fd' } : {}}
                    >
                        {/* Input row */}
                        <div className='flex items-center px-4 py-2.5 sm:py-2 gap-2'>
                            <Search size={15} className='text-gray-300 flex-shrink-0' />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={e => { setQuery(e.target.value); setShowSuggestions(true) }}
                                onFocus={() => { setFocused(true); setShowSuggestions(true) }}
                                onBlur={() => setFocused(false)}
                                onKeyDown={handleKeyDown}
                                placeholder='Job title, skill or keyword…'
                                className='flex-1 outline-none border-none text-sm text-gray-700 placeholder-gray-300 bg-transparent min-w-0'
                            />
                            <AnimatePresence>
                                {query && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.6 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.6 }}
                                        onClick={() => setQuery('')}
                                        className='p-1 rounded-full hover:bg-gray-100 text-gray-300 transition-colors flex-shrink-0'
                                    >
                                        <X size={13} />
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            {/* Desktop search button — inline */}
                            <Button
                                onClick={() => searchJobHandler()}
                                className="hidden sm:flex rounded-full bg-primary hover:bg-violet-700 text-white font-bold h-9 px-5 shadow-md hover:shadow-lg transition-all items-center gap-1.5 flex-shrink-0 text-sm"
                            >
                                Search <ArrowRight size={13} />
                            </Button>
                        </div>

                        {/* ✅ Mobile search button — full width below input */}
                        <div className='sm:hidden px-3 pb-3'>
                            <Button
                                onClick={() => searchJobHandler()}
                                className="w-full rounded-xl bg-primary hover:bg-violet-700 text-white font-bold h-10 shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <Search size={14} /> Search Jobs
                            </Button>
                        </div>

                        {/* Suggestions dropdown */}
                        <AnimatePresence>
                            {showSuggestions && filteredSuggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                    transition={{ duration: 0.15 }}
                                    className='absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-purple-100/40 z-50 overflow-hidden'
                                >
                                    <p className='text-[9px] font-bold text-gray-400 uppercase tracking-widest px-5 pt-3 pb-1'>
                                        {query ? 'Matching roles' : 'Popular searches'}
                                    </p>
                                    {filteredSuggestions.map((s, i) => (
                                        <motion.button
                                            key={s}
                                            initial={{ opacity: 0, x: -6 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.025 }}
                                            onMouseDown={() => searchJobHandler(s)}
                                            className='w-full flex items-center gap-3 px-5 py-2.5 hover:bg-purple-50 transition-colors text-left group'
                                        >
                                            <Search size={12} className='text-gray-200 group-hover:text-primary transition-colors flex-shrink-0' />
                                            <span className='text-sm text-gray-600 group-hover:text-primary font-medium transition-colors'>{s}</span>
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Quick tags */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                        className='flex flex-wrap justify-center gap-1.5 mt-3 px-1'
                    >
                        <span className='text-[11px] text-gray-300 font-medium self-center mr-0.5'>Trending:</span>
                        {QUICK_TAGS.map((tag, i) => (
                            <motion.button
                                key={tag.query}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.05 }}
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleTagClick(tag.query)}
                                className='flex items-center gap-1 px-2.5 py-1 bg-white/70 border border-gray-100 hover:border-purple-200 hover:bg-purple-50 text-gray-500 hover:text-primary text-[11px] font-semibold rounded-full transition-all duration-150'
                            >
                                <span className='text-[10px]'>{tag.icon}</span>
                                {tag.label}
                            </motion.button>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Social proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.55 }}
                    className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-1'
                >
                    <div className='flex items-center gap-2'>
                        <div className='flex -space-x-2'>
                            {['#6A38C2', '#8B5CF6', '#A78BFA', '#C4B5FD'].map((color, i) => (
                                <div key={i}
                                    className='w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold'
                                    style={{ background: color }}
                                >
                                    {['A', 'B', 'R', 'S'][i]}
                                </div>
                            ))}
                        </div>
                        <p className='text-xs text-gray-400 font-medium'>
                            <span className='text-primary font-bold'>2,400+</span> students hired
                        </p>
                    </div>

                    <span className='hidden sm:block w-px h-4 bg-gray-200' />

                    <div className='flex items-center gap-3 sm:gap-4'>
                        {[
                            { icon: <Briefcase size={11} />, text: "500+ Jobs" },
                            { icon: <MapPin size={11} />, text: "Bareilly" },
                            { icon: <Zap size={11} />, text: "Free Forever" },
                        ].map((s, i) => (
                            <div key={i} className='flex items-center gap-1 text-xs text-gray-400 font-medium'>
                                <span className='text-primary'>{s.icon}</span>
                                {s.text}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default HeroSection