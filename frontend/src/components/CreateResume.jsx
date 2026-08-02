/* eslint-disable react/prop-types */
import { useState } from 'react'
import Navbar from './shared/Navbar'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User, Mail, Phone, MapPin, Briefcase, GraduationCap,
    Star, FileText, Plus, Trash2, Printer, Eye, EyeOff,
    Pen, Globe, Linkedin, Github
} from 'lucide-react'

// ── helpers ───────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }
})

const newExp = () => ({ id: Date.now(), company: '', role: '', from: '', to: '', current: false, desc: '' })
const newEdu = () => ({ id: Date.now(), school: '', degree: '', field: '', from: '', to: '', gpa: '' })

// ── Section card ──────────────────────────────────────────────────────────────
const SectionCard = ({ icon, title, children, delay = 0 }) => (
    <motion.div {...fadeUp(delay)}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5"
    >
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50">
            <span className="text-primary">{icon}</span>
            <h2 className="font-bold text-gray-900 text-base">{title}</h2>
        </div>
        <div className="p-6 space-y-4">{children}</div>
    </motion.div>
)

// ── Field row ─────────────────────────────────────────────────────────────────
const Field = ({ label, children }) => (
    <div className="space-y-1.5">
        <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</Label>
        {children}
    </div>
)

// ── Resume preview ────────────────────────────────────────────────────────────
const ResumePreview = ({ data }) => {
    const { personal, summary, experiences, educations, skills } = data
    return (
        <div id="resume-preview" className="bg-white p-8 text-gray-900 font-sans min-h-[297mm] print:shadow-none shadow-xl rounded-2xl border border-gray-100">
            {/* Header */}
            <div className="border-b-2 border-primary pb-4 mb-5">
                <h1 className="text-3xl font-black tracking-tight text-gray-900">
                    {personal.name || 'Your Name'}
                </h1>
                {personal.title && (
                    <p className="text-base font-semibold text-primary mt-0.5">{personal.title}</p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                    {personal.email && <span className="flex items-center gap-1"><Mail size={10} />{personal.email}</span>}
                    {personal.phone && <span className="flex items-center gap-1"><Phone size={10} />{personal.phone}</span>}
                    {personal.location && <span className="flex items-center gap-1"><MapPin size={10} />{personal.location}</span>}
                    {personal.website && <span className="flex items-center gap-1"><Globe size={10} />{personal.website}</span>}
                    {personal.linkedin && <span className="flex items-center gap-1"><Linkedin size={10} />{personal.linkedin}</span>}
                    {personal.github && <span className="flex items-center gap-1"><Github size={10} />{personal.github}</span>}
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-5">
                    <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-2">Summary</h2>
                    <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{summary}</p>
                </div>
            )}

            {/* Experience */}
            {experiences.some(e => e.company || e.role) && (
                <div className="mb-5">
                    <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-3">Work Experience</h2>
                    <div className="space-y-4">
                        {experiences.filter(e => e.company || e.role).map(exp => (
                            <div key={exp.id}>
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{exp.role || '—'}</p>
                                        <p className="text-xs text-gray-600 font-semibold">{exp.company}</p>
                                    </div>
                                    <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                                        {exp.from}{exp.from && (exp.to || exp.current) ? ' – ' : ''}{exp.current ? 'Present' : exp.to}
                                    </span>
                                </div>
                                {exp.desc && <p className="text-[11px] text-gray-600 mt-1 leading-relaxed whitespace-pre-line">{exp.desc}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {educations.some(e => e.school || e.degree) && (
                <div className="mb-5">
                    <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-3">Education</h2>
                    <div className="space-y-3">
                        {educations.filter(e => e.school || e.degree).map(edu => (
                            <div key={edu.id}>
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                                        <p className="text-xs text-gray-600 font-semibold">{edu.school}</p>
                                    </div>
                                    <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                                        {edu.from}{edu.from && edu.to ? ' – ' : ''}{edu.to}
                                    </span>
                                </div>
                                {edu.gpa && <p className="text-[10px] text-gray-400 mt-0.5">GPA: {edu.gpa}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-1.5">
                        {skills.map((s, i) => (
                            <span key={i} className="text-[10px] font-semibold bg-purple-50 text-primary border border-purple-100 px-2 py-0.5 rounded-full">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Main ──────────────────────────────────────────────────────────────────────
const CreateResume = () => {
    const { user } = useSelector(store => store.auth)

    const [personal, setPersonal] = useState({
        name: user?.fullname || '',
        title: '',
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
    })
    const [summary, setSummary] = useState(user?.profile?.bio || '')
    const [experiences, setExperiences] = useState([newExp()])
    const [educations, setEducations] = useState([newEdu()])
    const [skills, setSkills] = useState(user?.profile?.skills || [])
    const [skillInput, setSkillInput] = useState('')
    const [showPreview, setShowPreview] = useState(true)

    const resumeData = { personal, summary, experiences, educations, skills }

    // ── Experience handlers ───────────────────────────────────────────────────
    const updateExp = (id, field, value) =>
        setExperiences(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
    const addExp = () => setExperiences(prev => [...prev, newExp()])
    const removeExp = id => setExperiences(prev => prev.filter(e => e.id !== id))

    // ── Education handlers ────────────────────────────────────────────────────
    const updateEdu = (id, field, value) =>
        setEducations(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
    const addEdu = () => setEducations(prev => [...prev, newEdu()])
    const removeEdu = id => setEducations(prev => prev.filter(e => e.id !== id))

    // ── Skills ────────────────────────────────────────────────────────────────
    const addSkill = () => {
        const s = skillInput.trim()
        if (s && !skills.includes(s)) setSkills(prev => [...prev, s])
        setSkillInput('')
    }
    const removeSkill = s => setSkills(prev => prev.filter(x => x !== s))

    // ── Print ─────────────────────────────────────────────────────────────────
    const handlePrint = () => window.print()

    return (
        <div className="min-h-screen bg-gray-50/60">
            <Navbar />

            {/* Print styles injected inline */}
            <style>{`
                @media print {
                    body > * { display: none !important; }
                    #resume-print-root { display: block !important; }
                    #resume-preview {
                        box-shadow: none !important;
                        border: none !important;
                        border-radius: 0 !important;
                        padding: 20mm 18mm !important;
                        margin: 0 !important;
                    }
                }
                @media screen {
                    #resume-print-root { display: none; }
                }
            `}</style>

            {/* Hidden print target */}
            <div id="resume-print-root">
                <ResumePreview data={resumeData} />
            </div>

            {/* ── Page header ──────────────────────────────────────────────── */}
            <div className="relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #6A38C2 0%, #8B5CF6 50%, #a78bfa 100%)' }}>
                <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
                <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
                    <motion.div {...fadeUp(0)}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <FileText size={20} className="text-white" />
                            </div>
                            <h1 className="text-2xl font-black text-white tracking-tight">Resume Builder</h1>
                        </div>
                        <p className="text-white/70 text-sm font-medium">
                            Build a professional resume and download it as a PDF.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* ── Content ──────────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm font-semibold text-gray-500">Fill in the sections below to build your resume.</p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowPreview(p => !p)}
                            className="flex items-center gap-2 rounded-xl text-sm font-semibold border-gray-200 h-9"
                        >
                            {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                            {showPreview ? 'Hide Preview' : 'Show Preview'}
                        </Button>
                        <Button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-primary hover:bg-violet-700 text-white font-bold rounded-xl px-5 h-9 text-sm shadow-md shadow-purple-200"
                        >
                            <Printer size={14} /> Download / Print
                        </Button>
                    </div>
                </div>

                <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-2xl'}`}>

                    {/* ── Left: Form ──────────────────────────────────────── */}
                    <div>

                        {/* Personal Info */}
                        <SectionCard icon={<User size={16} />} title="Personal Information" delay={0.05}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Full Name">
                                    <Input value={personal.name}
                                        onChange={e => setPersonal(p => ({ ...p, name: e.target.value }))}
                                        placeholder="Jane Doe"
                                        className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30" />
                                </Field>
                                <Field label="Job Title / Role">
                                    <Input value={personal.title}
                                        onChange={e => setPersonal(p => ({ ...p, title: e.target.value }))}
                                        placeholder="Software Engineer"
                                        className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30" />
                                </Field>
                                <Field label="Email">
                                    <Input value={personal.email} type="email"
                                        onChange={e => setPersonal(p => ({ ...p, email: e.target.value }))}
                                        placeholder="jane@example.com"
                                        className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30" />
                                </Field>
                                <Field label="Phone">
                                    <Input value={personal.phone}
                                        onChange={e => setPersonal(p => ({ ...p, phone: e.target.value }))}
                                        placeholder="+1 (555) 000-0000"
                                        className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30" />
                                </Field>
                                <Field label="Location">
                                    <Input value={personal.location}
                                        onChange={e => setPersonal(p => ({ ...p, location: e.target.value }))}
                                        placeholder="New York, NY"
                                        className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30" />
                                </Field>
                                <Field label="Website">
                                    <Input value={personal.website}
                                        onChange={e => setPersonal(p => ({ ...p, website: e.target.value }))}
                                        placeholder="https://yoursite.com"
                                        className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30" />
                                </Field>
                                <Field label="LinkedIn">
                                    <Input value={personal.linkedin}
                                        onChange={e => setPersonal(p => ({ ...p, linkedin: e.target.value }))}
                                        placeholder="linkedin.com/in/janedoe"
                                        className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30" />
                                </Field>
                                <Field label="GitHub">
                                    <Input value={personal.github}
                                        onChange={e => setPersonal(p => ({ ...p, github: e.target.value }))}
                                        placeholder="github.com/janedoe"
                                        className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30" />
                                </Field>
                            </div>
                        </SectionCard>

                        {/* Summary */}
                        <SectionCard icon={<Pen size={16} />} title="Professional Summary" delay={0.1}>
                            <Field label="Summary / Objective">
                                <textarea
                                    value={summary}
                                    onChange={e => setSummary(e.target.value)}
                                    rows={4}
                                    placeholder="Write a short professional summary that highlights your experience and goals..."
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 placeholder:text-gray-400"
                                />
                            </Field>
                        </SectionCard>

                        {/* Work Experience */}
                        <SectionCard icon={<Briefcase size={16} />} title="Work Experience" delay={0.15}>
                            <AnimatePresence>
                                {experiences.map((exp, idx) => (
                                    <motion.div key={exp.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.25 }}
                                        className={`space-y-3 ${idx > 0 ? 'pt-4 border-t border-gray-100' : ''}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                                Experience {idx + 1}
                                            </p>
                                            {experiences.length > 1 && (
                                                <button onClick={() => removeExp(exp.id)}
                                                    className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors">
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <Field label="Job Title">
                                                <Input value={exp.role}
                                                    onChange={e => updateExp(exp.id, 'role', e.target.value)}
                                                    placeholder="Software Engineer"
                                                    className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30" />
                                            </Field>
                                            <Field label="Company">
                                                <Input value={exp.company}
                                                    onChange={e => updateExp(exp.id, 'company', e.target.value)}
                                                    placeholder="Acme Inc."
                                                    className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30" />
                                            </Field>
                                            <Field label="Start Date">
                                                <Input value={exp.from} type="month"
                                                    onChange={e => updateExp(exp.id, 'from', e.target.value)}
                                                    className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30" />
                                            </Field>
                                            <Field label="End Date">
                                                <Input value={exp.to} type="month"
                                                    disabled={exp.current}
                                                    onChange={e => updateExp(exp.id, 'to', e.target.value)}
                                                    className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30 disabled:opacity-50" />
                                                <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
                                                    <input type="checkbox" checked={exp.current}
                                                        onChange={e => updateExp(exp.id, 'current', e.target.checked)}
                                                        className="accent-primary w-3 h-3" />
                                                    <span className="text-[11px] text-gray-500 font-medium">Currently working here</span>
                                                </label>
                                            </Field>
                                        </div>
                                        <Field label="Description">
                                            <textarea
                                                value={exp.desc}
                                                onChange={e => updateExp(exp.id, 'desc', e.target.value)}
                                                rows={3}
                                                placeholder="Describe your responsibilities and achievements..."
                                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 placeholder:text-gray-400"
                                            />
                                        </Field>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <button onClick={addExp}
                                className="flex items-center gap-2 text-sm font-bold text-primary hover:text-violet-700 transition-colors mt-1">
                                <Plus size={15} /> Add Experience
                            </button>
                        </SectionCard>

                        {/* Education */}
                        <SectionCard icon={<GraduationCap size={16} />} title="Education" delay={0.2}>
                            <AnimatePresence>
                                {educations.map((edu, idx) => (
                                    <motion.div key={edu.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.25 }}
                                        className={`space-y-3 ${idx > 0 ? 'pt-4 border-t border-gray-100' : ''}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                                Education {idx + 1}
                                            </p>
                                            {educations.length > 1 && (
                                                <button onClick={() => removeEdu(edu.id)}
                                                    className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors">
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <Field label="School / University">
                                                <Input value={edu.school}
                                                    onChange={e => updateEdu(edu.id, 'school', e.target.value)}
                                                    placeholder="MIT"
                                                    className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30" />
                                            </Field>
                                            <Field label="Degree">
                                                <Input value={edu.degree}
                                                    onChange={e => updateEdu(edu.id, 'degree', e.target.value)}
                                                    placeholder="Bachelor of Science"
                                                    className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30" />
                                            </Field>
                                            <Field label="Field of Study">
                                                <Input value={edu.field}
                                                    onChange={e => updateEdu(edu.id, 'field', e.target.value)}
                                                    placeholder="Computer Science"
                                                    className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30" />
                                            </Field>
                                            <Field label="GPA (optional)">
                                                <Input value={edu.gpa}
                                                    onChange={e => updateEdu(edu.id, 'gpa', e.target.value)}
                                                    placeholder="3.8 / 4.0"
                                                    className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30" />
                                            </Field>
                                            <Field label="Start Date">
                                                <Input value={edu.from} type="month"
                                                    onChange={e => updateEdu(edu.id, 'from', e.target.value)}
                                                    className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30" />
                                            </Field>
                                            <Field label="End Date">
                                                <Input value={edu.to} type="month"
                                                    onChange={e => updateEdu(edu.id, 'to', e.target.value)}
                                                    className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30" />
                                            </Field>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <button onClick={addEdu}
                                className="flex items-center gap-2 text-sm font-bold text-primary hover:text-violet-700 transition-colors mt-1">
                                <Plus size={15} /> Add Education
                            </button>
                        </SectionCard>

                        {/* Skills */}
                        <SectionCard icon={<Star size={16} />} title="Skills" delay={0.25}>
                            <div className="flex gap-2">
                                <Input
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    placeholder="Type a skill and press Enter"
                                    className="rounded-xl border-gray-200 h-9 text-sm focus-visible:ring-primary/30 flex-1"
                                />
                                <Button onClick={addSkill}
                                    className="bg-primary hover:bg-violet-700 text-white font-bold rounded-xl h-9 px-4 text-sm">
                                    <Plus size={14} />
                                </Button>
                            </div>
                            {skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {skills.map((s, i) => (
                                        <motion.div key={i}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center gap-1.5 bg-purple-50 text-primary border border-purple-100 px-3 py-1 rounded-full text-xs font-semibold"
                                        >
                                            {s}
                                            <button onClick={() => removeSkill(s)}
                                                className="hover:text-red-400 transition-colors">
                                                <Trash2 size={10} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </SectionCard>
                    </div>

                    {/* ── Right: Preview ──────────────────────────────────── */}
                    {showPreview && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="lg:sticky lg:top-24 lg:self-start"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
                                    <Eye size={13} /> Live Preview
                                </p>
                                <Button
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 bg-primary hover:bg-violet-700 text-white font-bold rounded-xl px-4 h-8 text-xs shadow-md shadow-purple-200"
                                >
                                    <Printer size={12} /> Print / Save PDF
                                </Button>
                            </div>
                            <div className="overflow-auto max-h-[85vh] rounded-2xl">
                                <ResumePreview data={resumeData} />
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreateResume
