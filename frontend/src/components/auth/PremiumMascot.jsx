import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PremiumMascot = ({ currentField, showPassword, textLength = 0 }) => {
    const [state, setState] = useState('idle');

    // Tracking Logic
    const maxChars = 30;
    const clampedLength = Math.min(textLength, maxChars);
    // Calculate eye pupil movement (x)
    // X: -8 to +8 based on length
    const eyeX = (clampedLength / maxChars) * 16 - 8;
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

    // Premium Colors (Violet/Indigo Palette)
    const colors = {
        body: '#F3E8FF',   // Very Light Violet (almost white)
        bodyShadow: '#E9D5FF',
        belly: '#FFFFFF',
        wing: '#C4B5FD',   // Light Violet
        wingDark: '#8B5CF6', // Violet-500
        beak: '#F59E0B',   // Amber
        eyeBg: '#FFFFFF',
        pupil: '#4C1D95'    // Dark Violet
    };

    return (
        <div className="relative w-40 h-32 mx-auto mb-[-20px] z-20 pointer-events-none" aria-hidden="true">
            <motion.svg
                viewBox="0 0 200 160"
                className="w-full h-full drop-shadow-xl"
                initial="idle"
                animate={state}
            >
                <defs>
                    <linearGradient id="premiumBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#F3E8FF" />
                    </linearGradient>
                    <linearGradient id="premiumWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#DDD6FE" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* BODY GROUP */}
                <motion.g
                    animate={{ y: [0, 2, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* Main Body Shape */}
                    <ellipse cx="100" cy="90" rx="60" ry="65" fill="url(#premiumBodyGrad)" />

                    {/* Belly Patch (Glassy) */}
                    <ellipse cx="100" cy="110" rx="40" ry="35" fill="white" opacity="0.6" />

                    {/* HEAD GROUP (Rotates with input) */}
                    <motion.g
                        animate={{
                            rotate: state === 'validating' ? headRotate : 0,
                            y: state === 'validating' ? 2 : 0
                        }}
                        style={{ originX: "100px", originY: "90px" }} // Rotate around center
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    >
                        {/* Ears/Tufts */}
                        <path d="M60 40 L70 70 L90 60 Z" fill="url(#premiumBodyGrad)" />
                        <path d="M140 40 L130 70 L110 60 Z" fill="url(#premiumBodyGrad)" />

                        {/* Face Mask */}
                        <ellipse cx="100" cy="70" rx="55" ry="40" fill="#FFFFFF" />

                        {/* Beak */}
                        <path d="M95 85 L105 85 L100 95 Z" fill={colors.beak} stroke="#D97706" strokeWidth="1" />

                        {/* EYES */}
                        <g>
                            {/* Left Eye Bg */}
                            <circle cx="75" cy="70" r="16" fill="#FFF" stroke="#E2E8F0" strokeWidth="2" />
                            {/* Left Pupil (Tracks) */}
                            <motion.circle
                                cx="75" cy="70" r="7" fill={colors.pupil}
                                animate={{
                                    cx: state === 'validating' ? 75 + eyeX / 2 : 75,
                                    cy: state === 'validating' ? 74 : 70 // Look down
                                }}
                            />
                            <circle cx="77" cy="68" r="2" fill="white" />

                            {/* Right Eye Bg */}
                            <circle cx="125" cy="70" r="16" fill="#FFF" stroke="#E2E8F0" strokeWidth="2" />
                            {/* Right Pupil (Tracks) */}
                            <motion.circle
                                cx="125" cy="70" r="7" fill={colors.pupil}
                                animate={{
                                    cx: state === 'validating' ? 125 + eyeX / 2 : 125,
                                    cy: state === 'validating' ? 74 : 70 // Look down
                                }}
                            />
                            <circle cx="127" cy="68" r="2" fill="white" />
                        </g>
                    </motion.g>
                </motion.g>

                {/* WINGS (The Interaction) */}

                {/* Left Wing */}
                <motion.path
                    d="M40 90 Q30 140 60 140 Q80 140 70 110" // Resting
                    fill="url(#premiumWingGrad)"
                    stroke={colors.wingDark} strokeWidth="1"
                    initial={{ d: "M40 90 Q30 140 60 140 Q80 140 70 110" }}
                    animate={
                        state === 'hiding' || state === 'peeking'
                            ? { d: "M50 40 Q20 100 100 90 Q80 140 50 140" } // Cover Eye
                            : { d: "M40 90 Q30 140 60 140 Q80 140 70 110" } // Resting
                    }
                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                />

                {/* Right Wing */}
                <motion.path
                    d="M160 90 Q170 140 140 140 Q120 140 130 110" // Resting
                    fill="url(#premiumWingGrad)"
                    stroke={colors.wingDark} strokeWidth="1"
                    animate={
                        state === 'hiding'
                            ? { d: "M150 40 Q180 100 100 90 Q120 140 150 140" } // Cover Eye
                            : state === 'peeking'
                                ? { d: "M160 100 Q170 150 140 150 Q120 150 130 120" } // Lowered slightly
                                : { d: "M160 90 Q170 140 140 140 Q120 140 130 110" } // Resting
                    }
                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                />

            </motion.svg>
        </div>
    );
};

export default PremiumMascot;
