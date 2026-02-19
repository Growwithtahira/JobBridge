import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoginMascot = ({ currentField, showPassword }) => {
    // States: 'idle', 'validating', 'hiding', 'peeking'
    const [state, setState] = useState('idle');

    useEffect(() => {
        if (currentField === 'password') {
            if (showPassword) {
                setState('peeking');
            } else {
                setState('hiding');
            }
        } else if (currentField === 'email' || currentField === 'fullname' || currentField === 'phoneNumber') {
            setState('validating'); // Looking down/writing
        } else {
            setState('idle');
        }
    }, [currentField, showPassword]);

    // Bear SVG Path Constants
    const colors = {
        skin: '#D9C5B6', // Bear Fur
        snout: '#EBE0D8',
        nose: '#4A3B32',
        eye: '#333333',
        bg: '#F3F4F6'
    };

    return (
        <div className="relative w-32 h-32 mx-auto mb-[-20px] z-10" aria-hidden="true">
            <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xl filter">
                {/* Head */}
                <motion.circle
                    cx="60" cy="60" r="45"
                    fill={colors.skin}
                    initial={false}
                />

                {/* Ears */}
                <circle cx="25" cy="30" r="12" fill={colors.skin} />
                <circle cx="95" cy="30" r="12" fill={colors.skin} />
                <circle cx="25" cy="30" r="6" fill="#C4A484" />
                <circle cx="95" cy="30" r="6" fill="#C4A484" />

                {/* Snout */}
                <ellipse cx="60" cy="75" rx="16" ry="12" fill={colors.snout} />
                <ellipse cx="60" cy="70" rx="6" ry="4" fill={colors.nose} />

                {/* Mouth (Simple Smile) */}
                {!['hiding', 'peeking'].includes(state) && (
                    <path d="M54 82 Q60 86 66 82" stroke={colors.nose} strokeWidth="2" fill="none" />
                )}

                {/* EYES CONTAINER */}
                <g>
                    {/* Left Eye */}
                    <motion.circle
                        cx="45" cy="55" r="4" fill={colors.eye}
                        animate={{
                            y: state === 'validating' ? 8 : 0,
                            scaleY: state === 'hiding' ? 0.1 : 1 // Squint if hiding? No, covered.
                        }}
                    />
                    {/* Right Eye */}
                    <motion.circle
                        cx="75" cy="55" r="4" fill={colors.eye}
                        animate={{
                            y: state === 'validating' ? 8 : 0,
                        }}
                    />
                </g>

                {/* HANDS (The interactive part) */}
                {/* Left Hand */}
                <motion.g
                    initial={{ x: 0, y: 120, rotate: 0 }}
                    animate={{
                        x: state === 'hiding' || state === 'peeking' ? 0 : -40,
                        y: state === 'hiding' || state === 'peeking' ? 0 : 40,
                        rotate: 0
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    {/* Paw covering eye */}
                    <circle cx="45" cy="55" r="14" fill={colors.skin} stroke="#C4A484" strokeWidth="2" />
                </motion.g>

                {/* Right Hand */}
                <motion.g
                    initial={{ x: 0, y: 120 }}
                    animate={{
                        x: state === 'hiding' ? 0 : (state === 'peeking' ? 10 : 40), // Peek moves hand slightly away
                        y: state === 'hiding' ? 0 : (state === 'peeking' ? 15 : 40), // Peek moves hand down
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    {/* Paw covering eye */}
                    <circle cx="75" cy="55" r="14" fill={colors.skin} stroke="#C4A484" strokeWidth="2" />
                </motion.g>

            </svg>
        </div>
    );
};

export default LoginMascot;
