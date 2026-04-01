import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import useGetJobById from '@/hooks/useGetJobById'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Loader2, ArrowLeft, Briefcase, MapPin, DollarSign,
    Users, Clock, Star, FileText, Building2, AlertCircle,
    CheckCircle2, Plus, ArrowRight
} from 'lucide-react'

// ── Job type options ───────────────────────────────────────────────────────────
const JOB_TYPES = ['Full Time', 'Part Time', 'Internship', 'Freelance', 'Remote']

const TYPE_STYLES = {
    'Full Time': 'bg-green-50  text-green-700  border-green-200',
    'Part Time': 'bg-blue-50   text-blue-700   border-blue-200',
    'Internship': 'bg-amber-50  text-amber-700  border-amber-200',
    'Freelance': 'bg-violet-50 text-violet-700 border-violet-200',
    'Remote': 'bg-teal-50   text-teal-700   border-teal-200',
}

// ── Field wrapper ──────────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, error, hint, required, children }) => (
    <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
            {Icon && <Icon size={11} className="text-primary" />}
            {label}
            {required && <span className="text-red-400 ml-0.5">*</span>}
        </Label>
        {children}
        <AnimatePresence>
            {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-1 text-xs text-red-500 font-medium">
                    <AlertCircle size={11} /> {error}
                </motion.p>
            )}
        </AnimatePresence>
        {hint && !error && <p className="text-[10px] text-gray-400">{hint}</p>}
    </div>
)

// ── Section wrapper ────────────────────────────────────────────────────────────
const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                <Icon size={14} className="text-primary" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
        </div>
        <div className="p-5 space-y-5">{children}</div>
    </div>
)

// ── Main ───────────────────────────────────────────────────────────────────────
const PostJob = () => {
    const { companies } = useSelector(store => store.company)
    const { singleJob } = useSelector(store => store.job)
    const navigate = useNavigate()
    const params = useParams()
    useGetJobById(params.id)

    const isEdit = !!params.id;

    const [input, setInput] = useState({
        title: '', description: '', requirements: '',
        salary: '', location: '', jobType: '',
        experienceLevel: '', position: 1, companyId: ''
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    React.useEffect(() => {
        if (isEdit && singleJob) {
            setInput({
                title: singleJob.title || '',
                description: singleJob.description || '',
                requirements: singleJob.requirements?.join(',') || '',
                salary: singleJob.salary || '',
                location: singleJob.location || '',
                jobType: singleJob.jobType || '',
                experienceLevel: singleJob.experienceLevel || '',
                position: singleJob.position || 1,
                companyId: singleJob.company?._id || singleJob.company || ''
            })
        }
    }, [singleJob, isEdit])

    const onChange = (e) => {
        setInput(p => ({ ...p, [e.target.name]: e.target.value }))
        if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }))
    }

    const onCompany = (value) => {
        const c = companies.find(c => c.name.toLowerCase() === value)
        setInput(p => ({ ...p, companyId: c?._id || '' }))
        if (errors.companyId) setErrors(p => ({ ...p, companyId: '' }))
    }

    const setJobType = (t) => {
        setInput(p => ({ ...p, jobType: t }))
        if (errors.jobType) setErrors(p => ({ ...p, jobType: '' }))
    }

    // ✅ All fields mandatory
    const validate = () => {
        const e = {}
        if (!input.title.trim()) e.title = 'Job title is required'
        if (!input.description.trim()) e.description = 'Description is required'
        if (!input.requirements.trim()) e.requirements = 'Requirements are required'
        if (!input.salary || Number(input.salary) <= 0) e.salary = 'Enter a valid salary'
        if (!input.location.trim()) e.location = 'Location is required'
        if (!input.jobType) e.jobType = 'Select a job type'
        if (input.experienceLevel === '' || input.experienceLevel === null)
            e.experienceLevel = 'Experience level is required'
        if (input.position < 1) e.position = 'At least 1 position required'
        if (!input.companyId && companies.length > 0) e.companyId = 'Select a company'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        try {
            setLoading(true)
            const url = isEdit ? `${JOB_API_END_POINT}/update/${params.id}` : `${JOB_API_END_POINT}/post`
            const res = await axios[isEdit ? 'put' : 'post'](url, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            if (res.data.success) {
                setDone(true)
                toast.success(res.data.message)
                setTimeout(() => navigate('/admin/jobs'), 1200)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'post'} job`)
        } finally {
            setLoading(false)
        }
    }

    const noCompany = companies.length === 0

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-10 space-y-5">

                {/* Back */}
                <motion.button
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}
                    type="button" onClick={() => navigate('/admin/jobs')}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-primary transition-colors group"
                >
                    <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Jobs
                </motion.button>

                {/* Page header */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }}>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{isEdit ? 'Update Job' : 'Post a New Job'}</h1>
                    <p className="text-sm text-gray-400 mt-0.5 font-medium">
                        All fields marked <span className="text-red-400">*</span> are required
                    </p>
                </motion.div>

                {/* No company warning */}
                <AnimatePresence>
                    {noCompany && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl"
                        >
                            <AlertCircle size={18} className="text-amber-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-amber-800">No company registered</p>
                                <p className="text-xs text-amber-600 font-medium">You need to register a company before posting a job.</p>
                            </div>
                            <button onClick={() => navigate('/admin/companies/create')}
                                className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 border border-amber-200 px-3 py-1.5 rounded-xl transition-colors flex-shrink-0">
                                <Plus size={11} /> Add Company
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={onSubmit} className="space-y-5">

                    {/* ── Basic Info ─────────────────────────────────────── */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
                        <Section title="Basic Information" icon={Briefcase}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <Field label="Job Title" icon={Briefcase} error={errors.title} required>
                                    <Input name="title" value={input.title} onChange={onChange}
                                        placeholder="e.g. Senior React Developer"
                                        className={`h-11 bg-white rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm ${errors.title ? 'border-red-300' : ''}`} />
                                </Field>

                                {!noCompany && (
                                    <Field label="Select Company" icon={Building2} error={errors.companyId} required>
                                        <Select onValueChange={onCompany} value={companies.find(c => c._id === input.companyId)?.name.toLowerCase() || ''}>
                                            <SelectTrigger className={`h-11 bg-white rounded-xl border-gray-200 text-sm focus:ring-purple-400 ${errors.companyId ? 'border-red-300' : ''}`}>
                                                <SelectValue placeholder="Choose a company" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white rounded-2xl border border-gray-100 shadow-xl z-[9999]">
                                                <SelectGroup>
                                                    {companies.map(c => (
                                                        <SelectItem key={c._id} value={c.name.toLowerCase()}
                                                            className="cursor-pointer rounded-xl hover:bg-purple-50 focus:bg-purple-50 focus:text-primary text-sm font-medium">
                                                            {c.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <Field label="Location" icon={MapPin} error={errors.location} required>
                                    <Input name="location" value={input.location} onChange={onChange}
                                        placeholder="e.g. Bareilly / Remote"
                                        className={`h-11 bg-white rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm ${errors.location ? 'border-red-300' : ''}`} />
                                </Field>

                                {/* ✅ Requirements is now required */}
                                <Field label="Requirements" icon={Star} error={errors.requirements} required
                                    hint={!errors.requirements ? 'Comma-separated: React, Node.js, SQL…' : undefined}>
                                    <Input name="requirements" value={input.requirements} onChange={onChange}
                                        placeholder="React, Node.js, MongoDB…"
                                        className={`h-11 bg-white rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm ${errors.requirements ? 'border-red-300' : ''}`} />
                                </Field>
                            </div>

                            <Field label="Description" icon={FileText} error={errors.description} required
                                hint={!errors.description ? `${input.description.length}/500 characters` : undefined}>
                                <textarea name="description" value={input.description} onChange={onChange}
                                    maxLength={500} rows={3}
                                    placeholder="Describe the role, responsibilities and expectations…"
                                    className={`w-full bg-white px-3 py-2.5 text-sm rounded-xl border focus:border-primary focus:ring-1 focus:ring-purple-400 outline-none resize-none text-gray-700 placeholder-gray-300 transition-colors
                                        ${errors.description ? 'border-red-300' : 'border-gray-200'}`} />
                            </Field>
                        </Section>
                    </motion.div>

                    {/* ── Job Details ────────────────────────────────────── */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                        <Section title="Job Details" icon={FileText}>

                            {/* Job type chips */}
                            <Field label="Job Type" icon={Clock} error={errors.jobType} required>
                                <div className="flex flex-wrap gap-2">
                                    {JOB_TYPES.map(t => (
                                        <motion.button key={t} type="button"
                                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                            onClick={() => setJobType(t)}
                                            className={`px-3.5 py-2 text-xs font-bold rounded-xl border-2 transition-all
                                                ${input.jobType === t
                                                    ? `${TYPE_STYLES[t]} border-current shadow-sm`
                                                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                        >
                                            {t}
                                            {input.jobType === t && <CheckCircle2 size={10} className="inline ml-1.5 mb-0.5" />}
                                        </motion.button>
                                    ))}
                                </div>
                            </Field>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <Field label="Salary (LPA)" icon={DollarSign} error={errors.salary} required>
                                    <Input name="salary" value={input.salary} onChange={onChange}
                                        type="number" min="0" placeholder="e.g. 8"
                                        className={`h-11 bg-white rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm ${errors.salary ? 'border-red-300' : ''}`} />
                                </Field>

                                {/* ✅ Experience is now required */}
                                <Field label="Experience (Years)" icon={Star} error={errors.experienceLevel} required>
                                    <Input name="experienceLevel" value={input.experienceLevel} onChange={onChange}
                                        type="number" min="0" placeholder="e.g. 2"
                                        className={`h-11 bg-white rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm ${errors.experienceLevel ? 'border-red-300' : ''}`} />
                                </Field>

                                <Field label="No. of Positions" icon={Users} error={errors.position} required>
                                    <div className="flex items-center gap-2">
                                        <button type="button"
                                            onClick={() => setInput(p => ({ ...p, position: Math.max(1, p.position - 1) }))}
                                            className="w-11 h-11 rounded-xl border border-gray-200 bg-white hover:bg-purple-50 hover:border-purple-200 text-gray-600 hover:text-primary font-bold text-lg flex items-center justify-center transition-all flex-shrink-0">
                                            −
                                        </button>
                                        <Input name="position" value={input.position} onChange={onChange}
                                            type="number" min="1"
                                            className="bg-white h-11 rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm text-center font-bold" />
                                        <button type="button"
                                            onClick={() => setInput(p => ({ ...p, position: p.position + 1 }))}
                                            className="w-11 h-11 rounded-xl border border-gray-200 bg-white hover:bg-purple-50 hover:border-purple-200 text-gray-600 hover:text-primary font-bold text-lg flex items-center justify-center transition-all flex-shrink-0">
                                            +
                                        </button>
                                    </div>
                                </Field>
                            </div>
                        </Section>
                    </motion.div>



                    {/* Submit */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, delay: 0.2 }}>
                        <Button type="submit" disabled={loading || done || noCompany}
                            className="w-full h-12 font-bold bg-primary hover:bg-violet-700 text-white rounded-xl shadow-md shadow-purple-200 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                            {loading ? <><Loader2 size={16} className="animate-spin" /> {isEdit ? 'Updating…' : 'Posting…'}</>
                                : done ? <><CheckCircle2 size={16} /> Job {isEdit ? 'Updated' : 'Posted'}!</>
                                    : <>{isEdit ? 'Update Job' : 'Post Job'} <ArrowRight size={15} /></>}
                        </Button>
                    </motion.div>
                </form>
            </div>
        </div>
    )
}

export default PostJob