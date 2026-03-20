import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Building2, Calendar, Globe, TrendingUp, Trash2, AlertTriangle } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { toast } from 'sonner'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { setCompanies } from '@/redux/companySlice'

// ── Time helper ────────────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
    if (!dateStr) return '—'
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 30) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Stat card ──────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '18' }}>
            <Icon size={16} style={{ color }} />
        </div>
        <div>
            <p className="text-xl font-extrabold text-gray-900 leading-none">{value}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
        </div>
    </div>
)

// ── Delete dialog — renders in document.body via portal ───────────────────────
const DeleteDialog = ({ company, onClose, onConfirm, loading }) => {
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

                <h2 className="text-lg font-extrabold text-gray-900 text-center mb-1">Delete Company?</h2>
                <p className="text-sm text-gray-400 text-center mb-2">
                    <span className="font-bold text-gray-700">"{company.name}"</span> will be permanently deleted.
                </p>
                <p className="text-xs text-gray-400 text-center mb-6">
                    This action cannot be undone.
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

// ── Action menu ────────────────────────────────────────────────────────────────
const ActionMenu = ({ company, onDeleteClick }) => {
    const navigate = useNavigate()
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="w-8 h-8 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-purple-200 flex items-center justify-center text-gray-400 hover:text-primary transition-all">
                    <MoreHorizontal size={15} />
                </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-2 rounded-2xl shadow-xl border-gray-100 bg-white">
                <button onClick={() => navigate(`/admin/companies/${company._id}`)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-purple-50 hover:text-primary transition-colors text-sm font-medium group">
                    <div className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                        <Edit2 size={11} />
                    </div>
                    Edit Company
                </button>

                <div className="h-px bg-gray-50 my-1" />

                <button onClick={() => onDeleteClick(company)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium group">
                    <div className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                        <Trash2 size={11} />
                    </div>
                    Delete
                </button>
            </PopoverContent>
        </Popover>
    )
}

// ── Empty state ────────────────────────────────────────────────────────────────
const EmptyState = ({ query }) => (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center">
        <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
            className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-4">
            <Building2 size={24} className="text-purple-300" strokeWidth={1.5} />
        </motion.div>
        <p className="font-bold text-gray-700">{query ? `No companies matching "${query}"` : 'No companies yet'}</p>
        <p className="text-sm text-gray-400 mt-1">
            {query ? 'Try a different keyword' : 'Register your first company to get started'}
        </p>
    </motion.div>
)

// ── Main ───────────────────────────────────────────────────────────────────────
const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company)
    const dispatch = useDispatch()
    const [filterCompany, setFilterCompany] = useState(companies)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    useEffect(() => {
        const q = searchCompanyByText?.toLowerCase() || ''
        setFilterCompany(companies.filter(c => !q || c?.name?.toLowerCase().includes(q)))
    }, [companies, searchCompanyByText])

    const recentlyAdded = companies.filter(c => {
        const days = Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 86_400_000)
        return days <= 7
    }).length

    const handleDelete = async () => {
        if (!deleteTarget) return
        try {
            setDeleteLoading(true)
            const res = await axios.delete(
                `${COMPANY_API_END_POINT}/delete/${deleteTarget._id}`,
                { withCredentials: true }
            )
            if (res.data.success) {
                dispatch(setCompanies(companies.filter(c => c._id !== deleteTarget._id)))
                toast.success(`"${deleteTarget.name}" deleted successfully`)
                setDeleteTarget(null)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete company')
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
                        company={deleteTarget}
                        onClose={() => !deleteLoading && setDeleteTarget(null)}
                        onConfirm={handleDelete}
                        loading={deleteLoading}
                    />
                )}
            </AnimatePresence>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard icon={Building2} label="Total Companies" value={companies.length} color="#6A38C2" />
                <StatCard icon={TrendingUp} label="Showing" value={filterCompany.length} color="#10b981" />
                <StatCard icon={Calendar} label="Added This Week" value={recentlyAdded} color="#f59e0b" />
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
                <AnimatePresence>
                    {filterCompany.length === 0 ? (
                        <EmptyState query={searchCompanyByText} />
                    ) : filterCompany.map((company, i) => (
                        <motion.div key={company._id}
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <Avatar className="w-12 h-12 rounded-2xl border border-gray-100 shadow-sm flex-shrink-0">
                                        <AvatarImage src={company.logo} className="object-cover rounded-2xl" />
                                        <AvatarFallback className="rounded-2xl bg-purple-50 text-primary font-black text-lg">
                                            {company.name?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="font-bold text-gray-900 text-sm truncate">{company.name}</p>
                                        {company.location && (
                                            <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                                                📍 {company.location}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <ActionMenu company={company} onDeleteClick={setDeleteTarget} />
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                                <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                                    <Calendar size={10} /> {timeAgo(company.createdAt)}
                                </span>
                                {company.website && (
                                    <a href={company.website} target="_blank" rel="noreferrer"
                                        className="flex items-center gap-1 text-[11px] text-primary font-semibold hover:underline"
                                        onClick={e => e.stopPropagation()}>
                                        <Globe size={10} /> Website
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-[auto_2fr_1fr_1fr_auto] gap-4 px-5 py-3.5 border-b border-gray-50 bg-gray-50/60">
                    {['Logo', 'Company', 'Location', 'Registered', 'Actions'].map((h, i) => (
                        <p key={i} className={`text-[10px] font-black text-gray-400 uppercase tracking-widest ${i === 4 ? 'text-right' : ''}`}>{h}</p>
                    ))}
                </div>

                {filterCompany.length === 0 ? (
                    <EmptyState query={searchCompanyByText} />
                ) : (
                    <div className="divide-y divide-gray-50">
                        <AnimatePresence>
                            {filterCompany.map((company, i) => (
                                <motion.div key={company._id}
                                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.28, delay: i * 0.04 }}
                                    className="grid grid-cols-[auto_2fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center hover:bg-gray-50/60 transition-colors"
                                >
                                    <Avatar className="w-10 h-10 rounded-xl border border-gray-100 shadow-sm">
                                        <AvatarImage src={company.logo} className="object-cover rounded-xl" />
                                        <AvatarFallback className="rounded-xl bg-purple-50 text-primary font-black text-sm">
                                            {company.name?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="min-w-0">
                                        <p className="font-bold text-sm text-gray-900 truncate">{company.name}</p>
                                        {company.website && (
                                            <a href={company.website} target="_blank" rel="noreferrer"
                                                className="flex items-center gap-1 text-[11px] text-primary hover:underline mt-0.5 w-fit"
                                                onClick={e => e.stopPropagation()}>
                                                <Globe size={10} /> {company.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-500 font-medium truncate">
                                        {company.location || <span className="text-gray-300">—</span>}
                                    </p>

                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={12} className="text-gray-400 flex-shrink-0" />
                                        <span className="text-xs text-gray-500 font-medium">{timeAgo(company.createdAt)}</span>
                                    </div>

                                    <div className="flex justify-end">
                                        <ActionMenu company={company} onDeleteClick={setDeleteTarget} />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {filterCompany.length > 0 && (
                    <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/40">
                        <p className="text-xs text-gray-400 font-medium">
                            Showing <span className="font-bold text-gray-600">{filterCompany.length}</span> of{' '}
                            <span className="font-bold text-gray-600">{companies.length}</span> companies
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CompaniesTable