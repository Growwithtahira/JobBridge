import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react'

// ---------------------------------------------------------------------------
// Filter taxonomy – each item maps display label → search keywords
// The `keywords` array is what gets matched against job fields.
// ---------------------------------------------------------------------------
const filterData = [
    {
        filterType: "Location",
        icon: "📍",
        array: [
            { label: "Remote / Hybrid", keywords: ["remote", "hybrid", "work from home", "wfh"] },
            { label: "Civil Lines", keywords: ["civil lines", "civil"] },
            { label: "D.D. Puram", keywords: ["dd puram", "d.d. puram", "ddpuram"] },
            { label: "Rajendra Nagar", keywords: ["rajendra nagar", "rajendra"] },
            { label: "Kutubkhana / Market", keywords: ["kutubkhana", "market"] },
            { label: "Parsakhera (Ind.)", keywords: ["parsakhera", "industrial area"] },
            { label: "Bareilly Cantt", keywords: ["bareilly", "cantt", "cantonment", "bareli"] },
        ]
    },
    {
        filterType: "Job Role",
        icon: "💼",
        array: [
            { label: "Data Entry / Office", keywords: ["data entry", "office", "admin", "clerk", "back office", "computer operator"] },
            { label: "Delivery / Field", keywords: ["delivery", "field", "logistics", "courier", "dispatch", "rider"] },
            { label: "Teaching / Tutor", keywords: ["teaching", "teacher", "tutor", "faculty", "trainer", "instructor", "educator"] },
            { label: "Web Dev / IT", keywords: ["web", "developer", "software", "it", "programmer", "frontend", "backend", "fullstack", "react", "node"] },
            { label: "Social Media / Design", keywords: ["social media", "design", "graphic", "content creator", "marketing", "digital", "photoshop"] },
            { label: "Hotel / Reception", keywords: ["hotel", "reception", "hospitality", "front desk", "housekeeping", "restaurant"] },
            { label: "Technician / Repair", keywords: ["technician", "repair", "mechanic", "electrician", "plumber", "ac", "mobile repair"] },
        ]
    },
    {
        filterType: "Monthly Salary",
        icon: "💰",
        array: [
            { label: "0 – 10k  (Intern / Part-time)", keywords: ["__salary_0_10k"] },
            { label: "10k – 25k  (Entry Level)", keywords: ["__salary_10k_25k"] },
            { label: "25k+  (Experienced)", keywords: ["__salary_25k_plus"] },
        ]
    },
    {
        filterType: "Job Type",
        icon: "🕐",
        array: [
            { label: "Full-Time", keywords: ["Full-Time", "full-time", "permanent"] },
            { label: "Part-Time", keywords: ["Part-Time", "part-time"] },
            { label: "Internship", keywords: ["internship", "intern", "trainee"] },
            { label: "Freelance", keywords: ["freelance", "contract", "project based"] },
        ]
    },
]

// ---------------------------------------------------------------------------
// Collapsible section wrapper
// ---------------------------------------------------------------------------
const FilterSection = ({ filterType, icon, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div className="mb-1">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between py-3 px-1 group"
            >
                <span className="flex items-center gap-2 font-semibold text-gray-800 text-sm tracking-wide uppercase">
                    <span>{icon}</span>
                    {filterType}
                </span>
                <span className="text-gray-400 group-hover:text-purple-600 transition-colors">
                    {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
            </button>
            {open && <div className="pb-3">{children}</div>}
            <hr className="border-gray-100" />
        </div>
    )
}

// ---------------------------------------------------------------------------
// Main FilterCard
// ---------------------------------------------------------------------------
const FilterCard = () => {
    // selectedFilters: { "Location": Set<label>, "Job Role": Set<label>, ... }
    const [selectedFilters, setSelectedFilters] = useState(() =>
        Object.fromEntries(filterData.map(f => [f.filterType, new Set()]))
    )
    const dispatch = useDispatch()

    // Toggle a single checkbox
    const toggleItem = (category, label) => {
        setSelectedFilters(prev => {
            const next = new Set(prev[category])
            next.has(label) ? next.delete(label) : next.add(label)
            return { ...prev, [category]: next }
        })
    }

    // How many total filters are active?
    const activeCount = Object.values(selectedFilters).reduce((sum, s) => sum + s.size, 0)

    // Clear all
    const clearAll = () =>
        setSelectedFilters(Object.fromEntries(filterData.map(f => [f.filterType, new Set()])))

    // Build a structured payload for Jobs.jsx instead of a flat string
    useEffect(() => {
        // Collect all selected keyword arrays grouped by category
        const payload = {}
        filterData.forEach(({ filterType, array }) => {
            const selected = selectedFilters[filterType]
            if (selected.size === 0) return
            const keywords = array
                .filter(item => selected.has(item.label))
                .flatMap(item => item.keywords)
            payload[filterType] = keywords
        })
        // Dispatch as JSON string so Jobs.jsx can parse it
        dispatch(setSearchedQuery(Object.keys(payload).length ? JSON.stringify(payload) : ""))
    }, [selectedFilters, dispatch])

    return (
        <div className="w-full bg-white rounded-2xl shadow-md border border-gray-100 md:sticky md:top-20 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-purple-600" />
                    <h1 className="font-bold text-lg text-gray-900">Filters</h1>
                    {activeCount > 0 && (
                        <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {activeCount}
                        </span>
                    )}
                </div>
                {activeCount > 0 && (
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-1 text-xs text-red-500 font-semibold hover:text-red-600 transition-colors"
                    >
                        <X size={13} /> Clear All
                    </button>
                )}
            </div>

            {/* Filter sections */}
            <div className="px-5 py-2">
                {filterData.map((data, index) => (
                    <FilterSection key={index} filterType={data.filterType} icon={data.icon}>
                        <div className="space-y-1 mt-1">
                            {data.array.map((item, idx) => {
                                const checked = selectedFilters[data.filterType].has(item.label)
                                const checkId = `chk-${index}-${idx}`
                                return (
                                    <label
                                        key={checkId}
                                        htmlFor={checkId}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all text-sm group
                                            ${checked
                                                ? 'bg-purple-50 text-purple-700 font-semibold'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        {/* Custom checkbox */}
                                        <span className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                                            ${checked
                                                ? 'bg-purple-600 border-purple-600'
                                                : 'border-gray-300 group-hover:border-purple-400'
                                            }`}>
                                            {checked && (
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                                                    <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </span>
                                        <input
                                            type="checkbox"
                                            id={checkId}
                                            className="sr-only"
                                            checked={checked}
                                            onChange={() => toggleItem(data.filterType, item.label)}
                                        />
                                        {item.label}
                                    </label>
                                )
                            })}
                        </div>
                    </FilterSection>
                ))}
            </div>
        </div>
    )
}

export default FilterCard