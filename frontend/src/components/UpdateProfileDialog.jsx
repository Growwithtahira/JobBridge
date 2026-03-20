import React, { useState, useRef, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Loader2, X, Upload, User, Mail, Phone,
    FileText, Star, Camera, CheckCircle2,
    ChevronRight, Trash2, Plus
} from 'lucide-react'

// ── Skill dictionary ───────────────────────────────────────────────────────────
const SUGGESTED_SKILLS = {
    Technical: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'HTML', 'CSS', 'Python', 'Java', 'SQL', 'TypeScript', 'Git'],
    Marketing: ['SEO', 'Social Media', 'Content Marketing', 'Sales', 'B2B', 'Copywriting', 'Email Marketing'],
    'Soft Skills': ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management'],
}

// ── Tab config ─────────────────────────────────────────────────────────────────
const TABS = [
    { id: 'info', label: 'Basic Info', icon: User },
    { id: 'skills', label: 'Skills', icon: Star },
    { id: 'resume', label: 'Resume', icon: FileText },
]

// ── Field row ──────────────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, children, hint }) => (
    <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
            {Icon && <Icon size={11} className="text-primary" />}
            {label}
        </Label>
        {children}
        {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
    </div>
)

// ── Main dialog ────────────────────────────────────────────────────────────────
const UpdateProfileDialog = ({ open, setOpen }) => {
    const dispatch = useDispatch()
    const { user } = useSelector(store => store.auth)
    const isStudent = user?.role === 'student'

    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('info')
    const [previewDP, setPreviewDP] = useState(user?.profile?.profilePhoto || "")
    const [isDragOver, setIsDragOver] = useState(false)
    const [skillInput, setSkillInput] = useState("")
    const [showSkillDrop, setShowSkillDrop] = useState(false)
    const [selectedSkills, setSelectedSkills] = useState(user?.profile?.skills || [])
    const [resumeFile, setResumeFile] = useState(null)
    const [photoFile, setPhotoFile] = useState(null)

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
    })

    const photoInputRef = useRef(null)
    const resumeInputRef = useRef(null)

    // ── Field change ──────────────────────────────────────────────────────────
    const onChange = (e) => setInput(p => ({ ...p, [e.target.name]: e.target.value }))

    // ── Photo handling ────────────────────────────────────────────────────────
    const applyPhoto = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) {
            toast.error("Please select a valid image file."); return
        }
        setPhotoFile(file)
        const reader = new FileReader()
        reader.onloadend = () => setPreviewDP(reader.result)
        reader.readAsDataURL(file)
    }, [])

    const onDrop = useCallback((e) => {
        e.preventDefault(); setIsDragOver(false)
        applyPhoto(e.dataTransfer.files?.[0])
    }, [applyPhoto])

    // ── Skills ────────────────────────────────────────────────────────────────
    const addSkill = (s) => {
        const t = s.trim()
        if (t && !selectedSkills.includes(t)) setSelectedSkills(p => [...p, t])
        setSkillInput(""); setShowSkillDrop(false)
    }
    const removeSkill = (s) => setSelectedSkills(p => p.filter(x => x !== s))
    const onSkillKey = (e) => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(skillInput) }
    }

    const filteredSuggestions = Object.entries(SUGGESTED_SKILLS).reduce((acc, [cat, skills]) => {
        const filtered = skills.filter(s =>
            !selectedSkills.includes(s) &&
            (skillInput === '' || s.toLowerCase().includes(skillInput.toLowerCase()))
        )
        if (filtered.length) acc[cat] = filtered
        return acc
    }, {})

    // ── Submit ────────────────────────────────────────────────────────────────
    const onSubmit = async (e) => {
        e.preventDefault()
        const fd = new FormData()
        fd.append("fullname", input.fullname)
        fd.append("email", input.email)
        fd.append("phoneNumber", input.phoneNumber)
        fd.append("bio", input.bio)
        if (isStudent) {
            fd.append("skills", selectedSkills.join(","))
            if (resumeFile) fd.append("file", resumeFile)
        }
        if (photoFile) fd.append("profilePhoto", photoFile)

        try {
            setLoading(true)
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            })
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                toast.success(res.data.message || "Profile updated!")
                setOpen(false)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    // ── Tab content ───────────────────────────────────────────────────────────
    const tabContent = {

        info: (
            <div className="space-y-5">
                {/* Photo upload area */}
                <div className="flex flex-col items-center gap-3">
                    <div
                        className={`relative group cursor-pointer`}
                        onClick={() => photoInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={onDrop}
                    >
                        <Avatar className={`w-24 h-24 border-4 transition-all duration-200 rounded-2xl
                            ${isDragOver ? 'border-primary scale-105' : 'border-purple-100'}`}>
                            <AvatarImage src={previewDP} className="object-cover rounded-2xl" />
                            <AvatarFallback className="text-2xl font-bold bg-purple-50 text-primary rounded-2xl">
                                {user?.fullname?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        {/* Hover overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera size={20} className="text-white" />
                        </div>
                        {/* Edit badge */}
                        <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-primary border-2 border-white flex items-center justify-center shadow-md">
                            <Camera size={11} className="text-white" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">
                        Click or drag to change photo
                    </p>
                    <input ref={photoInputRef} type="file" accept="image/*" className="hidden"
                        onChange={e => applyPhoto(e.target.files?.[0])} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" icon={User}>
                        <Input name="fullname" value={input.fullname} onChange={onChange}
                            placeholder="Your full name"
                            className="border-gray-200 focus-visible:ring-purple-400 text-sm" />
                    </Field>
                    <Field label="Email" icon={Mail}>
                        <Input name="email" value={input.email} onChange={onChange}
                            placeholder="you@email.com"
                            className="border-gray-200 focus-visible:ring-purple-400 text-sm" />
                    </Field>
                    <Field label="Phone" icon={Phone}>
                        <Input name="phoneNumber" value={input.phoneNumber} onChange={onChange}
                            placeholder="+91 XXXXX XXXXX"
                            className="border-gray-200 focus-visible:ring-purple-400 text-sm" />
                    </Field>
                    <Field label="Bio" hint="Max 120 characters">
                        <Input name="bio" value={input.bio} onChange={onChange}
                            placeholder="One line about yourself…"
                            maxLength={120}
                            className="border-gray-200 focus-visible:ring-purple-400 text-sm" />
                    </Field>
                </div>
            </div>
        ),

        skills: isStudent ? (
            <div className="space-y-4">
                {/* Selected skills */}
                <div>
                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                        Your Skills ({selectedSkills.length})
                    </Label>
                    <div className="min-h-[52px] flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <AnimatePresence>
                            {selectedSkills.length === 0 && (
                                <span className="text-xs text-gray-300 self-center">No skills added yet — add some below</span>
                            )}
                            {selectedSkills.map((skill, i) => (
                                <motion.div key={skill}
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.7 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Badge className="flex items-center gap-1.5 bg-purple-50 text-primary border border-purple-200 hover:bg-purple-100 transition-colors px-2.5 py-1 text-xs font-semibold rounded-full">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(skill)}
                                            className="hover:text-red-500 transition-colors ml-0.5">
                                            <X size={10} />
                                        </button>
                                    </Badge>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Skill input */}
                <div className="relative">
                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                        Add a Skill
                    </Label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Input
                                value={skillInput}
                                onChange={e => setSkillInput(e.target.value)}
                                onKeyDown={onSkillKey}
                                onFocus={() => setShowSkillDrop(true)}
                                onBlur={() => setTimeout(() => setShowSkillDrop(false), 200)}
                                placeholder='e.g. "React" then press Enter'
                                className="border-gray-200 focus-visible:ring-purple-400 text-sm pr-10"
                            />
                        </div>
                        <Button type="button" onClick={() => addSkill(skillInput)}
                            className="bg-primary hover:bg-violet-700 text-white rounded-xl px-4 h-10 flex items-center gap-1 text-sm font-bold flex-shrink-0">
                            <Plus size={14} /> Add
                        </Button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Press Enter or comma to add quickly</p>

                    {/* Suggestions dropdown */}
                    <AnimatePresence>
                        {showSkillDrop && Object.keys(filteredSuggestions).length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-4 max-h-52 overflow-y-auto"
                            >
                                {Object.entries(filteredSuggestions).map(([cat, skills]) => (
                                    <div key={cat} className="mb-3 last:mb-0">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">{cat}</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {skills.map(skill => (
                                                <button key={skill} type="button"
                                                    onMouseDown={() => addSkill(skill)}
                                                    className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2.5 py-1 rounded-full cursor-pointer hover:bg-purple-50 hover:text-primary hover:border-purple-200 transition-colors font-medium"
                                                >
                                                    + {skill}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <Star size={32} className="text-gray-200 mb-3" strokeWidth={1.5} />
                <p className="text-sm text-gray-400">Skills are only available for job seekers.</p>
            </div>
        ),

        resume: isStudent ? (
            <div className="space-y-4">
                {/* Current resume */}
                {user?.profile?.resume && (
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
                        <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-green-700 mb-0.5">Current Resume</p>
                            <p className="text-xs text-green-600 truncate">{user.profile.resumeOriginalName}</p>
                        </div>
                        <a href={user.profile.resume} target="_blank" rel="noreferrer"
                            className="text-xs font-bold text-green-600 hover:text-green-800 transition-colors flex-shrink-0">
                            View →
                        </a>
                    </div>
                )}

                {/* Upload new */}
                <div>
                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                        {user?.profile?.resume ? 'Replace Resume' : 'Upload Resume'}
                    </Label>

                    {/* Drop zone */}
                    <label htmlFor="resume-upload"
                        className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                            ${resumeFile
                                ? 'border-primary bg-purple-50'
                                : 'border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50/50'}`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                            ${resumeFile ? 'bg-primary' : 'bg-white border border-gray-200'}`}>
                            {resumeFile
                                ? <CheckCircle2 size={22} className="text-white" />
                                : <Upload size={20} className="text-gray-400" />}
                        </div>
                        <div className="text-center">
                            {resumeFile ? (
                                <>
                                    <p className="text-sm font-bold text-primary">{resumeFile.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {(resumeFile.size / 1024).toFixed(0)} KB · PDF
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-semibold text-gray-600">Drop your PDF here</p>
                                    <p className="text-xs text-gray-400 mt-0.5">or click to browse · PDF only · max 5MB</p>
                                </>
                            )}
                        </div>
                        <input ref={resumeInputRef} id="resume-upload" type="file" accept="application/pdf"
                            className="hidden"
                            onChange={e => {
                                const f = e.target.files?.[0]
                                if (!f) return
                                if (f.size > 5 * 1024 * 1024) { toast.error("File too large. Max 5MB."); return }
                                setResumeFile(f)
                            }}
                        />
                    </label>

                    {resumeFile && (
                        <button type="button"
                            onClick={() => { setResumeFile(null); resumeInputRef.current.value = '' }}
                            className="flex items-center gap-1.5 mt-2 text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
                        >
                            <Trash2 size={11} /> Remove selected file
                        </button>
                    )}
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <FileText size={32} className="text-gray-200 mb-3" strokeWidth={1.5} />
                <p className="text-sm text-gray-400">Resume upload is only available for job seekers.</p>
            </div>
        ),
    }

    // Tabs to show based on role
    const visibleTabs = isStudent ? TABS : TABS.filter(t => t.id === 'info')

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="sm:max-w-[520px] bg-white text-gray-900 border-gray-100 shadow-2xl p-0 overflow-hidden rounded-2xl"
                onInteractOutside={() => setOpen(false)}
            >
                {/* ── Header ───────────────────────────────────────────────── */}
                <DialogHeader className="px-6 pt-5 pb-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl font-extrabold text-gray-900 tracking-tight">
                                Edit Profile
                            </DialogTitle>
                            <p className="text-xs text-gray-400 mt-0.5 font-medium">
                                Keep your info up to date for better job matches
                            </p>
                        </div>
                        <button onClick={() => setOpen(false)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500">
                            <X size={15} />
                        </button>
                    </div>
                </DialogHeader>

                {/* ── Tabs ─────────────────────────────────────────────────── */}
                {isStudent && (
                    <div className="flex gap-1 px-6 pt-4 pb-0">
                        {visibleTabs.map(tab => {
                            const Icon = tab.icon
                            const active = activeTab === tab.id
                            return (
                                <button key={tab.id} type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150
                                        ${active
                                            ? 'bg-primary text-white shadow-md shadow-purple-200'
                                            : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                    <Icon size={12} /> {tab.label}
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* ── Tab body ─────────────────────────────────────────────── */}
                <form onSubmit={onSubmit}>
                    <div className="px-6 py-5 max-h-[55vh] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {tabContent[activeTab]}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* ── Footer ───────────────────────────────────────────── */}
                    <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between gap-3">
                        {/* Tab navigation (next/prev) */}
                        {isStudent && activeTab !== 'resume' && (
                            <button type="button"
                                onClick={() => {
                                    const idx = TABS.findIndex(t => t.id === activeTab)
                                    if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].id)
                                }}
                                className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-primary transition-colors"
                            >
                                Next <ChevronRight size={13} />
                            </button>
                        )}
                        {isStudent && activeTab === 'resume' && <div />}
                        {!isStudent && <div />}

                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline"
                                onClick={() => setOpen(false)}
                                className="border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl h-10 px-4 text-sm font-semibold"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}
                                className="bg-primary hover:bg-violet-700 text-white font-bold rounded-xl h-10 px-6 shadow-md shadow-purple-200 transition-all hover:scale-105 active:scale-95 text-sm flex items-center gap-2"
                            >
                                {loading
                                    ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                                    : <><CheckCircle2 size={14} /> Save Changes</>}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog