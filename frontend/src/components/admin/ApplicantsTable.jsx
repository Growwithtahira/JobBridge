import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import {
    MoreHorizontal, CheckCircle2, XCircle, Clock,
    Mail, Phone, FileText, ExternalLink, Users, Download
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    accepted: { label: 'Accepted', icon: CheckCircle2, bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    rejected: { label: 'Rejected', icon: XCircle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    pending: { label: 'Pending', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
}
const getStatus = (s = '') => STATUS_CONFIG[s?.toLowerCase()] ?? STATUS_CONFIG.pending

// ── Status badge ───────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const cfg = getStatus(status)
    const Icon = cfg.icon
    return (
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            <Icon size={10} /> {cfg.label}
        </span>
    )
}

// ── Time helper ────────────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
    if (!dateStr) return '—'
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// ── Empty state ────────────────────────────────────────────────────────────────
const EmptyState = () => (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center">
        <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
            className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-4">
            <Users size={24} className="text-purple-300" strokeWidth={1.5} />
        </motion.div>
        <p className="font-bold text-gray-700">No applicants yet</p>
        <p className="text-sm text-gray-400 mt-1">Applications will appear here once candidates apply</p>
    </motion.div>
)

// ── Action menu ────────────────────────────────────────────────────────────────
const ActionMenu = ({ item, onStatusChange }) => {
    const [updating, setUpdating] = useState(false)

    const updateStatus = async (status) => {
        setUpdating(true)
        try {
            axios.defaults.withCredentials = true
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${item._id}/update`, { status })
            if (res.data.success) {
                onStatusChange(item._id, status)
                toast.success(`Applicant ${status.toLowerCase()}`)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Status update failed')
        } finally {
            setUpdating(false)
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button disabled={updating}
                    className="w-8 h-8 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-purple-200 flex items-center justify-center text-gray-400 hover:text-primary transition-all disabled:opacity-50">
                    <MoreHorizontal size={15} />
                </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-2 rounded-2xl shadow-xl border-gray-100 bg-white">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-3 pb-1.5 pt-1">Update Status</p>
                <button onClick={() => updateStatus('Accepted')}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors text-sm font-medium group">
                    <div className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-green-100 flex items-center justify-center transition-colors flex-shrink-0">
                        <CheckCircle2 size={12} />
                    </div>
                    Accept
                </button>
                <button onClick={() => updateStatus('Rejected')}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium group mt-0.5">
                    <div className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0">
                        <XCircle size={12} />
                    </div>
                    Reject
                </button>
            </PopoverContent>
        </Popover>
    )
}

// ── Main ───────────────────────────────────────────────────────────────────────
const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application)
    // Local status state for optimistic UI
    const [localStatus, setLocalStatus] = useState({})

    const applications = applicants?.applications || []

    const getItemStatus = (item) => localStatus[item._id] || item.status || 'pending'

    const onStatusChange = (id, status) => {
        setLocalStatus(p => ({ ...p, [id]: status.toLowerCase() }))
    }

    // Stats
    const accepted = applications.filter(i => getItemStatus(i) === 'accepted').length
    const rejected = applications.filter(i => getItemStatus(i) === 'rejected').length
    const pending = applications.filter(i => getItemStatus(i) === 'pending').length

    return (
        <div className="space-y-5">

            {/* Stats */}
            {applications.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Total', value: applications.length, color: '#6A38C2', Icon: Users },
                        { label: 'Accepted', value: accepted, color: '#10b981', Icon: CheckCircle2 },
                        { label: 'Pending', value: pending, color: '#f59e0b', Icon: Clock },
                    ].map((s, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color + '18' }}>
                                <s.Icon size={15} style={{ color: s.color }} />
                            </div>
                            <div>
                                <p className="text-xl font-extrabold text-gray-900 leading-none">{s.value}</p>
                                <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
                {applications.length === 0 ? <EmptyState /> : (
                    <AnimatePresence>
                        {applications.map((item, i) => (
                            <motion.div key={item._id}
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 relative overflow-hidden"
                            >
                                {/* Left color accent based on status */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl
                                    ${getItemStatus(item) === 'accepted' ? 'bg-green-400'
                                        : getItemStatus(item) === 'rejected' ? 'bg-red-400'
                                            : 'bg-amber-400'}`}
                                />

                                <div className="pl-3">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10 rounded-xl border border-gray-100 flex-shrink-0">
                                                <AvatarImage src={item?.applicant?.profile?.profilePhoto} className="object-cover rounded-xl" />
                                                <AvatarFallback className="rounded-xl bg-purple-50 text-primary font-black text-sm">
                                                    {item?.applicant?.fullname?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{item?.applicant?.fullname}</p>
                                                <StatusBadge status={getItemStatus(item)} />
                                            </div>
                                        </div>
                                        <ActionMenu item={item} onStatusChange={onStatusChange} />
                                    </div>

                                    <div className="space-y-1.5 mt-3 pt-3 border-t border-gray-50">
                                        <p className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                            <Mail size={11} className="text-primary flex-shrink-0" />
                                            <span className="truncate">{item?.applicant?.email}</span>
                                        </p>
                                        <p className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                            <Phone size={11} className="text-primary flex-shrink-0" />
                                            {item?.applicant?.phoneNumber || '—'}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs">
                                            <FileText size={11} className="text-primary flex-shrink-0" />
                                            {item?.applicant?.profile?.resume ? (
                                                <a href={item.applicant.profile.resume} target="_blank" rel="noreferrer"
                                                    className="flex items-center gap-1 text-primary font-semibold hover:underline truncate">
                                                    <ExternalLink size={10} />
                                                    {item.applicant.profile.resumeOriginalName || 'View Resume'}
                                                </a>
                                            ) : <span className="text-gray-400 italic">Not provided</span>}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-[auto_2fr_2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 border-b border-gray-50 bg-gray-50/60">
                    {['', 'Applicant', 'Contact', 'Resume', 'Status', 'Applied', 'Actions'].map((h, i) => (
                        <p key={i} className={`text-[10px] font-black text-gray-400 uppercase tracking-widest ${i === 6 ? 'text-right' : ''}`}>{h}</p>
                    ))}
                </div>

                {applications.length === 0 ? <EmptyState /> : (
                    <div className="divide-y divide-gray-50">
                        <AnimatePresence>
                            {applications.map((item, i) => (
                                <motion.div key={item._id}
                                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.28, delay: i * 0.04 }}
                                    className="grid grid-cols-[auto_2fr_2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center hover:bg-gray-50/60 transition-colors"
                                >
                                    {/* Avatar */}
                                    <Avatar className="w-9 h-9 rounded-xl border border-gray-100 flex-shrink-0">
                                        <AvatarImage src={item?.applicant?.profile?.profilePhoto} className="object-cover rounded-xl" />
                                        <AvatarFallback className="rounded-xl bg-purple-50 text-primary font-bold text-sm">
                                            {item?.applicant?.fullname?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Name */}
                                    <p className="font-semibold text-sm text-gray-900 truncate">{item?.applicant?.fullname}</p>

                                    {/* Contact */}
                                    <div className="min-w-0 space-y-0.5">
                                        <p className="flex items-center gap-1.5 text-xs text-gray-500 font-medium truncate">
                                            <Mail size={10} className="flex-shrink-0 text-primary" />
                                            <span className="truncate">{item?.applicant?.email}</span>
                                        </p>
                                        <p className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                            <Phone size={10} className="flex-shrink-0 text-primary" />
                                            {item?.applicant?.phoneNumber || '—'}
                                        </p>
                                    </div>

                                    {/* Resume */}
                                    <div>
                                        {item?.applicant?.profile?.resume ? (
                                            <a href={item.applicant.profile.resume} target="_blank" rel="noreferrer"
                                                className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-violet-700 transition-colors">
                                                <Download size={12} />
                                                <span className="truncate max-w-[80px]">
                                                    {item.applicant.profile.resumeOriginalName || 'Resume'}
                                                </span>
                                            </a>
                                        ) : <span className="text-xs text-gray-300 italic">None</span>}
                                    </div>

                                    {/* Status */}
                                    <StatusBadge status={getItemStatus(item)} />

                                    {/* Applied */}
                                    <p className="text-xs text-gray-400 font-medium">{timeAgo(item?.createdAt)}</p>

                                    {/* Action */}
                                    <div className="flex justify-end">
                                        <ActionMenu item={item} onStatusChange={onStatusChange} />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Footer count */}
                {applications.length > 0 && (
                    <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/40">
                        <p className="text-xs text-gray-400 font-medium">
                            <span className="font-bold text-gray-600">{applications.length}</span> applicant{applications.length !== 1 ? 's' : ''} ·{' '}
                            <span className="text-green-600 font-bold">{accepted} accepted</span> ·{' '}
                            <span className="text-red-500 font-bold">{rejected} rejected</span> ·{' '}
                            <span className="text-amber-600 font-bold">{pending} pending</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ApplicantsTable