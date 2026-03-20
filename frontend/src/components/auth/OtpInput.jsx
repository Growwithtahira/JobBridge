import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'

// ── Drop-in replacement — same props: value, onChange ─────────────────────────
const OtpInput = ({ value = '', onChange }) => {
    const inputRefs = useRef([])

    // Always work from a clean 6-slot array
    const digits = Array.from({ length: 6 }, (_, i) => value[i] || '')

    const focusAt = (idx) => {
        const clamped = Math.max(0, Math.min(5, idx))
        inputRefs.current[clamped]?.focus()
    }

    const handleChange = (e, idx) => {
        // Only allow single digit
        const val = e.target.value.replace(/\D/g, '').slice(-1)
        if (!val) return

        const next = [...digits]
        next[idx] = val
        onChange(next.join(''))

        // Move focus to next box
        if (idx < 5) focusAt(idx + 1)
    }

    const handleKeyDown = (e, idx) => {
        if (e.key === 'Backspace') {
            e.preventDefault()
            const next = [...digits]

            if (digits[idx]) {
                // Clear current box first
                next[idx] = ''
                onChange(next.join(''))
            } else {
                // Box already empty — clear previous and move back
                if (idx > 0) {
                    next[idx - 1] = ''
                    onChange(next.join(''))
                    focusAt(idx - 1)
                }
            }
        }

        if (e.key === 'ArrowLeft' && idx > 0) focusAt(idx - 1)
        if (e.key === 'ArrowRight' && idx < 5) focusAt(idx + 1)
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pasted = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, 6)

        if (!pasted) return

        onChange(pasted.padEnd(6, '').slice(0, 6).replace(/ /g, ''))

        // Focus the box after last pasted digit
        focusAt(Math.min(pasted.length, 5))
    }

    const handleFocus = (e) => {
        // Select existing digit on focus so typing replaces it
        e.target.select()
    }

    const handleClick = (idx) => {
        // Always allow clicking any filled/empty box
        focusAt(idx)
    }

    return (
        <div className="flex items-center justify-center gap-2 sm:gap-3">
            {digits.map((d, i) => (
                <motion.input
                    key={i}
                    ref={el => inputRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleChange(e, i)}
                    onKeyDown={e => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                    onFocus={handleFocus}
                    onClick={() => handleClick(i)}
                    whileFocus={{ scale: 1.08 }}
                    className={`w-11 h-14 text-center text-xl font-extrabold rounded-xl border-2 outline-none transition-all cursor-text
                        ${d
                            ? 'border-primary bg-purple-50 text-primary'
                            : 'border-gray-200 bg-white text-gray-800 focus:border-primary focus:bg-purple-50/50'
                        }`}
                />
            ))}
        </div>
    )
}

export default OtpInput