import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { setSingleJob } from '@/redux/jobSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import Navbar from './shared/Navbar'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MapPin, Briefcase, DollarSign, Users, Calendar,
    Clock, Star, CheckCircle2, ArrowLeft, Share2,
    BookmarkPlus, Award, Building2, Zap, ChevronRight
} from 'lucide-react'

// ── Helpers ────────────────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
    if (!dateStr) return 'N/A'
    const diff = Date.now() - new Date(dateStr).getTime()
    const hours = Math.floor(diff / 3_600_000)
    const days = Math.floor(diff / 86_400_000)
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'

// ── Skeleton loader ────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
)

const JobSkeleton = () => (
    <div className="max-w-4xl mx-auto my-10 px-4 space-y-5">
        <Skeleton className="h-8 w-32" />
        <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5">
            <div className="flex gap-4 items-start">
                <Skeleton className="w-16 h-16 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                </div>
                <Skeleton className="h-11 w-32 rounded-xl flex-shrink-0" />
            </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-4">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-4">
                    <Skeleton className="h-5 w-28 flex-shrink-0" />
                    <Skeleton className="h-5 flex-1" />
                </div>
            ))}
        </div>
    </div>
)

// ── Stat chip ──────────────────────────────────────────────────────────────────
const StatChip = ({ icon: Icon, label, value, color = '#6A38C2' }) => (
    <div className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: color + '15' }}>
            <Icon size={15} style={{ color }} />
        </div>
        <div>
            <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-bold text-gray-800 leading-none">{value}</p>
        </div>
    </div>
)

// ── Detail row ─────────────────────────────────────────────────────────────────
const DetailRow = ({ icon: Icon, label, value, color = '#6A38C2', delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-start gap-4 py-4 border-b border-gray-50 last:border-0 group"
    >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
            style={{ background: color + '12' }}>
            <Icon size={15} style={{ color }} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-semibold text-gray-800 leading-relaxed break-words">{value}</p>
        </div>
    </motion.div>
)

// ── Main component ─────────────────────────────────────────────────────────────
const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job)
    const { user } = useSelector(store => store.auth)
    const isInitiallyApplied = singleJob?.applications?.some(a => a.applicant === user?._id) || false
    const [isApplied, setIsApplied] = useState(isInitiallyApplied)
    const [applying, setApplying] = useState(false)
    const [loading, setLoading] = useState(true)
    const [bookmarked, setBookmarked] = useState(false)
    const [showCopied, setShowCopied] = useState(false)

    const params = useParams()
    const jobId = params.id
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Apply handler
    const applyJobHandler = async () => {
        if (!user) {
            toast.error("Please login to apply for this job.")
            navigate("/login")
            return
        }
        try {
            setApplying(true)
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true })
            if (res.data.success) {
                setIsApplied(true)
                dispatch(setSingleJob({
                    ...singleJob,
                    applications: [...(singleJob?.applications || []), { applicant: user?._id }]
                }))
                toast.success(res.data.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong.")
        } finally {
            setApplying(false)
        }
    }

    // Share handler
    const handleShare = () => {
        navigator.clipboard?.writeText(window.location.href)
        setShowCopied(true)
        setTimeout(() => setShowCopied(false), 2000)
        toast.success("Link copied to clipboard!")
    }

    // Fetch job
    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true })
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job))
                    setIsApplied(res.data.job.applications?.some(a => a.applicant === user?._id))
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [jobId, dispatch, user?._id])

    if (loading) return <div><Navbar /><JobSkeleton /></div>

    if (!singleJob) return (
        <div><Navbar />
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center">
                    <Briefcase size={28} className="text-purple-300" strokeWidth={1.5} />
                </div>
                <p className="text-gray-500 font-semibold">Job not found</p>
                <button onClick={() => navigate('/jobs')}
                    className="text-sm text-primary font-bold hover:underline">
                    ← Back to Jobs
                </button>
            </div>
        </div>
    )

    const applicantCount = singleJob?.applications?.length || 0
    const isHot = applicantCount > 10

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            <div className="max-w-4xl mx-auto my-8 px-4 space-y-5">

                {/* ── Back button ──────────────────────────────────────────── */}
                <motion.button
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-primary transition-colors group"
                >
                    <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Jobs
                </motion.button>

                {/* ── Hero card ─────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                    {/* Purple top accent bar */}
                    <div className="h-1.5 w-full"
                        style={{ background: 'linear-gradient(90deg, #6A38C2, #8B5CF6, #a78bfa)' }} />

                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-start gap-5">

                            {/* Company logo placeholder */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-50 flex items-center justify-center flex-shrink-0 shadow-sm border border-purple-100 text-2xl font-black text-primary"
                            >
                                {singleJob?.company?.name?.[0]?.toUpperCase() || <Building2 size={24} className="text-purple-300" />}
                            </motion.div>

                            {/* Job info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                        {singleJob?.title}
                                    </h1>
                                    {isHot && (
                                        <span className="flex items-center gap-1 text-[10px] font-black bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded-full">
                                            <Zap size={9} /> HOT
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-gray-400 font-medium mb-3 flex items-center gap-1.5">
                                    <Building2 size={13} className="text-primary" />
                                    {singleJob?.company?.name || "Company"}
                                    <span className="text-gray-200">·</span>
                                    <MapPin size={13} className="text-primary" />
                                    {singleJob?.location}
                                </p>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <Badge className="bg-purple-50 text-primary border-purple-100 font-bold text-xs px-3 py-1 rounded-full">
                                        {singleJob?.position} {singleJob?.position === 1 ? 'Opening' : 'Openings'}
                                    </Badge>
                                    <Badge className="bg-violet-50 text-violet-600 border-violet-100 font-bold text-xs px-3 py-1 rounded-full">
                                        {singleJob?.jobType}
                                    </Badge>
                                    <Badge className="bg-green-50 text-green-600 border-green-100 font-bold text-xs px-3 py-1 rounded-full">
                                        ₹ {singleJob?.salary} LPA
                                    </Badge>
                                    <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium self-center">
                                        <Clock size={11} /> Posted {timeAgo(singleJob?.createdAt)}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0 self-start">
                                {/* Bookmark */}
                                <motion.button
                                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                                    onClick={() => setBookmarked(b => !b)}
                                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors
                                        ${bookmarked ? 'bg-purple-50 border-purple-200 text-primary' : 'bg-white border-gray-200 text-gray-400 hover:border-purple-200 hover:text-primary'}`}
                                >
                                    <BookmarkPlus size={16} />
                                </motion.button>

                                {/* Share */}
                                <motion.button
                                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                                    onClick={handleShare}
                                    className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-purple-200 hover:text-primary transition-colors"
                                >
                                    <Share2 size={15} />
                                </motion.button>

                                {/* Apply */}
                                <motion.div whileHover={!isApplied ? { scale: 1.04 } : {}} whileTap={!isApplied ? { scale: 0.97 } : {}}>
                                    <Button
                                        onClick={isApplied ? undefined : applyJobHandler}
                                        disabled={isApplied || applying}
                                        className={`relative h-10 px-6 rounded-xl font-bold text-sm transition-all overflow-hidden
                                            ${isApplied
                                                ? 'bg-green-50 text-green-600 border border-green-200 cursor-default shadow-none hover:bg-green-50'
                                                : 'bg-primary hover:bg-violet-700 text-white shadow-md shadow-purple-200 hover:shadow-lg'}`}
                                    >
                                        {/* Shimmer on apply button */}
                                        {!isApplied && !applying && (
                                            <motion.span
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 pointer-events-none"
                                                initial={{ x: '-100%' }}
                                                animate={{ x: '200%' }}
                                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                            />
                                        )}
                                        {applying ? (
                                            <span className="flex items-center gap-2">
                                                <motion.span
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                                    className="block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full"
                                                />
                                                Applying…
                                            </span>
                                        ) : isApplied ? (
                                            <span className="flex items-center gap-1.5">
                                                <CheckCircle2 size={14} /> Applied
                                            </span>
                                        ) : (
                                            'Apply Now'
                                        )}
                                    </Button>
                                </motion.div>
                            </div>
                        </div>

                        {/* ── Stat chips row ────────────────────────────────── */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-gray-50">
                            <StatChip icon={Users} label="Applicants" value={applicantCount} color="#6A38C2" />
                            <StatChip icon={Award} label="Experience" value={`${singleJob?.experienceLevel} yrs`} color="#ec4899" />
                            <StatChip icon={DollarSign} label="Salary" value={`₹${singleJob?.salary} LPA`} color="#10b981" />
                            <StatChip icon={Calendar} label="Posted" value={timeAgo(singleJob?.createdAt)} color="#f59e0b" />
                        </div>
                    </div>
                </motion.div>

                {/* ── Job details card ──────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                            <Briefcase size={15} className="text-primary" />
                        </div>
                        <h2 className="font-extrabold text-gray-900 text-lg">Job Details</h2>
                    </div>

                    <div className="divide-y divide-gray-50">
                        <DetailRow icon={Briefcase} label="Role" value={singleJob?.title} color="#6A38C2" delay={0.05} />
                        <DetailRow icon={MapPin} label="Location" value={singleJob?.location} color="#ec4899" delay={0.1} />
                        <DetailRow icon={Users} label="Open Positions" value={`${singleJob?.position} position(s)`} color="#3b82f6" delay={0.15} />
                        <DetailRow icon={Clock} label="Job Type" value={singleJob?.jobType} color="#f59e0b" delay={0.2} />
                        <DetailRow icon={Award} label="Experience" value={`${singleJob?.experienceLevel} year(s)`} color="#8b5cf6" delay={0.25} />
                        <DetailRow icon={DollarSign} label="Salary" value={`₹${singleJob?.salary} LPA`} color="#10b981" delay={0.3} />
                        <DetailRow icon={Users} label="Total Applicants" value={`${applicantCount} applied`} color="#6A38C2" delay={0.35} />
                        <DetailRow icon={Calendar} label="Posted On" value={formatDate(singleJob?.createdAt)} color="#f59e0b" delay={0.4} />
                    </div>
                </motion.div>

                {/* ── Description card ──────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8"
                >
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                            <Star size={15} className="text-primary" />
                        </div>
                        <h2 className="font-extrabold text-gray-900 text-lg">About this Role</h2>
                    </div>
                    <p className="text-gray-600 text-sm leading-7 whitespace-pre-line">
                        {singleJob?.description}
                    </p>
                </motion.div>

                {/* ── Sticky bottom apply bar (mobile) ─────────────────────── */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex items-center gap-3 z-40 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)]">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{singleJob?.title}</p>
                        <p className="text-xs text-gray-400">₹{singleJob?.salary} LPA · {singleJob?.location}</p>
                    </div>
                    <Button
                        onClick={isApplied ? undefined : applyJobHandler}
                        disabled={isApplied || applying}
                        className={`flex-shrink-0 h-10 px-6 rounded-xl font-bold text-sm
                            ${isApplied
                                ? 'bg-green-50 text-green-600 border border-green-200'
                                : 'bg-primary hover:bg-violet-700 text-white shadow-md shadow-purple-200'}`}
                    >
                        {isApplied ? <><CheckCircle2 size={14} className="mr-1.5" /> Applied</> : 'Apply Now'}
                    </Button>
                </div>
                {/* Bottom padding for mobile sticky bar */}
                <div className="md:hidden h-20" />

            </div>
        </div>
    )
}

export default JobDescription