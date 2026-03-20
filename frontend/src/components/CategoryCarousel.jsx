import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSearchedQuery } from '@/redux/jobSlice'
import { motion } from 'framer-motion'
import { ArrowRight, Bike, ShoppingBag, Monitor, Phone, UtensilsCrossed, BookOpen, Wrench, Sparkles } from 'lucide-react'

// ── Category data with icons + colors ─────────────────────────────────────────
const CATEGORIES = [
    { label: "Delivery Partner", icon: Bike, color: "#f59e0b", light: "#fef3c7", desc: "Swiggy · Zomato · Local" },
    { label: "Retail & Sales", icon: ShoppingBag, color: "#ec4899", light: "#fce7f3", desc: "Showroom · Dukan · Counter" },
    { label: "Office Admin", icon: Monitor, color: "#6A38C2", light: "#ede9fe", desc: "Receptionist · Data Entry" },
    { label: "Telecalling / BPO", icon: Phone, color: "#3b82f6", light: "#dbeafe", desc: "Call Centre · Support" },
    { label: "Hotel & Restaurant", icon: UtensilsCrossed, color: "#10b981", light: "#d1fae5", desc: "Waiter · Chef · Manager" },
    { label: "Home Tutor", icon: BookOpen, color: "#8b5cf6", light: "#ede9fe", desc: "All Subjects · All Classes" },
    { label: "Technician / Repair", icon: Wrench, color: "#f97316", light: "#fff7ed", desc: "AC · Mobile · Electric" },
]

// ── Single category card ───────────────────────────────────────────────────────
const CategoryCard = ({ cat, onClick }) => {
    const Icon = cat.icon
    return (
        <motion.button
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm
                hover:shadow-[0_12px_36px_-8px_rgba(0,0,0,0.12)] hover:border-gray-200
                transition-all duration-300 p-5 group relative overflow-hidden flex flex-col gap-3"
        >
            {/* Soft color wash on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: `linear-gradient(135deg, ${cat.light}99 0%, transparent 70%)` }}
            />

            {/* Top accent bar */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl origin-left"
                style={{ background: cat.color }}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
            />

            {/* Icon */}
            <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10 transition-transform duration-200 group-hover:scale-110"
                style={{ background: cat.light }}
            >
                <Icon size={20} style={{ color: cat.color }} strokeWidth={2} />
            </div>

            {/* Text */}
            <div className="relative z-10 flex-1">
                <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 group-hover:text-gray-900 transition-colors">
                    {cat.label}
                </h3>
                <p className="text-[11px] text-gray-400 font-medium leading-snug">
                    {cat.desc}
                </p>
            </div>

            {/* Arrow hint */}
            <div className="relative z-10 flex items-center justify-end">
                <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ArrowRight size={14} style={{ color: cat.color }} />
                </motion.div>
            </div>
        </motion.button>
    )
}

// ── Main ───────────────────────────────────────────────────────────────────────
const CategoryCarousel = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSearch = (query) => {
        dispatch(setSearchedQuery(query))
        navigate('/browse')
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">

            {/* ── Section header ────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
            >
                <div>
                    <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                        <Sparkles size={11} />
                        Browse by Category
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        What are you <span className="text-primary">looking for?</span>
                    </h2>
                    <p className="text-gray-400 text-sm mt-2 font-medium">
                        Tap a category to instantly find matching jobs in Bareilly
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/jobs')}
                    className="flex items-center gap-2 text-sm font-bold text-primary bg-purple-50
                        hover:bg-purple-100 border border-purple-100 px-5 py-2.5 rounded-full
                        transition-colors whitespace-nowrap self-start sm:self-auto flex-shrink-0"
                >
                    All Jobs <ArrowRight size={14} />
                </motion.button>
            </motion.div>

            {/* ── Carousel ──────────────────────────────────────────────────── */}
            <Carousel
                opts={{ align: 'start', loop: true }}
                className="w-full"
            >
                <CarouselContent className="-ml-3">
                    {CATEGORIES.map((cat, i) => (
                        <CarouselItem
                            key={i}
                            className="pl-3 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.38, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                viewport={{ once: true }}
                                className="h-full"
                            >
                                <CategoryCard cat={cat} onClick={() => handleSearch(cat.label)} />
                            </motion.div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Custom nav buttons */}
                <div className="flex items-center justify-center gap-3 mt-8">
                    <CarouselPrevious
                        className="static translate-y-0 w-10 h-10 rounded-xl border-gray-200
                            bg-white hover:bg-purple-50 hover:border-purple-200 hover:text-primary
                            text-gray-400 transition-all shadow-sm"
                    />
                    <CarouselNext
                        className="static translate-y-0 w-10 h-10 rounded-xl border-gray-200
                            bg-white hover:bg-purple-50 hover:border-purple-200 hover:text-primary
                            text-gray-400 transition-all shadow-sm"
                    />
                </div>
            </Carousel>
        </section>
    )
}

export default CategoryCarousel