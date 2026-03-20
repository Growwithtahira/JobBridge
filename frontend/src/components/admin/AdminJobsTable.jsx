import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
    Edit2, Eye, MoreHorizontal, Briefcase, Users, Calendar,
    Building2, TrendingUp, Trash2, AlertTriangle
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { toast } from 'sonner'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setAllAdminJobs } from '@/redux/jobSlice'

// ── Time helper ────────────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
    if (!dateStr) return '—'
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86_400_000)
    const hours = Math.floor(diff / 3_600_000)
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Job type color ─────────────────────────────────────────────────────────────
const TYPE_STYLES = {
    'full-time': 'bg-green-50  text-green-700  border-green-100',
    'part-time': 'bg-blue-50   text-blue-700   border-blue-100',
    'internship': 'bg-amber-50  text-amber-700  border-amber-100',
    'freelance': 'bg-violet-50 text-violet-700 border-violet-100',
}
const getTypeStyle = (type = '') =>
    TYPE_STYLES[type.toLowerCase()] ?? 'bg-purple-50 text-purple-700 border-purple-100'

// ── Stat card ──────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '15' }}>
            <Icon size={16} style={{ color }} />
        </div>
        <div>
            <p className="text-xl font-extrabold text-gray-900 leading-none">{value}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
        </div>
    </div>
)

// ── Delete dialog — renders in document.body via portal ───────────────────────
const DeleteDialog = ({ job, onClose, onConfirm, loading }) => {
    return createPortal(
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 16 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 max-w-sm w-full"
                onClick={e => e.stopPropagation()}
            >
                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={22} className="text-red-500" strokeWidth={1.5} />
                </div>

                <h2 className="text-lg font-extrabold text-gray-900 text-center mb-1">Delete Job?</h2>
                <p className="text-sm text-gray-400 text-center mb-2">
                    <span className="font-bold text-gray-700">"{job.title}"</span> at{' '}
                    <span className="font-bold text-gray-700">{job.company?.name}</span>
                </p>
                <p className="text-xs text-gray-400 text-center mb-6">
                    All applications for this job will also be deleted. This cannot be undone.
                </p>

                <div className="flex gap-3">
                    <button onClick={onClose} disabled={loading}
                        className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={loading}
                        className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? (
                            <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        ) : <Trash2 size={14} />}
                        {loading ? 'Deleting…' : 'Yes, Delete'}
                    </button>
                </div>
            </motion.div>
        </motion.div>,
        document.body
    )
}

// ── Action popover ─────────────────────────────────────────────────────────────
const ActionMenu = ({ job, onDeleteClick }) => {
    const navigate = useNavigate()
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="w-8 h-8 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-purple-200 flex items-center justify-center text-gray-400 hover:text-primary transition-all">
                    <MoreHorizontal size={15} />
                </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-2 rounded-2xl shadow-xl border-gray-100 bg-white">
                <button onClick={() => navigate(`/admin/companies/${job._id}`)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-purple-50 hover:text-primary transition-colors text-sm font-medium group">
                    <div className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                        <Edit2 size={12} />
                    </div>
                    Edit Job
                </button>
                <button onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-purple-50 hover:text-primary transition-colors text-sm font-medium group mt-1">
                    <div className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                        <Eye size={12} />
                    </div>
                    View Applicants
                </button>

                <div className="h-px bg-gray-50 my-1" />

                <button onClick={() => onDeleteClick(job)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium group">
                    <div className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                        <Trash2 size={12} />
                    </div>
                    Delete Job
                </button>
            </PopoverContent>
        </Popover>
    )
}

// ── Empty state ────────────────────────────────────────────────────────────────
const EmptyState = ({ query }) => (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
            className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-4 border border-purple-100">
            <Briefcase size={24} className="text-purple-300" strokeWidth={1.5} />
        </motion.div>
        <p className="font-bold text-gray-700 text-base">
            {query ? `No jobs matching "${query}"` : 'No jobs posted yet'}
        </p>
        <p className="text-sm text-gray-400 mt-1">
            {query ? 'Try a different search term' : 'Post your first job to get started'}
        </p>
    </motion.div>
)

// ── Main ───────────────────────────────────────────────────────────────────────
const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [filterJobs, setFilterJobs] = useState(allAdminJobs)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    useEffect(() => {
        const q = searchJobByText?.toLowerCase() || ''
        setFilterJobs(
            allAdminJobs.filter(job =>
                !q ||
                job?.title?.toLowerCase().includes(q) ||
                job?.company?.name?.toLowerCase().includes(q) ||
                job?.location?.toLowerCase().includes(q)
            )
        )
    }, [allAdminJobs, searchJobByText])

    const totalApplicants = allAdminJobs.reduce((sum, j) => sum + (j.applications?.length || 0), 0)

    const handleDelete = async () => {
        if (!deleteTarget) return
        try {
            setDeleteLoading(true)
            const res = await axios.delete(
                `${JOB_API_END_POINT}/delete/${deleteTarget._id}`,
                { withCredentials: true }
            )
            if (res.data.success) {
                dispatch(setAllAdminJobs(allAdminJobs.filter(j => j._id !== deleteTarget._id)))
                toast.success(`"${deleteTarget.title}" deleted successfully`)
                setDeleteTarget(null)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete job')
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <div className="space-y-5">

            {/* Delete portal dialog */}
            <AnimatePresence>
                {deleteTarget && (
                    <DeleteDialog
                        job={deleteTarget}
                        onClose={() => !deleteLoading && setDeleteTarget(null)}
                        onConfirm={handleDelete}
                        loading={deleteLoading}
                    />
                )}
            </AnimatePresence>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard icon={Briefcase} label="Total Jobs" value={allAdminJobs.length} color="#6A38C2" />
                <StatCard icon={Users} label="Total Applicants" value={totalApplicants} color="#10b981" />
                <StatCard icon={TrendingUp} label="Active" value={filterJobs.length} color="#f59e0b" />
                <StatCard icon={Building2} label="Companies"
                    value={[...new Set(allAdminJobs.map(j => j.company?.name))].filter(Boolean).length}
                    color="#3b82f6" />
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
                <AnimatePresence>
                    {filterJobs.length === 0 ? (
                        <EmptyState query={searchJobByText} />
                    ) : filterJobs.map((job, i) => (
                        <motion.div key={job._id}
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0 font-black text-primary text-base">
                                        {job?.company?.name?.[0]?.toUpperCase() || 'C'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-gray-900 text-sm truncate">{job?.title}</p>
                                        <p className="text-xs text-gray-400 font-medium truncate">{job?.company?.name}</p>
                                    </div>
                                </div>
                                <ActionMenu job={job} onDeleteClick={setDeleteTarget} />
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                {job?.jobType && (
                                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${getTypeStyle(job.jobType)}`}>
                                        {job.jobType}
                                    </span>
                                )}
                                <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                                    <Calendar size={10} /> {timeAgo(job?.createdAt)}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                                    <Users size={10} /> {job?.applications?.length || 0} applicants
                                </span>
                            </div>

                            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                                <button onClick={() => navigate(`/admin/companies/${job._id}`)}
                                    className="flex-1 h-8 rounded-xl border border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-purple-50 text-xs font-semibold transition-all flex items-center justify-center gap-1.5">
                                    <Edit2 size={11} /> Edit
                                </button>
                                <button onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                    className="flex-1 h-8 rounded-xl bg-primary hover:bg-violet-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-purple-200">
                                    <Eye size={11} /> Applicants ({job?.applications?.length || 0})
                                </button>
                                <button onClick={() => setDeleteTarget(job)}
                                    className="h-8 w-8 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all flex-shrink-0">
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 border-b border-gray-50 bg-gray-50/60">
                    {['Company', 'Role', 'Type', 'Applicants', 'Posted', 'Actions'].map((h, i) => (
                        <p key={i} className={`text-[10px] font-black text-gray-400 uppercase tracking-widest ${i === 5 ? 'text-right' : ''}`}>
                            {h}
                        </p>
                    ))}
                </div>

                {filterJobs.length === 0 ? (
                    <EmptyState query={searchJobByText} />
                ) : (
                    <div className="divide-y divide-gray-50">
                        <AnimatePresence>
                            {filterJobs.map((job, i) => (
                                <motion.div key={job._id}
                                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.28, delay: i * 0.04 }}
                                    className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center hover:bg-gray-50/60 transition-colors group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0 font-black text-primary text-sm">
                                            {job?.company?.name?.[0]?.toUpperCase() || 'C'}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800 truncate">{job?.company?.name}</span>
                                    </div>

                                    <span className="text-sm font-medium text-gray-700 truncate">{job?.title}</span>

                                    <div>
                                        {job?.jobType ? (
                                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${getTypeStyle(job.jobType)}`}>
                                                {job.jobType}
                                            </span>
                                        ) : <span className="text-xs text-gray-300">—</span>}
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <Users size={12} className="text-gray-400 flex-shrink-0" />
                                        <span className="text-sm font-semibold text-gray-700">{job?.applications?.length || 0}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={12} className="text-gray-400 flex-shrink-0" />
                                        <span className="text-xs text-gray-500 font-medium">{timeAgo(job?.createdAt)}</span>
                                    </div>

                                    <div className="flex justify-end">
                                        <ActionMenu job={job} onDeleteClick={setDeleteTarget} />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {filterJobs.length > 0 && (
                    <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/40">
                        <p className="text-xs text-gray-400 font-medium">
                            Showing <span className="font-bold text-gray-600">{filterJobs.length}</span> of{' '}
                            <span className="font-bold text-gray-600">{allAdminJobs.length}</span> jobs
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminJobsTable