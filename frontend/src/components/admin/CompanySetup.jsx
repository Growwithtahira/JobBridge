import React, { useEffect, useState, useRef } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, Loader2, Building2, Globe, MapPin,
    FileText, Camera, CheckCircle2, AlertCircle, Upload
} from 'lucide-react'

// ── Field component ────────────────────────────────────────────────────────────
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

// ── Main ───────────────────────────────────────────────────────────────────────
const CompanySetup = () => {
    const params = useParams()
    useGetCompanyById(params.id)
    const { singleCompany } = useSelector(store => store.company)
    const navigate = useNavigate()
    const fileRef = useRef(null)

    const [input, setInput] = useState({ name: '', description: '', website: '', location: '', file: null })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState(null)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        setInput({
            name: singleCompany.name || '',
            description: singleCompany.description || '',
            website: singleCompany.website || '',
            location: singleCompany.location || '',
            file: null
        })
        if (singleCompany.logo) setPreview(singleCompany.logo)
    }, [singleCompany])

    const onChange = (e) => {
        setInput(p => ({ ...p, [e.target.name]: e.target.value }))
        if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }))
    }

    const onFile = (e) => {
        const f = e.target.files?.[0]
        if (!f) return
        if (f.size > 2 * 1024 * 1024) { toast.error('Logo must be under 2MB'); return }
        setInput(p => ({ ...p, file: f }))
        const reader = new FileReader()
        reader.onloadend = () => setPreview(reader.result)
        reader.readAsDataURL(f)
    }

    // ✅ All fields mandatory

    const validate = () => {
        const e = {}
        if (!input.name.trim()) e.name = 'Company name is required'
        if (!input.description.trim()) e.description = 'Description is required'
        if (!input.location.trim()) e.location = 'Location is required'
        if (input.website.trim() && !/^https?:\/\//.test(input.website))
            e.website = 'URL must start with http:// or https://'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        const fd = new FormData()
        Object.entries(input).forEach(([k, v]) => { if (v && k !== 'file') fd.append(k, v) })
        if (input.file) fd.append('file', input.file)
        try {
            setLoading(true)
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            })
            if (res.data.success) {
                setSaved(true)
                toast.success(res.data.message)
                setTimeout(() => navigate('/admin/companies'), 1000)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />
            <div className="max-w-2xl mx-auto px-4 py-10">

                {/* Back */}
                <motion.button
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}
                    type="button" onClick={() => navigate('/admin/companies')}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-primary transition-colors mb-6 group"
                >
                    <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Companies
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-6 pt-6 pb-5 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                                <Building2 size={18} className="text-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Company Setup</h1>
                                <p className="text-xs text-gray-400 font-medium mt-0.5">
                                    All fields marked <span className="text-red-400">*</span> are required
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className="p-6 space-y-6">

                        {/* Logo upload */}
                        <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="relative group flex-shrink-0">
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 group-hover:border-primary bg-white flex items-center justify-center cursor-pointer transition-all overflow-hidden"
                                >
                                    {preview
                                        ? <img src={preview} alt="logo" className="w-full h-full object-cover rounded-2xl" />
                                        : <Camera size={24} className="text-gray-300 group-hover:text-primary transition-colors" />
                                    }
                                </div>
                                {preview && (
                                    <div
                                        className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary border-2 border-white flex items-center justify-center cursor-pointer"
                                        onClick={() => fileRef.current?.click()}
                                    >
                                        <Camera size={10} className="text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-700 mb-0.5">Company Logo</p>
                                <p className="text-xs text-gray-400">PNG, JPG up to 2MB. Recommended 200×200px.</p>
                                <button type="button" onClick={() => fileRef.current?.click()}
                                    className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary hover:text-violet-700 transition-colors">
                                    <Upload size={11} /> {preview ? 'Change Logo' : 'Upload Logo'}
                                </button>
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
                        </div>

                        {/* Fields grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field label="Company Name" icon={Building2} error={errors.name} required>
                                <Input name="name" value={input.name} onChange={onChange}
                                    placeholder="e.g. Acme Corp"
                                    className={`h-11 rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm ${errors.name ? 'border-red-300' : ''}`} />
                            </Field>

                            <Field label="Location" icon={MapPin} error={errors.location} required>
                                <Input name="location" value={input.location} onChange={onChange}
                                    placeholder="e.g. Bareilly, UP"
                                    className={`h-11 rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm ${errors.location ? 'border-red-300' : ''}`} />
                            </Field>

                            <Field label="Website" icon={Globe} error={errors.website} required hint="Include https://">
                                <Input name="website" value={input.website} onChange={onChange}
                                    placeholder="https://yourcompany.com"
                                    className={`h-11 rounded-xl border-gray-200 focus-visible:ring-purple-400 text-sm ${errors.website ? 'border-red-300' : ''}`} />
                            </Field>
                        </div>

                        <Field label="Description" icon={FileText} error={errors.description} required
                            hint={!errors.description ? `${input.description.length}/300 characters` : undefined}>
                            <textarea
                                name="description" value={input.description}
                                onChange={onChange} maxLength={300} rows={3}
                                placeholder="Brief description of what your company does…"
                                className={`w-full px-3 py-2.5 text-sm rounded-xl border focus:border-primary focus:ring-1 focus:ring-purple-400 outline-none resize-none text-gray-700 placeholder-gray-300 transition-colors
                                    ${errors.description ? 'border-red-300' : 'border-gray-200'}`}
                            />
                        </Field>

                        {/* Submit */}
                        <Button type="submit" disabled={loading || saved}
                            className="w-full h-12 font-bold bg-primary hover:bg-violet-700 text-white rounded-xl shadow-md shadow-purple-200 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm disabled:opacity-70"
                        >
                            {loading ? <><Loader2 size={16} className="animate-spin" /> Updating…</>
                                : saved ? <><CheckCircle2 size={16} /> Saved!</>
                                    : 'Update Company'}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default CompanySetup