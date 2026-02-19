import React from 'react';
import { motion } from 'framer-motion';

const ShieldIcon = ({ state = 'idle', className = '' }) => {
    // state: 'idle', 'secure' (focused/typing), 'unlocked' (show password), 'error'

    const variants = {
        idle: { scale: 1, stroke: "#64748b" }, // Gray
        secure: { scale: 1.1, stroke: "#6A0DAD", transition: { type: 'spring', stiffness: 300 } }, // Violet
        unlocked: { scale: 1.1, stroke: "#6A0DAD" },
        error: { x: [0, -5, 5, -5, 5, 0], stroke: "#ef4444", transition: { duration: 0.4 } } // Red shake
    };

    return (
        <motion.svg
            variants={variants}
            animate={state}
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-6 h-6 ${className}`}
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />

            {/* Lock/Keyhole Animation */}
            {state === 'secure' && (
                <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    d="M12 8v4 M12 16h.01"
                    strokeWidth="3"
                />
            )}

            {/* Unlocked / Peek Eye inside Shield */}
            {state === 'unlocked' && (
                <motion.path
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                    fill="#6A0DAD"
                    stroke="none"
                />
            )}
        </motion.svg>
    );
};

export default ShieldIcon;
