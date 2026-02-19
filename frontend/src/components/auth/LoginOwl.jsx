import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoginOwl = ({ currentField, showPassword, textLength = 0 }) => {
    const [state, setState] = useState('idle');

    // Tracking Logic
    const maxChars = 30;
    const clampedLength = Math.min(textLength, maxChars);
    // Calculate eye pupil movement (x and y)
    // X: -5 to +5 based on length
    const eyeX = (clampedLength / maxChars) * 10 - 5;
    // Rotate head slightly: -5 to +5
    const headRotate = (clampedLength / maxChars) * 10 - 5;

    useEffect(() => {
        if (currentField === 'password') {
            if (showPassword) {
                setState('peeking');
            } else {
                setState('hiding');
            }
        } else if (['email', 'fullname', 'phoneNumber'].includes(currentField)) {
            setState('validating');
        } else {
            setState('idle');
        }
    }, [currentField, showPassword]);

    // Owl Constants
    const colors = {
        body: '#F0F2F5', // Light Gray/White Owl
        belly: '#E2E8F0',
        wing: '#CBD5E1',
        wingDark: '#94A3B8',
        beak: '#F59E0B',
        eyeBg: '#FFFFFF',
        pupil: '#1E293B'
    };

    return (
        <div className="relative w-48 h-40 mx-auto mb-[-45px] z-20 pointer-events-none" aria-hidden="true">
            <motion.svg
                viewBox="0 0 200 160"
                className="w-full h-full drop-shadow-2xl"
                initial="idle"
                animate={state}
            >
                <defs>
                    <linearGradient id="owlBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F1F5F9" />
                        <stop offset="100%" stopColor="#CBD5E1" />
                    </linearGradient>
                    <linearGradient id="owlWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E2E8F0" />
                        <stop offset="100%" stopColor="#94A3B8" />
                    </linearGradient>
                    <filter id="owlShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                        <feOffset dx="0" dy="4" result="offsetblur" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.2" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* BODY GROUP */}
                <motion.g
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* Main Body Shape */}
                    <ellipse cx="100" cy="90" rx="60" ry="65" fill="url(#owlBodyGrad)" filter="url(#owlShadow)" />
                    {/* Belly Patch */}
                    <ellipse cx="100" cy="110" rx="40" ry="35" fill="#F8FAFC" opacity="0.8" />
                    {/* Feather patterns on belly */}
                    <path d="M90 100 L95 105 L100 100" stroke="#CBD5E1" strokeWidth="2" fill="none" opacity="0.5" />
                    <path d="M100 100 L105 105 L110 100" stroke="#CBD5E1" strokeWidth="2" fill="none" opacity="0.5" />
                    <path d="M95 115 L100 120 L105 115" stroke="#CBD5E1" strokeWidth="2" fill="none" opacity="0.5" />

                    {/* HEAD GROUP (Rotates with input) */}
                    <motion.g
                        animate={{ rotate: state === 'validating' ? headRotate : 0 }}
                        style={{ originX: "100px", originY: "90px" }} // Rotate around center
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    >
                        {/* Ears/Tufts */}
                        <path d="M60 40 L70 70 L90 60 Z" fill="url(#owlBodyGrad)" />
                        <path d="M140 40 L130 70 L110 60 Z" fill="url(#owlBodyGrad)" />

                        {/* Face Mask */}
                        <ellipse cx="100" cy="70" rx="55" ry="40" fill="#F8FAFC" filter="url(#owlShadow)" />

                        {/* Beak */}
                        <path d="M95 85 L105 85 L100 95 Z" fill={colors.beak} stroke="#D97706" strokeWidth="1" />

                        {/* EYES */}
                        <g>
                            {/* Left Eye Bg */}
                            <circle cx="75" cy="70" r="18" fill="#FFF" stroke="#E2E8F0" strokeWidth="2" />
                            {/* Left Pupil (Tracks) */}
                            <motion.circle
                                cx="75" cy="70" r="7" fill={colors.pupil}
                                animate={{
                                    x: state === 'validating' ? eyeX : 0,
                                    y: state === 'validating' ? 5 : 0 // Look down slightly when typing
                                }}
                            />
                            <circle cx="77" cy="68" r="2" fill="white" />

                            {/* Right Eye Bg */}
                            <circle cx="125" cy="70" r="18" fill="#FFF" stroke="#E2E8F0" strokeWidth="2" />
                            {/* Right Pupil (Tracks) */}
                            <motion.circle
                                cx="125" cy="70" r="7" fill={colors.pupil}
                                animate={{
                                    x: state === 'validating' ? eyeX : 0,
                                    y: state === 'validating' ? 5 : 0
                                }}
                            />
                            <circle cx="127" cy="68" r="2" fill="white" />
                        </g>
                    </motion.g>
                </motion.g>

                {/* WINGS (The Interaction) */}

                {/* Left Wing */}
                <motion.path
                    d="M40 90 Q30 140 60 140 Q80 140 70 110"
                    fill="url(#owlWingGrad)"
                    stroke="#94A3B8" strokeWidth="1"
                    filter="url(#owlShadow)"
                    initial={{ d: "M40 90 Q30 140 60 140 Q80 140 70 110", opacity: 1 }} // Resting state
                    animate={
                        state === 'hiding' || state === 'peeking'
                            ? { d: "M50 40 Q20 100 100 90 Q80 140 50 140", x: 20, y: -20, rotate: 20 } // Cover Eye
                            : { d: "M40 90 Q30 140 60 140 Q80 140 70 110", x: 0, y: 0, rotate: 0 } // Resting
                    }
                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                />

                {/* Right Wing */}
                <motion.path
                    d="M160 90 Q170 140 140 140 Q120 140 130 110"
                    fill="url(#owlWingGrad)"
                    stroke="#94A3B8" strokeWidth="1"
                    filter="url(#owlShadow)"
                    animate={
                        state === 'hiding'
                            ? { d: "M150 40 Q180 100 100 90 Q120 140 150 140", x: -20, y: -20, rotate: -20 } // Cover Eye
                            : state === 'peeking'
                                ? { d: "M160 90 Q170 140 140 140 Q120 140 130 110", x: 0, y: 0, rotate: 0 } // Down (One eye open)
                                : { d: "M160 90 Q170 140 140 140 Q120 140 130 110", x: 0, y: 0, rotate: 0 } // Resting
                    }
                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                />

            </motion.svg>
        </div>
    );
};

export default LoginOwl;
