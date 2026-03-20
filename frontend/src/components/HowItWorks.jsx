import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
    UserPlus, FileText, Search, Send, TrendingUp,
    Building, Briefcase, Users, Calendar, Award,
    ChevronRight, ArrowRight
} from 'lucide-react';

// ── 3D tilt hook ───────────────────────────────────────────────────────────────
const useTilt = () => {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 })
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 })
    const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%'])
    const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%'])
    const onMouseMove = (e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left) / r.width - 0.5)
        y.set((e.clientY - r.top) / r.height - 0.5)
    }
    const onMouseLeave = () => { x.set(0); y.set(0) }
    return { rotateX, rotateY, glareX, glareY, onMouseMove, onMouseLeave }
}

// ── Step data ──────────────────────────────────────────────────────────────────
const studentSteps = [
    { icon: UserPlus, title: "Create Account", desc: "Sign up free with your email in under 60 seconds.", color: "#6A38C2", light: "#ede9fe", num: "01" },
    { icon: FileText, title: "Build Profile", desc: "Add your skills, experience, and upload your resume.", color: "#ec4899", light: "#fce7f3", num: "02" },
    { icon: Search, title: "Browse Jobs", desc: "Explore hundreds of listings right here in Bareilly.", color: "#10b981", light: "#d1fae5", num: "03" },
    { icon: Send, title: "Apply Now", desc: "Submit your application with a single click.", color: "#f59e0b", light: "#fef3c7", num: "04" },
    { icon: TrendingUp, title: "Get Hired", desc: "Track your applications and land your dream role.", color: "#6A38C2", light: "#ede9fe", num: "05" },
]
const recruiterSteps = [
    { icon: Building, title: "Register", desc: "Verify your company and create your recruiter profile.", color: "#f59e0b", light: "#fef3c7", num: "01" },
    { icon: Briefcase, title: "Post a Job", desc: "Create detailed listings and reach local talent fast.", color: "#ec4899", light: "#fce7f3", num: "02" },
    { icon: Users, title: "Review", desc: "Browse pre-screened, qualified candidates instantly.", color: "#3b82f6", light: "#dbeafe", num: "03" },
    { icon: Calendar, title: "Interview", desc: "Schedule interviews with top applicants easily.", color: "#8b5cf6", light: "#ede9fe", num: "04" },
    { icon: Award, title: "Hire", desc: "Select the best fit and grow your team.", color: "#10b981", light: "#d1fae5", num: "05" },
]

// ── Step card ──────────────────────────────────────────────────────────────────
const StepCard = ({ step, index, isActive, onClick }) => {
    const { rotateX, rotateY, glareX, glareY, onMouseMove, onMouseLeave } = useTilt()
    const Icon = step.icon

    return (
        <motion.div
            className="relative cursor-pointer select-none"
            style={{ perspective: 900 }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={() => onClick(index)}
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                whileHover={{ z: 16, scale: 1.03 }}
                animate={isActive ? { scale: 1.04, z: 24 } : { scale: 1, z: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                className={`relative bg-white rounded-2xl p-5 border-2 overflow-hidden transition-colors duration-300
                    ${isActive
                        ? 'border-[#6A38C2] shadow-[0_16px_48px_-8px_rgba(106,56,194,0.22)]'
                        : 'border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.07)] hover:border-gray-200'}`}
            >
                {/* Glare */}
                <motion.div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{
                        background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.22) 0%, transparent 55%)`,
                        opacity: isActive ? 0 : 1
                    }}
                />

                {/* Step num watermark */}
                <span className="absolute -top-2 -right-0.5 text-6xl font-black pointer-events-none leading-none"
                    style={{ color: step.light }}>
                    {step.num}
                </span>

                {/* Active left bar */}
                <AnimatePresence>
                    {isActive && (
                        <motion.div
                            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} exit={{ scaleY: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                            style={{ background: step.color, transformOrigin: 'top' }}
                        />
                    )}
                </AnimatePresence>

                {/* Icon */}
                <motion.div
                    animate={isActive ? { scale: [1, 1.18, 1], rotate: [0, -6, 6, 0] } : { scale: 1, rotate: 0 }}
                    transition={{ duration: 0.45 }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 relative z-10"
                    style={{
                        background: `linear-gradient(135deg, ${step.color}, ${step.color}bb)`,
                        boxShadow: `0 6px 16px -4px ${step.color}55`
                    }}
                >
                    <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
                </motion.div>

                {/* Text */}
                <div className="relative z-10">
                    <h3 className="text-sm font-extrabold text-gray-900 mb-1 tracking-tight">{step.title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
                </div>

                {/* Active bottom bar */}
                <AnimatePresence>
                    {isActive && (
                        <motion.div
                            className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
                            style={{ background: `linear-gradient(90deg, ${step.color}, transparent)` }}
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            exit={{ width: '0%' }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    )
}

// ── Connector ──────────────────────────────────────────────────────────────────
const Connector = ({ color, active }) => (
    <div className="hidden lg:flex items-center justify-center w-6 flex-shrink-0" style={{ marginTop: '1.5rem' }}>
        <div className="relative w-full h-px bg-gray-100 rounded-full overflow-hidden">
            <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: color }}
                initial={{ width: '0%' }}
                animate={{ width: active ? '100%' : '0%' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
            />
        </div>
        <motion.div
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="-ml-0.5 flex-shrink-0"
        >
            <ChevronRight size={12} className="text-gray-300" />
        </motion.div>
    </div>
)

// ── Bg orb ─────────────────────────────────────────────────────────────────────
const Orb = ({ style, delay }) => (
    <motion.div
        className="absolute rounded-full pointer-events-none"
        style={style}
        animate={{ y: [0, -24, 0], scale: [1, 1.06, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay }}
    />
)

// ── Main ───────────────────────────────────────────────────────────────────────
const HowItWorks = () => {
    const [activeTab, setActiveTab] = useState('students')
    const [activeStep, setActiveStep] = useState(0)
    const sectionRef = useRef(null)
    const inView = useInView(sectionRef, { once: false, margin: '-80px' })
    const navigate = useNavigate()

    const currentSteps = activeTab === 'students' ? studentSteps : recruiterSteps

    const containerV = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } }
    }
    const cardV = {
        hidden: { opacity: 0, y: 32, rotateX: -15, scale: 0.94 },
        visible: {
            opacity: 1, y: 0, rotateX: 0, scale: 1,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
    }

    return (
        <section ref={sectionRef} className="relative py-20 bg-gray-50/40 overflow-hidden">

            <Orb delay={0} style={{ width: 300, height: 300, top: '-70px', left: '-70px', background: 'radial-gradient(circle, rgba(106,56,194,0.07) 0%, transparent 70%)' }} />
            <Orb delay={1.8} style={{ width: 240, height: 240, bottom: '-20px', right: '-50px', background: 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)' }} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* ── Header ───────────────────────────────────────────────── */}
                <div className="text-center mb-12">

                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center gap-2 bg-white border border-purple-100 text-[#6A38C2] text-xs font-bold px-4 py-1.5 rounded-full mb-5 shadow-sm"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6A38C2] animate-pulse" />
                        Simple 5-Step Process
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: -16 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.45, delay: 0.07 }}
                        className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight"
                    >
                        How It{' '}
                        <span className="text-[#6A38C2] relative inline-block">
                            Works
                            <motion.svg
                                className="absolute -bottom-1.5 left-0 w-full overflow-visible"
                                viewBox="0 0 120 10" fill="none"
                            >
                                <motion.path
                                    d="M2 7 Q30 1 60 7 Q90 13 118 7"
                                    stroke="#6A38C2" strokeWidth="2.5" strokeLinecap="round" fill="none"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                                    transition={{ duration: 0.9, delay: 0.55, ease: 'easeOut' }}
                                />
                            </motion.svg>
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.38, delay: 0.14 }}
                        className="text-gray-400 text-sm mb-7 max-w-sm mx-auto leading-relaxed"
                    >
                        {activeTab === 'students'
                            ? 'Land your dream job in Bareilly in just 5 simple steps.'
                            : 'Find the perfect candidate for your team in 5 easy steps.'}
                    </motion.p>

                    {/* Tab toggle */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.38, delay: 0.18 }}
                        className="inline-flex bg-white border border-gray-100 shadow-sm rounded-full p-1 gap-1"
                    >
                        {['students', 'recruiters'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setActiveStep(0) }}
                                className="relative px-5 py-2 rounded-full text-sm font-bold transition-colors duration-200 z-10"
                                style={{ color: activeTab === tab ? '#fff' : '#9ca3af' }}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="tab-pill"
                                        className="absolute inset-0 rounded-full bg-[#6A38C2] shadow-md shadow-purple-200"
                                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                    />
                                )}
                                <span className="relative z-10">
                                    For {tab === 'students' ? 'Students' : 'Recruiters'}
                                </span>
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* ── Cards row ────────────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        variants={containerV}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, y: -16, transition: { duration: 0.18 } }}
                        className="flex flex-col lg:flex-row items-stretch gap-3 lg:gap-0"
                        style={{ perspective: 1100 }}
                    >
                        {currentSteps.map((step, index) => (
                            <React.Fragment key={index}>
                                <motion.div variants={cardV} className="flex-1">
                                    <StepCard
                                        step={step}
                                        index={index}
                                        isActive={activeStep === index}
                                        onClick={setActiveStep}
                                    />
                                </motion.div>
                                {index < currentSteps.length - 1 && (
                                    <Connector color={step.color} active={activeStep > index} />
                                )}
                            </React.Fragment>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* ── Detail panel ─────────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activeTab}-${activeStep}`}
                        initial={{ opacity: 0, y: 16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-6 bg-white rounded-2xl p-5 md:p-7 flex flex-col md:flex-row items-center gap-5 border"
                        style={{
                            borderColor: currentSteps[activeStep].color + '28',
                            boxShadow: `0 8px 32px -8px ${currentSteps[activeStep].color}18`
                        }}
                    >
                        {/* Icon */}
                        <motion.div
                            key={activeStep}
                            initial={{ rotateY: -90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{
                                background: `linear-gradient(135deg, ${currentSteps[activeStep].color}, ${currentSteps[activeStep].color}bb)`,
                                boxShadow: `0 12px 32px -6px ${currentSteps[activeStep].color}44`
                            }}
                        >
                            {React.createElement(currentSteps[activeStep].icon, { className: 'w-7 h-7 text-white', strokeWidth: 2 })}
                        </motion.div>

                        {/* Text */}
                        <div className="flex-1 text-center md:text-left">
                            <span className="text-[10px] font-black tracking-widest uppercase"
                                style={{ color: currentSteps[activeStep].color }}>
                                Step {currentSteps[activeStep].num}
                            </span>
                            <h3 className="text-xl font-extrabold text-gray-900 mt-0.5 mb-1">
                                {currentSteps[activeStep].title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {currentSteps[activeStep].desc}
                            </p>
                        </div>

                        {/* Dot navigation */}
                        <div className="flex gap-1.5 flex-shrink-0">
                            {currentSteps.map((s, i) => (
                                <motion.button
                                    key={i}
                                    onClick={() => setActiveStep(i)}
                                    animate={activeStep === i
                                        ? { width: 20, background: currentSteps[activeStep].color }
                                        : { width: 6, background: '#e5e7eb' }}
                                    transition={{ duration: 0.25 }}
                                    className="h-1.5 rounded-full cursor-pointer"
                                />
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* ── Single CTA — only after last step ────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.15 }}
                    viewport={{ once: true }}
                    className="mt-10 flex justify-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.04, boxShadow: '0 20px 48px -8px rgba(106,56,194,0.35)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/signup')}
                        className="relative flex items-center gap-3 bg-[#6A38C2] text-white font-bold px-9 py-3.5 rounded-full shadow-lg shadow-purple-200 overflow-hidden text-sm"
                    >
                        {/* Shimmer */}
                        <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 pointer-events-none"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                        />
                        {activeTab === 'students'
                            ? <><UserPlus size={16} /> Get Started Free</>
                            : <><Building size={16} /> Register Your Company</>
                        }
                        <motion.span
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <ArrowRight size={15} />
                        </motion.span>
                    </motion.button>
                </motion.div>

            </div>
        </section>
    )
}

export default HowItWorks
