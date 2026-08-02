import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    Mail, Phone, Pen, FileText, Download, Briefcase,
    CheckCircle2, Clock, XCircle, Star, MapPin,
    TrendingUp, Award, ChevronRight, ExternalLink,
    User, BookOpen, Layers
} from 'lucide-react'

// ── Animation helpers ──────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }
})

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color, delay }) => (
    <motion.div {...fadeUp(delay)}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
    >
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: color + '18' }}>
            <span style={{ color }}>{icon}</span>
        </div>
        <div>
            <p className="text-2xl font-extrabold text-gray-900 leading-none mb-0.5">{value}</p>
            <p className="text-xs text-gray-400 font-medium">{label}</p>
        </div>
    </motion.div>
)

// ── Section wrapper ────────────────────────────────────────────────────────────
const Section = ({ icon, title, children, delay = 0, action }) => (
    <motion.div {...fadeUp(delay)}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2.5">
                <span className="text-primary">{icon}</span>
                <h2 className="font-bold text-gray-900 text-base">{title}</h2>
            </div>
            {action}
        </div>
        <div className="p-6">{children}</div>
    </motion.div>
)

// ── Profile completion ring ────────────────────────────────────────────────────
const CompletionRing = ({ percent }) => {
    const r = 28
    const circ = 2 * Math.PI * r
    const dash = (percent / 100) * circ
    return (
        <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
            <svg className="absolute inset-0 -rotate-90" width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r={r} fill="none" stroke="#f3f0ff" strokeWidth="5" />
                <motion.circle
                    cx="32" cy="32" r={r} fill="none"
                    stroke="#6A38C2" strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: circ - dash }}
                    transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                />
            </svg>
            <span className="text-xs font-extrabold text-primary">{percent}%</span>
        </div>
    )
}

// ── Main Profile ───────────────────────────────────────────────────────────────
const Profile = () => {
    useGetAppliedJobs()
    const [open, setOpen] = useState(false)
    const { user } = useSelector(store => store.auth)
    const { allAppliedJobs } = useSelector(store => store.job)

    const isResume = !!user?.profile?.resume
    const isRecruiter = user?.role === 'recruiter'

    // Compute profile completion
    const fields = [
        !!user?.fullname, !!user?.email, !!user?.phoneNumber,
        !!user?.profile?.bio, !!user?.profile?.resume,
        user?.profile?.skills?.length > 0,
        !!user?.profile?.profilePhoto
    ]
    const completion = Math.round((fields.filter(Boolean).length / fields.length) * 100)

    // Job application stats
    const totalApplied = allAppliedJobs?.length ?? 0
    const pending = allAppliedJobs?.filter(j => j.status === 'pending')?.length ?? 0
    const accepted = allAppliedJobs?.filter(j => j.status === 'accepted')?.length ?? 0
    const rejected = allAppliedJobs?.filter(j => j.status === 'rejected')?.length ?? 0

    return (
        <div className="min-h-screen bg-gray-50/60">
            <Navbar />

            {/* ── Hero banner ────────────────────────────────────────────────── */}
            <div className="relative h-40 md:h-52 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #6A38C2 0%, #8B5CF6 50%, #a78bfa 100%)' }}>
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
                <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
                <div className="absolute top-6 left-1/3 w-2 h-2 rounded-full bg-white/30" />
                <div className="absolute top-12 left-1/2 w-1.5 h-1.5 rounded-full bg-white/20" />
                <div className="absolute bottom-8 right-1/4 w-3 h-3 rounded-full bg-white/20" />
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-16 pb-12 relative z-10">

                {/* ── Profile card ─────────────────────────────────────────── */}
                <motion.div {...fadeUp(0)}
                    className="bg-white rounded-2xl border border-gray-100 shadow-md px-6 pt-6 pb-5 mb-5"
                >
                    <div className="flex flex-col md:flex-row md:items-end gap-5">

                        {/* Avatar + name */}
                        <div className="flex items-end gap-4">
                            <div className="relative flex-shrink-0">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-lg rounded-2xl">
                                    <AvatarImage
                                        src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                                        alt="profile"
                                        className="rounded-2xl object-cover"
                                    />
                                </Avatar>
                                {/* Online dot */}
                                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white" />
                            </div>

                            <div className="pb-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                        {user?.fullname || "Your Name"}
                                    </h1>
                                    {accepted > 0 && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded-full">
                                            <CheckCircle2 size={9} /> Hired
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-400 text-sm mt-0.5 font-medium max-w-sm">
                                    {user?.profile?.bio || "Add a short bio to introduce yourself"}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    {user?.email && (
                                        <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                            <Mail size={12} className="text-primary" /> {user.email}
                                        </span>
                                    )}
                                    {user?.phoneNumber && (
                                        <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                            <Phone size={12} className="text-primary" /> {user.phoneNumber}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Right: completion ring + edit */}
                        <div className="flex items-center gap-4 self-start md:self-auto">
                            <div className="flex items-center gap-3 bg-purple-50 rounded-2xl px-4 py-2.5 border border-purple-100">
                                <CompletionRing percent={completion} />
                                <div>
                                    <p className="text-xs font-bold text-gray-700">Profile Strength</p>
                                    <p className="text-[10px] text-gray-400 font-medium">
                                        {completion < 80 ? 'Add more details' : 'Looking great!'}
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={() => setOpen(true)}
                                className="flex items-center gap-2 bg-primary hover:bg-violet-700 text-white font-bold rounded-xl px-5 py-2.5 shadow-md shadow-purple-200 transition-all hover:scale-105 active:scale-95 text-sm h-auto"
                            >
                                <Pen size={14} /> Edit Profile
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* ── Stat cards row ────────────────────────────────────────── */}
                {!isRecruiter && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                        <StatCard delay={0.05} icon={<Briefcase size={18} />} color="#6A38C2" label="Total Applied" value={totalApplied} />
                        <StatCard delay={0.1} icon={<Clock size={18} />} color="#f59e0b" label="Pending" value={pending} />
                        <StatCard delay={0.15} icon={<CheckCircle2 size={18} />} color="#10b981" label="Accepted" value={accepted} />
                        <StatCard delay={0.2} icon={<XCircle size={18} />} color="#ef4444" label="Rejected" value={rejected} />
                    </div>
                )}

                {/* ── Two column grid ───────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

                    {/* Skills */}
                    <Section
                        icon={<Layers size={16} />}
                        title="Skills"
                        delay={0.1}
                        action={
                            <button onClick={() => setOpen(true)}
                                className="text-xs font-semibold text-primary hover:text-violet-700 flex items-center gap-1 transition-colors">
                                <Pen size={11} /> Edit
                            </button>
                        }
                    >
                        {user?.profile?.skills?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {user.profile.skills.map((skill, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.15 + i * 0.04 }}
                                    >
                                        <Badge className="bg-purple-50 text-primary border-purple-100 hover:bg-purple-100 transition-colors px-3 py-1 text-xs font-semibold rounded-full cursor-default">
                                            {skill}
                                        </Badge>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                                    <Star size={18} className="text-purple-300" strokeWidth={1.5} />
                                </div>
                                <p className="text-sm font-semibold text-gray-500">No skills added yet</p>
                                <button onClick={() => setOpen(true)}
                                    className="mt-2 text-xs text-primary font-bold hover:underline">
                                    + Add skills
                                </button>
                            </div>
                        )}
                    </Section>

                    {/* Resume */}
                    <Section
                        icon={<FileText size={16} />}
                        title="Resume"
                        delay={0.15}
                        action={
                            <div className="flex items-center gap-2">
                                <Link to="/create-resume"
                                    className="text-xs font-semibold text-primary hover:text-violet-700 flex items-center gap-1 transition-colors bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-lg">
                                    <FileText size={11} /> Build Resume
                                </Link>
                                <button onClick={() => setOpen(true)}
                                    className="text-xs font-semibold text-primary hover:text-violet-700 flex items-center gap-1 transition-colors">
                                    <Pen size={11} /> {isResume ? 'Update' : 'Upload'}
                                </button>
                            </div>
                        }
                    >
                        {isResume ? (
                            <div className="flex items-center gap-4 p-4 bg-purple-50/60 border border-purple-100 rounded-xl">
                                <div className="w-12 h-14 rounded-lg bg-white border border-purple-100 shadow-sm flex items-center justify-center flex-shrink-0">
                                    <FileText size={20} className="text-primary" strokeWidth={1.5} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate">
                                        {user.profile.resumeOriginalName}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">PDF Document</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <a href={user.profile.resume} target="_blank" rel="noreferrer"
                                        className="w-8 h-8 rounded-lg bg-white border border-purple-100 flex items-center justify-center text-primary hover:bg-purple-100 transition-colors shadow-sm">
                                        <ExternalLink size={13} />
                                    </a>
                                    <a href={user.profile.resume} download
                                        className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-violet-700 transition-colors shadow-sm">
                                        <Download size={13} />
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center border-2 border-dashed border-purple-100 rounded-xl">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                                    <FileText size={18} className="text-purple-300" strokeWidth={1.5} />
                                </div>
                                <p className="text-sm font-semibold text-gray-500">No resume uploaded</p>
                                <button onClick={() => setOpen(true)}
                                    className="mt-2 text-xs text-primary font-bold hover:underline">
                                    + Upload resume
                                </button>
                                <Link to="/create-resume"
                                    className="mt-1.5 text-xs text-primary font-bold hover:underline flex items-center gap-1">
                                    <FileText size={11} /> Or build one here
                                </Link>
                            </div>
                        )}
                    </Section>
                </div>

                {/* ── Contact info strip ───────────────────────────────────── */}
                <motion.div {...fadeUp(0.2)}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                                <Mail size={15} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Email</p>
                                <p className="text-sm font-semibold text-gray-800">{user?.email || "—"}</p>
                            </div>
                        </div>

                        <div className="hidden sm:block w-px h-8 bg-gray-100" />

                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                                <Phone size={15} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Phone</p>
                                <p className="text-sm font-semibold text-gray-800">{user?.phoneNumber || "—"}</p>
                            </div>
                        </div>

                        <div className="hidden sm:block w-px h-8 bg-gray-100" />

                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                                <User size={15} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Role</p>
                                <p className="text-sm font-semibold text-gray-800 capitalize">{user?.role || "—"}</p>
                            </div>
                        </div>

                        <div className="flex-1" />

                        <button onClick={() => setOpen(true)}
                            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-violet-700 transition-colors self-start sm:self-auto">
                            <Pen size={11} /> Edit Info
                        </button>
                    </div>
                </motion.div>

                {/* ── Profile completion checklist ──────────────────────────── */}
                {completion < 100 && (
                    <motion.div {...fadeUp(0.25)}
                        className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 rounded-2xl p-5 mb-5"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={15} className="text-primary" />
                            <h3 className="text-sm font-bold text-gray-800">Complete your profile to get more visibility</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: 'Full Name', done: !!user?.fullname },
                                { label: 'Bio', done: !!user?.profile?.bio },
                                { label: 'Phone', done: !!user?.phoneNumber },
                                { label: 'Skills', done: user?.profile?.skills?.length > 0 },
                                { label: 'Resume', done: !!user?.profile?.resume },
                                { label: 'Photo', done: !!user?.profile?.profilePhoto },
                            ].map((item, i) => (
                                <span key={i}
                                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors
                                        ${item.done
                                            ? 'bg-green-50 text-green-600 border-green-100'
                                            : 'bg-white text-gray-400 border-gray-200'}`}
                                >
                                    {item.done
                                        ? <CheckCircle2 size={11} />
                                        : <span className="w-2.5 h-2.5 rounded-full border border-gray-300 flex-shrink-0" />
                                    }
                                    {item.label}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── Applied jobs table ────────────────────────────────────── */}
                {!isRecruiter && (
                    <motion.div {...fadeUp(0.3)}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                            <div className="flex items-center gap-2.5">
                                <BookOpen size={16} className="text-primary" />
                                <h2 className="font-bold text-gray-900 text-base">Applied Jobs</h2>
                                {totalApplied > 0 && (
                                    <span className="bg-purple-100 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                                        {totalApplied}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="p-4 overflow-x-auto">
                            <AppliedJobTable />
                        </div>
                    </motion.div>
                )}
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile